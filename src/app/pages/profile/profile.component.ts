import {Component, inject, resource, ResourceRef} from '@angular/core';
import {NgOptimizedImage} from '@angular/common';
import {BackendService} from "../../services/backend/backend.service";
import {Movie} from "../../models/Movie";

@Component({
  selector: 'app-profile',
  imports: [
    NgOptimizedImage
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  backendService = inject(BackendService);

  logout() {
    this.backendService.logout();
    location.reload();
  }

}
