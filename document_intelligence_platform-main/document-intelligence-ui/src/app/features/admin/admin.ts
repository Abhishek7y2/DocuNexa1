import { Component, OnInit, HostListener, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LoadingState } from '../../shared/ui/loading-state/loading-state';
import { ErrorState } from '../../shared/ui/error-state/error-state';
import { EmptyState } from '../../shared/ui/empty-state/empty-state';
import { ADMIN_SERVICE_TOKEN, MockAdminService } from '../../core/services/api-services';
import { AuthService } from '../../core/services/auth.service';

type AdminTab =
  | 'overview'
  | 'users'
  | 'documents'
  | 'workflow'
  | 'retention'
  | 'security'
  | 'integrations'
  | 'delivery';

interface UserItem {
  name: string;
  email: string;
  role: string;
  department: string;
  status: 'Active' | 'Invited' | 'Suspended';
  lastActive: string;
}

interface RoleItem {
  name: string;
  description: string;
  users: number;
  permissions: string[];
}

interface DocumentTypeItem {
  name: string;
  code: string;
  description: string;
  fields: number;
  workflow: string;
  enabled: boolean;
}

interface IntegrationItem {
  name: string;
  description: string;
  type: string;
  status: 'Connected' | 'Not Connected' | 'Configuration Required';
  lastSync: string;
}

export interface DeliveryAttempt {
  attemptNumber: number;
  timestamp: string;
  channel: string;
  responseStatus: string;
  responseMessage: string;
  status: 'Success' | 'Failure';
}

export interface NotificationDeliveryLog {
  id: string;
  recipient: string;
  templateName: string;
  templateVersion: string;
  channel: 'Email' | 'In-App' | 'SMS';
  state: 'Queued' | 'Sent' | 'Failed' | 'Retrying';
  attempts: number;
  maxAttempts?: number;
  isRetrying?: boolean;
  lastError: string;
  timestamp: string;
  attemptHistory: DeliveryAttempt[];
}

export interface WebhookDeliveryLog {
  id: string;
  event: string;
  endpointUrl: string;
  httpStatus: string;
  signatureStatus: string;
  attempts: string;
  idempotencyKey: string;
  finalFailure: string;
  timestamp: string;
  isResending?: boolean;
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingState, ErrorState, EmptyState],
  templateUrl: './admin.html',
  styleUrl: './admin.scss',
  providers: [{ provide: ADMIN_SERVICE_TOKEN, useClass: MockAdminService }],
})
export class Admin implements OnInit {
  private readonly adminService = inject(ADMIN_SERVICE_TOKEN);
  private readonly authService = inject(AuthService);

  activeTab: AdminTab = 'overview';
  organizationName = 'Acme Corporation';
  organizationStatus = 'Active';
  organizationPlan = 'Enterprise';

  isLoading = signal(true);
  hasError = signal(false);
  saveError = signal(false);
  hasUnsavedChanges = signal(false);
  saveSuccessToast: string | null = null;
  testWebhookToast: string | null = null;

  // Delivery & Webhook Loading/Error Signals
  isDeliveryLoading = signal(false);
  hasDeliveryError = signal(false);
  isWebhookLoading = signal(false);
  hasWebhookError = signal(false);
  isHistoryLoading = signal(false);
  hasHistoryError = signal(false);

  searchUser = '';
  selectedUserRole = 'All Roles';
  selectedUserStatus = 'All Status';

  retentionPeriod = '7 years';
  sessionTimeout = '30 minutes';

  securitySettings = {
    requireMfa: true,
    auditLogging: true,
    ssoEnabled: false,
    ipRestriction: false,
    sessionTimeoutEnabled: true,
  };

  emailIntakeConfig = {
    mailboxAddress: 'invoices-ingest@docnexa.io',
    allowedSenders: 'acme.com, vendors.global.org, partner-network.com',
    defaultDocumentType: 'Purchase Invoice',
    sandboxMode: true,
    autoExtractAttachments: true,
  };

