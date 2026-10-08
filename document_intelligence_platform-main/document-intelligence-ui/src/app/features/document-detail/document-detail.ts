import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { LoadingState } from '../../shared/ui/loading-state/loading-state';
import { ErrorState, ErrorVariant } from '../../shared/ui/error-state/error-state';
import { StatusBadge } from '../../shared/ui/status-badge/status-badge';
import { DOCUMENT_SERVICE_TOKEN, MockDocumentService } from '../../core/services/api-services';

export interface DocumentDetailData {
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
  signedUrl?: string;
  signedUrlExpiry?: string;
}

export interface DocumentVersion {
  version: string;
  date: string;
  time: string;
  uploadedBy: string;
  size: string;
  pages: number;
  status: 'Received' | 'Processing' | 'Review' | 'Approved/Published' | 'Superseded';
  changeSummary: string;
  isCurrent: boolean;
}

export interface CommentItem {
  id: string;
  author: string;
  avatar: string;
  role: string;
  timestamp: string;
  text: string;
}

@Component({
  selector: 'app-document-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LoadingState,
    ErrorState,
    StatusBadge,
  ],
  templateUrl: './document-detail.html',
  styleUrl: './document-detail.scss',
  providers: [{ provide: DOCUMENT_SERVICE_TOKEN, useClass: MockDocumentService }],
})
export class DocumentDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  private readonly documentService = inject(DOCUMENT_SERVICE_TOKEN);

  documentId = '';
  activeTab = 'overview';

  isLoading = signal(true);
  hasError = signal(false);
  errorVariant = signal<ErrorVariant>('default');

  // Read-only historical version viewer state
  selectedHistoricalVersion: DocumentVersion | null = null;
  isHistoricalReadOnlyModalOpen = false;

  // Clarifications / Comments Drawer
  isCommentsDrawerOpen = false;
  commentText = '';
  comments: CommentItem[] = [
    {
      id: 'COM-1',
      author: 'Rahul Sharma',
      avatar: 'RS',
      role: 'Uploader',
      timestamp: '04 Oct 2026 · 10:15 AM',
      text: 'Original contract scan uploaded for vendor onboard approval.',
    },
    {
      id: 'COM-2',
      author: 'Abhishek Yadav',
      avatar: 'AY',
      role: 'Reviewer',
      timestamp: '06 Oct 2026 · 11:45 AM',
      text: 'Verified line item rates against PO #PO-2026-9842.',
    },
  ];

  toastMessage: string | null = null;

  document: DocumentDetailData = {
    id: 'DOC-10248',
    name: 'Supplier Agreement - Acme Industries',
    type: 'Supplier Contract',
    category: 'Contract',
    status: 'Approved/Published',
    owner: 'Abhishek Yadav',
    updatedAt: '06 Oct 2026',
    uploadedAt: '04 Oct 2026',
    size: '2.4 MB',
    pages: 18,
    fileName: 'supplier-agreement.pdf',
  };

  extractedFields = [
    { label: 'Supplier Name', value: 'Acme Industries Pvt. Ltd.', confidence: '98%', isRestricted: false },
    { label: 'Contract Number', value: 'AGR-2026-00841', confidence: '99%', isRestricted: false },
    { label: 'Effective Date', value: '01 Oct 2026', confidence: '97%', isRestricted: false },
    { label: 'Expiry Date', value: '30 Sep 2028', confidence: '96%', isRestricted: false },
    { label: 'Contract Value', value: '₹48,50,000', confidence: '94%', isRestricted: false },
    { label: 'Executive Bonus Schedule', value: '[RESTRICTED FIELD - MASKED BY POLICY]', confidence: '90%', isRestricted: true },
  ];

  // VERTICAL VERSION TIMELINE (BRD SECTION 10.1 - TASK 7C Item 2)
  versions: DocumentVersion[] = [
    {
      version: 'v3.0',
      date: '06 Oct 2026',
      time: '11:42 AM',
      uploadedBy: 'Abhishek Yadav',
      size: '2.4 MB',
      pages: 18,
      status: 'Approved/Published',
      changeSummary: 'Updated payment terms and renewal penalty clause.',
      isCurrent: true,
    },
    {
      version: 'v2.0',
      date: '05 Oct 2026',
      time: '04:18 PM',
      uploadedBy: 'Rahul Sharma',
      size: '2.3 MB',
      pages: 18,
      status: 'Superseded',
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
      status: 'Received',
      changeSummary: 'Initial document uploaded for processing.',
      isCurrent: false,
    },
  ];

  ngOnInit(): void {
    const paramId = this.route.snapshot.paramMap.get('id');
    if (paramId) {
      this.documentId = paramId;
    } else {
      this.documentId = 'DOC-10248';
    }
    this.loadDocumentData();
  }

  loadDocumentData(): void {
    this.isLoading.set(true);
    this.hasError.set(false);

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
            status: doc.status === 'Approved' ? 'Approved/Published' : doc.status,
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

  // TASK 7C Item 1: Navigate to Compare Studio (/compare)
  navigateToCompare(): void {
    this.router.navigate(['/compare'], { queryParams: { doc1: this.documentId, doc2: 'DOC-10246' } });
  }

  // TASK 7C Item 2: Historical Version Read-only View
  openHistoricalVersionReadOnly(ver: DocumentVersion): void {
    this.selectedHistoricalVersion = ver;
    this.isHistoricalReadOnlyModalOpen = true;
  }

  // TASK 7C Item 4: Download via Signed URL & Export
  downloadViaSignedUrl(): void {
    const expTime = new Date(Date.now() + 15 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    this.document.signedUrl = `https://storage.docintel.internal/signed-url/${this.document.id}-v3.0.pdf?expires=${Date.now() + 900000}`;
    this.document.signedUrlExpiry = `Expires at ${expTime} (15 mins TTL)`;
    this.showToast(`Generated temporary signed URL! ${this.document.signedUrlExpiry}`);
  }

  exportMetadataWithMasking(): void {
    this.showToast('Exporting document metadata (Masking rules applied for confidential fields)...');
  }

  addComment(): void {
    if (!this.commentText.trim()) return;
    this.comments.unshift({
      id: `COM-${Date.now()}`,
      author: 'Abhishek Yadav',
      avatar: 'AY',
      role: 'Reviewer',
      timestamp: 'Just now',
      text: this.commentText,
    });
    this.commentText = '';
    this.showToast('Posted comment to document discussion thread');
  }

  showToast(msg: string): void {
    this.toastMessage = msg;
    setTimeout(() => {
      if (this.toastMessage === msg) this.toastMessage = null;
    }, 4000);
  }

  goBack(): void {
    this.location.back();
  }
}