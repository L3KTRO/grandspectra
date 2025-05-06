// media-content-display.component.ts
import {ChangeDetectionStrategy, Component, Input, signal, WritableSignal} from '@angular/core';
import {DecimalPipe, NgClass, NgIf, NgOptimizedImage} from '@angular/common';
import {CreditlistComponent} from '../creditlist/creditlist.component';
import {ContentlistComponent} from '../contentlist/contentlist.component';
import Credit from '../../models/Credit';
import {Tv} from '../../models/Tv';
import {Movie} from '../../models/Movie';
import {RouterLink} from "@angular/router";
import {RatingComponent} from '../rating/rating.component';

@Component({
  selector: 'app-media-content-display',
  imports: [
    NgIf,
    NgOptimizedImage,
    CreditlistComponent,
    NgClass,
    DecimalPipe,
    ContentlistComponent,
    RouterLink,
    RatingComponent,
  ],
  templateUrl: './media-content-display.component.html',
  styleUrl: './media-content-display.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MediaContentDisplayComponent {
  @Input() id!: number;
  @Input() imdbId!: number | null;
  @Input() title!: string;
  @Input() tagline!: string | null;
  @Input() poster!: string | null;
  @Input() overview!: string | null;
  @Input() releaseDate!: Date | null;
  @Input() voteAverage!: string | null;
  @Input() voteCount!: number | null;
  @Input() runtime!: string | null;
  @Input() budget!: string | null;
  @Input() revenue!: string | null;
  @Input() watched!: WritableSignal<boolean>;
  @Input() watchlist!: WritableSignal<boolean>;
  @Input() favourite!: WritableSignal<boolean>;
  @Input() rating!: WritableSignal<null>;
  @Input() year!: string | null;
  @Input() cast!: Credit[];
  @Input() crew!: Credit[];
  @Input() director!: Credit;
  @Input() recommendations!: (Movie | Tv)[];
  @Input() genres!: string;
  @Input() companies!: string;

  @Input() onTogglePeople: () => void = () => {
    return null;
  };
  @Input() onToggleWatched: () => void = () => {
    return null;
  };
  @Input() onToggleWatchlist: () => void = () => {
    return null;
  };
  @Input() onToggleFavourite: () => void = () => {
    return null;
  };
  @Input() getPoster: (path: string | null) => string = () => '';

  isCast: WritableSignal<boolean> = signal(true);

}
