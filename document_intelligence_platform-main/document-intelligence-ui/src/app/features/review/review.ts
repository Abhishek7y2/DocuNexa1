import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface ReviewDocument {
  id: string;
  name: string;
  type: string;
  owner: string;
  submittedAt: string;
  priority: 'High' | 'Medium' | 'Low';
  confidence: number;
  status:
    | 'Pending Review'
    | 'In Review'
    | 'Changes Requested'
    | 'Approved';
  pages: number;
}

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './review.html',
  styleUrl: './review.scss',
})
export class Review {
  searchTerm = '';
  selectedType = 'All Types';
  selectedPriority = 'All Priority';
  selectedStatus = 'All Status';
  activeTab: 'all' | 'pending' | 'high' | 'low-confidence' | 'approved' = 'all';

  selectedDocument: ReviewDocument | null = null;

  showActionPanel = false;
  actionType = '';
  actionComment = '';
  reviewerName = 'Abhishek Yadav';
  reviewerRole = 'Senior Verification Lead';

  reviewDocuments: ReviewDocument[] = [
    {
      id: 'DOC-10247',
      name: 'Purchase Invoice - INV-78421',
      type: 'Purchase Invoice',
      owner: 'Rahul Sharma',
      submittedAt: '06 Oct 2026 · 09:18 AM',
      priority: 'High',
      confidence: 91,
      status: 'Pending Review',
      pages: 4,
    },
    {
      id: 'DOC-10245',
      name: 'Vendor Master Agreement',
      type: 'Supplier Contract',
      owner: 'Abhishek Yadav',
      submittedAt: '05 Oct 2026 · 03:42 PM',
      priority: 'High',
      confidence: 87,
      status: 'In Review',
      pages: 32,
    },
    {
      id: 'DOC-10243',
      name: 'Employee Data Handling Policy',
      type: 'Internal Policy',
      owner: 'Abhishek Yadav',
      submittedAt: '05 Oct 2026 · 11:26 AM',
      priority: 'Medium',
      confidence: 95,
      status: 'Pending Review',
      pages: 14,
    },
    {
      id: 'DOC-10241',
      name: 'Purchase Invoice - INV-78415',
      type: 'Purchase Invoice',
      owner: 'Neha Verma',
      submittedAt: '04 Oct 2026 · 05:14 PM',
      priority: 'Medium',
      confidence: 89,
      status: 'Pending Review',
      pages: 3,
    },
    {
      id: 'DOC-10239',
      name: 'Technology Services Agreement',
      type: 'Supplier Contract',
      owner: 'Rahul Sharma',
      submittedAt: '04 Oct 2026 · 01:08 PM',
      priority: 'Low',
      confidence: 97,
      status: 'Changes Requested',
      pages: 21,
    },
    {
      id: 'DOC-10236',
      name: 'Information Security Policy',
      type: 'Internal Policy',
      owner: 'Priya Mehta',
      submittedAt: '03 Oct 2026 · 10:42 AM',
      priority: 'Low',
      confidence: 98,
      status: 'Pending Review',
      pages: 26,
    },
    {
      id: 'DOC-10232',
      name: 'Q3 Financial Audit Summary',
      type: 'Financial Report',
      owner: 'Arjun Kapoor',
      submittedAt: '03 Oct 2026 · 08:30 AM',
      priority: 'High',
      confidence: 84,
      status: 'Pending Review',
      pages: 18,
    },
    {
      id: 'DOC-10228',
      name: 'SaaS SLA Agreement - Enterprise',
      type: 'Supplier Contract',
      owner: 'Karan Malhotra',
      submittedAt: '02 Oct 2026 · 04:15 PM',
      priority: 'Medium',
      confidence: 99,
      status: 'Approved',
      pages: 12,
    }
  ];

  get filteredDocuments(): ReviewDocument[] {
    const search = this.searchTerm.trim().toLowerCase();

    return this.reviewDocuments.filter((document) => {
      const matchesSearch =
        !search ||
        document.name.toLowerCase().includes(search) ||
        document.id.toLowerCase().includes(search) ||
        document.owner.toLowerCase().includes(search);

      const matchesType =
        this.selectedType === 'All Types' ||
        document.type === this.selectedType;

      const matchesPriority =
        this.selectedPriority === 'All Priority' ||
        document.priority === this.selectedPriority;

      const matchesStatus =
        this.selectedStatus === 'All Status' ||
        document.status === this.selectedStatus;

      let matchesTab = true;
      if (this.activeTab === 'pending') {
        matchesTab = document.status === 'Pending Review' || document.status === 'In Review';
      } else if (this.activeTab === 'high') {
        matchesTab = document.priority === 'High';
      } else if (this.activeTab === 'low-confidence') {
        matchesTab = document.confidence < 90;
      } else if (this.activeTab === 'approved') {
        matchesTab = document.status === 'Approved';
      }

      return (
        matchesSearch &&
        matchesType &&
        matchesPriority &&
        matchesStatus &&
        matchesTab
      );
    });
  }

  get totalCount(): number {
    return this.reviewDocuments.length;
  }

  get pendingCount(): number {
    return this.reviewDocuments.filter(
      (document) =>
        document.status === 'Pending Review' || document.status === 'In Review',
    ).length;
  }

  get highPriorityCount(): number {
    return this.reviewDocuments.filter(
      (document) =>
        document.priority === 'High',
    ).length;
  }

  get lowConfidenceCount(): number {
    return this.reviewDocuments.filter(
      (document) =>
        document.confidence < 90,
    ).length;
  }

  get approvedCount(): number {
    return this.reviewDocuments.filter(
      (document) =>
        document.status === 'Approved',
    ).length;
  }

  setTab(tab: 'all' | 'pending' | 'high' | 'low-confidence' | 'approved'): void {
    this.activeTab = tab;
  }

  openActionPanel(
    document: ReviewDocument,
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
      this.actionType === 'Request Changes' &&
      !this.actionComment.trim()
    ) {
      return;
    }

    const document = this.reviewDocuments.find(
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
      document.status = 'Changes Requested';
    }

    if (this.actionType === 'Request Changes') {
      document.status = 'Changes Requested';
    }

    this.closeActionPanel();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedType = 'All Types';
    this.selectedPriority = 'All Priority';
    this.selectedStatus = 'All Status';
    this.activeTab = 'all';
  }
}
