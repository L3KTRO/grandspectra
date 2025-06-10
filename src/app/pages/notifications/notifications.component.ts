// notifications.component.ts
import {Component, computed, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {NotificationService} from '../../services/notification/notification.service';
import {Notification} from '../../models/Notification';
import {ChecksliderComponent} from '../../shared/checkslider/checkslider.component';


@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, RouterModule, ChecksliderComponent],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss'
})
export class NotificationsComponent implements OnInit {
  notifications = signal<Notification[]>([]);
  unread = signal<boolean>(false);

  filteredNotifications = computed(() => {
    const filter = this.unread();
    const notifs = this.notifications();

    if (filter) {
      return notifs.filter(n => !n.read_at);
    }
    return notifs;
  });

  unreadCount = computed(() =>
    this.notifications().filter(n => !n.read_at).length
  );

  constructor(private notificationService: NotificationService) {
  }

  ngOnInit() {
    this.loadNotifications();
  }

  async loadNotifications() {
    try {
      const response = (await this.notificationService.getNotifications())?.data.data;
      if (response) this.notifications.set(response);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  }

  async markAsRead(notificationId: string) {
    try {
      await this.notificationService.markAsRead(notificationId);
      this.notifications.update(notifications =>
        notifications.map(n =>
          n.id === notificationId
            ? {...n, read_at: new Date().toISOString()}
            : n
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }

  async markAllAsRead() {
    try {
      await this.notificationService.markAllAsRead();
      this.notifications.update(notifications =>
        notifications.map(n => ({...n, read_at: new Date().toISOString()}))
      );
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  }

  getNotificationIcon(type: 'follow' | 'like' | 'comment' | 'list' | 'recommendation'): string {
    const icons: Record<'follow' | 'like' | 'comment' | 'list' | 'recommendation', string> = {
      follow: '👤',
      like: '❤️',
      comment: '💬',
      list: '📝',
      recommendation: '🎬'
    };
    return icons[type] || '🔔';
  }

  getTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Hace unos minutos';
    if (diffInHours < 24) return `Hace ${diffInHours}h`;
    if (diffInHours < 168) return `Hace ${Math.floor(diffInHours / 24)}d`;
    return date.toLocaleDateString();
  }

  protected readonly signal = signal;
}
