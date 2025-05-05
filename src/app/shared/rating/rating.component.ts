import {Component, computed, signal} from '@angular/core';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss'],
})
export class RatingComponent {
  protected currentRating = 0;
  protected hasRating = signal(false);
  protected disablingDelete = computed(() => !this.hasRating);

  protected onRatingChange(event: Event) {
    this.currentRating = +(event.target as HTMLInputElement).value;
  }

  protected onRatingChangeUp(event: Event) {
    this.currentRating = +(event.target as HTMLInputElement).value;
    this.hasRating.set(true);
  }

  protected deleteRating() {
    this.hasRating.set(false);
    this.currentRating = 0;
  }
}
