// hub.component.ts
import {Component, ElementRef, inject, resource, ResourceRef, signal, ViewChild} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {InputText} from 'primeng/inputtext';
import {NgClass, NgForOf, NgIf, NgOptimizedImage} from '@angular/common';
import {BackendService} from '../../services/backend/backend.service';
import {Movie} from '../../models/Movie';
import {Tv} from '../../models/Tv';

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

  tv: ResourceRef<Tv[]> = resource({
    request: () => ({by: this.orderer()}),
    loader: async ({request}) => (
      await this.backend.request("/tv", {
        params: {
          sort_by: request.by,
          sort_dir: 'desc',
        }
      })).data.data,
  });

  movies: ResourceRef<Movie[]> = resource({
    request: () => ({by: this.orderer()}),
    loader: async ({request}) => (
      await this.backend.request("/movies", {
        params: {
          sort_by: request.by,
          sort_dir: 'desc',
        }
      })).data.data,
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
