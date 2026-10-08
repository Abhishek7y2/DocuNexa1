import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute } from '@angular/router';

import { LoadingState } from '../../shared/ui/loading-state/loading-state';
import { ErrorState, ErrorVariant } from '../../shared/ui/error-state/error-state';
import { COMPARE_SERVICE_TOKEN, MockCompareService } from '../../core/services/api-services';

export interface ClauseDiff {
  id: string;
  sectionNumber: string;
  title: string;
  category: 'commercial' | 'legal' | 'compliance' | 'general';
  changeType: 'added' | 'removed' | 'modified' | 'unchanged';
  version1Text: string;
  version2Text: string;
  pageCitationV1?: string;
  pageCitationV2?: string;
  riskImpact: 'High' | 'Medium' | 'Low' | 'None';
  summaryDelta?: string;
}

@Component({
  selector: 'app-compare-studio',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LoadingState, ErrorState],
  templateUrl: './compare-studio.html',
  styleUrl: './compare-studio.scss',
  providers: [{ provide: COMPARE_SERVICE_TOKEN, useClass: MockCompareService }],
})
export class CompareStudio implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly compareService = inject(COMPARE_SERVICE_TOKEN);

  documentId = 'DOC-10245';
  documentTitle = 'Master Services & Vendor Agreement';
  version1Tag = 'v1.0 (Baseline - 15 Jan 2026)';
  version2Tag = 'v2.0 (Current Amendment - 06 Oct 2026)';

  activeFilter: 'all' | 'changed' | 'financial' | 'compliance' = 'changed';
  isLoading = signal(true);
  hasError = signal(false);
  errorVariant = signal<ErrorVariant>('default');
  toastMessage: string | null = null;

  clauses: ClauseDiff[] = [];

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.documentId = id;
      }
    });

    this.loadComparison();
  }

  loadComparison(): void {
    this.isLoading.set(true);
    this.hasError.set(false);

    const stateParam = this.route.snapshot.queryParamMap.get('state');

    if (this.documentId === 'alignment' || stateParam === 'alignment') {
      setTimeout(() => {
        this.errorVariant.set('alignment-failed');
        this.hasError.set(true);
        this.isLoading.set(false);
      }, 300);
      return;
    }

    this.compareService.compareDocuments(this.documentId, 'v2').subscribe({
      next: (diffs) => {
        this.clauses = diffs.map((d, index) => ({
          id: d.id,
          sectionNumber: `${index + 1}.0`,
          title: d.section,
          category: d.riskLevel === 'High' ? 'legal' : 'commercial',
          changeType: d.type,
          version1Text: d.baselineText || '[No baseline clause]',
          version2Text: d.amendedText || '[Clause removed]',
          pageCitationV1: 'Page 2, Para 4',
          pageCitationV2: 'Page 2, Para 4',
          riskImpact: d.riskLevel as any,
          summaryDelta: `${d.type} in amendment`,
        }));
        this.isLoading.set(false);
      },
      error: () => {
        this.errorVariant.set('default');
        this.hasError.set(true);
        this.isLoading.set(false);
      },
    });
  }

  retryLoad(): void {
    this.loadComparison();
  }

  get filteredClauses(): ClauseDiff[] {
    if (this.activeFilter === 'changed') {
      return this.clauses.filter((c) => c.changeType !== 'unchanged');
    }
    if (this.activeFilter === 'financial') {
      return this.clauses.filter((c) => c.category === 'commercial');
    }
    if (this.activeFilter === 'compliance') {
      return this.clauses.filter(
        (c) => c.category === 'compliance' || c.category === 'legal',
      );
    }
    return this.clauses;
  }

  get addedCount(): number {
    return this.clauses.filter((c) => c.changeType === 'added').length;
  }

  get removedCount(): number {
    return this.clauses.filter((c) => c.changeType === 'removed').length;
  }

  get modifiedCount(): number {
    return this.clauses.filter((c) => c.changeType === 'modified').length;
  }

  get unchangedCount(): number {
    return this.clauses.filter((c) => c.changeType === 'unchanged').length;
  }

  setFilter(filter: 'all' | 'changed' | 'financial' | 'compliance'): void {
    this.activeFilter = filter;
  }

  exportDiffReport(): void {
    this.showToast(
      'Exporting Clause Diff Audit Package (PDF/CSV) with tamper-evident hash...',
    );
  }

  acknowledgeDelta(): void {
    this.showToast(
      'Version 2.0 contract differences acknowledged and logged to compliance trail.',
    );
  }

  showToast(message: string): void {
    this.toastMessage = message;
    setTimeout(() => {
      if (this.toastMessage === message) {
        this.toastMessage = null;
      }
    }, 3500);
  }
}
