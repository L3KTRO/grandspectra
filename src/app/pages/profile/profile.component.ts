import {
  Component, computed,
  inject,
  OnChanges,
  OnInit,
  resource,
  ResourceRef,
  Signal,
  signal,
  SimpleChanges
} from '@angular/core';
import {NgIf, NgOptimizedImage} from '@angular/common';
import {BackendService} from "../../services/backend/backend.service";
import {Movie} from "../../models/Movie";
import {User} from '../../models/User';

@Component({
  selector: 'app-profile',
  imports: [
    NgOptimizedImage,
    NgIf
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  backend = inject(BackendService);
  resources: ResourceRef<User> = resource({
    request: () => ({}),
    loader: async () => (await this.backend.getMe()).data
  });
  me = computed(() => this.resources.asReadonly().value());

  logout() {
    this.backend.logout();
    location.reload();
  }

}
