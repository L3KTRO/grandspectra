import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {DatePipe, NgForOf, NgIf, SlicePipe} from '@angular/common';
import {Skeleton} from 'primeng/skeleton';
import {Review} from '../../models/Review';
import {DialogComponent} from '../dialog/dialog.component';

@Component({
  selector: 'app-ratingsandreview',
  imports: [
    NgForOf,
    Skeleton,
    NgIf,
    DatePipe,
    SlicePipe,
    DialogComponent
  ],
  templateUrl: './ratingsandreview.component.html',
  styleUrl: './ratingsandreview.component.scss'
})
export class RatingsandreviewComponent {

  @Input() sizes: {
    width: number;
    height: number;
  } = {width: 150, height: 225};
  @Input() content: Review[] = [];
  @ViewChild("fullContent") contentDialog!: DialogComponent;

  protected readonly Array = Array;
}
