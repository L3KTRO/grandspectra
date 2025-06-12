import {computed, effect, inject, Injectable, OnInit, resource, Signal, signal} from '@angular/core';
import {Notification} from '../models/Notification';
import {NotificationService} from '../services/notification/notification.service';
import {BackendService} from '../services/backend/backend.service';

@Injectable({providedIn: 'root'})
export class NotificationsHelper {
  notificationService = inject(NotificationService);
  backendService = inject(BackendService);

  private refreshTrigger = signal(0);

  constructor() {
    setInterval(() => {
      if (document.visibilityState === 'visible' && this.backendService.isLoggedIn()) {
        this.refreshTrigger.update(v => v + 1);
      }
    }, 5 * 1000);
  }

  notificationsResource = resource({
    loader: async () => {
      return (await this.notificationService.getNotifications())?.data;
    },
  })

  unreadResource = resource({
    request: () => this.refreshTrigger(),
    loader: async ({request}) => {
      const data = (await this.notificationService.unreadCount())?.data;
      if (data.unread_count !== this.unreadCount()) {
        this.notificationsResource.reload()
      }
      return data;
    },
  });

  unreadCount = computed(() => this.notificationsResource.asReadonly().value()?.unread_count ?? 0);


  readonly markAsRead = (id: string) => this.notificationService.markAsRead(id);
  readonly markAllAsRead = () => this.notificationService.markAllAsRead();
}
