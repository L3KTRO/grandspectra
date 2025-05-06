import {Component, Input} from '@angular/core';
import {NgForOf, NgOptimizedImage} from '@angular/common';
import {RouterLink} from '@angular/router';
import {Skeleton} from 'primeng/skeleton';

@Component({
  selector: 'app-ratingsandreview',
  imports: [
    NgForOf,
    NgOptimizedImage,
    RouterLink,
    Skeleton
  ],
  templateUrl: './ratingsandreview.component.html',
  styleUrl: './ratingsandreview.component.scss'
})
export class RatingsandreviewComponent {
  @Input() sizes: {
    width: number;
    height: number;
  } = {width: 150, height: 225};
  content = [];


  protected readonly Array = Array;
}
