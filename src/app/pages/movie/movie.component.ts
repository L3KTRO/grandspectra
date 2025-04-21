import {Component, computed, inject, Input, resource, ResourceRef, signal} from '@angular/core';
import {Movie} from '../../models/Movie';
import {BackendService} from '../../services/backend/backend.service';
import {DecimalPipe, NgClass, NgIf, NgOptimizedImage} from '@angular/common';
import {Rating} from 'primeng/rating';
import {FormsModule} from '@angular/forms';
import {CreditlistComponent} from '../../shared/creditlist/creditlist.component';
import {OccupationEnum} from '../../models/Occupation';
import {ContentlistComponent} from '../../shared/contentlist/contentlist.component';

@Component({
  selector: 'app-movie',
  imports: [
    NgIf,
    NgOptimizedImage,
    Rating,
    FormsModule,
    CreditlistComponent,
    NgClass,
    DecimalPipe,
    ContentlistComponent
  ],
  templateUrl: './movie.component.html',
  styleUrl: './movie.component.scss'
})
export class MovieComponent {
  @Input() id!: string;
  backend = inject(BackendService);
  readonly = computed(() => this.movie.asReadonly().value());
  rating = signal<number | null>(null);
  watched = signal(false);
  watchlist = signal(false);
  favourite = signal(false);
  isCast = signal(true);

  movie: ResourceRef<Movie> = resource({
    request: () => ({id: this.id}),
    loader: async ({request}) => {
      return (await this.backend.request(`/movies/${request.id}`)).data
    }
  });

  togglePeople() {
    this.isCast.update(value => !value);
  }

  toggleWatched() {
    this.watched.update(value => !value);
  }

  toggleWatchlist() {
    this.watchlist.update(value => !value);
  }

  toggleFavourite() {
    this.favourite.update(value => !value);
  }

  poster(path: string | null) {
    if (!path) return "https://placehold.co/75x100"
    // "w92"
    // "w154"
    // "w185"
    // "w342"
    // "w500"
    // "w780"
    // "original"
    return path.replace("original", "w780");
  }

  year() {
    if (!this.readonly().release_date) return null;
    else return new Date(this.readonly().release_date!).getFullYear();
  }

  cast() {
    return this.readonly().credits.filter(c => c.occupation_id === OccupationEnum.Actor.valueOf());
  }

  crew() {
    return this.readonly().credits.filter(c => c.occupation_id !== OccupationEnum.Actor.valueOf());
  }

  genres() {
    return this.readonly().genres.map(g => g.name).join(", ");
  }

  companies() {
    return this.readonly().companies?.map(g => g.name).join(", ");
  }

  director() {
    return this.crew().filter(c => c.occupation_id === 2).sort((a, b) => b.person.popularity - a.person.popularity)[0];
  }

  recommendations() {
    return this.readonly().recommendations.map(r => r)
  }
}
