import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth';

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
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  private readonly authService = inject(AuthService);

  userName = 'User';
  greetingPrefix = 'Good morning';

  // Filters & State
  includeTeamDocs = true;
  searchQuery = '';
  selectedFunnelPeriod = 'Last 30 Days';
  selectedAuditPeriod = 'Last 30 Days';
  selectedTab = 'In Review';

  funnelPeriods = ['Today', 'Yesterday', 'Last 7 Days', 'Last 15 Days', 'Last 30 Days', 'Current FY'];
  auditPeriods = ['Last 7 Days', 'Last 15 Days', 'Last 30 Days', 'This Month', 'Last Month'];

  categoryOverview: CategoryStat[] = [
    { name: 'Supplier Contracts', activeIngestion: 142, extractedFields: 1240, approvedDocs: 98, archivedCount: 840, accuracy: 89 },
    { name: 'Purchase Invoices', activeIngestion: 86, extractedFields: 912, approvedDocs: 74, archivedCount: 620, accuracy: 82 },
    { name: 'Internal Policies', activeIngestion: 34, extractedFields: 480, approvedDocs: 30, archivedCount: 310, accuracy: 76 },
    { name: 'Compliance Reports', activeIngestion: 28, extractedFields: 390, approvedDocs: 24, archivedCount: 210, accuracy: 71 },
    { name: 'Financial Statements', activeIngestion: 19, extractedFields: 290, approvedDocs: 16, archivedCount: 180, accuracy: 68 },
    { name: 'HR Agreements', activeIngestion: 15, extractedFields: 210, approvedDocs: 12, archivedCount: 140, accuracy: 65 },
  ];

  reviewerRankings: ReviewerRanking[] = [
    { rank: 1, name: 'Abhishek Yadav', initials: 'AY', assignedQueue: 48, verifiedCount: 340, accuracyRate: 98, targetAchieved: 96, avatarBg: '#4f46e5' },
    { rank: 2, name: 'Rahul Sharma', initials: 'RS', assignedQueue: 36, verifiedCount: 290, accuracyRate: 95, targetAchieved: 90, avatarBg: '#2563eb' },
    { rank: 3, name: 'Priya Mehta', initials: 'PM', assignedQueue: 28, verifiedCount: 240, accuracyRate: 92, targetAchieved: 88, avatarBg: '#7c3aed' },
    { rank: 4, name: 'Neha Verma', initials: 'NV', assignedQueue: 22, verifiedCount: 180, accuracyRate: 88, targetAchieved: 82, avatarBg: '#059669' },
    { rank: 5, name: 'Arjun Kapoor', initials: 'AK', assignedQueue: 18, verifiedCount: 140, accuracyRate: 84, targetAchieved: 78, avatarBg: '#d97706' },
  ];

  pipelineStages: FunnelStage[] = [
    { id: 1, name: 'Ingestion Intake', count: 16 },
    { id: 2, name: 'OCR Scanned', count: 293 },
    { id: 3, name: 'Data Extracted', count: 256 },
    { id: 4, name: 'Confidence Validated', count: 87 },
    { id: 5, name: 'HITL Review', count: 100 },
    { id: 6, name: 'Approval Pending', count: 11 },
    { id: 7, name: 'Archived & Indexed', count: 9 },
  ];

  conversionRatios: ConversionRatio[] = [
    { title: 'OCR Validation Ratio', percentage: 34, ratioText: '87 / 256', subtitle: 'Scanned → Validated' },
    { title: 'HITL Review Ratio', percentage: 62, ratioText: '100 / 161', subtitle: 'Validated → Reviewed' },
    { title: 'Approval Ratio', percentage: 18, ratioText: '11 / 61', subtitle: 'Reviewed → Approved' },
    { title: 'Archival Indexing Ratio', percentage: 82, ratioText: '9 / 11', subtitle: 'Approved → Indexed' },
  ];

  auditMatrix: AuditMatrixRow[] = [
    { reviewer: 'Abhishek Yadav', ingested: 180, newOcr: 172, dataExtracted: 165, highConfidence: 150, lowConfidence: 15, manualCorrections: 14, approved: 142, rejected: 8, escalated: 4 },
    { reviewer: 'Rahul Sharma', ingested: 145, newOcr: 138, dataExtracted: 130, highConfidence: 115, lowConfidence: 15, manualCorrections: 12, approved: 110, rejected: 10, escalated: 3 },
    { reviewer: 'Priya Mehta', ingested: 120, newOcr: 115, dataExtracted: 110, highConfidence: 95, lowConfidence: 15, manualCorrections: 10, approved: 90, rejected: 8, escalated: 2 },
    { reviewer: 'Neha Verma', ingested: 95, newOcr: 90, dataExtracted: 85, highConfidence: 70, lowConfidence: 15, manualCorrections: 12, approved: 68, rejected: 7, escalated: 5 },
    { reviewer: 'Arjun Kapoor', ingested: 80, newOcr: 75, dataExtracted: 70, highConfidence: 55, lowConfidence: 15, manualCorrections: 11, approved: 52, rejected: 6, escalated: 2 },
  ];

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user?.name) {
      this.userName = user.name.split(' ')[0];
    }

    this.updateGreetingPrefix();
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