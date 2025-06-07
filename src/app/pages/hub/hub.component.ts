// hub.component.ts
import {
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  resource,
  ResourceRef,
  Signal,
  signal,
  ViewChild
} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgClass, NgForOf, NgIf, NgOptimizedImage} from '@angular/common';
import {BackendService} from '../../services/backend/backend.service';
import {Router, RouterLink} from '@angular/router';
import {ProgressSpinnerComponent} from '../../shared/progress-spinner/progress-spinner.component';
import {Movie} from '../../models/Movie';
import {Tv} from '../../models/Tv';
import Person from '../../models/Person';

@Component({
  selector: 'app-hub',
  templateUrl: './hub.component.html',
  imports: [
    FormsModule,
    NgClass,
    NgOptimizedImage,
    NgIf,
    ProgressSpinnerComponent,
    NgForOf,
    RouterLink,

  ],
  styleUrls: ['./hub.component.scss']
})

export class HubComponent {
  @ViewChild('orderby') orderby!: ElementRef;
  router = inject(Router);
  backend = inject(BackendService);
  orderers: { label: string, value: string }[] = [
    {label: 'Trending', value: 'popularity'},
    {label: 'Most rating', value: 'vote_average'},
    {label: 'Most votes', value: 'vote_count'}
  ];
  orderer = signal("popularity");
  contentType = signal(ContentType.MOVIE);
  writingTitleName = signal<string | null>(null);
  securedTitleName = signal<string | null>(null);
  perPage = signal(10);
  page = signal(1);
  totalPages: Signal<number> = computed(() => {
    switch (this.contentType()) {
      case ContentType.MOVIE:
        return this.movies.asReadonly().value()?.last_page ?? 0;
      case ContentType.TV:
        return this.tv.asReadonly().value()?.last_page ?? 0;
      case ContentType.PEOPLE:
        return this.people.asReadonly().value()?.last_page ?? 0;
      default:
        return 0;
    }
  });
  peopleHits = computed(() => this.people.asReadonly().value() ? this.people.asReadonly().value().data as Person[] : []);

  genres: { id: number, name: string }[] = []

  constructor() {
    this.backend.getGenres().then((response) => {
      this.genres = response.data.data;
    })
  }

  tv = resource({
    request: () => ({
      by: this.orderer(),
      title: this.securedTitleName(),
      page: this.page(),
      hitsPerPage: this.perPage(),
    }),
    loader: async ({request}) => {
      return (await this.backend.getTv(request.title ?? "", request.by, request.page, request.hitsPerPage)).data;
    }
  });

  movies = resource({
    request: () => ({
      by: this.orderer(),
      title: this.securedTitleName(),
      page: this.page(),
      hitsPerPage: this.perPage(),
    }),
    loader: async ({request}) => {
      return (await this.backend.getMovies(request.title ?? "", request.by, request.page, request.hitsPerPage)).data;
    }
  });

  people = resource({
    request: () => ({
      by: this.orderer(),
      name: this.securedTitleName(),
      page: this.page(),
      hitsPerPage: this.perPage(),
    }),
    loader: async ({request}) => {
      return (await this.backend.getPeople(request.name ?? "", request.by, request.page, request.hitsPerPage)).data;
    }
  });

  private debounceEffect = effect((onCleanup) => {
    const value = this.writingTitleName();
    this.securedTitleName.set(value);
  });

// Añadir a hub.component.ts
  getVisiblePages(): number[] {
    const visiblePages: number[] = [];
    const maxVisiblePages = 5; // Puedes ajustar este número

    let start = Math.max(2, this.page() - Math.floor(maxVisiblePages / 2));
    let end = Math.min(this.totalPages() - 1, start + maxVisiblePages - 1);

    // Ajustar si estamos cerca del final
    if (end >= this.totalPages() - 1) {
      start = Math.max(2, this.totalPages() - maxVisiblePages);
      end = this.totalPages() - 1;
    }

    // Generar array de páginas visibles
    for (let i = start; i <= end; i++) {
      visiblePages.push(i);
    }

    return visiblePages;
  }

  navigate(path: string) {
    this.router.navigate([path])
  }

  onSelected(): void {
    this.orderer.set(this.orderby.nativeElement.value);
  }

  getYearDate(date: Date) {
    return new Date(date).getFullYear();
  }

  poster(path: string | null) {
    if (!path) return "https://placehold.co/75x100"
    return path.replace('original', `w154`);
  }

  getContentList() {
    if (this.contentType() === ContentType.MOVIE && this.movies.status() === 4) {
      const content = this.movies.asReadonly().value().data as Movie[];
      return content.map(movie => ({
        id: movie.id,
        type: 'movie',
        title: movie.title,
        poster: movie.poster,
        voteAverage: movie.vote_average,
        voteCount: movie.vote_count,
        hasDate: !!movie.release_date,
        dateText: movie.release_date ? this.getYearDate(movie.release_date) : '',
        hasDuration: !!(movie.runtime && parseInt(movie.runtime) > 0),
        durationText: !movie.runtime || parseInt(movie.runtime) <= 0 ? '' : movie.runtime + 'm',
        imageWidth: 50,
        imageHeight: 75
      }));
    } else if (this.contentType() === ContentType.TV && this.tv.status() === 4) {
      const content = this.tv.asReadonly().value().data as Tv[];
      return content.map(show => ({
        id: show.id,
        type: 'tv',
        title: show.name,
        poster: show.poster,
        voteAverage: show.vote_average,
        voteCount: show.vote_count,
        hasDate: !!show.first_air_date,
        dateText: (show.first_air_date ? this.getYearDate(show.first_air_date) : '') +
          (show.last_air_date ? ' /  ' + this.getYearDate(show.last_air_date) : ''),
        hasDuration: !!(show.episode_run_time && parseInt(show.episode_run_time) > 0),
        durationText: !show.episode_run_time || parseInt(show.episode_run_time) <= 0 ? '' :
          show.episode_run_time + 'm',
        imageWidth: 52.5,
        imageHeight: 70
      }));
    }
    return [];
  }


  protected readonly parseInt = parseInt;
  protected readonly ContentType = ContentType;
}

enum ContentType {
  MOVIE = 'movie',
  TV = 'tv',
  PEOPLE = 'people'
}
