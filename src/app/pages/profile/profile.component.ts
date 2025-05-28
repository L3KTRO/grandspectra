import {Component, computed, effect, inject, Input, OnInit, resource, ResourceRef, signal, Signal} from '@angular/core';
import {NgForOf, NgIf, NgOptimizedImage} from '@angular/common';
import {BackendService} from "../../services/backend/backend.service";
import {ContentlistComponent} from '../../shared/contentlist/contentlist.component';
import {Movie} from '../../models/Movie';
import {Tv} from '../../models/Tv';
import {UserAndContent} from '../../models/UserAndContent';
import {SyncStore} from '../../stores/SyncStore';
import {ListsVisualizerComponent} from '../../shared/lists-visualizer/lists-visualizer.component';
import {computedResource} from '../../helpers/Resources';
import {Me} from '../../models/Me';
import {ActivatedRoute, Router} from '@angular/router';

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
export class ProfileComponent implements OnInit {
  @Input() username!: string;

  usernamePath = signal(this.username);

  constructor(public syncStore: SyncStore, private route: ActivatedRoute) {
    this.initialSync.set(syncStore.profileSync())
    effect(() => {
      if (this.syncStore.profileSync() > this.initialSync()) {
        this.triggerSync.update(res => res + 1);
      }
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe(data => {
      this.usernamePath.set(data.get("username") || '')
      this.userResource.reload();
    });
  }

  initialSync = signal(0)
  triggerSync = signal(0)
  backend = inject(BackendService);
  router = inject(Router);

  meResource: ResourceRef<Me> = resource(({
    loader: async () => {
      const req = await this.backend.getMe()
      return req.status === 200 ? req.data : null
    }
  }))

  me = computed(() => this.meResource.asReadonly().value());

  meFollowing = computed(() => this.me().following.map(u => u.username))

  userResource = resource({
    request: () => ({
      sync: this.triggerSync(),
      username: this.usernamePath(),
    }),
    loader: async ({request}) => {
      const req = await this.backend.getUser(request.username);
      if (req.status === 200) {
        return req.data;
      } else {
        return this.router.navigate(['/spectators']);
      }
    }
  });

  user = computed(() => this.userResource.asReadonly().value());

  moviesLength = computed(() => {
    const allContent = [
      ...this.user()?.watched || [],
      ...this.user()?.watchlist || [],
      ...this.user()?.ratings || []
    ];
    return Array.from(new Set(allContent.filter(film => film.movie_id !== null).map(film => film.movie_id))).length;
  });

  tvLength = computed(() => {
    const allContent = [
      ...this.user()?.watched || [],
      ...this.user()?.watchlist || [],
      ...this.user()?.ratings || []
    ];
    return Array.from(new Set(allContent.filter(film => film.tv_id !== null).map(film => film.tv_id))).length;
  });

  watched: Signal<(Movie | Tv)[]> = computed(() => this.user().watched.sort(this.sorter).map(this.mapper));
  watchlist: Signal<(Movie | Tv)[]> = computed(() => this.user().watchlist.sort(this.sorter).map(this.mapper));
  ratings: Signal<(Movie | Tv)[]> = computed(() => this.user().ratings.sort(this.sorter).map(this.mapper));

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

  follow() {
    this.backend.follow(this.user().username).then(res => {
      if (res.status === 201) {
        this.meResource.reload();
      }
    });
  }

  unfollow() {
    this.backend.unfollow(this.user().username).then(res => {
      if (res.status === 204) {
        this.meResource.reload();
      }
    });
  }

}
