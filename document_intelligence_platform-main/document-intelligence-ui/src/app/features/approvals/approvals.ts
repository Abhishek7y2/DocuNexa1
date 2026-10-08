import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface ApprovalDocument {
  id: string;
  name: string;
  type: string;
  submittedBy: string;
  reviewedBy: string;
  submittedAt: string;
  priority: 'High' | 'Medium' | 'Low';
  documentValue: string;
  status:
    | 'Pending Approval'
    | 'In Approval'
    | 'Approved'
    | 'Rejected';
  pages: number;
}

@Component({
  selector: 'app-approvals',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './approvals.html',
  styleUrl: './approvals.scss',
})
export class Approvals {
  searchTerm = '';
  selectedType = 'All Types';
  selectedPriority = 'All Priority';
  selectedStatus = 'All Status';

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

  isSelfSubmission(doc: ApprovalDocument): boolean {
    return doc.submittedBy === this.currentUserId;
  }

  approvalDocuments: ApprovalDocument[] = [
    {
      id: 'DOC-10245',
      name: 'Vendor Master Agreement',
      type: 'Supplier Contract',
      submittedBy: 'Abhishek Yadav',
      reviewedBy: 'Rahul Sharma',
      submittedAt: '06 Oct 2026 · 11:24 AM',
      priority: 'High',
      documentValue: '₹72,50,000',
      status: 'Pending Approval',
      pages: 32,
    },
    {
      id: 'DOC-10242',
      name: 'Annual Software License Agreement',
      type: 'Supplier Contract',
      submittedBy: 'Priya Mehta',
      reviewedBy: 'Rahul Sharma',
      submittedAt: '05 Oct 2026 · 04:18 PM',
      priority: 'High',
      documentValue: '₹24,80,000',
      status: 'Pending Approval',
      pages: 18,
    },
    {
      id: 'DOC-10240',
      name: 'Purchase Invoice - INV-78416',
      type: 'Purchase Invoice',
      submittedBy: 'Neha Verma',
      reviewedBy: 'Abhishek Yadav',
      submittedAt: '05 Oct 2026 · 01:32 PM',
      priority: 'Medium',
      documentValue: '₹8,45,000',
      status: 'In Approval',
      pages: 5,
    },
    {
      id: 'DOC-10237',
      name: 'Cloud Infrastructure Contract',
      type: 'Supplier Contract',
      submittedBy: 'Rahul Sharma',
      reviewedBy: 'Priya Mehta',
      submittedAt: '04 Oct 2026 · 03:48 PM',
      priority: 'Medium',
      documentValue: '₹15,20,000',
      status: 'Pending Approval',
      pages: 27,
    },
    {
      id: 'DOC-10235',
      name: 'Employee Benefits Policy',
      type: 'Internal Policy',
      submittedBy: 'Abhishek Yadav',
      reviewedBy: 'Priya Mehta',
      submittedAt: '03 Oct 2026 · 12:15 PM',
      priority: 'Low',
      documentValue: '—',
      status: 'Pending Approval',
      pages: 16,
    },
    {
      id: 'DOC-10231',
      name: 'Security Compliance Agreement',
      type: 'Supplier Contract',
      submittedBy: 'Rahul Sharma',
      reviewedBy: 'Abhishek Yadav',
      submittedAt: '02 Oct 2026 · 10:26 AM',
      priority: 'Low',
      documentValue: '₹6,75,000',
      status: 'Approved',
      pages: 22,
    },
  ];

  get filteredDocuments(): ApprovalDocument[] {
    const search = this.searchTerm.trim().toLowerCase();

    return this.approvalDocuments.filter((document) => {
      const matchesSearch =
        !search ||
        document.name.toLowerCase().includes(search) ||
        document.id.toLowerCase().includes(search) ||
        document.submittedBy
          .toLowerCase()
          .includes(search) ||
        document.reviewedBy
          .toLowerCase()
          .includes(search);

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