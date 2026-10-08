import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { LoadingState } from '../../shared/ui/loading-state/loading-state';
import { EmptyState } from '../../shared/ui/empty-state/empty-state';
import { ErrorState } from '../../shared/ui/error-state/error-state';

export interface DocumentItem {
  id: string;
  name: string;
  type: string;
  category: string;
  status: string;
  owner: string;
  ownerInitials: string;
  updatedAt: string;
  size: string;
  pages: number;
  confidence: number;
  extractedMetadata: string[];
}

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    LoadingState,
    EmptyState,
    ErrorState,
  ],
  templateUrl: './documents.html',
  styleUrl: './documents.scss',
})
export class Documents {
  searchTerm = '';
  selectedType = 'All Types';
  selectedStatus = 'All Status';
  selectedCategory = 'All Documents';
  viewMode: 'grid' | 'table' = 'grid';

  isLoading = false;
  hasError = false;

  categoryTabs = [
    'All Documents',
    'Supplier Contract',
    'Purchase Invoice',
    'Internal Policy',
    'Compliance Report',
  ];

  documents: DocumentItem[] = [
    {
      id: 'DOC-10248',
      name: 'Supplier Agreement - Acme Industries',
      type: 'Supplier Contract',
      category: 'Contract',
      status: 'Approved',
      owner: 'Abhishek Yadav',
      ownerInitials: 'AY',
      updatedAt: '06 Oct 2026',
      size: '2.4 MB',
      pages: 18,
      confidence: 98.4,
      extractedMetadata: ['Vendor: Acme Corp', 'Val: ₹12,50,000', 'Term: 3 Years'],
    },
    {
      id: 'DOC-10247',
      name: 'Purchase Invoice - INV-78421',
      type: 'Purchase Invoice',
      category: 'Invoice',
      status: 'Pending Review',
      owner: 'Rahul Sharma',
      ownerInitials: 'RS',
      updatedAt: '06 Oct 2026',
      size: '1.8 MB',
      pages: 4,
      confidence: 86.2,
      extractedMetadata: ['Inv #: 78421', 'Amt: ₹4,50,000', 'Due: 15 Oct'],
    },
    {
      id: 'DOC-10246',
      name: 'Information Security Policy v4',
      type: 'Internal Policy',
      category: 'Policy',
      status: 'Approved',
      owner: 'Priya Mehta',
      ownerInitials: 'PM',
      updatedAt: '05 Oct 2026',
      size: '3.1 MB',
      pages: 24,
      confidence: 99.1,
      extractedMetadata: ['Scope: Enterprise', 'Ver: 4.2', 'Audited: Yes'],
    },
    {
      id: 'DOC-10245',
      name: 'Vendor Master Agreement 2026',
      type: 'Supplier Contract',
      category: 'Contract',
      status: 'Under Review',
      owner: 'Abhishek Yadav',
      ownerInitials: 'AY',
      updatedAt: '05 Oct 2026',
      size: '4.7 MB',
      pages: 32,
      confidence: 87.5,
      extractedMetadata: ['Vendor: TechCorp', 'Val: ₹45,00,000', 'HITL Required'],
    },
    {
      id: 'DOC-10244',
      name: 'Purchase Invoice - INV-78420',
      type: 'Purchase Invoice',
      category: 'Invoice',
      status: 'Processing',
      owner: 'Neha Verma',
      ownerInitials: 'NV',
      updatedAt: '04 Oct 2026',
      size: '1.2 MB',
      pages: 2,
      confidence: 74.0,
      extractedMetadata: ['Inv #: 78420', 'Amt: ₹1,80,000', 'OCR Ingestion'],
    },
    {
      id: 'DOC-10243',
      name: 'Employee Data Handling Policy',
      type: 'Internal Policy',
      category: 'Policy',
      status: 'Draft',
      owner: 'Abhishek Yadav',
      ownerInitials: 'AY',
      updatedAt: '03 Oct 2026',
      size: '2.8 MB',
      pages: 14,
      confidence: 95.0,
      extractedMetadata: ['Dept: HR', 'GDPR: Compliant', 'Status: Draft'],
    },
    {
      id: 'DOC-10242',
      name: 'Q3 Financial Audit Compliance',
      type: 'Compliance Report',
      category: 'Compliance',
      status: 'Approved',
      owner: 'Arjun Kapoor',
      ownerInitials: 'AK',
      updatedAt: '02 Oct 2026',
      size: '5.2 MB',
      pages: 42,
      confidence: 97.8,
      extractedMetadata: ['Audit: Q3 2026', 'Score: 98/100', 'ISO 27001'],
    },
    {
      id: 'DOC-10241',
      name: 'Logistics SLA & Carrier Agreement',
      type: 'Supplier Contract',
      category: 'Contract',
      status: 'Approved',
      owner: 'Karan Malhotra',
      ownerInitials: 'KM',
      updatedAt: '01 Oct 2026',
      size: '3.6 MB',
      pages: 22,
      confidence: 96.5,
      extractedMetadata: ['Carrier: BlueDart', 'SLA: 99.2%', 'Val: ₹8,00,000'],
    },
  ];

  constructor() {
    this.loadDocuments();
  }

  get filteredDocuments(): DocumentItem[] {
    const search = this.searchTerm.trim().toLowerCase();

    return this.documents.filter((doc) => {
      const matchesSearch =
        !search ||
        doc.name.toLowerCase().includes(search) ||
        doc.id.toLowerCase().includes(search) ||
        doc.owner.toLowerCase().includes(search) ||
        doc.type.toLowerCase().includes(search);

      const matchesType =
        this.selectedType === 'All Types' ||
        doc.type === this.selectedType;

      const matchesStatus =
        this.selectedStatus === 'All Status' ||
        doc.status === this.selectedStatus;

      const matchesCategory =
        this.selectedCategory === 'All Documents' ||
        doc.type === this.selectedCategory;

      return matchesSearch && matchesType && matchesStatus && matchesCategory;
    });
  }

  loadDocuments(): void {
    this.isLoading = true;
    this.hasError = false;

    setTimeout(() => {
      this.isLoading = false;
    }, 600);
  }

  retryLoad(): void {
    this.loadDocuments();
  }

  setCategoryTab(category: string): void {
    this.selectedCategory = category;
  }

  setViewMode(mode: 'grid' | 'table'): void {
    this.viewMode = mode;
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedType = 'All Types';
    this.selectedStatus = 'All Status';
    this.selectedCategory = 'All Documents';
  }

  showExportModal = false;
  exportFormat: 'CSV' | 'JSON' | 'PDF' = 'CSV';
  maskPIIData = true;
  exportSuccessToast: string | null = null;

  openExportModal(): void {
    this.showExportModal = true;
  }

  closeExportModal(): void {
    this.showExportModal = false;
  }

  executeScopedExport(): void {
    this.showExportModal = false;
    this.exportSuccessToast = `Successfully generated ${this.exportFormat} export (${this.maskPIIData ? 'PII Masked' : 'Unmasked Raw'}) for ${this.filteredDocuments.length} documents.`;
    setTimeout(() => {
      this.exportSuccessToast = null;
    }, 4000);
  }
}