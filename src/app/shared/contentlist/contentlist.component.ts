import {Component, Input} from '@angular/core';
import {Content} from '../../models/Content';
import {NgForOf, NgIf, NgOptimizedImage} from '@angular/common';
import {Skeleton} from 'primeng/skeleton';

@Component({
  selector: 'app-contentlist',
  imports: [
    NgIf,
    NgForOf,
    NgOptimizedImage,
    Skeleton
  ],
  templateUrl: './contentlist.component.html',
  styleUrl: './contentlist.component.scss'
})
export class ContentlistComponent {
  @Input({required: true}) content: Content[] = [];
  @Input() title: string = '';
  @Input() showContentTitle: boolean = false;
  @Input() sizes: {
    width: number;
    height: number;
  } = {width: 150, height: 225};

  intrinsic(poster: string) {
    if (!poster) return `https://placehold.co/${this.sizes.width}x${this.sizes.height}`
    return poster.replace('original', `w342`);
  }

  protected readonly Array = Array;
}
