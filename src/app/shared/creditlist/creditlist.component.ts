import {Component, Input} from '@angular/core';
import {NgForOf, NgIf, NgOptimizedImage} from '@angular/common';
import {Skeleton} from 'primeng/skeleton';
import Credit from '../../models/Credit';
import {OccupationEnum} from '../../models/Occupation';

@Component({
  selector: 'app-creditlist',
  imports: [
    NgIf,
    NgForOf,
    Skeleton,
    NgOptimizedImage
  ],
  templateUrl: './creditlist.component.html',
  styleUrl: './creditlist.component.scss'
})
export class CreditlistComponent {
  @Input({required: true}) content: Credit[] = [];
  @Input() title: string = '';
  @Input() sizes: {
    width: number;
    height: number;
  } = {width: 150, height: 225};

  intrinsic(poster: string | null) {
    if (!poster) return `https://placehold.co/${this.sizes.width}x${this.sizes.height}`
    return poster.replace('original', `w300`);
  }

  protected readonly Array = Array;
  protected readonly OccupationEnum = OccupationEnum;
}
