// home.component.ts
import {Component, computed, HostListener, inject, resource, ResourceRef, Signal, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Movie} from '../../models/Movie';
import {Tv} from '../../models/Tv';
import {MeiliService} from '../../services/meili/meili.service';
import {BackendService} from '../../services/backend/backend.service';
import {ContentlistnumberedComponent} from '../../shared/contentlistnumbered/contentlistnumbered.component';
import {RouterLink} from '@angular/router'; // Asegúrate de tener la interfaz Movie

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ContentlistnumberedComponent, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  meili = inject(MeiliService)
  backend = inject(BackendService)
  windowWidth = signal(window.innerWidth);
  mobile: Signal<boolean> = computed(() => this.windowWidth() < 750);
  movies: ResourceRef<Movie[] | undefined> = resource({
    loader: async () => (await this.meili.movies("", "popularity")).hits as Movie[]
  });
  tv: ResourceRef<Tv[]> = resource({
    loader: async () => (await this.backend.getPopularTv()).data.data
  });

  features = [
    {
      title: 'Organize your content',
      description: 'Keep your watched list organized and accessible at all times.'
    },
    {
      title: 'Don\'t know what to watch? <br>Check our Hub',
      description: 'Our database has more than 1 million movies and more than 150,000 tv shows'
    },
    {
      title: 'Share with your friends',
      description: 'Share your ratings, watchlist and watched content.'
    },
    {
      title: 'Updated daily',
      description: 'We update our database daily with the latest movies and tv shows.'
    },
  ];

  @HostListener('window:resize')
  onResize() {
    this.windowWidth.set(window.innerWidth);
  }
}
