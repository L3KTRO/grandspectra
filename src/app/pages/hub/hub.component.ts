// hub.component.ts
import {Component, effect, ElementRef, inject, resource, ResourceRef, signal, ViewChild} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {InputText} from 'primeng/inputtext';
import {NgClass, NgIf, NgOptimizedImage} from '@angular/common';
import {BackendService} from '../../services/backend/backend.service';
import {Movie} from '../../models/Movie';
import {Tv} from '../../models/Tv';
import {LoadingComponent} from '../../shared/loading/loading.component';
import {ChecksliderComponent} from '../../shared/checkslider/checkslider.component';
import {Router} from '@angular/router';

@Component({
  selector: 'app-hub',
  templateUrl: './hub.component.html',
  imports: [
    FormsModule,
    InputText,
    NgClass,
    NgOptimizedImage,
    NgIf,
    LoadingComponent,
    ChecksliderComponent,

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
  isTv = signal(false);
  writingTitleName = signal<string | null>(null);
  securedTitleName = signal<string | null>(null);
  genres: { id: number, name: string }[] = []

  constructor() {
    this.backend.getGenres().then((response) => {
      this.genres = response.data.data;
    })
  }

  tv: ResourceRef<Tv[]> = resource({
    request: () => ({
      by: this.orderer(),
      trigger: this.isTv(),
      native: {
        name: this.securedTitleName()
      }
    }),
    loader: async ({request}) => {
      console.log(this.genres)
      return (await this.backend.request("/tv", {
        params: {
          sort_by: request.by,
          sort_dir: 'desc',
          ...request.native
        }
      })).data.data
    }
  });

  movies: ResourceRef<Movie[]> = resource({
    request: () => ({
      by: this.orderer(),
      trigger: this.isTv(),
      native: {
        title: this.securedTitleName()
      }
    }),
    loader: async ({request}) => {
      return (await this.backend.request("/movies", {
        params: {
          sort_by: request.by,
          sort_dir: 'desc',
          ...request.native
        }
      })).data.data
    }
  });

  private debounceEffect = effect((onCleanup) => {
    const value = this.writingTitleName();
    const timeoutId = setTimeout(() => {
      this.securedTitleName.set(value);
    }, 700);

    // Limpieza del timeout si el valor cambia antes de 1s
    onCleanup(() => clearTimeout(timeoutId));
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
    if (!this.isTv() && this.movies.status() === 4) {
      return this.movies.asReadonly().value().map(movie => ({
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
    } else if (this.isTv() && this.tv.status() === 4) {
      return this.tv.asReadonly().value().map(show => ({
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
}
