import {Component, Input} from '@angular/core';
import {NgForOf} from '@angular/common';
import {Skeleton} from 'primeng/skeleton';

@Component({
  selector: 'app-ratingsandreview',
  imports: [
    NgForOf,
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
