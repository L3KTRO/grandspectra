import {Component, Input} from '@angular/core';
import {NgForOf, NgIf, NgOptimizedImage} from '@angular/common';
import {Skeleton} from 'primeng/skeleton';
import {Tv} from '../../models/Tv';
import {Movie} from '../../models/Movie';

@Component({
  selector: 'app-contentlist',
  imports: [
    NgIf,
    NgForOf,
    Skeleton,
    NgOptimizedImage
  ],
  templateUrl: './contentlist.component.html',
  styleUrl: './contentlist.component.scss'
})
export class ContentlistComponent {
  @Input({required: true}) content: (Movie | Tv)[] = [];
  @Input() title: string = '';
  @Input() sizes: {
    width: number;
    height: number;
  } = {width: 150, height: 225};

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

  protected readonly Array = Array;
}
