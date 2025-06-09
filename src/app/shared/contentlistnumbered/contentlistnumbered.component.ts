import {ChangeDetectionStrategy, Component, computed, Input, signal} from '@angular/core';
import {NgIf, NgOptimizedImage} from '@angular/common';
import {Tv} from '../../models/Tv';
import {Movie} from '../../models/Movie';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-contentlist-numbered',
  imports: [
    NgIf,
    NgOptimizedImage,
    RouterLink
  ],
  templateUrl: './contentlistnumbered.component.html',
  styleUrl: './contentlistnumbered.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContentlistnumberedComponent {
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
