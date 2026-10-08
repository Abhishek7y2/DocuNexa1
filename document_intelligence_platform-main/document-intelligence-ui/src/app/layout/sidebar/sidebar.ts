import { Component } from '@angular/core';
import {
  RouterLink,
  RouterLinkActive,
} from '@angular/router';

import { UiStateService } from '../../core/services/ui-state';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  constructor(
    readonly uiState: UiStateService,
  ) {}

  closeMobileSidebar(): void {
    this.uiState.closeSidebar();
  }
}