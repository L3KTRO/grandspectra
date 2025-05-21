// hub.component.ts
import {Component, effect, ElementRef, inject, resource, ResourceRef, signal, ViewChild} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {InputText} from 'primeng/inputtext';
import {NgClass, NgIf, NgOptimizedImage} from '@angular/common';
import {BackendService} from '../../services/backend/backend.service';
import {Movie} from '../../models/Movie';
import {Tv} from '../../models/Tv';
import {Router} from '@angular/router';
import {MeiliService} from '../../services/meili/meili.service';
import {ProgressSpinnerComponent} from '../../shared/progress-spinner/progress-spinner.component';
import Person from '../../models/Person';

@Component({
  selector: 'app-hub',
  templateUrl: './hub.component.html',
  imports: [
    FormsModule,
    InputText,
    NgClass,
    NgOptimizedImage,
    NgIf,
    ProgressSpinnerComponent,

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
  genres: { id: number, name: string }[] = []

  constructor(private meili: MeiliService) {
    this.backend.getGenres().then((response) => {
      this.genres = response.data.data;
    })
  }

  tv: ResourceRef<Tv[] | undefined> = resource({
    request: () => ({
      by: this.orderer(),
      trigger: this.contentType(),
      native: {
        name: this.securedTitleName()
      }
    }),
    loader: async ({request}) => {
      return (await this.meili.tv(request.native.name ?? "", request.by)).hits as Tv[];
    }
  });

  movies: ResourceRef<Movie[] | undefined> = resource({
    request: () => ({
      by: this.orderer(),
      trigger: this.contentType(),
      native: {
        title: this.securedTitleName()
      }
    }),
    loader: async ({request}): Promise<Movie[]> => {
      return (await this.meili.movies(request.native.title ?? "", request.by)).hits as Movie[];
    }
  });

  people: ResourceRef<Person[] | undefined> = resource({
    request: () => ({
      by: this.orderer(),
      trigger: this.contentType(),
      native: {
        name: this.securedTitleName()
      }
    }),
    loader: async ({request}) => {
      return (await this.meili.people(request.native.name ?? "", request.by)).hits as any[];
    }
  });

  private debounceEffect = effect((onCleanup) => {
    const value = this.writingTitleName();
    this.securedTitleName.set(value);
  });

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
      return this.movies.asReadonly().value()?.map(movie => ({
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
      return this.tv.asReadonly().value()?.map(show => ({
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
