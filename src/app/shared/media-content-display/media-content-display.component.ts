// media-content-display.component.ts
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  Input,
  linkedSignal,
  OnDestroy,
  resource,
  ResourceRef,
  signal,
  ViewChild,
  WritableSignal
} from '@angular/core';
import {DecimalPipe, NgClass, NgForOf, NgIf, NgOptimizedImage} from '@angular/common';
import {CreditlistComponent} from '../creditlist/creditlist.component';
import {ContentlistComponent} from '../contentlist/contentlist.component';
import Credit from '../../models/Credit';
import {Tv} from '../../models/Tv';
import {Movie} from '../../models/Movie';
import {Router, RouterLink} from "@angular/router";
import {RatingComponent} from '../rating/rating.component';
import {BackendService} from "../../services/backend/backend.service";
import {Me} from "../../models/Me";
import {UserAndContent} from "../../models/UserAndContent";
import {RatingsandreviewComponent} from "../ratingsandreview/ratingsandreview.component";
import {DialogComponent} from "../dialog/dialog.component";
import {FormsModule} from '@angular/forms';
import {ProgressSpinnerComponent} from '../progress-spinner/progress-spinner.component';
import {Review} from '../../models/Review';

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
    RatingsandreviewComponent,
    DialogComponent,
    NgForOf,
    FormsModule,
    ProgressSpinnerComponent,
  ],
  templateUrl: './media-content-display.component.html',
  styleUrl: './media-content-display.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MediaContentDisplayComponent implements OnDestroy {
  @Input({required: true}) id!: number;
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
  @Input() year!: string | null;
  @Input() cast!: Credit[];
  @Input() crew!: Credit[];
  @Input() director!: Credit;
  @Input() recommendations!: (Movie | Tv)[];
  @Input() genres!: string;
  @Input() companies!: string;
  @Input() reviews!: Review[];
  @Input() getPoster: (path: string | null) => string = () => '';

  router = inject(Router)
  backend = inject(BackendService)
  originalRating: UserAndContent | null = null;
  originalWatched: UserAndContent | null = null;
  originalWatchlist: UserAndContent | null = null;
  rating = signal(this.originalRating?.qualification || 0);
  watched = signal(this.originalWatched !== null);
  watchlist = signal(this.originalWatchlist !== null);
  hoverReview = signal(false);
  hoverList = signal(false);
  hoverWatchlist = signal(false);
  hoverWatched = signal(false);
  reviewText = signal('');

  authed = signal(false);
  data: ResourceRef<Me> = resource({
    request: () => ({}),
    loader: async () => {
      const req = await this.backend.getMe()

      if (req.status !== 200) return null

      this.authed.set(true);
      const data = req.data
      this.originalRating = data.ratings.find((rating: UserAndContent) => {
        return rating.movie_id === this.id || rating.tv_id === this.id;
      }) || null;
      this.rating.set(this.originalRating?.qualification || 0);
      this.originalWatched = data.watched.find((watched: UserAndContent) => {
        return watched.movie_id === this.id || watched.tv_id === this.id;
      }) || null;
      this.watched.set(this.originalWatched !== null);
      this.originalWatchlist = data.watchlist.find((watchlist: UserAndContent) => {
        return watchlist.movie_id === this.id || watchlist.tv_id === this.id;
      }) || null;
      this.watchlist.set(this.originalWatchlist !== null);

      console.log(this.reviews)

      return data
    }
  });
  isCast: WritableSignal<boolean> = signal(true);
  isMovie = this.router.url.includes('/movie');
  readonly = computed(() => this.data.asReadonly().value());

  ngOnDestroy(): void {
    this.updateInfo()
  }

  async updateInfo() {
    const contentType = this.isMovie ? "movie" : "tv";

    if (this.rating() !== 0 && this.originalRating === null) {
      // No existía y hay datos nuevos: POST
      await this.backend.authRequest(`/me/ratings?qualification=${parseInt(String(this.rating()))}&${contentType}_id=${this.id}`, {
        method: 'POST',
      });
    } else if (this.rating() !== 0 && this.rating() !== this.originalRating?.qualification) {
      // Existía y hay datos nuevos: PUT
      await this.backend.authRequest(`/me/ratings/${this.originalRating?.id}?qualification=${parseInt(String(this.rating()))}&${contentType}_id=${this.id}`, {
        method: 'PUT',
      });
    } else if (this.rating() === 0 && this.originalRating !== null) {
      // Existía y se ha eliminado: DELETE
      await this.backend.authRequest(`/me/ratings/${this.originalRating?.id}`, {
        method: 'DELETE'
      });
    }

    // Manejo de watched
    if (this.watched() && this.originalWatched === null) {
      // No existía y ha sido marcado como visto: POST
      await this.backend.authRequest(`/me/watched?${contentType}_id=${this.id}`, {
        method: 'POST',
      });
    } else if (!this.watched() && this.originalWatched !== null) {
      // Existía y ha sido desmarcado: DELETE
      await this.backend.authRequest(`/me/watched/${this.originalWatched?.id}`, {
        method: 'DELETE'
      });
    }

    // Manejo de watchlist
    if (this.watchlist() && this.originalWatchlist === null) {
      // No existía y ha sido agregado a watchlist: POST
      await this.backend.authRequest(`/me/watchlist?${contentType}_id=${this.id}`, {
        method: 'POST',
      });
    } else if (!this.watchlist() && this.originalWatchlist !== null) {
      // Existía y ha sido eliminado de watchlist: DELETE
      await this.backend.authRequest(`/me/watchlist/${this.originalWatchlist?.id}`, {
        method: 'DELETE'
      });
    }
  }

  toggler(value: boolean) {
    return !value;
  }

  @ViewChild('review') reviewDialog!: DialogComponent;
  @ViewChild("addToList") listDialog!: DialogComponent;

  listsAdded = linkedSignal(() => this.data.value().content_lists.map(r => r.id))

  toggleList(item: number) {
    this.listsAdded.update(res => {
      if (res.includes(item)) {
        return res.filter(i => i !== item);
      } else {
        return [...res, item];
      }
    })
  }

  openReviewDialog() {
    this.reviewDialog.open();
  }

  openListDialog() {
    this.listDialog.open();
  }

  async saveReview() {
    await this.backend.authRequest(`/me/reviews/`, {
      method: 'POST',
      data: {
        content: this.reviewText(),
        qualification: this.rating(),
        movie_id: this.isMovie ? this.id : null,
        tv_id: this.isMovie ? null : this.id,
      }
    }).then((res) => {
      console.log(res)
      this.reviewDialog.close();
    }).catch((err) => {
      console.error(err);
    })
  }
}
