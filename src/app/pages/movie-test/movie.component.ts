// movie.component.ts
import {Component, computed, inject, Input, resource, ResourceRef} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Movie} from '../../models/Movie';
import {BackendService} from '../../services/backend/backend.service';
import {CreditlistComponent} from '../../shared/creditlist/creditlist.component';
import {RatingComponent} from '../../shared/rating/rating.component';
import {AxiosResponse} from 'axios';
import Credit from '../../models/Credit';

@Component({
  selector: 'app-movie-test',
  imports: [
    FormsModule,
    CreditlistComponent,
    RatingComponent
  ],
  templateUrl: './movie.component.html',
})
export class MovieTestComponent {
  @Input() id: number = 0;
  backend = inject(BackendService);

  mediaContent: ResourceRef<Movie> = resource({
    request: () => ({id: this.id}),
    loader: async ({request}) => {
      return (await this.backend.request(this.getApiEndpoint() + request.id)).data
    }
  });

  readonly = computed(() => this.mediaContent.asReadonly().value());

  getApiEndpoint(): string {
    return '/movies/';
  }

}
