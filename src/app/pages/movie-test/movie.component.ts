// movie.component.ts
import {ChangeDetectionStrategy, Component, computed, inject, Input, resource, ResourceRef} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Movie} from '../../models/Movie';
import {BackendService} from '../../services/backend/backend.service';
import {CreditlistComponent} from '../../shared/creditlist/creditlist.component';
import {RatingComponent} from '../../shared/rating/rating.component';
import Credit from '../../models/Credit';

@Component({
  selector: 'app-movie-test',
  imports: [
    FormsModule,
    CreditlistComponent,
    RatingComponent
  ],
  templateUrl: './movie.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MovieTestComponent {
  @Input() id: number = 0;
  backend = inject(BackendService);

  mediaContent: ResourceRef<Movie> = resource({
    request: () => ({id: this.id}),
    loader: async ({request}) => {
      console.log((await this.backend.request(this.getApiEndpoint() + request.id)).data.credits)
      return (await this.backend.request(this.getApiEndpoint() + request.id)).data
    }
  });

  fakeCredits: Credit[] = [
    {
      id: 1,
      person: {
        id: 1,
        name: 'Alice Johnson',
        popularity: 0,
        imdb_id: null,
        known_for_department: null,
        place_of_birth: null,
        profile: null,
        still: null,
        adult: null,
        also_known_as: null,
        biography: null,
        birthday: null,
        deathday: null,
        gender: null,
        homepage: null,
        credits: []
      },
      movie_id: 101,
      tv_id: null,
      occupation: {id: 1, name: 'Actor', position: 1},
      occupation_id: 1,
      order: 1,
      character: 'Protagonist',
      tv: null,
      movie: null
    },
    {
      id: 2,
      person: {
        id: 1,
        name: 'Alice Johnson',
        popularity: 0,
        imdb_id: null,
        known_for_department: null,
        place_of_birth: null,
        profile: null,
        still: null,
        adult: null,
        also_known_as: null,
        biography: null,
        birthday: null,
        deathday: null,
        gender: null,
        homepage: null,
        credits: []
      },
      movie_id: 101,
      tv_id: null,
      occupation: {id: 1, name: 'Actor', position: 1},
      occupation_id: 1,
      order: 1,
      character: 'Protagonist',
      tv: null,
      movie: null
    },
    {
      id: 3,
      person: {
        id: 1,
        name: 'Alice Johnson',
        popularity: 0,
        imdb_id: null,
        known_for_department: null,
        place_of_birth: null,
        profile: null,
        still: null,
        adult: null,
        also_known_as: null,
        biography: null,
        birthday: null,
        deathday: null,
        gender: null,
        homepage: null,
        credits: []
      },
      movie_id: 101,
      tv_id: null,
      occupation: {id: 1, name: 'Actor', position: 1},
      occupation_id: 1,
      order: 1,
      character: 'Protagonist',
      tv: null,
      movie: null
    },
    {
      id: 4,
      person: {
        id: 1,
        name: 'Alice Johnson',
        popularity: 0,
        imdb_id: null,
        known_for_department: null,
        place_of_birth: null,
        profile: null,
        still: null,
        adult: null,
        also_known_as: null,
        biography: null,
        birthday: null,
        deathday: null,
        gender: null,
        homepage: null,
        credits: []
      },
      movie_id: 101,
      tv_id: null,
      occupation: {id: 1, name: 'Actor', position: 1},
      occupation_id: 1,
      order: 1,
      character: 'Protagonist',
      tv: null,
      movie: null
    },
    {
      id: 5,
      person: {
        id: 1,
        name: 'Alice Johnson',
        popularity: 0,
        imdb_id: null,
        known_for_department: null,
        place_of_birth: null,
        profile: null,
        still: null,
        adult: null,
        also_known_as: null,
        biography: null,
        birthday: null,
        deathday: null,
        gender: null,
        homepage: null,
        credits: []
      },
      movie_id: 101,
      tv_id: null,
      occupation: {id: 1, name: 'Actor', position: 1},
      occupation_id: 1,
      order: 1,
      character: 'Protagonist',
      tv: null,
      movie: null
    },
  ];

  readonly = computed(() => this.mediaContent.asReadonly().value());

  getApiEndpoint(): string {
    return '/movies/';
  }

}
