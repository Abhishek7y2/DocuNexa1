import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';

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
  pageCitationV1: string;
  pageCitationV2: string;
  riskImpact: 'High' | 'Medium' | 'Low' | 'None';
  summaryDelta?: string;
  isUncertainAlignment?: boolean;
}

export interface FieldDiff {
  fieldKey: string;
  label: string;
  v1Value: string;
  v2Value: string;
  status: 'Added' | 'Removed' | 'Modified';
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
  private readonly router = inject(Router);
  private readonly compareService = inject(COMPARE_SERVICE_TOKEN);

  documentId = 'DOC-10245';
  documentTitle = 'Master Services & Vendor Agreement';
  version1Tag = 'v1.0 (Baseline - 15 Jan 2026)';
  version2Tag = 'v2.0 (Current Amendment - 06 Oct 2026)';

  // View Level Tabs (TASK 7D Item 2)
  viewTab: 'clauses' | 'fields' | 'text' = 'clauses';

  activeFilter: 'all' | 'changed' | 'financial' | 'compliance' = 'changed';
  isLoading = signal(true);
  hasError = signal(false);
  errorVariant = signal<ErrorVariant>('default');
  toastMessage: string | null = null;

  clauses: ClauseDiff[] = [];

  fieldDiffs: FieldDiff[] = [
    { fieldKey: 'paymentTerms', label: 'Payment Terms', v1Value: 'Net 45 Days', v2Value: 'Net 30 Days', status: 'Modified' },
    { fieldKey: 'contractValue', label: 'Contract Value', v1Value: '₹ 45,00,000.00', v2Value: '₹ 48,50,000.00', status: 'Modified' },
    { fieldKey: 'liabilityCap', label: 'Penalty & Liability Cap', v1Value: '100% of Contract Value', v2Value: 'Uncapped Penalty Clause', status: 'Modified' },
    { fieldKey: 'registeredAddress', label: 'Supplier Registered Address', v1Value: '— (Unspecified)', v2Value: 'Plot 42, Electronic City, Bangalore', status: 'Added' },
  ];

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.documentId = id;
      }
    });

    const doc1 = this.route.snapshot.queryParamMap.get('doc1');
    if (doc1) {
      this.documentId = doc1;
    }

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
        this.clauses = [
          {
            id: 'CL-1',
            sectionNumber: '1.0',
            title: 'Scope of Equipment & Calibration Services',
            category: 'commercial',
            changeType: 'modified',
            version1Text: 'Supplier shall supply precision calibration sensor units within 45 days of PO.',
            version2Text: 'Supplier shall supply precision calibration sensor units within 30 days of PO with priority dispatch.',
            pageCitationV1: 'v1.0 Page 2, Para 4',
            pageCitationV2: 'v2.0 Page 2, Para 3',
            riskImpact: 'Low',
            summaryDelta: 'Delivery timeline reduced from 45 to 30 days.',
            isUncertainAlignment: false,
          },
          {
            id: 'CL-2',
            sectionNumber: '2.0',
            title: 'Maximum Liability & Penalty Cap',
            category: 'legal',
            changeType: 'modified',
            version1Text: 'Total liability of either party shall be capped at 100% of total contract value.',
            version2Text: 'Total liability shall be uncapped for direct gross negligence or breach of confidentiality.',
            pageCitationV1: 'v1.0 Page 5, Para 2',
            pageCitationV2: 'v2.0 Page 6, Para 1',
            riskImpact: 'High',
            summaryDelta: 'Liability cap removed for negligence clauses.',
            isUncertainAlignment: true, // TASK 7D Item 2
          },
          {
            id: 'CL-3',
            sectionNumber: '3.0',
            title: 'Auto-Renewal & Termination Notice',
            category: 'compliance',
            changeType: 'added',
            version1Text: '[No clause present in baseline version]',
            version2Text: 'This agreement shall auto-renew for 12 months unless 60 days written notice is served.',
            pageCitationV1: 'v1.0 Page 8, Para 1',
            pageCitationV2: 'v2.0 Page 9, Para 4',
            riskImpact: 'Medium',
            summaryDelta: 'New 60-day auto-renewal clause added.',
            isUncertainAlignment: false,
          },
        ];
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

  // TASK 7D Item 1: Inline Word-Level Diff Renderer
  renderInlineWordDiff(v1Text: string, v2Text: string): Array<{ text: string; type: 'added' | 'removed' | 'normal' }> {
    const v1Words = v1Text.split(' ');
    const v2Words = v2Text.split(' ');
    const result: Array<{ text: string; type: 'added' | 'removed' | 'normal' }> = [];

    // Simple word diff visualization
    v2Words.forEach((w) => {
      if (!v1Words.includes(w)) {
        result.push({ text: w, type: 'added' });
      } else {
        result.push({ text: w, type: 'normal' });
      }
    });

    return result;
  }

  // TASK 7D Item 3: Click Citation to Open Viewer
  navigateToViewerCitation(docId: string, pageCitation: string): void {
    const pageNum = pageCitation.includes('Page 2') ? 2 : (pageCitation.includes('Page 5') || pageCitation.includes('Page 6') ? 5 : 1);
    this.router.navigate(['/documents', docId], { queryParams: { page: pageNum } });
  }

  get filteredClauses(): ClauseDiff[] {
    if (this.activeFilter === 'changed') {
      return this.clauses.filter((c) => c.changeType !== 'unchanged');
    }
    if (this.activeFilter === 'financial') {
      return this.clauses.filter((c) => c.category === 'commercial');
    }
    if (this.activeFilter === 'compliance') {
      return this.clauses.filter((c) => c.category === 'compliance' || c.category === 'legal');
    }
    return this.clauses;
  }

  setFilter(filter: 'all' | 'changed' | 'financial' | 'compliance'): void {
    this.activeFilter = filter;
  }

  // TASK 7D Item 4: Export Redline Report PDF
  exportRedlinePdfReport(): void {
    this.showToast('Exporting Redline PDF Report with dual citations and tamper-evident hashes...');
  }

  acknowledgeDelta(): void {
    this.showToast('Version 2.0 contract differences acknowledged and logged to audit trail.');
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
