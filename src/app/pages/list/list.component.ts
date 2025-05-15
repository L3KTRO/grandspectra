import {Component, computed, Input, linkedSignal, signal, ViewChild, WritableSignal} from '@angular/core';
import {Me} from '../../models/Me';
import {BackendService} from '../../services/backend/backend.service';
import {ContentList} from '../../models/ContentList';
import {ContentlistWrapComponent} from '../../shared/contentlistwrap/contentlistwrap.component';
import {NgClass, NgIf} from '@angular/common';
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
    NgClass
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {
  @Input() id!: string;

  @ViewChild('secureDelete') dialog!: DialogComponent;

  svgSize = 30

  vote: WritableSignal<boolean | null> = signal(null)
  voteCount = linkedSignal(() => this.list().votes.length)
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

  list = computedResource<ContentList>({
    loader: async () => {
      try {
        const req = await this.backend.list(this.id)
        return req.status === 200 ? req.data : null
      } catch {
        await this.router.navigate(['/lists'])
        return null
      }
    }
  })

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
    if (!this.descriptionList() || !this.nameList()) return;
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
    setTimeout(() => {
      this.backend.voteList(this.id, {
        method: act === null ? "DELETE" : "PUT",
        data: {
          vote: act
        }
      }).then((res) => {
        if (res.status === 200) {
          this.vote.set(res.data)
        } else {
          this.vote.set(null)
        }
      })
    }, 1000)
  }

  protected readonly toggler = toggler;
}
