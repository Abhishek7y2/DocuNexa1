import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-overview',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="admin-overview-page">
      <div class="overview-header">
        <div>
          <h2>Organization Governance & Platform Overview</h2>
          <p>Tenant: <strong>Acme Corporation Global</strong> · Enterprise Plan · Status: <span class="badge active">Active</span></p>
        </div>
      </div>

      <div class="metrics-grid">
        <div class="metric-card">
          <span class="icon">👥</span>
          <div>
            <span class="lbl">Active Tenant Users</span>
            <strong class="val">28 Users</strong>
          </div>
        </div>
        <div class="metric-card">
          <span class="icon">📜</span>
          <div>
            <span class="lbl">Document Type Schemas</span>
            <strong class="val">3 Configured</strong>
          </div>
        </div>
        <div class="metric-card">
          <span class="icon">⚡</span>
          <div>
            <span class="lbl">Active Workflows</span>
            <strong class="val">v1.4-Policy</strong>
          </div>
        </div>
        <div class="metric-card">
          <span class="icon">🎯</span>
          <div>
            <span class="lbl">Extraction Accuracy</span>
            <strong class="val green">94.2% AI</strong>
          </div>
        </div>
      </div>

      <div class="quick-nav-grid">
        <a routerLink="/admin/users" class="nav-card">
          <span class="icon">👥</span>
          <h3>Users & Roles</h3>
          <p>Invite team members, assign workspace scopes, manage MFA rules, and deactivate access.</p>
        </a>
        <a routerLink="/admin/document-types" class="nav-card">
          <span class="icon">📋</span>
          <h3>Document Type Schemas</h3>
          <p>Configure field schemas, confidence thresholds, PII masking, and versioned templates.</p>
        </a>
        <a routerLink="/admin/workflow" class="nav-card">
          <span class="icon">🔀</span>
          <h3>Approval Route Builder</h3>
          <p>Design sequential & parallel routes, quorum rules, threshold gates, and SoD policies.</p>
        </a>
        <a routerLink="/admin/retention" class="nav-card">
          <span class="icon">🛡️</span>
          <h3>Retention & Deletion Cases</h3>
          <p>Manage legal holds, deletion cases, per-store completion evidence, and purge certificates.</p>
        </a>
        <a routerLink="/admin/integrations" class="nav-card">
          <span class="icon">🔌</span>
          <h3>Integrations & Webhooks</h3>
          <p>Configure ERP/CLM export mappings, SAML/OIDC SSO, email intake, and signed webhooks.</p>
        </a>
        <a routerLink="/admin/ai-quality" class="nav-card">
          <span class="icon">🎯</span>
          <h3>AI Quality Benchmarks</h3>
          <p>Monitor field precision/recall, CER, citation accuracy, and reviewer override rates.</p>
        </a>
      </div>
    </div>
  `,
  styles: [`
    .admin-overview-page { display: flex; flex-direction: column; gap: 1.5rem; }
    .overview-header { h2 { margin: 0; font-size: 1.25rem; } p { margin: 0.2rem 0 0 0; color: #94a3b8; font-size: 0.85rem; } .badge.active { background: rgba(16,185,129,0.2); color: #4ade80; padding: 0.1rem 0.4rem; border-radius: 4px; font-size: 0.72rem; } }
    .metrics-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; }
    .metric-card { display: flex; align-items: center; gap: 0.75rem; background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 1rem; .icon { font-size: 1.4rem; } .lbl { font-size: 0.75rem; color: #94a3b8; display: block; } .val { font-size: 1.2rem; color: #f8fafc; &.green { color: #10b981; } } }
    .quick-nav-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.25rem; }
    .nav-card { background: #1e293b; border: 1px solid #334155; border-radius: 10px; padding: 1.25rem; text-decoration: none; color: inherit; transition: all 0.2s; &:hover { border-color: #6366f1; transform: translateY(-2px); } .icon { font-size: 1.5rem; } h3 { margin: 0.5rem 0 0.35rem 0; font-size: 1rem; color: #f8fafc; } p { margin: 0; font-size: 0.8rem; color: #94a3b8; line-height: 1.4; } }
  `]
})
export class AdminOverview {}