  saveEmailIntakeConfig(): void {
    this.saveSuccessToast = 'Email Intake integration configuration updated successfully.';
    setTimeout(() => {
      this.saveSuccessToast = null;
    }, 3000);
  }


  workflowSettings = {
    autoClassification: true,
    autoExtraction: true,
    requireReview: true,
    requireApproval: true,
    lowConfidenceReview: true,
  };

  users: UserItem[] = [
    { name: 'Abhishek Yadav', email: 'admin@docnexa.io', role: 'Organization Admin', department: 'Administration', status: 'Active', lastActive: 'Just now' },
    { name: 'Rahul Sharma', email: 'reviewer@docnexa.io', role: 'Reviewer', department: 'Operations', status: 'Active', lastActive: '12 min ago' },
    { name: 'Priya Mehta', email: 'approver@docnexa.io', role: 'Approver', department: 'Finance', status: 'Active', lastActive: '34 min ago' },
    { name: 'Neha Verma', email: 'contributor@docnexa.io', role: 'Contributor', department: 'Procurement', status: 'Active', lastActive: '1 hour ago' },
    { name: 'Arjun Kapoor', email: 'auditor@docnexa.io', role: 'Auditor', department: 'Compliance', status: 'Active', lastActive: '2 hours ago' },
  ];

  roles: RoleItem[] = [
    { name: 'Organization Admin', description: 'Full organization configuration and user management.', users: 2, permissions: ['Manage users', 'Configure workflows', 'Manage documents', 'View audit logs'] },
    { name: 'Reviewer', description: 'Review OCR, classification and extracted document data.', users: 6, permissions: ['Review documents', 'Edit extraction', 'Request changes', 'View source'] },
    { name: 'Approver', description: 'Approve or reject documents after review.', users: 4, permissions: ['Approve documents', 'Reject documents', 'Request changes', 'View source'] },
    { name: 'Contributor', description: 'Upload documents and track processing status.', users: 11, permissions: ['Upload documents', 'View own documents', 'Create tasks', 'Track processing'] },
    { name: 'Auditor', description: 'Read-only access to documents, search and audit data.', users: 5, permissions: ['Search documents', 'View documents', 'View versions', 'View audit logs'] },
  ];

  documentTypes: DocumentTypeItem[] = [
    { name: 'Supplier Contract', code: 'SUP-CONTRACT', description: 'Vendor and supplier agreements requiring review and approval.', fields: 18, workflow: 'Review → Approval', enabled: true },
    { name: 'Purchase Invoice', code: 'PUR-INVOICE', description: 'Supplier invoices processed through extraction and validation.', fields: 14, workflow: 'Validation → Review → Approval', enabled: true },
  ];

  integrations: IntegrationItem[] = [
    { name: 'Object Storage', description: 'Secure document storage for uploaded files and versions.', type: 'Storage', status: 'Connected', lastSync: '2 minutes ago' },
    { name: 'Enterprise Email', description: 'Email notifications for reviews, approvals and tasks.', type: 'Notifications', status: 'Connected', lastSync: '5 minutes ago' },
  ];

  workflowSteps = [
    { number: 1, title: 'Document Intake', description: 'Receive and validate uploaded documents.', enabled: true },
    { number: 2, title: 'OCR Processing', description: 'Extract machine-readable text from source documents.', enabled: true },
    { number: 3, title: 'Classification', description: 'Identify document type and processing rules.', enabled: true },
    { number: 4, title: 'Field Extraction', description: 'Extract configured business fields with confidence scores.', enabled: true },
    { number: 5, title: 'Human Review', description: 'Review low-confidence fields and document data.', enabled: true },
    { number: 6, title: 'Approval', description: 'Route documents to authorized approvers.', enabled: true },
    { number: 7, title: 'Repository', description: 'Store approved documents and searchable metadata.', enabled: true },
  ];

  // --- TAB: NOTIFICATION DELIVERY (BRD FR-020 & Section 15) ---
  deliveryFilterState: 'All' | 'Queued' | 'Sent' | 'Failed' | 'Retrying' = 'All';
  deliveryDateRange = 'Last 7 Days';

