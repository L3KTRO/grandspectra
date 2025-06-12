// notifications.component.ts
import {Component, computed, OnInit, resource, Signal, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {NotificationService} from '../../services/notification/notification.service';
import {Notification} from '../../models/Notification';
import {ChecksliderComponent} from '../../shared/checkslider/checkslider.component';
import {computedResource} from '../../helpers/Resources';
import {NotificationsHelper} from '../../helpers/NotificationsHelper';


@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, RouterModule, ChecksliderComponent],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss'
})
export class NotificationsComponent {
  unread = signal<boolean>(false);

  constructor(protected notificationService: NotificationsHelper) {
  }

  notifications: Signal<Notification[]> = computed(() => this.notificationService.notificationsResource.asReadonly().value()?.notifications.data?.filter(
    (a: Notification) => (this.unread() && a.read_at === null) || (!this.unread())
  ) ?? []);

  async markAsRead(notificationId: string) {
    try {
      await this.notificationService.markAsRead(notificationId);
      this.notificationService.notificationsResource.reload()
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }

  async markAllAsRead() {
    try {
      await this.notificationService.markAllAsRead();
      this.notificationService.notificationsResource.reload()
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  }

  getNotificationIcon(type: 'content_list_updated' | "content_list_deleted" | "new_follower"): string {
    const icons: Record<'content_list_updated' | 'content_list_deleted' | "new_follower", string> = {
      // follow: '👤',
      // like: '❤️',
      // comment: '💬',
      // list: '📝',
      // recommendation: '🎬'
      new_follower: "👥",
      content_list_updated: "📄",
      content_list_deleted: "🗑️",
    };
    return icons[type] || '🔔';
  }

  getTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'A few minutes ago';
    if (diffInHours < 24) return `About ${diffInHours}h ago`;
    if (diffInHours < 168) return `About ${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  }

  protected readonly signal = signal;
}
