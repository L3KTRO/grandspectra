// hub.component.ts
import {
  Component,
  effect,
  ElementRef,
  inject,
  resource,
  ResourceLoaderParams,
  ResourceRef,
  signal,
  ViewChild
} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {InputText} from 'primeng/inputtext';
import {NgClass, NgForOf, NgIf, NgOptimizedImage} from '@angular/common';
import {BackendService} from '../../services/backend/backend.service';
import {Movie} from '../../models/Movie';
import {Tv} from '../../models/Tv';
import {LoadingComponent} from '../../shared/loading/loading.component';

@Component({
  selector: 'app-hub',
  templateUrl: './hub.component.html',
  imports: [
    FormsModule,
    InputText,
    NgClass,
    NgForOf,
    NgOptimizedImage,
    NgIf,
    LoadingComponent,
  ],
  styleUrls: ['./hub.component.scss']
})

export class HubComponent {
  @ViewChild('orderby') orderby!: ElementRef;
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

  tv: ResourceRef<Tv[]> = resource({
    request: () => ({
      by: this.orderer(),
      trigger: this.isTv(),
      native: {
        name: this.securedTitleName()
      }
    }),
    loader: async ({request}) => {
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

  protected readonly parseInt = parseInt;
}