  selectedDeliveryLog: NotificationDeliveryLog | null = null;
  showAttemptHistoryModal = false;
  private previousActiveElement: HTMLElement | null = null;

  notificationLogs: NotificationDeliveryLog[] = [
    {
      id: 'DEL-901',
      recipient: 'reviewer@docnexa.io',
      templateName: 'tpl_review_assignment',
      templateVersion: 'v2.1',
      channel: 'Email',
      state: 'Failed',
      attempts: 3,
      maxAttempts: 5,
      lastError: '550 5.1.1 SMTP relay timeout: MX host unreachable',
      timestamp: '06 Oct 2026 · 11:32 AM',
      attemptHistory: [
        { attemptNumber: 1, timestamp: '06 Oct 2026 · 11:28 AM', channel: 'SMTP Email', responseStatus: '504 Gateway Timeout', responseMessage: 'Connection timed out after 3000ms', status: 'Failure' },
        { attemptNumber: 2, timestamp: '06 Oct 2026 · 11:30 AM', channel: 'SMTP Email', responseStatus: '550 5.1.1', responseMessage: 'MX host unreachable', status: 'Failure' },
        { attemptNumber: 3, timestamp: '06 Oct 2026 · 11:32 AM', channel: 'SMTP Email', responseStatus: '550 5.1.1', responseMessage: 'MX host unreachable', status: 'Failure' },
      ],
    },
    {
      id: 'DEL-902',
      recipient: 'approver@docnexa.io',
      templateName: 'tpl_approval_requested',
      templateVersion: 'v1.4',
      channel: 'Email',
      state: 'Sent',
      attempts: 1,
      maxAttempts: 5,
      lastError: '—',
      timestamp: '06 Oct 2026 · 11:15 AM',
      attemptHistory: [
        { attemptNumber: 1, timestamp: '06 Oct 2026 · 11:15 AM', channel: 'SMTP Email', responseStatus: '250 2.0.0 OK', responseMessage: 'Queued for delivery msg-id 98412', status: 'Success' },
      ],
    },
    {
      id: 'DEL-903',
      recipient: 'admin@docnexa.io',
      templateName: 'tpl_sla_breach_warning',
      templateVersion: 'v3.0',
      channel: 'In-App',
      state: 'Sent',
      attempts: 1,
      maxAttempts: 5,
      lastError: '—',
      timestamp: '06 Oct 2026 · 10:45 AM',
      attemptHistory: [
        { attemptNumber: 1, timestamp: '06 Oct 2026 · 10:45 AM', channel: 'WebSocket In-App', responseStatus: '200 OK', responseMessage: 'Delivered to active socket ID wss-084', status: 'Success' },
      ],
    },
    {
      id: 'DEL-904',
      recipient: 'contributor@docnexa.io',
      templateName: 'tpl_changes_requested',
      templateVersion: 'v1.2',
      channel: 'Email',
      state: 'Retrying',
      attempts: 2,
      maxAttempts: 5,
      lastError: '421 4.7.0 Temporary rate limit exceeded',
      timestamp: '06 Oct 2026 · 09:50 AM',
      attemptHistory: [
        { attemptNumber: 1, timestamp: '06 Oct 2026 · 09:45 AM', channel: 'SMTP Email', responseStatus: '421 4.7.0', responseMessage: 'Rate limit exceeded', status: 'Failure' },
        { attemptNumber: 2, timestamp: '06 Oct 2026 · 09:50 AM', channel: 'SMTP Email', responseStatus: '421 4.7.0', responseMessage: 'Rate limit exceeded', status: 'Failure' },
      ],
    },
  ];

