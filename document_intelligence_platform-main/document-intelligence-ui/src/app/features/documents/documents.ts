import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { LoadingState } from '../../shared/ui/loading-state/loading-state';
import { EmptyState } from '../../shared/ui/empty-state/empty-state';
import { ErrorState } from '../../shared/ui/error-state/error-state';
import { DOCUMENT_SERVICE_TOKEN, MockDocumentService, IDocumentItem } from '../../core/services/api-services';

export type DocumentItem = IDocumentItem;

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
  providers: [{ provide: DOCUMENT_SERVICE_TOKEN, useClass: MockDocumentService }],
})
export class Documents implements OnInit {
  private readonly documentService = inject(DOCUMENT_SERVICE_TOKEN);

  searchTerm = '';
  selectedType = 'All Types';
  selectedStatus = 'All Status';
  selectedCategory = 'All Documents';
  viewMode: 'grid' | 'table' = 'grid';

  isLoading = signal(true);
  hasError = signal(false);

  categoryTabs = [
    'All Documents',
    'Supplier Contract',
    'Purchase Invoice',
    'Internal Policy',
    'Compliance Report',
  ];

  documents: DocumentItem[] = [];

  ngOnInit(): void {
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
    this.isLoading.set(true);
    this.hasError.set(false);

    this.documentService.getDocuments().subscribe({
      next: (data) => {
        this.documents = data;
        this.isLoading.set(false);
      },
      error: () => {
        this.hasError.set(true);
        this.isLoading.set(false);
      },
    });
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