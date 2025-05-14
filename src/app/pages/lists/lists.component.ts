import {Component, computed, resource, ResourceRef} from '@angular/core';
import {Me} from '../../models/Me';
import {BackendService} from '../../services/backend/backend.service';

@Component({
  selector: 'app-lists',
  imports: [],
  templateUrl: './lists.component.html',
  styleUrl: './lists.component.scss'
})
export class ListsComponent {

  constructor(private backend: BackendService) {
  }

  me: ResourceRef<Me> = resource({
    request: () => ({}),
    loader: async () => {
      const req = await this.backend.getMe()
      if (req.status !== 200) return null

      return req.data
    }
  });

  readonly = computed(() => this.me.asReadonly().value());

}
