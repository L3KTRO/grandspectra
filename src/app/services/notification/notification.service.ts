// notification.service.ts
import {Injectable} from '@angular/core';
import {Notification} from '../../models/Notification';
import {BackendService} from '../backend/backend.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = '/api/notifications';

  constructor(private backend: BackendService) {
  }

  getNotifications() {
    return this.backend.api.get<{ data: Notification[] }>(`${this.apiUrl}`);
  }

  markAsRead(notificationId: string) {
    return this.backend.api.patch(`${this.apiUrl}/${notificationId}/read`, {});
  }

  markAllAsRead() {
    return this.backend.api.patch(`${this.apiUrl}/mark-all-read`, {});
  }
}
