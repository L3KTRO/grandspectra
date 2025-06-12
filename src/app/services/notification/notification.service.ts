// notification.service.ts
import {inject, Injectable} from '@angular/core';
import {Notification} from '../../models/Notification';
import {BackendService} from '../backend/backend.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = '/me/notifications';
  backend = inject(BackendService);

  async getNotifications() {
    return await this.backend.authRequest(`${this.apiUrl}`);
  }

  markAsRead(notificationId: string) {
    return this.backend.authRequest(`${this.apiUrl}/${notificationId}/read`, {method: 'POST'});
  }

  markAllAsRead() {
    return this.backend.authRequest(`${this.apiUrl}/read-all`, {method: 'POST'});
  }

  unreadCount() {
    return this.backend.authRequest(`${this.apiUrl}/unread-count`);
  }
}
