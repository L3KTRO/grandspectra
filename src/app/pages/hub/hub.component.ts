// hub.component.ts
import {Component, inject, resource, ResourceRef, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {InputText} from 'primeng/inputtext';
import {NgClass, NgForOf, NgOptimizedImage} from '@angular/common';
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
    NgOptimizedImage
  ],
  styleUrls: ['./hub.component.scss']
})
export class HubComponent {
  backend = inject(BackendService);
  isTv = signal(false)

  tv: ResourceRef<Tv[]> = resource({
    request: () => ({}),
    loader: async () => (
      await this.backend.request("/tv", {
        params: {
          sort_by: 'popularity',
          sort_dir: 'desc',
        }
      })).data.data,
  });

  movies: ResourceRef<Movie[]> = resource({
    request: () => ({}),
    loader: async () => (
      await this.backend.request("/movies", {
        params: {
          sort_by: 'popularity',
          sort_dir: 'desc',
        }
      })).data.data,
  });

  getYearDate(date: Date) {
    return new Date(date).getFullYear();
  }

  poster(path: string | null) {
    if (!path) return "https://placehold.co/75x100"
    return path.replace('original', `w154`);
  }

  protected readonly parseInt = parseInt;
}
