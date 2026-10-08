import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { LoadingState } from '../../shared/ui/loading-state/loading-state';
import { ErrorState, ErrorVariant } from '../../shared/ui/error-state/error-state';
import { DOCUMENT_SERVICE_TOKEN, MockDocumentService } from '../../core/services/api-services';

interface DocumentDetailData {
  id: string;
  name: string;
  type: string;
  category: string;
  status: string;
  owner: string;
  updatedAt: string;
  uploadedAt: string;
  size: string;
  pages: number;
  fileName: string;
}

interface DocumentVersion {
  version: string;
  date: string;
  time: string;
  uploadedBy: string;
  size: string;
  pages: number;
  status: string;
  changeSummary: string;
  isCurrent: boolean;
}

interface ComparisonChange {
  section: string;
  field: string;
  oldValue: string;
  newValue: string;
  type: 'Added' | 'Removed' | 'Modified';
}

@Component({
  selector: 'app-document-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    LoadingState,
    ErrorState,
  ],
  templateUrl: './document-detail.html',
  styleUrl: './document-detail.scss',
  providers: [{ provide: DOCUMENT_SERVICE_TOKEN, useClass: MockDocumentService }],
})
export class DocumentDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly location = inject(Location);
  private readonly documentService = inject(DOCUMENT_SERVICE_TOKEN);

  documentId = '';
  activeTab = 'overview';

  isLoading = signal(true);
  hasError = signal(false);
  errorVariant = signal<ErrorVariant>('default');

  showVersionHistory = false;
  showComparison = false;

  selectedVersion = '';
  compareFromVersion = 'v1.0';
  compareToVersion = 'v3.0';

  document: DocumentDetailData = {
    id: 'DOC-10248',
    name: 'Supplier Agreement - Acme Industries',
    type: 'Supplier Contract',
    category: 'Contract',
    status: 'Approved',
    owner: 'Abhishek Yadav',
    updatedAt: '06 Oct 2026',
    uploadedAt: '04 Oct 2026',
    size: '2.4 MB',
    pages: 18,
    fileName: 'supplier-agreement.pdf',
  };

  extractedFields = [
    { label: 'Supplier Name', value: 'Acme Industries Pvt. Ltd.', confidence: '98%' },
    { label: 'Contract Number', value: 'AGR-2026-00841', confidence: '99%' },
    { label: 'Effective Date', value: '01 Oct 2026', confidence: '97%' },
    { label: 'Expiry Date', value: '30 Sep 2028', confidence: '96%' },
    { label: 'Contract Value', value: '₹48,50,000', confidence: '94%' },
    { label: 'Payment Terms', value: 'Net 30 Days', confidence: '98%' },
  ];

  versions: DocumentVersion[] = [
    {
      version: 'v3.0',
      date: '06 Oct 2026',
      time: '11:42 AM',
      uploadedBy: 'Abhishek Yadav',
      size: '2.4 MB',
      pages: 18,
      status: 'Current',
      changeSummary: 'Updated payment terms and renewal clause.',
      isCurrent: true,
    },
    {
      version: 'v2.0',
      date: '05 Oct 2026',
      time: '04:18 PM',
      uploadedBy: 'Rahul Sharma',
      size: '2.3 MB',
      pages: 18,
      status: 'Approved',
      changeSummary: 'Updated supplier address and contract value.',
      isCurrent: false,
    },
    {
      version: 'v1.0',
      date: '04 Oct 2026',
      time: '09:26 AM',
      uploadedBy: 'Abhishek Yadav',
      size: '2.1 MB',
      pages: 17,
      status: 'Original',
      changeSummary: 'Initial document uploaded for processing.',
      isCurrent: false,
    },
  ];

  comparisonChanges: ComparisonChange[] = [
    { section: 'Commercial Terms', field: 'Payment Terms', oldValue: 'Net 45 Days', newValue: 'Net 30 Days', type: 'Modified' },
    { section: 'Commercial Terms', field: 'Contract Value', oldValue: '₹45,00,000', newValue: '₹48,50,000', type: 'Modified' },
    { section: 'Renewal', field: 'Renewal Period', oldValue: '12 months', newValue: '24 months', type: 'Modified' },
    { section: 'Supplier Information', field: 'Registered Address', oldValue: '—', newValue: 'Plot 42, Industrial Area, New Delhi', type: 'Added' },
    { section: 'Termination', field: 'Notice Period', oldValue: '30 days', newValue: '60 days', type: 'Modified' },
    { section: 'Legal', field: 'Confidentiality Clause', oldValue: 'Confidential information shall be protected.', newValue: 'Confidential information shall be protected for 5 years after termination.', type: 'Modified' },
  ];

  ngOnInit(): void {
    this.documentId = this.route.snapshot.paramMap.get('id') || 'DOC-10248';
    this.loadDocumentData();
  }

  loadDocumentData(): void {
    this.isLoading.set(true);
    this.hasError.set(false);

    // Check specific URL query flags for testing 404 / purged states
    const statusParam = this.route.snapshot.queryParamMap.get('status');
    if (this.documentId === 'purged' || statusParam === 'purged') {
      setTimeout(() => {
        this.errorVariant.set('deleted-or-purged');
        this.hasError.set(true);
        this.isLoading.set(false);
      }, 300);
      return;
    }

    if (this.documentId === '404' || statusParam === '404') {
      setTimeout(() => {
        this.errorVariant.set('not-found');
        this.hasError.set(true);
        this.isLoading.set(false);
      }, 300);
      return;
    }

    this.documentService.getDocumentById(this.documentId).subscribe({
      next: (doc) => {
        if (!doc) {
          this.errorVariant.set('not-found');
          this.hasError.set(true);
        } else {
          this.document = {
            id: doc.id,
            name: doc.name,
            type: doc.type,
            category: doc.type.includes('Invoice') ? 'Invoice' : doc.type.includes('Policy') ? 'Policy' : 'Contract',
            status: doc.status,
            owner: doc.owner,
            updatedAt: doc.updatedAt,
            uploadedAt: '04 Oct 2026',
            size: doc.size,
            pages: doc.pages,
            fileName: `${doc.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.pdf`,
          };
        }
        this.isLoading.set(false);
      },
      error: () => {
        this.errorVariant.set('default');
        this.hasError.set(true);
        this.isLoading.set(false);
      },
    });
  }

  retryLoad(): void {
    this.loadDocumentData();
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  goBack(): void {
    this.location.back();
  }

  toggleVersionHistory(): void {
    this.showVersionHistory = !this.showVersionHistory;
  }

  openComparison(): void {
    this.showVersionHistory = false;
    this.showComparison = true;
  }

  closeComparison(): void {
    this.showComparison = false;
  }

  selectVersion(version: string): void {
    this.selectedVersion = version;
  }

  restoreVersion(version: DocumentVersion): void {
    alert(`${version.version} selected for restoration.`);
  }

  sendForReview(): void {
    alert(`${this.document.name} has been sent for review.`);
  }

  downloadDocument(): void {
    alert(`Downloading ${this.document.fileName}...`);
  }

  saveExtraction(): void {
    alert('Extraction changes saved successfully.');
  }
}