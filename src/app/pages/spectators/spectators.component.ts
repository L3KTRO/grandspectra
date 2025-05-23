import {Component, inject} from '@angular/core';
import {computedResource} from '../../helpers/Resources';
import {User} from '../../models/User';
import {BackendService} from '../../services/backend/backend.service';
import {NgForOf, NgOptimizedImage} from '@angular/common';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-spectators',
  imports: [
    NgForOf,
    NgOptimizedImage,
    RouterLink
  ],
  templateUrl: './spectators.component.html',
  styleUrl: './spectators.component.scss'
})
export class SpectatorsComponent {
  backend = inject(BackendService);
  usersSortByFollowers = computedResource<Spectator[]>({
    loader: async () => {
      const req = await this.backend.getUsers("followers");
      if (req.status === 200) {
        return req.data.data
      } else {
        return []
      }
    }
  })

  usersSortByWatched = computedResource<Spectator[]>({
    loader: async () => {
      const req = await this.backend.getUsers("watched");
      if (req.status === 200) {
        return req.data.data
      } else {
        return []
      }
    }
  })

  usersSortByRatings = computedResource<Spectator[]>({
    loader: async () => {
      const req = await this.backend.getUsers("ratings");
      if (req.status === 200) {
        return req.data.data
      } else {
        return []
      }
    }
  })


}

interface Spectator extends User {
  followers_count: number,
  following_count: number,
  ratings_count: number,
  watchlist_count: number,
  watched_count: number,
  reviews_count: number,
}
