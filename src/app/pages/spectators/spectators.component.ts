import {Component, inject} from '@angular/core';
import {computedResource} from '../../helpers/Resources';
import {User} from '../../models/User';
import {BackendService} from '../../services/backend/backend.service';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-spectators',
  imports: [
    NgForOf
  ],
  templateUrl: './spectators.component.html',
  styleUrl: './spectators.component.scss'
})
export class SpectatorsComponent {
  backend = inject(BackendService);
  users = computedResource<User[]>({
    loader: async () => {
      const req = await this.backend.getUsers()
      console.log(req)
      if (req.status === 200) {
        return req.data.data
      } else {
        return []
      }
    }
  })

}
