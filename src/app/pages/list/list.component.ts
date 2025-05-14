import {Component, computed, Input, linkedSignal, signal, ViewChild, WritableSignal} from '@angular/core';
import {Me} from '../../models/Me';
import {BackendService} from '../../services/backend/backend.service';
import {ContentList} from '../../models/ContentList';
import {ContentlistWrapComponent} from '../../shared/contentlistwrap/contentlistwrap.component';
import {NgIf} from '@angular/common';
import {computedResource} from '../../helpers/Resources';
import {toggler} from '../../helpers/Toggler';
import {DialogComponent} from '../../shared/dialog/dialog.component';

@Component({
  selector: 'app-list',
  imports: [
    ContentlistWrapComponent,
    NgIf,
    DialogComponent
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

  constructor(private backend: BackendService) {
  }

  me = computedResource<Me>({
    loader: async () => {
      const req = await this.backend.getMe()
      this.dialog.open()
      return req.status === 200 ? req.data : null
    }
  });

  list = computedResource<ContentList>({
    loader: async () => {
      const req = await this.backend.list(this.id)
      return req.status === 200 ? req.data : null
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

  protected readonly toggler = toggler;
}
