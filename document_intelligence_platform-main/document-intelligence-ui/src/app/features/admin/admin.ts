import { Component, OnInit, HostListener, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LoadingState } from '../../shared/ui/loading-state/loading-state';
import { ErrorState } from '../../shared/ui/error-state/error-state';
import { ADMIN_SERVICE_TOKEN, MockAdminService } from '../../core/services/api-services';

type AdminTab =
  | 'overview'
  | 'users'
  | 'documents'
  | 'workflow'
  | 'retention'
  | 'security'
  | 'integrations';

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

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingState, ErrorState],
  templateUrl: './admin.html',
  styleUrl: './admin.scss',
  providers: [{ provide: ADMIN_SERVICE_TOKEN, useClass: MockAdminService }],
})
export class Admin implements OnInit {
  private readonly adminService = inject(ADMIN_SERVICE_TOKEN);

  activeTab: AdminTab = 'overview';
  organizationName = 'Acme Corporation';
  organizationStatus = 'Active';
  organizationPlan = 'Enterprise';

  isLoading = signal(true);
  hasError = signal(false);
  saveError = signal(false);
  hasUnsavedChanges = signal(false);
  saveSuccessToast: string | null = null;

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

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: BeforeUnloadEvent): void {
    if (this.hasUnsavedChanges()) {
      $event.returnValue = 'You have unsaved administration setting changes.';
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
}