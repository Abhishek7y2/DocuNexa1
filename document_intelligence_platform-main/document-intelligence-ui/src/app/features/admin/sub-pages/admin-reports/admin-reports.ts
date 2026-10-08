import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-reports',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="admin-reports-page">
      <!-- HEADER -->
      <div class="header-bar">
        <div>
          <h2>Governance, SLA Compliance & Executive Reports</h2>
          <p>Generate downloadable compliance summaries, turnaround time reports, and deletion certificates.</p>
        </div>
      </div>

      <!-- REPORT CARDS GRID -->
      <div class="reports-grid">
        <div class="report-card">
          <span class="icon">📊</span>
          <h3>SLA Compliance & Turnaround Times</h3>
          <p>Review average document processing durations from intake to final approval lock across teams.</p>
          <button type="button" class="btn-download" (click)="downloadReport('SLA Compliance Summary')">📥 Download PDF Report</button>
        </div>

        <div class="report-card">
          <span class="icon">🛡️</span>
          <h3>Data Retention & Legal Hold Audit</h3>
          <p>Complete audit of active retention periods, legal hold freezes, and scheduled purge cases.</p>
          <button type="button" class="btn-download" (click)="downloadReport('Retention Audit Summary')">📥 Download CSV Report</button>
        </div>

        <div class="report-card">
          <span class="icon">🎯</span>
          <h3>AI Quality & Reviewer Overrides</h3>
          <p>Precision/recall breakdown per document type, character error rates, and human override logs.</p>
          <button type="button" class="btn-download" (click)="downloadReport('AI Quality Analytics')">📥 Download PDF Report</button>
        </div>
      </div>

      @if (toastMessage) {
        <div class="toast-popup"><span>{{ toastMessage }}</span></div>
      }
    </div>
  `,
  styles: [`
    .admin-reports-page { display: flex; flex-direction: column; gap: 1.25rem; }
    .header-bar { display: flex; justify-content: space-between; align-items: flex-start; h2 { margin: 0; font-size: 1.25rem; } p { margin: 0.2rem 0 0 0; color: #94a3b8; font-size: 0.85rem; } }
    .reports-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.25rem; }
    .report-card { background: #1e293b; border: 1px solid #334155; border-radius: 10px; padding: 1.25rem; display: flex; flex-direction: column; gap: 0.75rem; .icon { font-size: 1.8rem; } h3 { margin: 0; font-size: 1.05rem; color: #f8fafc; } p { margin: 0; font-size: 0.82rem; color: #94a3b8; flex: 1; line-height: 1.4; } .btn-download { background: #334155; color: #ffffff; border: none; border-radius: 6px; padding: 0.5rem 1rem; font-size: 0.82rem; font-weight: 600; cursor: pointer; align-self: flex-start; &:hover { background: #6366f1; } } }
    .toast-popup { position: fixed; bottom: 2rem; right: 2rem; z-index: 300; background: #16a34a; color: #ffffff; padding: 0.75rem 1.25rem; border-radius: 8px; font-weight: 600; font-size: 0.85rem; }
  `]
})
export class AdminReports {
  toastMessage: string | null = null;

  downloadReport(name: string): void {
    this.toastMessage = `Generated and downloaded ${name} report successfully.`;
    setTimeout(() => { this.toastMessage = null; }, 3500);
  }
}
