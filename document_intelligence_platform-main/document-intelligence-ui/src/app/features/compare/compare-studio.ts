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
  status?: 'pending' | 'accepted' | 'flagged';
}

export interface FieldDiff {
  fieldKey: string;
  label: string;
  v1Value: string;
  v2Value: string;
  status: 'Added' | 'Removed' | 'Modified';
  varianceImpact?: string;
  reviewed?: boolean;
}

export interface AuditRecord {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  details: string;
  hash: string;
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

  availableVersions = [
    { value: 'v1.0', label: 'v1.0 (Baseline - 15 Jan 2026)', date: '15 Jan 2026', author: 'Abhishek Yadav', role: 'Principal Legal Counsel' },
    { value: 'v1.1', label: 'v1.1 (Draft - 12 Feb 2026)', date: '12 Feb 2026', author: 'Rahul Sharma', role: 'Commercial Reviewer' },
    { value: 'v2.0', label: 'v2.0 (Current Amendment - 06 Oct 2026)', date: '06 Oct 2026', author: 'Priya Mehta', role: 'Head of Compliance' },
  ];
  selectedV1 = 'v1.0';
  selectedV2 = 'v2.0';

  // View Level Tabs
  viewTab: 'clauses' | 'fields' | 'text' | 'audit' = 'clauses';
  diffViewMode: 'split' | 'unified' = 'split';

  activeFilter: 'all' | 'changed' | 'financial' | 'compliance' | 'highRisk' = 'changed';
  searchQuery = '';
  isLoading = signal(true);
  hasError = signal(false);
  errorVariant = signal<ErrorVariant>('default');
  toastMessage: string | null = null;

  clauses: ClauseDiff[] = [];

  fieldDiffs: FieldDiff[] = [
    { 
      fieldKey: 'paymentTerms', 
      label: 'Payment Terms', 
      v1Value: 'Net 45 Days', 
      v2Value: 'Net 30 Days', 
      status: 'Modified', 
      varianceImpact: 'Accelerated Cash Outflow (-15 Days)',
      reviewed: false
    },
    { 
      fieldKey: 'contractValue', 
      label: 'Total Contract Consideration', 
      v1Value: '₹ 45,00,000.00', 
      v2Value: '₹ 48,50,000.00', 
      status: 'Modified', 
      varianceImpact: '+₹ 3,50,000 (+7.78% Scope Addendum)',
      reviewed: true
    },
    { 
      fieldKey: 'liabilityCap', 
      label: 'Penalty & Liability Limitation', 
      v1Value: '100% of Contract Value', 
      v2Value: 'Uncapped Liability for Gross Negligence', 
      status: 'Modified', 
      varianceImpact: 'Severe Risk Exposure (Uncapped)',
      reviewed: false
    },
    { 
      fieldKey: 'registeredAddress', 
      label: 'Vendor Registered Address', 
      v1Value: '— (Unspecified in Baseline)', 
      v2Value: 'Plot 42, Electronic City Phase 1, Bangalore', 
      status: 'Added', 
      varianceImpact: 'New Physical Jurisdiction Specified',
      reviewed: true
    },
  ];

  auditRecords: AuditRecord[] = [
    {
      id: 'AUD-901',
      timestamp: '08 Oct 2026, 16:45:12',
      action: 'Automated Alignment Engine',
      actor: 'DocuNexa AI Engine v3.4',
      details: 'Semantic clause alignment completed across 4 sections with 98.4% alignment score.',
      hash: 'sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
    },
    {
      id: 'AUD-902',
      timestamp: '08 Oct 2026, 17:02:40',
      action: 'Risk Classification Trigger',
      actor: 'Risk Guard Subsystem',
      details: 'Flagged Section 2.0 (Liability Cap) as HIGH RISK due to uncapped gross negligence clause.',
      hash: 'sha256:b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9',
    },
    {
      id: 'AUD-903',
      timestamp: '08 Oct 2026, 17:15:08',
      action: 'Draft Redline Generated',
      actor: 'Abhishek Yadav (Reviewer)',
      details: 'Generated dual-citation comparison report between Baseline v1.0 and Amendment v2.0.',
      hash: 'sha256:a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0',
    },
  ];

  get highRiskCount(): number {
    return this.clauses.filter((c) => c.riskImpact === 'High').length;
  }