  webhookLogs: WebhookDeliveryLog[] = [
    {
      id: 'WH-801',
      event: 'document.approved',
      endpointUrl: 'https://api.acme.com/webhooks/docnexa-ingest',
      httpStatus: '500 Internal Error',
      signatureStatus: 'HMAC SHA256 Valid',
      attempts: '3 / 5',
      idempotencyKey: 'ik_98412_01',
      finalFailure: 'Remote server returned HTTP 500: Database lock timeout',
      timestamp: '06 Oct 2026 · 11:40 AM',
    },
    {
      id: 'WH-802',
      event: 'intake.completed',
      endpointUrl: 'https://erp.acme.com/api/v1/document-listener',
      httpStatus: '200 OK',
      signatureStatus: 'HMAC SHA256 Valid',
      attempts: '1 / 5',
      idempotencyKey: 'ik_98412_02',
      finalFailure: '—',
      timestamp: '06 Oct 2026 · 10:12 AM',
    },
    {
      id: 'WH-803',
      event: 'sla.breached',
      endpointUrl: 'https://compliance.acme.com/hooks/sla',
      httpStatus: '200 OK',
      signatureStatus: 'HMAC SHA256 Valid',
      attempts: '1 / 5',
      idempotencyKey: 'ik_98412_03',
      finalFailure: '—',
      timestamp: '06 Oct 2026 · 08:30 AM',
    },
  ];

  get canAccessDeliveryTab(): boolean {
    const role = this.authService.currentUser()?.role;
    return role === 'org_admin' || role === 'platform_operator';
  }

  get filteredNotificationLogs(): NotificationDeliveryLog[] {
    if (this.deliveryFilterState === 'All') return this.notificationLogs;
    return this.notificationLogs.filter((log) => log.state === this.deliveryFilterState);
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: BeforeUnloadEvent): void {
    if (this.hasUnsavedChanges()) {
      $event.returnValue = 'You have unsaved administration setting changes.';
    }
  }

  @HostListener('document:keydown.escape', ['$event'])
  handleModalEscape(event: any): void {
    if (this.showAttemptHistoryModal) {
      event.preventDefault();
      this.closeAttemptHistory();
    }
  }


  ngOnInit(): void {
    this.loadAdminSettings();
  }

  loadAdminSettings(): void {
    this.isLoading.set(true);
    this.hasError.set(false);

    this.adminService.getSettings().subscribe({
      next: (settings) => {
        this.sessionTimeout = `${settings.sessionTimeoutMinutes} minutes`;
        this.retentionPeriod = `${settings.retentionDays} days`;
        this.isLoading.set(false);
      },
      error: () => {
        this.hasError.set(true);
        this.isLoading.set(false);
      },
    });
  }

  retryLoad(): void {
    this.loadAdminSettings();
  }

  markChanged(): void {
    this.hasUnsavedChanges.set(true);
  }

  setTab(tab: AdminTab): void {
    if (tab === 'delivery' && !this.canAccessDeliveryTab) {
      alert('Access Denied: Only Organization Admins and Platform Operators can access Notification Delivery.');
      return;
    }

    if (this.hasUnsavedChanges()) {
      const confirmSwitch = confirm('You have unsaved changes. Are you sure you want to switch tabs?');
      if (!confirmSwitch) return;
    }
    this.activeTab = tab;
  }

