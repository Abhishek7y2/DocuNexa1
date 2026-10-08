import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { REPORT_SERVICE_TOKEN, MockReportService } from '../../core/services/api-services';
import { LoadingState } from '../../shared/ui/loading-state/loading-state';
import { ErrorState } from '../../shared/ui/error-state/error-state';

export interface CategoryStat {
  name: string;
  activeIngestion: number;
  extractedFields: number;
  approvedDocs: number;
  archivedCount: number;
  accuracy: number;
}

export interface ReviewerRanking {
  rank: number;
  name: string;
  initials: string;
  assignedQueue: number;
  verifiedCount: number;
  accuracyRate: number;
  targetAchieved: number;
  avatarBg: string;
}

export interface FunnelStage {
  id: number;
  name: string;
  count: number;
}

export interface ConversionRatio {
  title: string;
  percentage: number;
  ratioText: string;
  subtitle: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LoadingState, ErrorState],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  providers: [{ provide: REPORT_SERVICE_TOKEN, useClass: MockReportService }],
})
export class Dashboard implements OnInit, OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly reportService = inject(REPORT_SERVICE_TOKEN);
  private readonly router = inject(Router);

  userName = 'User';
  greetingPrefix = 'Good morning';
  userRole: string = 'org_admin';

  // Signals for state
  isLoading = signal(true);
  hasError = signal(false);
  isRefreshing = signal(false);

  // Data Arrays
  categoryOverview: CategoryStat[] = [];
  reviewerRankings: ReviewerRanking[] = [];
  pipelineStages: FunnelStage[] = [];
  conversionRatios: ConversionRatio[] = [];

  // Filters & State
  includeTeamDocs = true;
  searchQuery = '';
  selectedDateRange = 'Last 30 Days';
  selectedFunnelPeriod = 'Last 30 Days';
  selectedTab = 'In Review';
  lastUpdatedTimestamp = '';

  dateRangeOptions = ['Today', 'Last 7 Days', 'Last 15 Days', 'Last 30 Days', 'Current FY'];
  funnelPeriods = ['Today', 'Last 7 Days', 'Last 30 Days'];

  private refreshIntervalTimer: any = null;

  ngOnInit(): void {
    const user = this.authService.currentUser();
    if (user?.name) {
      this.userName = user.name.split(' ')[0];
    }
    if (user?.role) {
      this.userRole = user.role;
    }
    this.updateGreetingPrefix();
    this.loadData();
    this.updateLastUpdated();

    // Prepare live-refresh polling hook (15s polling, easily replaced by WebSocket listener)
    if (typeof window !== 'undefined') {
      this.refreshIntervalTimer = setInterval(() => {
        this.pollLiveUpdates();
      }, 15000);
    }
  }

  ngOnDestroy(): void {
    if (this.refreshIntervalTimer) {
      clearInterval(this.refreshIntervalTimer);
    }
  }

  loadData(): void {
    this.isLoading.set(true);
    this.hasError.set(false);

    this.reportService.getDashboardStats().subscribe({
      next: (stats) => {
        this.categoryOverview = stats.categoryOverview;
        this.reviewerRankings = stats.reviewerRankings;
        this.pipelineStages = stats.pipelineStages;
        this.conversionRatios = stats.conversionRatios;
        this.isLoading.set(false);
        this.updateLastUpdated();
      },
      error: () => {
        this.hasError.set(true);
        this.isLoading.set(false);
      },
    });
  }

  pollLiveUpdates(): void {
    this.isRefreshing.set(true);
    setTimeout(() => {
      this.updateLastUpdated();
      this.isRefreshing.set(false);
    }, 600);
  }

  refreshNow(): void {
    this.pollLiveUpdates();
  }

  private updateLastUpdated(): void {
    const now = new Date();
    this.lastUpdatedTimestamp = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }

  private updateGreetingPrefix(): void {
    const hour = new Date().getHours();
    if (hour < 12) {
      this.greetingPrefix = 'Good morning';
    } else if (hour < 17) {
      this.greetingPrefix = 'Good afternoon';
    } else {
      this.greetingPrefix = 'Good evening';
    }
  }

  onDateRangeChange(): void {
    this.loadData();
  }

  setFunnelPeriod(period: string): void {
    this.selectedFunnelPeriod = period;
  }

  setTab(tab: string): void {
    this.selectedTab = tab;
  }

  drillDown(targetRoute: string, queryParams: Record<string, string>): void {
    this.router.navigate([targetRoute], { queryParams });
  }
}