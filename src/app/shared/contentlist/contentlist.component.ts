import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {NgForOf, NgIf, NgOptimizedImage} from '@angular/common';
import {Tv} from '../../models/Tv';
import {Movie} from '../../models/Movie';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-contentlist',
  imports: [
    NgIf,
    NgForOf,
    NgOptimizedImage,
    RouterLink
  ],
  templateUrl: './contentlist.component.html',
  styleUrl: './contentlist.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContentlistComponent {
  @Input({required: true}) content: (Movie | Tv)[] = [];
  @Input() title: string = '';
  @Input() sizes: {
    width: number;
    height: number;
  } = {width: 150, height: 225};
  @Input() wrap: boolean = false;

  intrinsic(poster: string | null) {
    if (!poster) return `https://placehold.co/${this.sizes.width}x${this.sizes.height}`
    return poster.replace('original', `w185`);
  }

  getTitle(item: (Movie | Tv)) {
    if ('title' in item) {
      return item.title;
    } else if ('name' in item) {
      return item.name;
    }
    return '';
  }

  isMovie(item: (Movie | Tv)): Boolean {
    return 'title' in item;
  }

  protected readonly Array = Array;
}
