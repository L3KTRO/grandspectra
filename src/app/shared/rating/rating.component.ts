import {Component, computed, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss'],
  imports: [
    FormsModule
  ]
})
export class RatingComponent {
  protected currentRating = signal(0);
  protected disablingDelete = computed(() => this.currentRating() === 0);

  protected deleteRating() {
    this.currentRating.set(0);
  }
}
