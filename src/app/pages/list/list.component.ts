import {
  Component,
  computed, ElementRef, HostListener,
  Input,
  linkedSignal,
  resource,
  ResourceRef,
  signal,
  ViewChild,
  WritableSignal
} from '@angular/core';
import {Me} from '../../models/Me';
import {BackendService} from '../../services/backend/backend.service';
import {ContentList} from '../../models/ContentList';
import {ContentlistWrapComponent} from '../../shared/contentlistwrap/contentlistwrap.component';
import {DatePipe, NgClass, NgForOf, NgIf, NgOptimizedImage, SlicePipe, TitleCasePipe} from '@angular/common';
import {computedResource} from '../../helpers/Resources';
import {toggler} from '../../helpers/Toggler';
import {DialogComponent} from '../../shared/dialog/dialog.component';
import {Router, RouterLink} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {ChecksliderComponent} from '../../shared/checkslider/checkslider.component';
import {Result} from '../../models/Result';
import {Movie} from '../../models/Movie';
import {Tv} from '../../models/Tv';

@Component({
  selector: 'app-list',
  imports: [
    NgIf,
    DialogComponent,
    FormsModule,
    NgClass,
    SlicePipe,
    ChecksliderComponent,
    RouterLink,
    NgOptimizedImage,
    TitleCasePipe,
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {
  @Input() id!: string;

  @ViewChild('secureDelete') dialog!: DialogComponent;

  svgSize = 30

  vote: WritableSignal<boolean | null> = linkedSignal(() => {
    const ownVote = this.list().votes.find(v => v.user_id === this.me()?.id)
    if (!ownVote) return null
    if (ownVote.vote === 1) return true;
    if (ownVote.vote === 0) return false;
    else return null
  })

  save = computed(() => !!this.me().content_lists_saved.find(v => `${v.id}` === this.id))

  voteCount = linkedSignal(() => this.list().votes.filter(v => v.vote === 1).length - this.list().votes.filter(v => v.vote === 0).length)
  nameList = linkedSignal(() => this.list().name)
  descriptionList = linkedSignal(() => this.list().description)
  editMode = signal(false)
  visibility = linkedSignal(() => this.list().public)

  constructor(private backend: BackendService, private router: Router) {
  }

  meResource: ResourceRef<Me> = resource({
    loader: async () => {
      const req = await this.backend.getMe()
      return req.status === 200 ? req.data : null
    }
  });

  me = computed(() => this.meResource.asReadonly().value());

  listResource: ResourceRef<ContentList> = resource({
    loader: async () => {
      try {
        const req = await this.backend.list(this.id)
        return req.status === 200 ? req.data : null
      } catch {
        await this.router.navigate(['/lists'])
      }
    }
  })

  list = computed(() => this.listResource.asReadonly().value())

  content = linkedSignal(() => {
    if (!this.list()) return []
    const content = [];
    content.push(...this.list().movie)
    content.push(...this.list().tv)
    return content
  });

  delete() {
    this.backend.list(this.id, {method: "DELETE"}).then((res) => {
      if (res.status === 204) {
        this.dialog.close()
        window.location.reload()
      }
    })
  }

  private arraysEqual(a: any[], b: any[]): boolean {
    if (a.length !== b.length) return false;
    return a.every((item, idx) => item.id === b[idx].id);
  }

  editing() {
    if (this.editMode() && (!this.descriptionList() || !this.nameList())) return;
    this.editMode.update(toggler)
    if (!this.editMode()) {
      const movies = this.content().filter(item => this.isMovie(item))
      const tvs = this.content().filter(item => !this.isMovie(item))

      if (
        this.descriptionList() === this.list().description
        && this.nameList() === this.list().name
        && this.list().public === this.visibility()
        && this.arraysEqual(this.list().tv, tvs)
        && this.arraysEqual(this.list().movie, movies)) return;

      this.backend.list(this.id, {
        method: "PUT",
        data: {
          name: this.nameList(),
          description: this.descriptionList(),
          public: this.visibility(),
          movie_id: movies.map(item => item.id),
          tv_id: tvs.map(item => item.id)
        }
      }).then((_) => {
        window.location.reload()
      })
    }
  }

  voting(act: boolean | null) {
    this.vote.set(act)
    this.backend.voteList(this.id, {
      method: act === null ? "DELETE" : "PUT",
      data: {
        vote: act
      }
    }).then((_) => {
      this.listResource.reload()
    })
  }

  saving() {
    this.backend.saveList(this.id, {
      method: this.save() ? "DELETE" : "PUT",
    }).then((_) => {
      this.meResource.reload()
    })
  }

  // -- Searcher Toggler --

  @ViewChild('secureDelete') deleteDialog!: DialogComponent;

  // ... meResource, listResource, etc.

  // --- NUEVAS PROPIEDADES PARA EL BUSCADOR ---

  // Referencias a elementos del DOM para gestionar el "click outside"
  @ViewChild('searchContainer') searchContainer!: ElementRef;

  // Signals para gestionar el estado de la búsqueda
  searchQuery = signal('');
  searchResults = signal<any[]>([]);
  isSearching = signal(false);
  showResults = signal(false);
  private searchDebounceTimer: any = null;

  // --- MÉTODOS EXISTENTES ---
  // ... constructor, delete, editing, etc.

  // --- NUEVOS MÉTODOS PARA EL BUSCADOR ---

  /**
   * Gestiona el evento de clic en todo el documento para cerrar los resultados
   * si se hace clic fuera del contenedor de búsqueda.
   */
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    if (this.searchContainer && !this.searchContainer.nativeElement.contains(event.target)) {
      this.showResults.set(false);
    }
  }

  /**
   * Se activa al escribir en el input. Utiliza un debounce para evitar
   * llamadas excesivas a la API.
   */
  onSearchInput(event: Event) {
    const query = (event.target as HTMLInputElement).value;
    this.searchQuery.set(query);

    clearTimeout(this.searchDebounceTimer);

    if (query.trim().length < 2) {
      this.searchResults.set([]);
      this.isSearching.set(false);
      return;
    }

    this.isSearching.set(true);
    this.showResults.set(true); // Muestra el contenedor de resultados

    this.searchDebounceTimer = setTimeout(async () => {
      try {
        // Llama al nuevo endpoint 'meili/onlycontent'
        const response = await this.backend.mediaSearch(query); // Asume que este método existe en tu BackendService
        if (response.status === 200) {
          this.searchResults.set(response.data);
        }
      } catch (error) {
        console.error('Error en la búsqueda de contenido:', error);
        this.searchResults.set([]);
      } finally {
        this.isSearching.set(false);
      }
    }, 300);
  }

  /**
   * Añade el contenido seleccionado a la lista actual.
   * @param content El objeto de película o serie a añadir.
   */
  async addContentToList(content: Result) {

    // Oculta y limpia el buscador
    this.showResults.set(false);
    this.searchQuery.set('');
    this.searchResults.set([]);

    switch (content._index) {
      case 'movies':
        if (this.content().some(item => item.id === content.id && (item as Movie)?.title === content.title)) return;
        let mv = (await this.backend.request("/movies/" + content.id)).data
        this.content.update(list => {
          list.push(mv)
          return list
        })
        break;
      case 'tv':
        if (this.content().some(item => item.id === content.id && (item as Tv)?.name === content.name)) return;
        let tv = (await this.backend.request("/tv/" + content.id)).data
        this.content.update(list => {
          list.push(tv)
          return list
        })
        break;
      default:
        console.warn('Tipo de contenido no soportado:', content._index);
        return;
    }
  }

  deleteContentFromList(content: (Movie | Tv)) {
    console.log(content)
    this.content.update(list => {
      const movies = list.filter(item => this.isMovie(item));
      const tvs = list.filter(item => !this.isMovie(item));

      if (this.isMovie(content)) {
        // Es una película, eliminar de movies
        const updatedMovies = movies.filter(item => item !== content);
        return [...updatedMovies, ...tvs];
      } else if (!this.isMovie(content)) {
        // Es una serie, eliminar de tvs
        const updatedTvs = tvs.filter(item => item !== content);
        return [...movies, ...updatedTvs];
      }
      return list;
    })
  }

  sizes: {
    width: number;
    height: number;
  } = {width: 150, height: 225};

  intrinsic(poster: string | null) {
    if (!poster) return `https://placehold.co/${this.sizes.width}x${this.sizes.height}`
    return poster.replace('original', `w342`);
  }

  getTitle(item: (Movie | Tv)) {
    if ('title' in item) {
      return item.title;
    } else if ('name' in item) {
      return item.name;
    }
    return '';
  }

  isMovie(item: (Movie | Tv)) {
    return 'title' in item;
  }

  protected readonly toggler = toggler;
}
