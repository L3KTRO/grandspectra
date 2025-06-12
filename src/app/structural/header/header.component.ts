// header.component.ts
import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  computed, ElementRef,
  HostListener,
  inject,
  OnDestroy,
  OnInit,
  resource,
  signal, ViewChild,
  WritableSignal
} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {Router, RouterModule} from '@angular/router';
import {GrandSpectraBrandComponent} from '../../shared/grand-spectra-brand/grand-spectra-brand.component';
import {BackendService} from '../../services/backend/backend.service';
import {SyncStore} from '../../stores/SyncStore';
import {computedResource} from '../../helpers/Resources';
import {Me} from '../../models/Me';
import {NotificationService} from '../../services/notification/notification.service';
import {NotificationsHelper} from '../../helpers/NotificationsHelper';
import {toggler} from '../../helpers/Toggler';
import {Tv} from '../../models/Tv';


interface Result {
  id: number;
  title: string;
  name: string;
  _index: "tv" | "movies" | "people";
  poster: string;
  still: string;
  known_for_department?: string;
  episode_run_time?: number;
  release_date?: string;
  first_air_date?: string;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, GrandSpectraBrandComponent, NgOptimizedImage],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('searchInput', {static: false}) searchInput: ElementRef<HTMLInputElement> | undefined;


  constructor(public syncStore: SyncStore, public notificationsHelper: NotificationsHelper, public router: Router) {
    this.initialSync.set(syncStore.loginSync())
  }

  initialSync = signal(0)
  isMenuOpen = signal(false);
  backendService = inject(BackendService);

  me = computedResource<Me>({
    request: () => ({
      sync: this.syncStore.loginSync()
    }),
    loader: async () => {
      const req = await this.backendService.getMe();
      if (req.status === 200) {
        return req.data;
      } else {
        return null;
      }
    }
  })

  windowWidth = signal(typeof window !== 'undefined' ? window.innerWidth : 1024);

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    const target = event.target as Window;
    this.windowWidth.set(target.innerWidth);
  }

  ngOnInit() {
    this.windowWidth.set(window.innerWidth);
  }

  ngAfterViewChecked() {
    if (this.searchInput) {
      this.searchInput.nativeElement.focus();
    }
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.onResize);
    if (this.searchDebounceTimer) {
      clearTimeout(this.searchDebounceTimer);
    }
  }

  togglerMenu(signal: WritableSignal<boolean>) {
    if (this.windowWidth() <= 725) signal.update(value => !value);
  }

  isSearchOpen = signal(false);
  searchQuery = signal('');
  searchResults = signal<Result[]>([]);
  isSearching = signal(false);
  searchDebounceTimer: any = null;

  // Método para abrir/cerrar el buscador
  toggleSearch() {
    this.searchQuery.set('');
    this.searchResults.set([]);
    this.isSearchOpen.update(value => !value);
  }

  // Método para manejar la búsqueda con debounce
  onSearchInput(event: Event) {
    const target = event.target as HTMLInputElement;
    const query = target.value;
    this.searchQuery.set(query);

    // Limpiar el timer anterior
    if (this.searchDebounceTimer) {
      clearTimeout(this.searchDebounceTimer);
    }

    if (query.trim().length < 2) {
      this.searchResults.set([]);
      this.isSearching.set(false);
      return;
    }

    this.isSearching.set(true);

    // Debounce de 300ms
    this.searchDebounceTimer = setTimeout(async () => {
      try {
        // Aquí llamarías a tu endpoint de búsqueda
        const response = await this.backendService.globalSearch(query);
        if (response.status === 200) {
          this.searchResults.set(response.data.slice(0, 10)); // Limitar a 10 resultados
        }
      } catch (error) {
        console.error('Error en búsqueda:', error);
        this.searchResults.set([]);
      } finally {
        this.isSearching.set(false);
      }
    }, 100);
  }

  // Método para manejar teclas especiales
  @HostListener('document:keydown', ['$event'])
  onSearchKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' && this.isSearchOpen()) {
      this.toggleSearch();
    } else if (event.altKey && (event.key === 'q' || event.key === 'Q')) {
      this.toggleSearch();
    }
  }

  // Añade este método a tu componente
  navigateToResult(result: Result) {
    // Cerrar el buscador
    this.toggleSearch();

    // Navegar según el tipo de resultado
    console.log(result._index)
    switch (result._index) {
      case 'movies':
        this.router.navigate(['/movie', result.id]);
        break;
      case 'tv':
        this.router.navigate(['/tv', result.id]);
        break;
      case 'people':
        this.router.navigate(['/person', result.id]);
        break;
    }
  }

  getPoster(path: string | undefined){
    if (!path) return "https://placehold.co/50x75";
    return path.replace("original", "w92");
  }

  protected readonly toggler = toggler;
}
