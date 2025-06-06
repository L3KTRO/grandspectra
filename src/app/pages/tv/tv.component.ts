// tv.component.ts
import {Component, computed, resource, ResourceRef} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MediaContentBaseComponent} from '../../media-content-base.directive';
import {Tv} from '../../models/Tv';
import {MediaContentDisplayComponent} from '../../shared/media-content-display/media-content-display.component';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-tv',
  imports: [
    FormsModule,
    MediaContentDisplayComponent,
    NgIf
  ],
  templateUrl: './tv.component.html',
})
export class TvComponent extends MediaContentBaseComponent {
  override readonly = computed(() => this.mediaContent.asReadonly().value());
  mediaContent: ResourceRef<Tv> = resource({
    request: () => ({id: this.id}),
    loader: async ({request}) => {
      return (await this.backend.request(this.getApiEndpoint() + request.id)).data
    }
  });

  getApiEndpoint(): string {
    return '/tv/';
  }

  override year = computed(() => {
    console.log("year override")
    if (!this.readonly().first_air_date) return null;
    return new Date(this.readonly().first_air_date!).getFullYear().toString();
  })

  override director = computed(() => {
    return this.crew().filter(c => c.occupation_id === 1)
        .sort((a, b) => b.person.popularity - a.person.popularity)[0]
      ??
      this.crew().filter(c => c.occupation_id === 2)
        .sort((a, b) => b.person.popularity - a.person.popularity)[0];
  });
}
