// movie.component.ts
import {Component, computed, resource, ResourceRef} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MediaContentBaseComponent} from '../../media-content-base.directive';
import {Movie} from '../../models/Movie';
import {MediaContentDisplayComponent} from '../../shared/media-content-display/media-content-display.component';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-movie',
  imports: [
    FormsModule,
    MediaContentDisplayComponent,
    MediaContentDisplayComponent,
    NgIf
  ],
  templateUrl: './movie.component.html',
})
export class MovieComponent extends MediaContentBaseComponent {
  override readonly = computed(() => this.mediaContent.asReadonly().value());
  mediaContent: ResourceRef<Movie> = resource({
    request: () => ({id: this.id}),
    loader: async ({request}) => {
      return (await this.backend.request(this.getApiEndpoint() + request.id)).data
    }
  });

  getApiEndpoint(): string {
    return '/movies/';
  }

  year(): string | null {
    if (!this.readonly().release_date) return null;
    return new Date(this.readonly().release_date!).getFullYear().toString();
  }

}
