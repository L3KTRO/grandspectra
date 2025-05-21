import {Component, computed, inject, Input, resource, ResourceRef} from '@angular/core';
import {BackendService} from '../../services/backend/backend.service';
import Person from '../../models/Person';
import {NgIf, NgOptimizedImage} from '@angular/common';
import Credit from '../../models/Credit';
import {Movie} from '../../models/Movie';
import {Tv} from '../../models/Tv';
import {ContentlistWrapComponent} from '../../shared/contentlistwrap/contentlistwrap.component';
import {Router} from '@angular/router';

@Component({
  selector: 'app-person',
  imports: [
    NgOptimizedImage,
    ContentlistWrapComponent,
    NgIf
  ],
  templateUrl: './person.component.html',
  styleUrl: './person.component.scss'
})
export class PersonComponent {
  @Input() id!: string;
  backend = inject(BackendService);
  router = inject(Router);
  readonly = computed(() => this.data.asReadonly().value());
  data: ResourceRef<Person> = resource({
    request: () => ({id: this.id}),
    loader: async ({request}) => {
      const data = (await this.backend.request(this.getApiEndpoint() + request.id)).data
      if (!data) this.router.navigateByUrl("/hub");
      return data;
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
