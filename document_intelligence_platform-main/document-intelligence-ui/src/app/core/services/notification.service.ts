import { Injectable, signal, computed } from '@angular/core';

export type NotificationType =
  | 'receipt'
  | 'processing_exception'
  | 'review_assignment'
  | 'returned_for_changes'
  | 'approval_decision'
  | 'retention_expiry'
  | 'sla_breach';

export type NotificationCategory = 'tasks' | 'approvals' | 'failures' | 'expiry';

export interface NotificationItem {
  id: string;
  type: NotificationType;
  category: NotificationCategory;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  severity: 'info' | 'warning' | 'error' | 'success';
  targetUrl: string;
  entityId?: string;
}

export interface NotificationPreference {
  type: NotificationType;
  label: string;
  email: boolean;
  inApp: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  readonly isDrawerOpen = signal(false);

  readonly notifications = signal<NotificationItem[]>([
    {
      id: 'NOTIF-101',
      type: 'sla_breach',
      category: 'failures',
      title: 'SLA Warning Threshold Breach',
      message: 'DOC-10247 (INV-78421) requires review within 3.5 hours to avoid SLA breach.',
      timestamp: '10 min ago',
      read: false,
      severity: 'error',
      targetUrl: '/review/DOC-10247',
      entityId: 'DOC-10247',
    },
    {
      id: 'NOTIF-102',
      type: 'review_assignment',
      category: 'tasks',
      title: 'New Review Task Assigned',
      message: 'You have been assigned to verify OCR extractions for Supplier Master Agreement.',
      timestamp: '25 min ago',
      read: false,
      severity: 'info',
      targetUrl: '/review/DOC-10248',
      entityId: 'DOC-10248',
    },
    {
      id: 'NOTIF-103',
      type: 'approval_decision',
      category: 'approvals',
      title: 'Document Approved by Finance',
      message: 'Purchase Order PO-2026-9842 has been approved by Priya Mehta.',
      timestamp: '1 hour ago',
      read: false,
      severity: 'success',
      targetUrl: '/approvals',
      entityId: 'DOC-10245',
    },
    {
      id: 'NOTIF-104',
      type: 'processing_exception',
      category: 'failures',
      title: 'Low OCR Confidence Exception',
      message: 'Scanned receipt PDF Page 2 resolution is below 150 DPI threshold.',
      timestamp: '2 hours ago',
      read: true,
      severity: 'warning',
      targetUrl: '/intake',
      entityId: 'ERR-901',
    },
    {
      id: 'NOTIF-105',
      type: 'returned_for_changes',
      category: 'tasks',
      title: 'Changes Requested on Invoice',
      message: 'Rahul Sharma requested arithmetic reconciliation on invoice total.',
      timestamp: '3 hours ago',
      read: false,
      severity: 'warning',
      targetUrl: '/review/DOC-10247',
      entityId: 'DOC-10247',
    },
    {
      id: 'NOTIF-106',
      type: 'retention_expiry',
      category: 'expiry',
      title: 'Retention Schedule Expiry Alert',
      message: 'Vendor agreement DOC-09812 is scheduled for automatic purge in 14 days.',
      timestamp: '1 day ago',
      read: true,
      severity: 'info',
      targetUrl: '/documents/DOC-10248',
      entityId: 'DOC-09812',
    },
    {
      id: 'NOTIF-107',
      type: 'receipt',
      category: 'tasks',
      title: 'Document Batch Ingested',
      message: 'Batch upload of 4 invoices completed with 98.4% average OCR confidence.',
      timestamp: '1 day ago',
      read: true,
      severity: 'success',
      targetUrl: '/documents',
      entityId: 'BAT-2026-04',
    },
  ]);

  readonly preferences = signal<NotificationPreference[]>([
    { type: 'receipt', label: 'Document Intake Receipt', email: true, inApp: true },
    { type: 'processing_exception', label: 'OCR & Processing Exceptions', email: true, inApp: true },
    { type: 'review_assignment', label: 'Review Task Assignments', email: true, inApp: true },
    { type: 'returned_for_changes', label: 'Returned for Changes', email: true, inApp: true },
    { type: 'approval_decision', label: 'Approval & Rejection Decisions', email: true, inApp: true },
    { type: 'retention_expiry', label: 'Retention Policy Expiry Alerts', email: false, inApp: true },
    { type: 'sla_breach', label: 'SLA Breach Warnings', email: true, inApp: true },
  ]);

  readonly unreadCount = computed(() => {
    return this.notifications().filter((item) => !item.read).length;
  });

  toggleDrawer(): void {
    this.isDrawerOpen.set(!this.isDrawerOpen());
  }

  openDrawer(): void {
    this.isDrawerOpen.set(true);
  }

  closeDrawer(): void {
    this.isDrawerOpen.set(false);
  }

  markAsRead(id: string): void {
    this.notifications.update((list) =>
      list.map((item) => (item.id === id ? { ...item, read: true } : item)),
    );
  }

  markAllAsRead(): void {
    this.notifications.update((list) =>
      list.map((item) => ({ ...item, read: true })),
    );
  }

  toggleRead(id: string): void {
    this.notifications.update((list) =>
      list.map((item) => (item.id === id ? { ...item, read: !item.read } : item)),
    );
  }

  updatePreferences(prefList: NotificationPreference[]): void {
    this.preferences.set(prefList);
  }

  toggleEmailPref(type: NotificationType): void {
    this.preferences.update((list) =>
      list.map((p) => (p.type === type ? { ...p, email: !p.email } : p)),
    );
  }

  toggleInAppPref(type: NotificationType): void {
    this.preferences.update((list) =>
      list.map((p) => (p.type === type ? { ...p, inApp: !p.inApp } : p)),
    );
  }
}