  get filteredUsers(): UserItem[] {
    const search = this.searchUser.trim().toLowerCase();

    return this.users.filter((user) => {
      const matchesSearch =
        !search ||
        user.name.toLowerCase().includes(search) ||
        user.email.toLowerCase().includes(search) ||
        user.department.toLowerCase().includes(search);

      const matchesRole =
        this.selectedUserRole === 'All Roles' ||
        user.role === this.selectedUserRole;

      const matchesStatus =
        this.selectedUserStatus === 'All Status' ||
        user.status === this.selectedUserStatus;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }

  get activeUsers(): number {
    return this.users.filter((user) => user.status === 'Active').length;
  }

  get connectedIntegrations(): number {
    return this.integrations.filter((integration) => integration.status === 'Connected').length;
  }

  saveSettings(): void {
    this.saveError.set(false);

    this.adminService.updateSettings({ sessionTimeoutMinutes: 15 }).subscribe({
      next: () => {
        this.hasUnsavedChanges.set(false);
        this.saveSuccessToast = 'Administration settings saved successfully.';
        setTimeout(() => {
          this.saveSuccessToast = null;
        }, 3000);
      },
      error: () => {
        this.saveError.set(true);
      },
    });
  }

  inviteUser(): void {
    alert('User invitation flow will be connected to the backend API.');
  }

  editUser(user: UserItem): void {
    alert(`User management for ${user.name} will be connected to the backend API.`);
  }

  configureDocumentType(documentType: DocumentTypeItem): void {
    alert(`${documentType.name} configuration will be connected to the document-type API.`);
  }

  configureIntegration(integration: IntegrationItem): void {
    alert(`${integration.name} configuration will be connected to the integration API.`);
  }

  toggleDocumentType(documentType: DocumentTypeItem): void {
    documentType.enabled = !documentType.enabled;
    this.markChanged();
  }

  clearUserFilters(): void {
    this.searchUser = '';
    this.selectedUserRole = 'All Roles';
    this.selectedUserStatus = 'All Status';
  }

  // --- NOTIFICATION DELIVERY ACTIONS ---
  openAttemptHistory(log: NotificationDeliveryLog): void {
    if (typeof document !== 'undefined') {
      this.previousActiveElement = document.activeElement as HTMLElement;
    }
    this.selectedDeliveryLog = log;
    this.showAttemptHistoryModal = true;
    this.isHistoryLoading.set(true);
    this.hasHistoryError.set(false);
    setTimeout(() => {
      this.isHistoryLoading.set(false);
    }, 300);
  }

  closeAttemptHistory(): void {
    this.showAttemptHistoryModal = false;
    this.selectedDeliveryLog = null;
    if (this.previousActiveElement && typeof this.previousActiveElement.focus === 'function') {
      this.previousActiveElement.focus();
    }
  }

  retryHistoryLoad(): void {
    this.isHistoryLoading.set(true);
    this.hasHistoryError.set(false);
    setTimeout(() => {
      this.isHistoryLoading.set(false);
    }, 400);
  }

  loadDeliveryLogs(): void {
    this.isDeliveryLoading.set(true);
    this.hasDeliveryError.set(false);
    setTimeout(() => {
      this.isDeliveryLoading.set(false);
    }, 400);
  }

  loadWebhookLogs(): void {
    this.isWebhookLoading.set(true);
    this.hasWebhookError.set(false);
    setTimeout(() => {
      this.isWebhookLoading.set(false);
    }, 400);
  }

  retryNotificationDelivery(log: NotificationDeliveryLog): void {
    const maxAttempts = log.maxAttempts ?? 5;
    if (log.state === 'Sent' || log.isRetrying || log.attempts >= maxAttempts) {
      return; // Idempotency guard & limit check
    }

    log.isRetrying = true;
    log.state = 'Retrying';
    log.attempts++;

    setTimeout(() => {
      log.isRetrying = false;
      log.state = 'Sent';
      log.lastError = '—';
      log.attemptHistory.push({
        attemptNumber: log.attempts,
        timestamp: 'Just now',
        channel: log.channel,
        responseStatus: '250 2.0.0 OK',
        responseMessage: 'Manual retry succeeded via SMTP relay',
        status: 'Success',
      });
    }, 1200);
  }

  resendWebhook(webhook: WebhookDeliveryLog): void {
    if (webhook.isResending) return;

    webhook.isResending = true;
    setTimeout(() => {
      webhook.isResending = false;
      webhook.httpStatus = '200 OK (Resent)';
      webhook.finalFailure = '—';
      this.testWebhookToast = `Resent webhook payload [${webhook.event}] to ${webhook.endpointUrl}`;
      setTimeout(() => {
        this.testWebhookToast = null;
      }, 3500);
    }, 800);
  }

  sendTestWebhook(): void {
    this.testWebhookToast = 'Test Webhook Payload sent successfully! Signature HMAC SHA256 verified (HTTP 200 OK).';
    setTimeout(() => {
      this.testWebhookToast = null;
    }, 3500);
  }
}