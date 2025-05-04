import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {NgForOf, NgIf, NgOptimizedImage} from '@angular/common';
import {Skeleton} from 'primeng/skeleton';
import {Tv} from '../../models/Tv';
import {Movie} from '../../models/Movie';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-contentlist-wrap',
  imports: [
    NgIf,
    NgForOf,
    Skeleton,
    NgOptimizedImage,
    RouterLink
  ],
  templateUrl: './contentlistwrap.component.html',
  styleUrl: './contentlistwrap.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class ContentlistWrapComponent {
  @Input({required: true}) content: (Movie | Tv)[] = [];
  @Input() title: string = '';
  @Input() sizes: {
    width: number;
    height: number;
  } = {width: 150, height: 225};
  wrap = true;

  intrinsic(poster: string | null) {
    if (!poster) return `https://placehold.co/${this.sizes.width}x${this.sizes.height}`
    return poster.replace('original', `w342`);
  }

  getTitle(item: (Movie | Tv)) {
    if ('title' in item) {
      return item.title;
    } else if ('name' in item) {
      return item.name;
    }
    return '';
  }

  isMovie(item: (Movie | Tv)) {
    return 'title' in item;
  }

  protected readonly Array = Array;
}
