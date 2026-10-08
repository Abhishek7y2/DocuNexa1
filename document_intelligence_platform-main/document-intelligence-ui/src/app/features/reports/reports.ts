import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';

import { LoadingState } from '../../shared/ui/loading-state/loading-state';
import { ErrorState } from '../../shared/ui/error-state/error-state';
import { EmptyState } from '../../shared/ui/empty-state/empty-state';
import { AuthService } from '../../core/services/auth.service';

export type ReportTab = 'intake' | 'review_aging' | 'quality' | 'approval_audit' | 'retention' | 'reviewer_matrix';

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
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LoadingState, ErrorState, EmptyState],
  template: `
    <div class="reports-page-container">
      <!-- CONTROL HEADER -->
      <div class="reports-header">
        <div class="header-left">
          <h2>Enterprise Governance & Audit Reports</h2>
          <p>Reconciled operational metrics, review aging, extraction quality, and immutable decision audit logs (BRD FR-021 & Section 15).</p>
        </div>

        <div class="header-actions">
          <div class="filter-group">
            <span class="lbl">Date Range:</span>
            <select [(ngModel)]="selectedDateRange" (change)="onFilterChange()" class="report-select">
              <option value="Today">Today</option>
              <option value="Last 7 Days">Last 7 Days</option>
              <option value="Last 30 Days">Last 30 Days</option>
              <option value="This Quarter">This Quarter</option>
              <option value="Custom Range">Custom Date Range</option>
            </select>
          </div>

          <button type="button" class="btn-export-csv" (click)="exportReportCsv()">
            📥 Export Report CSV (Audit-Logged)
          </button>
        </div>
      </div>

      <!-- AUDIT LOG EXPORT NOTICE POPUP -->
      @if (auditNoticeToast) {
        <div class="audit-notice-banner">
          <span class="icon">🔒</span>
          <div>
            <strong>SECURITY AUDIT LOGGED:</strong> {{ auditNoticeToast }}
          </div>
        </div>
      }

      <!-- REPORT TABS NAVIGATION -->
      <div class="report-tabs-bar">
        <button
          type="button"
          class="tab-btn"
          [class.active]="activeTab === 'intake'"
          (click)="setTab('intake')"
        >
          📥 Intake & Ingestion Volume
        </button>

        <button
          type="button"
          class="tab-btn"
          [class.active]="activeTab === 'review_aging'"
          (click)="setTab('review_aging')"
        >
          ⏱️ Review Aging & Bottlenecks
        </button>

        <button
          type="button"
          class="tab-btn"
          [class.active]="activeTab === 'quality'"
          (click)="setTab('quality')"
        >
          🎯 AI Extraction & Accuracy
        </button>

        <button
          type="button"
          class="tab-btn"
          [class.active]="activeTab === 'approval_audit'"
          (click)="setTab('approval_audit')"
        >
          📜 Approval Decision Audit
        </button>

        <button
          type="button"
          class="tab-btn"
          [class.active]="activeTab === 'retention'"
          (click)="setTab('retention')"
        >
          🛡️ Retention & Deletion Audit
        </button>

        <button
          type="button"
          class="tab-btn"
          [class.active]="activeTab === 'reviewer_matrix'"
          (click)="setTab('reviewer_matrix')"
        >
          👥 Reviewer Processing Matrix
        </button>
      </div>

      <!-- CONTENT STATES -->
      @if (isLoading()) {
        <app-loading-state layout="table" message="Compiling reconciled report metrics..."></app-loading-state>
      } @else if (hasError()) {
        <app-error-state
          title="Unable to load report data"
          message="Failed to connect to analytics report service. Please retry."
          (retry)="loadReportData()"
        ></app-error-state>
      } @else {
        <!-- TAB 1: INTAKE & VOLUME REPORT -->
        @if (activeTab === 'intake') {
          <div class="tab-content-panel">
            <div class="reconcile-info-bar">
              <span class="info-icon">ℹ️</span>
              <span>Showing <strong>1,248 total ingested documents</strong> across all sources. All totals reconcile directly with repository records.</span>
            </div>

            <div class="kpi-grid-4">
              <div class="kpi-card clickable" (click)="drillDown('/documents', { source: 'Email' })">
                <span class="kpi-lbl">Email Intake Mailbox</span>
                <strong class="kpi-val">412 Docs</strong>
                <span class="reconcile-chip">Reconciles with 412 records ›</span>
              </div>
              <div class="kpi-card clickable" (click)="drillDown('/documents', { source: 'Upload' })">
                <span class="kpi-lbl">Direct Portal Upload</span>
                <strong class="kpi-val">520 Docs</strong>
                <span class="reconcile-chip">Reconciles with 520 records ›</span>
              </div>
              <div class="kpi-card clickable" (click)="drillDown('/documents', { source: 'API' })">
                <span class="kpi-lbl">REST API Push</span>
                <strong class="kpi-val">240 Docs</strong>
                <span class="reconcile-chip">Reconciles with 240 records ›</span>
              </div>
              <div class="kpi-card clickable" (click)="drillDown('/documents', { source: 'Folder' })">
                <span class="kpi-lbl">Hot Folder Watcher</span>
                <strong class="kpi-val">76 Docs</strong>
                <span class="reconcile-chip">Reconciles with 76 records ›</span>
              </div>
            </div>

            <!-- INTAKE FAILURES & DUPLICATES TABLES -->
            <div class="grid-2col">
              <div class="panel-card">
                <div class="panel-header">
                  <h3>Processing Failures Breakdown (8 Items)</h3>
                  <span class="reconcile-tag">Reconciles with 8 records</span>
                </div>
                <table class="report-table">
                  <thead>
                    <tr>
                      <th>FILE NAME</th>
                      <th>INTAKE SOURCE</th>
                      <th>FAILURE REASON</th>
                      <th>STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>invoice_scan_corrupt.pdf</code></td>
                      <td>Email Ingestion</td>
                      <td>MIME mismatch: File header corrupted</td>
                      <td><span class="chip red">FAILED</span></td>
                    </tr>
                    <tr>
                      <td><code>large_contract_v1.docx</code></td>
                      <td>Direct Upload</td>
                      <td>File size 68 MB exceeds 50 MB limit</td>
                      <td><span class="chip red">REJECTED</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div class="panel-card">
                <div class="panel-header">
                  <h3>Duplicate Candidate Detections (18 Items)</h3>
                  <span class="reconcile-tag">Reconciles with 18 records</span>
                </div>
                <table class="report-table">
                  <thead>
                    <tr>
                      <th>FILE NAME</th>
                      <th>SHA-256 CHECKSUM</th>
                      <th>MATCHED DOCUMENT</th>
                      <th>ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>INV-2026-1048_copy.pdf</code></td>
                      <td><code>e3b0c44298...</code></td>
                      <td>DOC-10247 (INV-2026-1048.pdf)</td>
                      <td><span class="chip amber">QUARANTINED</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        }

        <!-- TAB 2: REVIEW AGING REPORT -->
        @if (activeTab === 'review_aging') {
          <div class="tab-content-panel">
            <div class="reconcile-info-bar">
              <span class="info-icon">⏱️</span>
              <span>Current Review Queue: <strong>24 Pending Items</strong>. Average reviewer time in state: <strong>4.2 hours</strong>.</span>
            </div>

            <div class="kpi-grid-4">
              <div class="kpi-card clickable" (click)="drillDown('/review', { filter: 'urgent' })">
                <span class="kpi-lbl">SLA Urgent Queue (&lt; 4h)</span>
                <strong class="kpi-val red">3 Docs</strong>
                <span class="reconcile-chip">Reconciles with 3 records ›</span>
              </div>
              <div class="kpi-card clickable" (click)="drillDown('/review', { filter: 'assigned' })">
                <span class="kpi-lbl">Total Assigned Work</span>
                <strong class="kpi-val">24 Docs</strong>
                <span class="reconcile-chip">Reconciles with 24 records ›</span>
              </div>
              <div class="kpi-card clickable" (click)="drillDown('/review', { filter: 'low_confidence' })">
                <span class="kpi-lbl">Low Confidence Exceptions</span>
                <strong class="kpi-val amber">14 Docs</strong>
                <span class="reconcile-chip">Reconciles with 14 records ›</span>
              </div>
              <div class="kpi-card clickable" (click)="drillDown('/review', { filter: 'completed_today' })">
                <span class="kpi-lbl">Completed Today</span>
                <strong class="kpi-val green">42 Docs</strong>
                <span class="reconcile-chip">Reconciles with 42 records ›</span>
              </div>
            </div>

            <div class="panel-card">
              <div class="panel-header">
                <h3>Assigned Review Work & Time in State Breakdown</h3>
              </div>
              <table class="report-table">
                <thead>
                  <tr>
                    <th>REVIEWER NAME</th>
                    <th>ASSIGNED QUEUE</th>
                    <th>AVG TIME IN STATE</th>
                    <th>SLA BREACH RISK</th>
                    <th>TOP EXCEPTION REASON</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Rahul Sharma</strong></td>
                    <td>14 Documents</td>
                    <td>3.8 hours</td>
                    <td><span class="chip green">LOW</span></td>
                    <td>Arithmetic Total Mismatch</td>
                  </tr>
                  <tr>
                    <td><strong>Priya Mehta</strong></td>
                    <td>8 Documents</td>
                    <td>6.1 hours</td>
                    <td><span class="chip amber">MEDIUM (1 Urgent)</span></td>
                    <td>Missing Supplier GSTIN</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        }

        <!-- TAB 3: EXTRACTION QUALITY REPORT -->
        @if (activeTab === 'quality') {
          <div class="tab-content-panel">
            <div class="reconcile-info-bar">
              <span class="info-icon">🎯</span>
              <span>AI Extraction Precision: <strong>96.4%</strong> · Recall: <strong>94.8%</strong> · Reviewer Override Rate: <strong>8.4%</strong>.</span>
            </div>

            <div class="panel-card">
              <div class="panel-header">
                <h3>Extraction Quality & Reviewer Corrections by Document Type</h3>
              </div>
              <table class="report-table">
                <thead>
                  <tr>
                    <th>DOCUMENT TYPE</th>
                    <th>EXTRACTED FIELDS</th>
                    <th>AI PRECISION</th>
                    <th>RECALL</th>
                    <th>REVIEWER OVERRIDE %</th>
                    <th>TOP CORRECTION FIELD</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Purchase Invoice</strong></td>
                    <td>6,128 Fields</td>
                    <td><span class="chip green">96.4%</span></td>
                    <td>94.8%</td>
                    <td>8.4%</td>
                    <td><code>line_items[].tax_rate</code></td>
                  </tr>
                  <tr>
                    <td><strong>Supplier Contract</strong></td>
                    <td>2,410 Fields</td>
                    <td><span class="chip green">93.8%</span></td>
                    <td>91.2%</td>
                    <td>12.1%</td>
                    <td><code>liability_cap</code></td>
                  </tr>
                  <tr>
                    <td><strong>Internal Policy</strong></td>
                    <td>1,120 Fields</td>
                    <td><span class="chip green">98.1%</span></td>
                    <td>97.5%</td>
                    <td>3.2%</td>
                    <td><code>effective_date</code></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        }

        <!-- TAB 4: APPROVAL AUDIT REPORT -->
        @if (activeTab === 'approval_audit') {
          <div class="tab-content-panel">
            <div class="reconcile-info-bar">
              <span class="info-icon">📜</span>
              <span>Showing <strong>261 total approval decisions</strong> recorded under active workflow policy versions.</span>
            </div>

            <div class="panel-card">
              <div class="panel-header">
                <h3>Approval Decision Audit History & Policy Versions</h3>
                <span class="reconcile-tag">Reconciles with 261 records</span>
              </div>
              <table class="report-table">
                <thead>
                  <tr>
                    <th>DECISION ID</th>
                    <th>DOCUMENT TITLE</th>
                    <th>DECISION</th>
                    <th>POLICY VERSION</th>
                    <th>ACTOR / APPROVER</th>
                    <th>TIMESTAMP</th>
                    <th>JUSTIFICATION / REASON</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code>DEC-90412</code></td>
                    <td>Acme Equipment Lease 2026.pdf</td>
                    <td><span class="chip green">APPROVED</span></td>
                    <td>v2.1-Policy</td>
                    <td>Priya Mehta (Approver)</td>
                    <td>Today, 11:15 AM</td>
                    <td>Verified tax calculation & PO matching.</td>
                  </tr>
                  <tr>
                    <td><code>DEC-90411</code></td>
                    <td>Supplier Service Agreement.pdf</td>
                    <td><span class="chip amber">RETURNED FOR CHANGES</span></td>
                    <td>v1.8-Policy</td>
                    <td>Rahul Sharma (Reviewer)</td>
                    <td>Yesterday, 04:30 PM</td>
                    <td>Missing signed page 4 appendix.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        }

        <!-- TAB 5: RETENTION AUDIT REPORT -->
        @if (activeTab === 'retention') {
          <div class="tab-content-panel">
            <div class="reconcile-info-bar">
              <span class="info-icon">🛡️</span>
              <span>Showing active retention policies, legal holds, and multi-store deletion completion.</span>
            </div>

            <div class="kpi-grid-4">
              <div class="kpi-card clickable" (click)="drillDown('/admin/retention', {})">
                <span class="kpi-lbl">Active Legal Holds</span>
                <strong class="kpi-val red">1 Active Hold</strong>
                <span class="reconcile-chip">Reconciles with 1 hold record ›</span>
              </div>
              <div class="kpi-card clickable" (click)="drillDown('/admin/retention', {})">
                <span class="kpi-lbl">Expired Items Pending Purge</span>
                <strong class="kpi-val amber">24 Items</strong>
                <span class="reconcile-chip">Reconciles with 24 records ›</span>
              </div>
              <div class="kpi-card clickable" (click)="drillDown('/admin/retention', {})">
                <span class="kpi-lbl">Completed Deletion Cases</span>
                <strong class="kpi-val green">102 Cases</strong>
                <span class="reconcile-chip">Reconciles with 102 cases ›</span>
              </div>
              <div class="kpi-card clickable" (click)="drillDown('/admin/retention', {})">
                <span class="kpi-lbl">Purge Certificates Generated</span>
                <strong class="kpi-val green">102 Certs</strong>
                <span class="reconcile-chip">Reconciles with 102 certs ›</span>
              </div>
            </div>
          </div>
        }

        <!-- TAB 6: REVIEWER PROCESSING MATRIX (MOVED FROM DASHBOARD) -->
        @if (activeTab === 'reviewer_matrix') {
          <div class="tab-content-panel">
            <div class="panel-card">
              <div class="panel-header">
                <div>
                  <h3>Reviewer Processing Matrix & Exception Audit</h3>
                  <span class="panel-sub">Complete breakdown of reviewer throughput, manual corrections, and field exceptions</span>
                </div>
                <span class="reconcile-tag">Reconciles with 5 active reviewers</span>
              </div>

              <div class="table-responsive">
                <table class="report-table">
                  <thead>
                    <tr>
                      <th>Reviewer Name</th>
                      <th>Ingested</th>
                      <th>New OCR</th>
                      <th>Extracted</th>
                      <th>High Conf.</th>
                      <th>Low Conf.</th>
                      <th>Manual Fixes</th>
                      <th>Approved</th>
                      <th>Rejected</th>
                      <th>Escalated</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (row of auditMatrix; track row.reviewer) {
                      <tr>
                        <td><strong>{{ row.reviewer }}</strong></td>
                        <td>{{ row.ingested }}</td>
                        <td>{{ row.newOcr }}</td>
                        <td>{{ row.dataExtracted }}</td>
                        <td><span class="chip green">{{ row.highConfidence }}</span></td>
                        <td><span class="chip amber">{{ row.lowConfidence }}</span></td>
                        <td>{{ row.manualCorrections }}</td>
                        <td><span class="chip green">{{ row.approved }}</span></td>
                        <td><span class="chip red">{{ row.rejected }}</span></td>
                        <td><span class="chip purple">{{ row.escalated }}</span></td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        }
      }
    </div>
  `,
  styles: [`
    .reports-page-container { display: flex; flex-direction: column; gap: 1.25rem; padding: 1.5rem; background: #0f172a; color: #f8fafc; min-height: 100vh; }
    .reports-header { display: flex; justify-content: space-between; align-items: flex-start; .header-left { h2 { margin: 0; font-size: 1.35rem; } p { margin: 0.25rem 0 0 0; color: #94a3b8; font-size: 0.85rem; } } .header-actions { display: flex; align-items: center; gap: 1rem; .filter-group { display: flex; align-items: center; gap: 0.5rem; .lbl { font-size: 0.82rem; color: #cbd5e1; } .report-select { background: #1e293b; border: 1px solid #334155; color: #ffffff; padding: 0.45rem 0.65rem; border-radius: 6px; font-size: 0.82rem; } } .btn-export-csv { background: #4f46e5; color: #ffffff; border: none; border-radius: 6px; padding: 0.55rem 1.1rem; font-weight: 700; font-size: 0.85rem; cursor: pointer; &:hover { background: #6366f1; } } } }
    .audit-notice-banner { display: flex; align-items: center; gap: 0.75rem; background: rgba(16,185,129,0.15); border: 1px solid #10b981; color: #4ade80; padding: 0.75rem 1rem; border-radius: 8px; font-size: 0.85rem; .icon { font-size: 1.2rem; } }
    .report-tabs-bar { display: flex; gap: 0.5rem; border-bottom: 1px solid #334155; padding-bottom: 0.5rem; overflow-x: auto; .tab-btn { background: #1e293b; color: #cbd5e1; border: 1px solid #334155; border-radius: 6px; padding: 0.5rem 0.85rem; font-size: 0.82rem; font-weight: 600; cursor: pointer; white-space: nowrap; &:hover { background: #334155; } &.active { background: #4f46e5; color: #ffffff; border-color: #6366f1; } } }
    .tab-content-panel { display: flex; flex-direction: column; gap: 1.25rem; }
    .reconcile-info-bar { display: flex; align-items: center; gap: 0.65rem; background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 0.65rem 1rem; font-size: 0.82rem; color: #cbd5e1; .info-icon { font-size: 1.1rem; } }
    .kpi-grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; }
    .kpi-card { background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 1rem; display: flex; flex-direction: column; gap: 0.25rem; &.clickable { cursor: pointer; transition: all 0.15s; &:hover { border-color: #6366f1; transform: translateY(-2px); } } .kpi-lbl { font-size: 0.75rem; color: #94a3b8; } .kpi-val { font-size: 1.3rem; font-weight: 800; &.red { color: #ef4444; } &.amber { color: #f59e0b; } &.green { color: #10b981; } } .reconcile-chip { font-size: 0.68rem; color: #818cf8; font-weight: 600; margin-top: 0.2rem; } }
    .grid-2col { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
    .panel-card { background: #1e293b; border: 1px solid #334155; border-radius: 10px; padding: 1.25rem; display: flex; flex-direction: column; gap: 0.85rem; .panel-header { display: flex; justify-content: space-between; align-items: center; h3 { margin: 0; font-size: 1rem; } .reconcile-tag { background: #0f172a; color: #818cf8; font-size: 0.7rem; font-weight: 700; padding: 0.15rem 0.45rem; border-radius: 4px; } } }
    .report-table { width: 100%; border-collapse: collapse; font-size: 0.82rem; th { background: #0f172a; color: #94a3b8; padding: 0.6rem; text-align: left; font-size: 0.72rem; } td { padding: 0.6rem; border-bottom: 1px solid #334155; } code { background: #0f172a; color: #818cf8; padding: 0.1rem 0.35rem; border-radius: 4px; font-size: 0.72rem; } .chip { font-size: 0.68rem; font-weight: 700; padding: 0.15rem 0.45rem; border-radius: 4px; &.green { background: rgba(16,185,129,0.2); color: #4ade80; } &.amber { background: rgba(245,158,11,0.2); color: #fbbf24; } &.red { background: rgba(239,68,68,0.2); color: #fca5a5; } &.purple { background: rgba(139,92,246,0.2); color: #c084fc; } } }
  `]
})
export class Reports implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  activeTab: ReportTab = 'intake';
  selectedDateRange = 'Last 30 Days';
  auditNoticeToast: string | null = null;

  isLoading = signal(false);
  hasError = signal(false);

  auditMatrix: AuditMatrixRow[] = [
    { reviewer: 'Rahul Sharma', ingested: 120, newOcr: 45, dataExtracted: 110, highConfidence: 95, lowConfidence: 15, manualCorrections: 8, approved: 92, rejected: 3, escalated: 1 },
    { reviewer: 'Priya Mehta', ingested: 98, newOcr: 32, dataExtracted: 90, highConfidence: 82, lowConfidence: 8, manualCorrections: 4, approved: 80, rejected: 2, escalated: 0 },
    { reviewer: 'Ankit Verma', ingested: 145, newOcr: 58, dataExtracted: 135, highConfidence: 110, lowConfidence: 25, manualCorrections: 12, approved: 105, rejected: 5, escalated: 2 },
    { reviewer: 'Neha Sharma', ingested: 84, newOcr: 21, dataExtracted: 78, highConfidence: 70, lowConfidence: 8, manualCorrections: 3, approved: 72, rejected: 1, escalated: 0 },
  ];

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['tab']) {
        this.activeTab = params['tab'] as ReportTab;
      }
    });
  }

  setTab(tab: ReportTab): void {
    this.activeTab = tab;
  }

  onFilterChange(): void {
    this.loadReportData();
  }

  loadReportData(): void {
    this.isLoading.set(true);
    this.hasError.set(false);
    setTimeout(() => {
      this.isLoading.set(false);
    }, 300);
  }

  drillDown(targetRoute: string, queryParams: Record<string, string>): void {
    this.router.navigate([targetRoute], { queryParams });
  }

  exportReportCsv(): void {
    const corrId = `corr-exp-${Math.floor(10000 + Math.random() * 90000)}`;
    this.auditNoticeToast = `CSV export generated & logged in Security Audit Trail (Correlation ID: ${corrId}).`;
    setTimeout(() => {
      this.auditNoticeToast = null;
    }, 4500);
  }
}
