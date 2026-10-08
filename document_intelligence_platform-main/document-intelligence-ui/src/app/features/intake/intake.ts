import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { LoadingState } from '../../shared/ui/loading-state/loading-state';
import { ErrorState, ErrorVariant } from '../../shared/ui/error-state/error-state';
import { DOCUMENT_SERVICE_TOKEN, MockDocumentService } from '../../core/services/api-services';

export interface RecentUpload {
  id: string;
  name: string;
  type: string;
  size: string;
  status: string;
  uploadedAt: string;
  submitter: string;
  submitterInitials: string;
  confidence: number;
}

export interface DocumentTypeOption {
  value: string;
  title: string;
  description: string;
  icon: string;
}

@Component({
  selector: 'app-intake',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingState, ErrorState],
  templateUrl: './intake.html',
  styleUrl: './intake.scss',
  providers: [{ provide: DOCUMENT_SERVICE_TOKEN, useClass: MockDocumentService }],
})
export class Intake implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly documentService = inject(DOCUMENT_SERVICE_TOKEN);

  isLoading = signal(true);
  hasError = signal(false);
  errorVariant = signal<ErrorVariant>('default');

  selectedType = 'Supplier Contract';
  referenceNumber = '';
  description = '';

  selectedFile: File | null = null;

  isDragging = false;
  isUploading = false;
  uploadComplete = false;

  uploadProgress = 0;
  errorMessage = '';

  documentTypes: DocumentTypeOption[] = [
    {
      value: 'Supplier Contract',
      title: 'Supplier Contract',
      description: 'Agreements, SLAs, vendor contracts & legal deeds.',
      icon: '📄',
    },
    {
      value: 'Purchase Invoice',
      title: 'Purchase Invoice',
      description: 'Vendor bills, PO receipts & tax invoices.',
      icon: '🧾',
    },
    {
      value: 'Internal Policy',
      title: 'Internal Policy',
      description: 'Company guidelines, SOPs & compliance rules.',
      icon: '📋',
    },
    {
      value: 'Compliance Report',
      title: 'Compliance Report',
      description: 'Audit logs, ISO certifications & security reviews.',
      icon: '🛡️',
    },
  ];

  recentUploads: RecentUpload[] = [
    {
      id: 'DOC-10249',
      name: 'Supplier_Master_Agreement_2026.pdf',
      type: 'Supplier Contract',
      size: '4.8 MB',
      status: 'Processing',
      uploadedAt: '5 min ago',
      submitter: 'Abhishek Yadav',
      submitterInitials: 'AY',
      confidence: 98.4,
    },
    {
      id: 'DOC-10248',
      name: 'INV-2026-78421_Purchase_Receipt.pdf',
      type: 'Purchase Invoice',
      size: '2.4 MB',
      status: 'Processing',
      uploadedAt: '18 min ago',
      submitter: 'Rahul Sharma',
      submitterInitials: 'RS',
      confidence: 94.2,
    },
    {
      id: 'DOC-10247',
      name: 'Information_Security_SOP_v4.pdf',
      type: 'Internal Policy',
      size: '1.8 MB',
      status: 'In Review',
      uploadedAt: '42 min ago',
      submitter: 'Priya Mehta',
      submitterInitials: 'PM',
      confidence: 88.0,
    },
    {
      id: 'DOC-10246',
      name: 'ISO_27001_Audit_Compliance_Report.pdf',
      type: 'Compliance Report',
      size: '3.1 MB',
      status: 'Approved',
      uploadedAt: '2 hrs ago',
      submitter: 'Neha Verma',
      submitterInitials: 'NV',
      confidence: 99.1,
    },
  ];

  activeRightTab: 'stream' | 'quarantine' = 'stream';

  quarantinedItems = [
    {
      id: 'ERR-901',
      name: 'Scanned_Receipt_LowDPI_Corrupted.pdf',
      size: '1.2 MB',
      status: 'Quarantined',
      errorReason: 'OCR Confidence Failure: Scan resolution < 150 DPI with unreadable text artifacts on Page 2.',
      detectedAt: '12 min ago',
    },
    {
      id: 'ERR-902',
      name: 'Vendor_Handwritten_Challan_Blur.png',
      size: '840 KB',
      status: 'Quarantined',
      errorReason: 'Unsupported Script: High degradation handwriting without embedded machine-readable layer.',
      detectedAt: '35 min ago',
    },
  ];

  ngOnInit(): void {
    this.loadIntakeData();
  }

  loadIntakeData(): void {
    this.isLoading.set(true);
    this.hasError.set(false);

    const errorParam = this.route.snapshot.queryParamMap.get('error');
    if (errorParam === 'quota') {
      setTimeout(() => {
        this.errorVariant.set('quota-exceeded');
        this.hasError.set(true);
        this.isLoading.set(false);
      }, 300);
      return;
    }

    this.documentService.getDocuments().subscribe({
      next: () => {
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
    this.loadIntakeData();
  }

  retryQuarantine(item: any): void {
    item.status = 'Reprocessing';
    item.errorReason = 'Re-running through Super-Resolution OCR Engine...';
    setTimeout(() => {
      item.status = 'Completed';
      item.errorReason = 'Successfully extracted with LayoutLMv3 fallback!';
    }, 1500);
  }

  manualOverride(item: any): void {
    item.status = 'Escalated to HITL';
    item.errorReason = 'Routed to Senior Reviewer for manual field transcription.';
  }

  selectType(typeValue: string): void {
    this.selectedType = typeValue;
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    const file = event.dataTransfer?.files?.[0];
    if (file) {
      this.handleFile(file);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this.handleFile(file);
    }
    input.value = '';
  }

  private handleFile(file: File): void {
    this.errorMessage = '';
    this.uploadComplete = false;

    const allowedTypes = [
      'application/pdf',
      'image/png',
      'image/jpeg',
      'image/jpg',
      'image/tiff',
    ];

    const maxSize = 50 * 1024 * 1024; // 50MB

    if (!allowedTypes.includes(file.type) && !file.name.endsWith('.pdf')) {
      this.errorMessage = 'Only PDF, PNG, JPG and TIFF files are supported.';
      this.selectedFile = null;
      return;
    }

    if (file.size > maxSize) {
      this.errorMessage = 'File size must be less than 50 MB.';
      this.selectedFile = null;
      return;
    }

    this.selectedFile = file;
  }

  removeFile(): void {
    this.selectedFile = null;
    this.errorMessage = '';
    this.uploadProgress = 0;
    this.uploadComplete = false;
  }

  uploadDocument(): void {
    this.errorMessage = '';

    if (!this.selectedFile) {
      this.errorMessage = 'Please drag & drop or select a document file first.';
      return;
    }

    if (!this.selectedType) {
      this.errorMessage = 'Please select a document category type.';
      return;
    }

    this.isUploading = true;
    this.uploadComplete = false;
    this.uploadProgress = 0;

    const interval = setInterval(() => {
      this.uploadProgress += 10;

      if (this.uploadProgress >= 100) {
        clearInterval(interval);

        this.isUploading = false;
        this.uploadComplete = true;

        this.addRecentUpload();
      }
    }, 120);
  }

  private addRecentUpload(): void {
    if (!this.selectedFile) {
      return;
    }

    const newUpload: RecentUpload = {
      id: `DOC-${10250 + this.recentUploads.length}`,
      name: this.selectedFile.name,
      type: this.selectedType,
      size: this.formatFileSize(this.selectedFile.size),
      status: 'Processing',
      uploadedAt: 'Just now',
      submitter: 'Abhishek Yadav',
      submitterInitials: 'AY',
      confidence: 96.8,
    };

    this.recentUploads = [newUpload, ...this.recentUploads];
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) {
      return '0 Bytes';
    }

    const units = ['Bytes', 'KB', 'MB', 'GB'];
    const index = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, index)).toFixed(1)} ${units[index]}`;
  }

  resetForm(): void {
    this.selectedFile = null;
    this.selectedType = 'Supplier Contract';
    this.referenceNumber = '';
    this.description = '';
    this.uploadProgress = 0;
    this.uploadComplete = false;
    this.errorMessage = '';
    this.isUploading = false;
    this.isDragging = false;
  }
}