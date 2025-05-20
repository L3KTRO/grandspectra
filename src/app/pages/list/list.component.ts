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
import {Router} from '@angular/router';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-list',
  imports: [
    ContentlistWrapComponent,
    NgIf,
    DialogComponent,
    FormsModule,
    NgClass,
    SlicePipe
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
    if (ownVote.vote === 1) return true
    if (ownVote.vote === 0) return false
    else return null
  })
  voteCount = linkedSignal(() => this.list().votes.filter(v => v.vote === 1).length - this.list().votes.filter(v => v.vote === 0).length)
  nameList = linkedSignal(() => this.list().name)
  descriptionList = linkedSignal(() => this.list().description)
  editMode = signal(false)

  constructor(private backend: BackendService, private router: Router) {
  }

  me = computedResource<Me>({
    loader: async () => {
      const req = await this.backend.getMe()
      return req.status === 200 ? req.data : null
    }
  });

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
      if (this.descriptionList() === this.list().description && this.nameList() === this.list().name) return;
      this.backend.list(this.id, {
        method: "PUT",
        data: {
          name: this.nameList(),
          description: this.descriptionList()
        }
      }).then((_) => {
        window.location.reload()
      })
    } else {
      document.querySelector<HTMLInputElement>('#list-title')!.focus();
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

  saving(){

  }

  protected readonly toggler = toggler;
}
