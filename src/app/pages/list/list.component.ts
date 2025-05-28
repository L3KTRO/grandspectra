import {
  Component,
  computed,
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
import {NgClass, NgIf, SlicePipe} from '@angular/common';
import {computedResource} from '../../helpers/Resources';
import {toggler} from '../../helpers/Toggler';
import {DialogComponent} from '../../shared/dialog/dialog.component';
import {Router, RouterLink} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {ChecksliderComponent} from '../../shared/checkslider/checkslider.component';

@Component({
  selector: 'app-list',
  imports: [
    ContentlistWrapComponent,
    NgIf,
    DialogComponent,
    FormsModule,
    NgClass,
    SlicePipe,
    ChecksliderComponent,
    RouterLink
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

  content = computed(() => {
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

  editing() {
    if (this.editMode() && (!this.descriptionList() || !this.nameList())) return;
    this.editMode.update(toggler)
    if (!this.editMode()) {
      if (this.descriptionList() === this.list().description && this.nameList() === this.list().name && this.list().public === this.visibility()) return;
      this.backend.list(this.id, {
        method: "PUT",
        data: {
          name: this.nameList(),
          description: this.descriptionList(),
          public: this.visibility(),
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

  protected readonly toggler = toggler;
}
