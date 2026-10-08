import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { LoadingState } from '../../shared/ui/loading-state/loading-state';
import { EmptyState } from '../../shared/ui/empty-state/empty-state';
import { ErrorState } from '../../shared/ui/error-state/error-state';
import { APPROVAL_SERVICE_TOKEN, MockApprovalService } from '../../core/services/api-services';

export interface ApprovalDocument {
  id: string;
  name: string;
  type: string;
  submittedBy: string;
  reviewedBy: string;
  submittedAt: string;
  priority: 'High' | 'Medium' | 'Low';
  documentValue: string;
  status: string;
  pages: number;
}

@Component({
  selector: 'app-approvals',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LoadingState, EmptyState, ErrorState],
  templateUrl: './approvals.html',
  styleUrl: './approvals.scss',
  providers: [{ provide: APPROVAL_SERVICE_TOKEN, useClass: MockApprovalService }],
})
export class Approvals implements OnInit {
  private readonly approvalService = inject(APPROVAL_SERVICE_TOKEN);

  searchTerm = '';
  selectedType = 'All Types';
  selectedPriority = 'All Priority';
  selectedStatus = 'All Status';

  isLoading = signal(true);
  hasError = signal(false);

  selectedDocument: ApprovalDocument | null = null;
  showActionPanel = false;
  actionType = '';
  actionComment = '';

  currentUserId = 'Abhishek Yadav';
  selectedRejectionReason = 'Arithmetic Discrepancy in Line-Items';
  rejectionReasons: string[] = [
    'Arithmetic Discrepancy in Line-Items',
    'Unsigned Vendor Contract / Missing Signature',
    'Expired PO Reference / Budget Cap Exceeded',
    'Missing Mandatory GSTIN / Tax ID Registration',
    'Disputed Legal Clause / Uncapped Liability',
    'Duplicate Document Submission',
  ];

  approvalDocuments: ApprovalDocument[] = [];

  ngOnInit(): void {
    this.loadApprovals();
  }

  loadApprovals(): void {
    this.isLoading.set(true);
    this.hasError.set(false);

    this.approvalService.getApprovals().subscribe({
      next: (items) => {
        this.approvalDocuments = items.map((i) => ({
          id: i.id,
          name: i.documentTitle,
          type: 'Supplier Contract',
          submittedBy: i.uploader,
          reviewedBy: 'Rahul Sharma',
          submittedAt: '06 Oct 2026 · 11:24 AM',
          priority: 'High',
          documentValue: `₹${i.amount.toLocaleString('en-IN')}`,
          status: i.status === 'Pending' ? 'Pending Approval' : i.status,
          pages: 18,
        }));
        this.isLoading.set(false);
      },
      error: () => {
        this.hasError.set(true);
        this.isLoading.set(false);
      },
    });
  }

  retryLoad(): void {
    this.loadApprovals();
  }

  isSelfSubmission(doc: ApprovalDocument): boolean {
    return doc.submittedBy === this.currentUserId;
  }

  get filteredDocuments(): ApprovalDocument[] {
    const search = this.searchTerm.trim().toLowerCase();

    return this.approvalDocuments.filter((document) => {
      const matchesSearch =
        !search ||
        document.name.toLowerCase().includes(search) ||
        document.id.toLowerCase().includes(search) ||
        document.submittedBy.toLowerCase().includes(search) ||
        document.reviewedBy.toLowerCase().includes(search);

      const matchesType =
        this.selectedType === 'All Types' ||
        document.type === this.selectedType;

      const matchesPriority =
        this.selectedPriority === 'All Priority' ||
        document.priority === this.selectedPriority;

      const matchesStatus =
        this.selectedStatus === 'All Status' ||
        document.status === this.selectedStatus;

      return (
        matchesSearch &&
        matchesType &&
        matchesPriority &&
        matchesStatus
      );
    });
  }

  get pendingCount(): number {
    return this.approvalDocuments.filter(
      (document) =>
        document.status === 'Pending Approval' ||
        document.status === 'In Approval',
    ).length;
  }

  get highPriorityCount(): number {
    return this.approvalDocuments.filter(
      (document) =>
        document.priority === 'High' &&
        document.status !== 'Approved',
    ).length;
  }

  get totalValue(): number {
    return this.approvalDocuments
      .filter(
        (document) =>
          document.status === 'Pending Approval' ||
          document.status === 'In Approval',
      )
      .reduce((total, document) => {
        const numericValue = Number(
          document.documentValue
            .replace(/₹/g, '')
            .replace(/,/g, ''),
        );

        return total + (isNaN(numericValue) ? 0 : numericValue);
      }, 0);
  }

  get formattedTotalValue(): string {
    return `₹${this.totalValue.toLocaleString('en-IN')}`;
  }

  get approvedCount(): number {
    return this.approvalDocuments.filter(
      (document) =>
        document.status === 'Approved',
    ).length;
  }

  openActionPanel(
    document: ApprovalDocument,
    action: string,
  ): void {
    this.selectedDocument = document;
    this.actionType = action;
    this.actionComment = '';
    this.showActionPanel = true;
  }

  closeActionPanel(): void {
    this.showActionPanel = false;
    this.selectedDocument = null;
    this.actionType = '';
    this.actionComment = '';
  }

  confirmAction(): void {
    if (!this.selectedDocument) {
      return;
    }

    if (
      this.actionType === 'Reject' &&
      !this.actionComment.trim()
    ) {
      return;
    }

    const document = this.approvalDocuments.find(
      (item) =>
        item.id === this.selectedDocument?.id,
    );

    if (!document) {
      return;
    }

    if (this.actionType === 'Approve') {
      document.status = 'Approved';
    }

    if (this.actionType === 'Reject') {
      document.status = 'Rejected';
    }

    this.closeActionPanel();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedType = 'All Types';
    this.selectedPriority = 'All Priority';
    this.selectedStatus = 'All Status';
  }
}