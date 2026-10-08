import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth';
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

export interface AuditMatrixRow {
  reviewer: string;
  ingested: number;
  newOcr: number;
  dataExtracted: number;
  highConfidence: number;
  lowConfidence: number;
  manualCorrections: number;
  approved: number;
  rejected: number;
  escalated: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LoadingState, ErrorState],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  providers: [{ provide: REPORT_SERVICE_TOKEN, useClass: MockReportService }],
})
export class Dashboard implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly reportService = inject(REPORT_SERVICE_TOKEN);

  userName = 'User';
  greetingPrefix = 'Good morning';

  // Signals for state
  isLoading = signal(true);
  hasError = signal(false);

  // Data Arrays
  categoryOverview: CategoryStat[] = [];
  reviewerRankings: ReviewerRanking[] = [];
  pipelineStages: FunnelStage[] = [];
  conversionRatios: ConversionRatio[] = [];
  auditMatrix: AuditMatrixRow[] = [];

  // Filters & State
  includeTeamDocs = true;
  searchQuery = '';
  selectedFunnelPeriod = 'Last 30 Days';
  selectedAuditPeriod = 'Last 30 Days';
  selectedTab = 'In Review';

  funnelPeriods = ['Today', 'Yesterday', 'Last 7 Days', 'Last 15 Days', 'Last 30 Days', 'Current FY'];
  auditPeriods = ['Last 7 Days', 'Last 15 Days', 'Last 30 Days', 'This Month', 'Last Month'];

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user?.name) {
      this.userName = user.name.split(' ')[0];
    }
    this.updateGreetingPrefix();
    this.loadData();
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
        this.auditMatrix = stats.auditMatrix;
        this.isLoading.set(false);
      },
      error: () => {
        this.hasError.set(true);
        this.isLoading.set(false);
      },
    });
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

  setFunnelPeriod(period: string): void {
    this.selectedFunnelPeriod = period;
  }

  setAuditPeriod(period: string): void {
    this.selectedAuditPeriod = period;
  }

  setTab(tab: string): void {
    this.selectedTab = tab;
  }
}