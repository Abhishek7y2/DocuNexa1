import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface ProcessingJob {
  id: string;
  tenantId: string;
  documentType: string;
  status: 'Queued' | 'Processing' | 'Completed' | 'DLQ';
  workerId: string;
  durationMs: number;
  createdAt: string;
}

export interface DlqItem {
  id: string;
  tenantId: string;
  jobId: string;
  failureReason: string;
  retryCount: number;
  timestamp: string;
  metadataPayload: {
    documentId: string;
    fileSizeBytes: number;
    mimeType: string;
    correlationId: string;
  };
}

@Component({
  selector: 'app-admin-operations',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-operations-page">
      <!-- MANDATORY PRIVACY NOTICE BANNER -->
      <div class="operator-privacy-banner">
        <span class="banner-icon">🛡️</span>
        <div class="banner-content">
          <strong>OPERATOR PRIVACY GUARD ENFORCED:</strong>
          Platform operators have access strictly to processing pipeline metadata, queue health, worker latency, and system execution diagnostics. Document text, images, and confidential payload fields are completely stripped and inaccessible.
        </div>
      </div>

      <!-- HEADER -->
      <div class="header-bar">
        <div>
          <h2>Operator Control Center & Tenant Provisioning</h2>
          <p>Monitor worker queues, dead-letter queues (DLQ), delivery health, and provision new enterprise tenants.</p>
        </div>
        <div class="header-actions">
          <button type="button" class="btn-primary" (click)="showTenantModal = true">+ Provision New Tenant</button>
        </div>
      </div>

      <!-- QUEUE DEPTH & HEALTH METRICS -->
      <div class="metrics-grid">
        <div class="metric-card">
          <span class="m-lbl">Active Worker Queue Depth</span>
          <strong class="m-val green">12 Jobs</strong>
          <span class="m-sub">4 Worker Pods Active</span>
        </div>
        <div class="metric-card">
          <span class="m-lbl">Avg Pipeline Latency</span>
          <strong class="m-val green">1.84s</strong>
          <span class="m-sub">OCR + Extraction</span>
        </div>
        <div class="metric-card">
          <span class="m-lbl">Dead-Letter Queue (DLQ)</span>
          <strong class="m-val red">2 Poison Jobs</strong>
          <span class="m-sub">Requires Inspection</span>
        </div>
        <div class="metric-card">
          <span class="m-lbl">Outbound Delivery Health</span>
          <strong class="m-val green">99.8%</strong>
          <span class="m-sub">Webhook & SMTP</span>
        </div>
      </div>

      <!-- WORKER QUEUE DEPTH CHART / BARS -->
      <div class="queue-depth-card">
        <h3>Worker Pod Task Distribution</h3>
        <div class="pods-grid">
          <div class="pod-bar">
            <div class="pod-top"><span>Worker Pod 01 (Intake & OCR)</span><strong>8 / 20 Tasks</strong></div>
            <div class="bar-bg"><div class="bar-fill green" style="width: 40%;"></div></div>
          </div>
          <div class="pod-bar">
            <div class="pod-top"><span>Worker Pod 02 (Field Extraction)</span><strong>4 / 20 Tasks</strong></div>
            <div class="bar-bg"><div class="bar-fill blue" style="width: 20%;"></div></div>
          </div>
          <div class="pod-bar">
            <div class="pod-top"><span>Worker Pod 03 (Export & Webhooks)</span><strong>0 / 20 Tasks (Idle)</strong></div>
            <div class="bar-bg"><div class="bar-fill" style="width: 0%;"></div></div>
          </div>
        </div>
      </div>

      <!-- DEAD-LETTER QUEUE (DLQ) SECTION -->
      <div class="dlq-card">
        <div class="card-header">
          <h3>Dead-Letter Queue (DLQ) & Poison Messages</h3>
          <span class="sub-hint">Inspect failed execution metadata without revealing document content.</span>
        </div>

        <table class="dlq-table">
          <thead>
            <tr>
              <th>DLQ ITEM ID</th>
              <th>TENANT ID</th>
              <th>JOB ID</th>
              <th>FAILURE STACK REASON</th>
              <th>RETRY COUNT</th>
              <th>TIMESTAMP</th>
              <th class="text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            @for (item of dlqItems; track item.id) {
              <tr>
                <td><code>{{ item.id }}</code></td>
                <td><span class="tenant-tag">{{ item.tenantId }}</span></td>
                <td><code>{{ item.jobId }}</code></td>
                <td class="err-reason">{{ item.failureReason }}</td>
                <td>{{ item.retryCount }} / 5</td>
                <td>{{ item.timestamp }}</td>
                <td class="text-right">
                  <button type="button" class="btn-inspect" (click)="inspectDlqPayload(item)">🔍 Inspect Metadata</button>
                  <button type="button" class="btn-retry" (click)="retryDlqJob(item)">🔁 Retry Job</button>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <!-- PROCESSING JOBS METADATA TABLE -->
      <div class="jobs-card">
        <h3>Recent System Processing Jobs</h3>
        <table class="jobs-table">
          <thead>
            <tr>
              <th>JOB ID</th>
              <th>TENANT ID</th>
              <th>DOCUMENT TYPE</th>
              <th>WORKER POD</th>
              <th>DURATION</th>
              <th>CREATED AT</th>
              <th class="text-right">STATUS</th>
            </tr>
          </thead>
          <tbody>
            @for (job of jobs; track job.id) {
              <tr>
                <td><code>{{ job.id }}</code></td>
                <td><span class="tenant-tag">{{ job.tenantId }}</span></td>
                <td>{{ job.documentType }}</td>
                <td>{{ job.workerId }}</td>
                <td>{{ job.durationMs }}ms</td>
                <td>{{ job.createdAt }}</td>
                <td class="text-right">
                  <span class="job-status {{ job.status.toLowerCase() }}">{{ job.status | uppercase }}</span>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <!-- TENANT PROVISIONING MODAL -->
      @if (showTenantModal) {
        <div class="modal-backdrop" (click)="showTenantModal = false">
          <div class="tenant-modal-card" (click)="$event.stopPropagation()">
            <h3>Provision New Enterprise Tenant</h3>
            <div class="form-group">
              <label>Tenant Organization Name:</label>
              <input type="text" [(ngModel)]="tenantForm.name" class="modal-input" placeholder="e.g. Zenith Global Logistics" />
            </div>
            <div class="form-group">
              <label>Target Infrastructure Region:</label>
              <select [(ngModel)]="tenantForm.region" class="modal-select">
                <option value="us-east-1">AWS us-east-1 (N. Virginia)</option>
                <option value="eu-central-1">AWS eu-central-1 (Frankfurt - GDPR)</option>
                <option value="ap-south-1">AWS ap-south-1 (Mumbai)</option>
              </select>
            </div>
            <div class="form-group">
              <label>First Tenant Org Admin Email:</label>
              <input type="email" [(ngModel)]="tenantForm.adminEmail" class="modal-input" placeholder="admin@zenithlogistics.com" />
            </div>
            <div class="form-group">
              <label>First Admin Full Name:</label>
              <input type="text" [(ngModel)]="tenantForm.adminName" class="modal-input" placeholder="Ananya Sharma" />
            </div>
            <div class="modal-actions">
              <button type="button" class="btn-secondary" (click)="showTenantModal = false">Cancel</button>
              <button type="button" class="btn-primary" (click)="provisionTenant()">Provision Tenant & Send Credentials</button>
            </div>
          </div>
        </div>
      }

      <!-- INSPECT DLQ METADATA MODAL -->
      @if (selectedDlqItem) {
        <div class="modal-backdrop" (click)="selectedDlqItem = null">
          <div class="inspect-modal-card" (click)="$event.stopPropagation()">
            <div class="inspect-header">
              <h3>DLQ System Execution Metadata: {{ selectedDlqItem.id }}</h3>
              <span class="privacy-tag">PRIVACY GUARDED (NO CONTENT)</span>
            </div>
            <div class="inspect-body">
              <p>Failure Stack Trace: <code>{{ selectedDlqItem.failureReason }}</code></p>
              
              <div class="metadata-grid">
                <div><strong>Document Unique ID:</strong> {{ selectedDlqItem.metadataPayload.documentId }}</div>
                <div><strong>File Size:</strong> {{ (selectedDlqItem.metadataPayload.fileSizeBytes / 1024).toFixed(1) }} KB</div>
                <div><strong>Detected MIME Type:</strong> {{ selectedDlqItem.metadataPayload.mimeType }}</div>
                <div><strong>Trace Correlation ID:</strong> {{ selectedDlqItem.metadataPayload.correlationId }}</div>
              </div>
            </div>
            <div class="modal-actions">
              <button type="button" class="btn-secondary" (click)="selectedDlqItem = null">Close</button>
            </div>
          </div>
        </div>
      }

      @if (toastMessage) {
        <div class="toast-popup"><span>{{ toastMessage }}</span></div>
      }
    </div>
  `,
  styles: [`
    .admin-operations-page { display: flex; flex-direction: column; gap: 1.25rem; }
    .operator-privacy-banner { display: flex; align-items: center; gap: 0.75rem; background: rgba(239,68,68,0.15); border: 1px solid #ef4444; border-radius: 8px; padding: 0.85rem 1rem; color: #fca5a5; font-size: 0.85rem; .banner-icon { font-size: 1.2rem; } }
    .header-bar { display: flex; justify-content: space-between; align-items: flex-start; h2 { margin: 0; font-size: 1.25rem; } p { margin: 0.2rem 0 0 0; color: #94a3b8; font-size: 0.85rem; } .btn-primary { background: #4f46e5; color: #ffffff; border: none; border-radius: 6px; padding: 0.55rem 1.1rem; font-weight: 700; font-size: 0.85rem; cursor: pointer; } }
    .metrics-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; }
    .metric-card { background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 1rem; display: flex; flex-direction: column; gap: 0.25rem; .m-lbl { font-size: 0.75rem; color: #94a3b8; } .m-val { font-size: 1.3rem; font-weight: 800; &.green { color: #10b981; } &.red { color: #ef4444; } } .m-sub { font-size: 0.7rem; color: #64748b; } }
    .queue-depth-card, .dlq-card, .jobs-card { background: #1e293b; border: 1px solid #334155; border-radius: 10px; padding: 1.25rem; h3 { margin: 0 0 1rem 0; font-size: 1rem; } .card-header { display: flex; flex-direction: column; margin-bottom: 1rem; h3 { margin: 0; } .sub-hint { font-size: 0.78rem; color: #94a3b8; } } }
    .pods-grid { display: flex; flex-direction: column; gap: 0.85rem; .pod-bar { .pod-top { display: flex; justify-content: space-between; font-size: 0.8rem; color: #cbd5e1; margin-bottom: 0.3rem; } .bar-bg { background: #0f172a; border-radius: 9999px; height: 10px; overflow: hidden; .bar-fill { height: 100%; border-radius: 9999px; &.green { background: #10b981; } &.blue { background: #3b82f6; } } } } }
    .dlq-table, .jobs-table { width: 100%; border-collapse: collapse; font-size: 0.8rem; th { background: #0f172a; color: #94a3b8; padding: 0.6rem; text-align: left; font-size: 0.7rem; } td { padding: 0.6rem; border-bottom: 1px solid #334155; } code { background: #0f172a; color: #818cf8; padding: 0.1rem 0.35rem; border-radius: 4px; font-size: 0.72rem; } .tenant-tag { background: #334155; color: #e2e8f0; font-size: 0.7rem; padding: 0.1rem 0.4rem; border-radius: 4px; } .err-reason { color: #fca5a5; font-size: 0.75rem; max-width: 240px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; } .btn-inspect { background: #334155; color: #ffffff; border: none; border-radius: 4px; padding: 0.25rem 0.5rem; font-size: 0.72rem; cursor: pointer; margin-right: 0.35rem; } .btn-retry { background: rgba(99,102,241,0.2); color: #a5b4fc; border: 1px solid #6366f1; border-radius: 4px; padding: 0.25rem 0.5rem; font-size: 0.72rem; cursor: pointer; } .job-status { font-weight: 700; font-size: 0.68rem; padding: 0.1rem 0.4rem; border-radius: 4px; &.completed { background: rgba(16,185,129,0.2); color: #4ade80; } &.processing { background: rgba(59,130,246,0.2); color: #60a5fa; } &.queued { background: rgba(245,158,11,0.2); color: #fbbf24; } } }
    .modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.75); backdrop-filter: blur(3px); z-index: 100; }
    .tenant-modal-card, .inspect-modal-card { position: fixed; top: 50%; left: 50%; transform: translate(-50%,-50%); width: 480px; background: #1e293b; border: 1px solid #475569; border-radius: 10px; padding: 1.5rem; z-index: 105; h3 { margin: 0 0 1rem 0; font-size: 1.1rem; } .form-group { margin-bottom: 1rem; label { font-size: 0.78rem; color: #cbd5e1; display: block; margin-bottom: 0.35rem; } .modal-input, .modal-select { width: 100%; background: #0f172a; border: 1px solid #334155; color: #ffffff; padding: 0.5rem; border-radius: 6px; box-sizing: border-box; } } .modal-actions { display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.25rem; .btn-secondary { background: #334155; color: #ffffff; border: none; border-radius: 6px; padding: 0.5rem 1rem; font-size: 0.82rem; cursor: pointer; } .btn-primary { background: #4f46e5; color: #ffffff; border: none; border-radius: 6px; padding: 0.5rem 1.1rem; font-size: 0.82rem; font-weight: 700; cursor: pointer; } } }
    .inspect-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #334155; padding-bottom: 0.85rem; margin-bottom: 1rem; h3 { margin: 0; font-size: 1rem; } .privacy-tag { background: rgba(239,68,68,0.2); color: #fca5a5; font-size: 0.65rem; font-weight: 800; padding: 0.15rem 0.4rem; border-radius: 4px; } }
    .metadata-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.65rem; background: #0f172a; padding: 0.85rem; border-radius: 6px; font-size: 0.78rem; color: #cbd5e1; }
    .toast-popup { position: fixed; bottom: 2rem; right: 2rem; z-index: 300; background: #16a34a; color: #ffffff; padding: 0.75rem 1.25rem; border-radius: 8px; font-weight: 600; font-size: 0.85rem; }
  `]
})
export class AdminOperations implements OnInit {
  showTenantModal = false;
  selectedDlqItem: DlqItem | null = null;
  toastMessage: string | null = null;

  tenantForm = {
    name: '',
    region: 'us-east-1',
    adminEmail: '',
    adminName: '',
  };

  dlqItems: DlqItem[] = [
    {
      id: 'DLQ-901',
      tenantId: 'tenant-acme-global',
      jobId: 'JOB-77812',
      failureReason: 'OCR Tesseract worker panic: Memory Allocation Exceeded (SIGSEGV)',
      retryCount: 3,
      timestamp: '11:42 AM',
      metadataPayload: {
        documentId: 'DOC-90412',
        fileSizeBytes: 48921000,
        mimeType: 'application/pdf',
        correlationId: 'corr-98412-01',
      },
    },
    {
      id: 'DLQ-902',
      tenantId: 'tenant-zenith-logistics',
      jobId: 'JOB-77819',
      failureReason: 'HTTP 504 Gateway Timeout while calling Vision OCR Subservice',
      retryCount: 2,
      timestamp: '10:15 AM',
      metadataPayload: {
        documentId: 'DOC-88912',
        fileSizeBytes: 1204000,
        mimeType: 'image/tiff',
        correlationId: 'corr-98412-02',
      },
    }
  ];

  jobs: ProcessingJob[] = [
    { id: 'JOB-77820', tenantId: 'tenant-acme-global', documentType: 'Purchase Invoice', status: 'Processing', workerId: 'pod-01-worker-a', durationMs: 1420, createdAt: '11:50 AM' },
    { id: 'JOB-77821', tenantId: 'tenant-acme-global', documentType: 'Supplier Contract', status: 'Queued', workerId: 'pod-02-worker-b', durationMs: 0, createdAt: '11:51 AM' },
    { id: 'JOB-77818', tenantId: 'tenant-acme-global', documentType: 'Purchase Invoice', status: 'Completed', workerId: 'pod-01-worker-a', durationMs: 1890, createdAt: '11:48 AM' },
  ];

  ngOnInit(): void {}

  provisionTenant(): void {
    if (!this.tenantForm.name || !this.tenantForm.adminEmail) return;
    this.showTenantModal = false;
    this.showToast(`Provisioned new tenant [${this.tenantForm.name}] in region ${this.tenantForm.region}. Credentials sent to ${this.tenantForm.adminEmail}.`);
  }

  inspectDlqPayload(item: DlqItem): void {
    this.selectedDlqItem = item;
  }

  retryDlqJob(item: DlqItem): void {
    this.dlqItems = this.dlqItems.filter(i => i.id !== item.id);
    this.showToast(`Retried DLQ Poison Job [${item.jobId}]. Re-queued into Pod 01.`);
  }

  showToast(msg: string): void {
    this.toastMessage = msg;
    setTimeout(() => { if (this.toastMessage === msg) this.toastMessage = null; }, 3500);
  }
}
