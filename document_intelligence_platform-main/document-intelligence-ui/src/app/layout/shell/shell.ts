import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Sidebar } from '../sidebar/sidebar';
import { Topbar } from '../topbar/topbar';
import { SessionWarningModal } from '../../shared/ui/session-warning-modal/session-warning-modal';
import { DevPanel } from '../../shared/ui/dev-panel/dev-panel';
import { IdleTimerService } from '../../core/services/idle-timer.service';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    RouterOutlet,
    Sidebar,
    Topbar,
    SessionWarningModal,
    DevPanel,
  ],
  templateUrl: './shell.html',
  styleUrl: './shell.scss',
})
export class Shell implements OnInit, OnDestroy {
  private idleTimerService = inject(IdleTimerService);

  ngOnInit(): void {
    this.idleTimerService.init(15);
  }

  ngOnDestroy(): void {
    this.idleTimerService.destroy();
  }
}