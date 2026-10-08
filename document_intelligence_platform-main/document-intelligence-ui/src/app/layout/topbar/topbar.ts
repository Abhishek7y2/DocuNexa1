import { Component } from '@angular/core';
import { Router } from '@angular/router';

import {
  AuthService,
  AuthUser,
} from '../../core/services/auth';

import { UiStateService } from '../../core/services/ui-state';

@Component({
  selector: 'app-topbar',
  standalone: true,
  templateUrl: './topbar.html',
  styleUrl: './topbar.scss',
})
export class Topbar {
  currentUser: AuthUser | null = null;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    readonly uiState: UiStateService,
  ) {
    this.currentUser =
      this.authService.getCurrentUser();
  }

  logout(): void {
    this.authService.logout();

    this.router.navigate(['/login']);
  }

  toggleSidebar(): void {
    this.uiState.toggleSidebar();
  }
}