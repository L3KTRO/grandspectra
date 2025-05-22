import {Component, computed, effect, inject, resource, ResourceRef, signal, Signal} from '@angular/core';
import {NgForOf, NgIf, NgOptimizedImage} from '@angular/common';
import {BackendService} from "../../services/backend/backend.service";
import {Me} from '../../models/Me';
import {ContentlistComponent} from '../../shared/contentlist/contentlist.component';
import {Movie} from '../../models/Movie';
import {Tv} from '../../models/Tv';
import {UserAndContent} from '../../models/UserAndContent';
import {SyncStore} from '../../stores/SyncStore';
import {ListsVisualizerComponent} from '../../shared/lists-visualizer/lists-visualizer.component';

@Component({
  selector: 'app-profile',
  imports: [
    NgOptimizedImage,
    NgIf,
    ContentlistComponent,
    NgForOf,
    ListsVisualizerComponent
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  constructor(public syncStore: SyncStore) {
    this.initialSync.set(syncStore.profileSync())
    effect(() => {
      if (this.syncStore.profileSync() > this.initialSync()) {
        this.resources.reload()
      }
    });
  }

  initialSync = signal(0)
  backend = inject(BackendService);
  resources: ResourceRef<Me> = resource({
    request: () => ({}),
    loader: async () => (await this.backend.getMe()).data
  });
  me = computed(() => this.resources.asReadonly().value());

  moviesLength = computed(() => {
    const allContent = [
      ...this.me()?.watched || [],
      ...this.me()?.watchlist || [],
      ...this.me()?.ratings || []
    ];
    return Array.from(new Set(allContent.filter(film => film.movie_id !== null).map(film => film.movie_id))).length;
  });

  tvLength = computed(() => {
    const allContent = [
      ...this.me()?.watched || [],
      ...this.me()?.watchlist || [],
      ...this.me()?.ratings || []
    ];
    return Array.from(new Set(allContent.filter(film => film.tv_id !== null).map(film => film.tv_id))).length;
  });

  watched: Signal<(Movie | Tv)[]> = computed(() => this.me().watched.sort(this.sorter).map(this.mapper));
  watchlist: Signal<(Movie | Tv)[]> = computed(() => this.me().watchlist.sort(this.sorter).map(this.mapper));
  ratings: Signal<(Movie | Tv)[]> = computed(() => this.me().ratings.sort(this.sorter).map(this.mapper));

  sorter(a: UserAndContent, b: UserAndContent) {
    return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
  }

  mapper(r: UserAndContent) {
    return r.movie_id ? r.movie! : r.tv!;
  }

  logout() {
    this.backend.logout();
    location.reload();
  }

}
