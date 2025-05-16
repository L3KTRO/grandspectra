import {Component, computed, Input, ViewChild} from '@angular/core';
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

  sorted = computed(() => this.content.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));

  protected readonly Array = Array;
}
