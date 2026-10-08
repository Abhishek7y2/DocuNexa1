import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Location } from '@angular/common';

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
  imports: [FormsModule, RouterLink],
  templateUrl: './document-detail.html',
  styleUrl: './document-detail.scss',
})
export class DocumentDetail implements OnInit {
  documentId = '';

  activeTab = 'overview';

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
    {
      label: 'Supplier Name',
      value: 'Acme Industries Pvt. Ltd.',
      confidence: '98%',
    },
    {
      label: 'Contract Number',
      value: 'AGR-2026-00841',
      confidence: '99%',
    },
    {
      label: 'Effective Date',
      value: '01 Oct 2026',
      confidence: '97%',
    },
    {
      label: 'Expiry Date',
      value: '30 Sep 2028',
      confidence: '96%',
    },
    {
      label: 'Contract Value',
      value: '₹48,50,000',
      confidence: '94%',
    },
    {
      label: 'Payment Terms',
      value: 'Net 30 Days',
      confidence: '98%',
    },
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
      changeSummary:
        'Updated payment terms and renewal clause.',
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
      changeSummary:
        'Updated supplier address and contract value.',
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
      changeSummary:
        'Initial document uploaded for processing.',
      isCurrent: false,
    },
  ];

  comparisonChanges: ComparisonChange[] = [
    {
      section: 'Commercial Terms',
      field: 'Payment Terms',
      oldValue: 'Net 45 Days',
      newValue: 'Net 30 Days',
      type: 'Modified',
    },
    {
      section: 'Commercial Terms',
      field: 'Contract Value',
      oldValue: '₹45,00,000',
      newValue: '₹48,50,000',
      type: 'Modified',
    },
    {
      section: 'Renewal',
      field: 'Renewal Period',
      oldValue: '12 months',
      newValue: '24 months',
      type: 'Modified',
    },
    {
      section: 'Supplier Information',
      field: 'Registered Address',
      oldValue: '—',
      newValue:
        'Plot 42, Industrial Area, New Delhi',
      type: 'Added',
    },
    {
      section: 'Termination',
      field: 'Notice Period',
      oldValue: '30 days',
      newValue: '60 days',
      type: 'Modified',
    },
    {
      section: 'Legal',
      field: 'Confidentiality Clause',
      oldValue:
        'Confidential information shall be protected.',
      newValue:
        'Confidential information shall be protected for 5 years after termination.',
      type: 'Modified',
    },
  ];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly location: Location,
  ) {}

  ngOnInit(): void {
    this.documentId =
      this.route.snapshot.paramMap.get('id') ||
      'DOC-10248';

    this.loadDocument(this.documentId);
  }

  private loadDocument(id: string): void {
    const mockDocuments: Record<
      string,
      Partial<DocumentDetailData>
    > = {
      'DOC-10248': {
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
      },

      'DOC-10247': {
        name: 'Purchase Invoice - INV-78421',
        type: 'Purchase Invoice',
        category: 'Invoice',
        status: 'Pending Review',
        owner: 'Rahul Sharma',
        updatedAt: '06 Oct 2026',
        uploadedAt: '06 Oct 2026',
        size: '1.8 MB',
        pages: 4,
        fileName: 'invoice-78421.pdf',
      },

      'DOC-10246': {
        name: 'Information Security Policy',
        type: 'Internal Policy',
        category: 'Policy',
        status: 'Approved',
        owner: 'Priya Mehta',
        updatedAt: '05 Oct 2026',
        uploadedAt: '03 Oct 2026',
        size: '3.1 MB',
        pages: 26,
        fileName: 'information-security-policy.pdf',
      },

      'DOC-10245': {
        name: 'Vendor Master Agreement',
        type: 'Supplier Contract',
        category: 'Contract',
        status: 'Under Review',
        owner: 'Abhishek Yadav',
        updatedAt: '05 Oct 2026',
        uploadedAt: '05 Oct 2026',
        size: '4.7 MB',
        pages: 32,
        fileName: 'vendor-master-agreement.pdf',
      },

      'DOC-10244': {
        name: 'Purchase Invoice - INV-78420',
        type: 'Purchase Invoice',
        category: 'Invoice',
        status: 'Processing',
        owner: 'Neha Verma',
        updatedAt: '04 Oct 2026',
        uploadedAt: '04 Oct 2026',
        size: '1.2 MB',
        pages: 3,
        fileName: 'invoice-78420.pdf',
      },

      'DOC-10243': {
        name: 'Employee Data Handling Policy',
        type: 'Internal Policy',
        category: 'Policy',
        status: 'Draft',
        owner: 'Abhishek Yadav',
        updatedAt: '03 Oct 2026',
        uploadedAt: '03 Oct 2026',
        size: '2.8 MB',
        pages: 14,
        fileName: 'employee-data-policy.pdf',
      },
    };

    const selectedDocument = mockDocuments[id];

    if (selectedDocument) {
      this.document = {
        ...this.document,
        ...selectedDocument,
        id,
      };
    }
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  goBack(): void {
    this.location.back();
  }

  toggleVersionHistory(): void {
    this.showVersionHistory =
      !this.showVersionHistory;
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
    alert(
      `${version.version} selected for restoration. This will be connected to the document API later.`,
    );
  }

  sendForReview(): void {
    alert(
      `${this.document.name} has been sent for review.`,
    );
  }

  downloadDocument(): void {
    alert(
      `Download will be connected to the document API for ${this.document.fileName}.`,
    );
  }

  saveExtraction(): void {
    alert(
      'Extraction changes saved successfully.',
    );
  }
}