import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { EmptyState } from '../../shared/ui/empty-state/empty-state';
import {
  NotificationService,
  NotificationItem,
  NotificationCategory,
  NotificationPreference,
} from '../../core/services/notification.service';

@Component({
  selector: 'app-notification-center',
  standalone: true,
  imports: [CommonModule, FormsModule, EmptyState],
  templateUrl: './notification-center.html',
  styleUrl: './notification-center.scss',
})
export class NotificationCenter {
  readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);

  activeTab: 'all' | NotificationCategory = 'all';
  showPreferences = signal(false);

  get filteredNotifications(): NotificationItem[] {
    const list = this.notificationService.notifications();
    if (this.activeTab === 'all') return list;
    return list.filter((item) => item.category === this.activeTab);
  }

  setTab(tab: 'all' | NotificationCategory): void {
    this.activeTab = tab;
  }

  togglePreferences(): void {
    this.showPreferences.set(!this.showPreferences());
  }

  closeDrawer(): void {
    this.notificationService.closeDrawer();
  }

  markAllAsRead(): void {
    this.notificationService.markAllAsRead();
  }

  handleItemClick(item: NotificationItem): void {
    this.notificationService.markAsRead(item.id);
    this.notificationService.closeDrawer();
    this.router.navigateByUrl(item.targetUrl);
  }

  toggleItemRead(event: Event, item: NotificationItem): void {
    event.stopPropagation();
    this.notificationService.toggleRead(item.id);
  }

  toggleEmailPref(pref: NotificationPreference): void {
    this.notificationService.toggleEmailPref(pref.type);
  }

  toggleInAppPref(pref: NotificationPreference): void {
    this.notificationService.toggleInAppPref(pref.type);
  }
}
