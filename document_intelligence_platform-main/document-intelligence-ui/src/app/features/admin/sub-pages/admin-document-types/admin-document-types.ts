import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-document-types',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="admin-doc-types-page">
      <div class="header-bar">
        <div>
          <h2>Document Type Schema Templates</h2>
          <p>Versioned extraction templates, field validation rules, and reviewer role mappings (BRD Section 6).</p>
        </div>
        <a routerLink="/admin/document-types/new" class="btn-primary">+ Create Document Type</a>
      </div>

      <div class="types-grid">
        @for (t of documentTypes; track t.id) {
          <div class="type-card">
            <div class="card-top">
              <span class="code-badge">{{ t.code }}</span>
              <span class="ver-badge">Active Template {{ t.version }}</span>
            </div>
            <h3>{{ t.name }}</h3>
            <p>{{ t.description }}</p>
            <div class="meta-row">
              <span><strong>{{ t.fieldsCount }}</strong> Defined Fields</span> · <span>Workflow: {{ t.workflow }}</span>
            </div>
            <div class="card-actions">
              <a [routerLink]="['/admin/document-types', t.id]" class="btn-builder">
                🛠️ Open Schema Builder
              </a>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .admin-doc-types-page { display: flex; flex-direction: column; gap: 1.25rem; }
    .header-bar { display: flex; justify-content: space-between; align-items: flex-start; h2 { margin: 0; font-size: 1.25rem; } p { margin: 0.2rem 0 0 0; color: #94a3b8; font-size: 0.85rem; } }
    .btn-primary { background: #4f46e5; color: #ffffff; border: none; border-radius: 6px; padding: 0.55rem 1.1rem; font-weight: 700; font-size: 0.85rem; text-decoration: none; display: inline-block; }
    .types-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.25rem; }
    .type-card { background: #1e293b; border: 1px solid #334155; border-radius: 10px; padding: 1.25rem; display: flex; flex-direction: column; .card-top { display: flex; justify-content: space-between; margin-bottom: 0.75rem; .code-badge { background: #0f172a; color: #818cf8; font-weight: 700; font-size: 0.75rem; padding: 0.15rem 0.45rem; border-radius: 4px; } .ver-badge { background: rgba(16,185,129,0.2); color: #4ade80; font-size: 0.72rem; font-weight: 700; padding: 0.15rem 0.45rem; border-radius: 4px; } } h3 { margin: 0 0 0.35rem 0; font-size: 1.1rem; color: #f8fafc; } p { margin: 0; font-size: 0.82rem; color: #94a3b8; flex: 1; line-height: 1.4; } .meta-row { font-size: 0.75rem; color: #cbd5e1; margin: 0.85rem 0; } .card-actions { border-top: 1px solid #334155; padding-top: 0.75rem; .btn-builder { display: inline-block; background: #334155; color: #ffffff; text-decoration: none; border-radius: 6px; padding: 0.4rem 0.85rem; font-size: 0.8rem; font-weight: 600; &:hover { background: #6366f1; } } } }
  `]
})
export class AdminDocumentTypes {
  documentTypes = [
    { id: 'purchase-invoice', code: 'PUR-INVOICE', name: 'Purchase Invoice', description: 'Supplier tax invoices, line items breakdown, IGST tax calculations, and PO matching.', version: 'v2.1', fieldsCount: 9, workflow: 'Validation → Review → Approval' },
    { id: 'supplier-contract', code: 'SUP-CONTRACT', name: 'Supplier Contract', description: 'Master equipment and service agreements, liability caps, effective dates, and renewal terms.', version: 'v1.4', fieldsCount: 8, workflow: 'Legal Review → Executive Approval' },
    { id: 'internal-policy', code: 'INT-POLICY', name: 'Internal Policy', description: 'Corporate governance policies, document control IDs, versioning, and compliance officer sign-offs.', version: 'v4.2', fieldsCount: 6, workflow: 'Policy Owner Approval' },
  ];
}
