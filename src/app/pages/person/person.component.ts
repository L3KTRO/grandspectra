import {Component, computed, inject, Input, resource, ResourceRef} from '@angular/core';
import {BackendService} from '../../services/backend/backend.service';
import Person from '../../models/Person';
import {NgOptimizedImage} from '@angular/common';
import Credit from '../../models/Credit';
import {Movie} from '../../models/Movie';
import {Tv} from '../../models/Tv';
import {ContentlistWrapComponent} from '../../shared/contentlistwrap/contentlistwrap.component';

@Component({
  selector: 'app-person',
  imports: [
    NgOptimizedImage,
    ContentlistWrapComponent
  ],
  templateUrl: './person.component.html',
  styleUrl: './person.component.scss'
})
export class PersonComponent {
  @Input() id!: string;
  backend = inject(BackendService);
  readonly = computed(() => this.data.asReadonly().value());
  data: ResourceRef<Person> = resource({
    request: () => ({id: this.id}),
    loader: async ({request}) => {
      return (await this.backend.request(this.getApiEndpoint() + request.id)).data
    }
  });

  getApiEndpoint(): string {
    return '/people/';
  }

  content(credits: Credit[]): (Movie | Tv)[] { // Duplicates removal
    const content = credits.map((credit: Credit): Movie | Tv =>
      (credit.movie || credit.tv)!
    )
    const ids = new Set(content.map(x => x.id));

    return content.filter((x) => {
      if (ids.has(x.id)) {
        ids.delete(x.id);
        return true;
      }
      return false;
    }).sort((a, b) => {
      if (a.popularity === null && b.popularity === null) {
        return 0;
      }
      if (a.popularity === null) {
        return 1;
      }
      if (b.popularity === null) {
        return -1;
      }
      return b.popularity - a.popularity;
    });
  }
}
