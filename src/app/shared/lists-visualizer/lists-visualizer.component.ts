import {Component, Input} from '@angular/core';
import {ContentList} from '../../models/ContentList';
import {Content} from '../../models/Content';
import {NgForOf, NgIf, NgOptimizedImage} from '@angular/common';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-lists-visualizer',
  imports: [
    NgForOf,
    NgIf,
    NgOptimizedImage,
    RouterLink
  ],
  templateUrl: './lists-visualizer.component.html',
  styleUrl: './lists-visualizer.component.scss'
})
export class ListsVisualizerComponent {
  @Input({required: true}) list!: ContentList;
  @Input() disabled = true;

  getFullContent(list: ContentList): Content[] {
    return [...list.tv, ...list.movie]
      .sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
  }

  getPosterUrl(path: string | null): string {
    if (!path) return 'https://placehold.co/100x150?text=No+Image';

    // Si el path ya contiene la URL base de TMDB, úsalo directamente
    if (path.startsWith('http')) return path;

    // Si es solo el path de TMDB, añade la base URL
    return `https://image.tmdb.org/t/p/w185${path}`;
  }
}
