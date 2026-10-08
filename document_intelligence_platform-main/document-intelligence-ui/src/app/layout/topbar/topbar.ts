import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { AuthService, AuthUser } from '../../core/services/auth';
import { UiStateService } from '../../core/services/ui-state';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './topbar.html',
  styleUrl: './topbar.scss',
})
export class Topbar {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  readonly uiState = inject(UiStateService);
  readonly notificationService = inject(NotificationService);

  currentUser: AuthUser | null = null;

  constructor() {
    this.currentUser = this.authService.getCurrentUser();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  toggleSidebar(): void {
    this.uiState.toggleSidebar();
  }

  toggleNotifications(): void {
    this.notificationService.toggleDrawer();
  }
}