  get modifiedClausesCount(): number {
    return this.clauses.filter((c) => c.changeType === 'modified').length;
  }

  get totalDiffsCount(): number {
    return this.clauses.length + this.fieldDiffs.length;
  }

  get authorV1(): string {
    return this.availableVersions.find((v) => v.value === this.selectedV1)?.author || 'Author v1';
  }

  get authorV2(): string {
    return this.availableVersions.find((v) => v.value === this.selectedV2)?.author || 'Author v2';
  }

  onVersionChange(): void {
    const v1 = this.availableVersions.find((v) => v.value === this.selectedV1);
    const v2 = this.availableVersions.find((v) => v.value === this.selectedV2);
    if (v1) this.version1Tag = v1.label;
    if (v2) this.version2Tag = v2.label;
    this.showToast(`Comparison updated: Comparing ${this.selectedV1} vs ${this.selectedV2}`);
  }

  swapVersions(): void {
    const temp = this.selectedV1;
    this.selectedV1 = this.selectedV2;
    this.selectedV2 = temp;
    this.onVersionChange();
    this.showToast(`Swapped comparison: Now comparing ${this.selectedV1} as baseline vs ${this.selectedV2}`);
  }

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
      next: () => {
        this.clauses = [
          {
            id: 'CL-1',
            sectionNumber: '1.0',
            title: 'Scope of Equipment & Calibration Services',
            category: 'commercial',
            changeType: 'modified',
            version1Text: 'Supplier shall supply precision calibration sensor units within 45 days of purchase order receipt with standard shipping.',
            version2Text: 'Supplier shall supply precision calibration sensor units within 30 days of purchase order receipt with priority dispatch and live tracking.',
            pageCitationV1: 'v1.0 Page 2, Para 4',
            pageCitationV2: 'v2.0 Page 2, Para 3',
            riskImpact: 'Low',
            summaryDelta: 'Delivery timeline reduced from 45 to 30 days with priority dispatch requirement.',
            isUncertainAlignment: false,
            status: 'pending',
          },
          {
            id: 'CL-2',
            sectionNumber: '2.0',
            title: 'Maximum Liability & Penalty Cap',
            category: 'legal',
            changeType: 'modified',
            version1Text: 'Total aggregate liability of either party under this agreement shall be capped strictly at 100% of the total contract value paid.',
            version2Text: 'Total aggregate liability shall be uncapped for any direct gross negligence, confidentiality breach, or willful misconduct.',
            pageCitationV1: 'v1.0 Page 5, Para 2',
            pageCitationV2: 'v2.0 Page 6, Para 1',
            riskImpact: 'High',
            summaryDelta: 'Liability cap removed for gross negligence and confidentiality breach, introducing unbounded financial risk.',
            isUncertainAlignment: true, // TASK 7D Item 2: Uncertain Alignment Warning
            status: 'flagged',
          },
          {
            id: 'CL-3',
            sectionNumber: '3.0',
            title: 'Auto-Renewal & Advance Termination Notice',
            category: 'compliance',
            changeType: 'added',
            version1Text: '[No clause present in baseline version. Standard expiration was governed by general contract duration of 12 months.]',
            version2Text: 'This agreement shall automatically renew for successive 12-month terms unless either party serves written notice at least 60 calendar days prior to expiration.',
            pageCitationV1: 'v1.0 Page 8, Para 1',
            pageCitationV2: 'v2.0 Page 9, Para 4',
            riskImpact: 'Medium',
            summaryDelta: 'New 60-day advance notice requirement and automatic 12-month renewal term added.',
            isUncertainAlignment: false,
            status: 'pending',
          },
          {
            id: 'CL-4',
            sectionNumber: '4.0',
            title: 'Data Security & Incident Reporting Window',
            category: 'compliance',
            changeType: 'modified',
            version1Text: 'Vendor shall notify Customer of any confirmed data breach incident within 72 hours of verification.',
            version2Text: 'Vendor shall notify Customer of any suspected or confirmed data breach incident within 24 hours of discovery and submit root-cause forensics within 5 business days.',
            pageCitationV1: 'v1.0 Page 11, Para 2',
            pageCitationV2: 'v2.0 Page 12, Para 1',
            riskImpact: 'Medium',
            summaryDelta: 'Reporting window tightened from 72h to 24h, triggering expedited forensic audits.',
            isUncertainAlignment: false,
            status: 'pending',
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

  // TASK 7D Item 1: Inline Word-Level Diff Renderer for Baseline (shows deletions)
  renderV1WordDiff(v1Text: string, v2Text: string): Array<{ text: string; type: 'removed' | 'normal' }> {
    if (v1Text.startsWith('[No clause')) {
      return [{ text: v1Text, type: 'normal' }];
    }
    const v1Words = v1Text.split(' ');
    const v2Words = new Set(v2Text.split(' ').map((w) => w.toLowerCase().replace(/[.,;:]/g, '')));
    return v1Words.map((word) => {
      const cleanWord = word.toLowerCase().replace(/[.,;:]/g, '');
      const isPresent = v2Words.has(cleanWord);
      return {
        text: word,
        type: isPresent ? 'normal' : 'removed',
      };
    });
  }

  // TASK 7D Item 1: Inline Word-Level Diff Renderer for Amendment (shows additions)
  renderV2WordDiff(v1Text: string, v2Text: string): Array<{ text: string; type: 'added' | 'normal' }> {
    if (v1Text.startsWith('[No clause')) {
      return v2Text.split(' ').map((w) => ({ text: w, type: 'added' }));
    }
    const v1Words = new Set(v1Text.split(' ').map((w) => w.toLowerCase().replace(/[.,;:]/g, '')));
    const v2Words = v2Text.split(' ');
    return v2Words.map((word) => {
      const cleanWord = word.toLowerCase().replace(/[.,;:]/g, '');
      const isPresent = v1Words.has(cleanWord);
      return {
        text: word,
        type: isPresent ? 'normal' : 'added',
      };
    });
  }

  // TASK 7D Item 3: Click Citation to Open Viewer
  navigateToViewerCitation(docId: string, pageCitation: string): void {
    const pageMatch = pageCitation.match(/Page\s+(\d+)/i);
    const pageNum = pageMatch ? parseInt(pageMatch[1], 10) : 1;
    this.router.navigate(['/documents', docId], { queryParams: { page: pageNum } });
  }

  get filteredClauses(): ClauseDiff[] {
    let list = this.clauses;

    if (this.activeFilter === 'changed') {
      list = list.filter((c) => c.changeType !== 'unchanged');
    } else if (this.activeFilter === 'financial') {
      list = list.filter((c) => c.category === 'commercial');
    } else if (this.activeFilter === 'compliance') {
      list = list.filter((c) => c.category === 'compliance');
    } else if (this.activeFilter === 'highRisk') {
      list = list.filter((c) => c.riskImpact === 'High');
    }

    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase().trim();
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(query) ||
          c.sectionNumber.includes(query) ||
          c.version1Text.toLowerCase().includes(query) ||
          c.version2Text.toLowerCase().includes(query) ||
          (c.summaryDelta && c.summaryDelta.toLowerCase().includes(query))
      );
    }

    return list;
  }

  setFilter(filter: 'all' | 'changed' | 'financial' | 'compliance' | 'highRisk'): void {
    this.activeFilter = filter;
  }

  acceptClause(clause: ClauseDiff): void {
    clause.status = 'accepted';
    this.showToast(`Clause ${clause.sectionNumber} amendment accepted by reviewer.`);
  }

  flagClause(clause: ClauseDiff): void {
    clause.status = 'flagged';
    this.showToast(`Clause ${clause.sectionNumber} flagged for General Counsel escalation.`);
  }

  toggleFieldReview(field: FieldDiff): void {
    field.reviewed = !field.reviewed;
    this.showToast(`Field '${field.label}' marked as ${field.reviewed ? 'Verified' : 'Pending'}.`);
  }

  // TASK 7D Item 4: Export Redline Report PDF
  exportRedlinePdfReport(): void {
    this.showToast('Generating Redline PDF Report with dual citations, word deltas & tamper-evident hashes...');
  }

  exportWordRedline(): void {
    this.showToast('Exporting Microsoft Word Track Changes (.docx) file...');
  }

  acknowledgeDelta(): void {
    this.showToast('All version differences acknowledged & logged to immutable audit trail.');
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

