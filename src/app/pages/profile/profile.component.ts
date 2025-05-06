import {Component, computed, inject, linkedSignal, resource, ResourceRef, Signal} from '@angular/core';
import {NgIf, NgOptimizedImage} from '@angular/common';
import {BackendService} from "../../services/backend/backend.service";
import {Me} from '../../models/Me';
import {ContentlistComponent} from '../../shared/contentlist/contentlist.component';
import {Movie} from '../../models/Movie';
import {Tv} from '../../models/Tv';
import {UserAndContent} from '../../models/UserAndContent';

@Component({
  selector: 'app-profile',
  imports: [
    NgOptimizedImage,
    NgIf,
    ContentlistComponent
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  backend = inject(BackendService);
  resources: ResourceRef<Me> = resource({
    request: () => ({}),
    loader: async () => (await this.backend.getMe()).data
  });
  me = computed(() => this.resources.asReadonly().value());

  moviesLength = linkedSignal(() => {
    const allContent = [
      ...this.me()?.watched || [],
      ...this.me()?.watchlist || [],
      ...this.me()?.ratings || []
    ];
    return allContent.filter(film => film.movie_id !== null).length;
  });

  tvLength = linkedSignal(() => {
    const allContent = [
      ...this.me()?.watched || [],
      ...this.me()?.watchlist || [],
      ...this.me()?.ratings || []
    ];
    return allContent.filter(film => film.tv_id !== null).length;
  });

  watched: Signal<(Movie | Tv)[]> = computed(() => this.me().watched.map(this.mapper));
  watchlist: Signal<(Movie | Tv)[]> = computed(() => this.me().watchlist.map(this.mapper));
  ratings: Signal<(Movie | Tv)[]> = computed(() => this.me().ratings.map(this.mapper));


  mapper(r: UserAndContent) {
    return r.movie_id ? r.movie! : r.tv!;
  }

  logout() {
    this.backend.logout();
    location.reload();
  }

}
