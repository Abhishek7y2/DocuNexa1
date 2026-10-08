import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { LoadingState } from '../../../shared/ui/loading-state/loading-state';
import { ErrorState, ErrorVariant } from '../../../shared/ui/error-state/error-state';
import { REVIEW_SERVICE_TOKEN, MockReviewService } from '../../../core/services/api-services';

interface BoundingBox {
  id: string;
  fieldKey: string;
  label: string;
  page: number;
  top: number;
  left: number;
  width: number;
  height: number;
  value: string;
  confidence: number;
}

interface ExtractedField {
  key: string;
  label: string;
  value: string;
  originalValue: string;
  confidence: number;
  status: 'verified' | 'modified' | 'flagged' | 'pending';
  page: number;
  isArithmetic?: boolean;
}

interface InvoiceLineItem {
  id: number;
  description: string;
  hsnCode: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  lineTotal: number;
  isModified?: boolean;
}

@Component({
  selector: 'app-review-workbench',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    LoadingState,
    ErrorState,
  ],
  templateUrl: './review-workbench.html',
  styleUrl: './review-workbench.scss',
  providers: [{ provide: REVIEW_SERVICE_TOKEN, useClass: MockReviewService }],
})
export class ReviewWorkbench implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly reviewService = inject(REVIEW_SERVICE_TOKEN);

  isLoading = signal(true);
  hasError = signal(false);
  errorVariant = signal<ErrorVariant>('default');

  documentId = 'DOC-10247';
  documentName = 'Purchase Invoice - INV-78421';
  documentType = 'Purchase Invoice';
  totalPages = 4;
  currentPage = 1;
  zoomLevel = 100;
  rotation = 0;

  activeTab: 'metadata' | 'line-items' | 'audit' = 'metadata';
  activeFieldKey = 'invoiceTotal';
  hoveredFieldKey: string | null = null;

  reviewerName = 'Abhishek Yadav';
  reviewerRole = 'Senior Verification Lead';

  toastMessage: string | null = null;
  toastType: 'success' | 'warning' | 'error' = 'success';

  fields: ExtractedField[] = [
    { key: 'vendorName', label: 'Vendor / Supplier Name', value: 'Apex Industrial Solutions Pvt Ltd', originalValue: 'Apex Industrial Solutions Pvt Ltd', confidence: 98, status: 'verified', page: 1 },
    { key: 'invoiceNumber', label: 'Invoice / Reference Number', value: 'INV-78421', originalValue: 'INV-78421', confidence: 96, status: 'verified', page: 1 },
    { key: 'poNumber', label: 'Purchase Order (PO) Reference', value: 'PO-2026-9842', originalValue: 'PO-2026-9842', confidence: 88, status: 'modified', page: 1 },
    { key: 'invoiceDate', label: 'Invoice Date', value: '04 Oct 2026', originalValue: '04 Oct 2026', confidence: 94, status: 'verified', page: 1 },
    { key: 'dueDate', label: 'Payment Due Date', value: '03 Nov 2026', originalValue: '03 Nov 2026', confidence: 82, status: 'flagged', page: 1 },
    { key: 'gstNumber', label: 'Supplier GSTIN / Tax ID', value: '27AABCA1234F1Z8', originalValue: '27AABCA1234F1Z8', confidence: 97, status: 'verified', page: 1 },
    { key: 'subTotal', label: 'Subtotal (Before Tax)', value: '1,23,000.00', originalValue: '1,23,000.00', confidence: 95, status: 'verified', page: 1, isArithmetic: true },
    { key: 'taxAmount', label: 'Total Tax (GST 18%)', value: '22,140.00', originalValue: '22,140.00', confidence: 91, status: 'verified', page: 1, isArithmetic: true },
    { key: 'invoiceTotal', label: 'Grand Invoice Total (INR)', value: '1,45,140.00', originalValue: '1,45,140.00', confidence: 79, status: 'flagged', page: 1, isArithmetic: true },
  ];

  boundingBoxes: BoundingBox[] = [
    { id: 'box-1', fieldKey: 'vendorName', label: 'Vendor Name', page: 1, top: 14, left: 12, width: 48, height: 4.5, value: 'Apex Industrial Solutions Pvt Ltd', confidence: 98 },
    { id: 'box-2', fieldKey: 'invoiceNumber', label: 'Invoice #', page: 1, top: 14, left: 64, width: 25, height: 4.5, value: 'INV-78421', confidence: 96 },
    { id: 'box-3', fieldKey: 'poNumber', label: 'PO Ref', page: 1, top: 21, left: 64, width: 25, height: 4.2, value: 'PO-2026-9842', confidence: 88 },
    { id: 'box-4', fieldKey: 'invoiceDate', label: 'Date', page: 1, top: 21, left: 12, width: 26, height: 4, value: '04 Oct 2026', confidence: 94 },
    { id: 'box-5', fieldKey: 'gstNumber', label: 'GSTIN', page: 1, top: 27, left: 12, width: 32, height: 3.8, value: '27AABCA1234F1Z8', confidence: 97 },
    { id: 'box-6', fieldKey: 'subTotal', label: 'Subtotal', page: 1, top: 68, left: 62, width: 26, height: 4, value: '₹ 1,23,000.00', confidence: 95 },
    { id: 'box-7', fieldKey: 'taxAmount', label: 'Tax (18%)', page: 1, top: 74, left: 62, width: 26, height: 4, value: '₹ 22,140.00', confidence: 91 },
    { id: 'box-8', fieldKey: 'invoiceTotal', label: 'Grand Total', page: 1, top: 81, left: 60, width: 29, height: 5.5, value: '₹ 1,45,140.00', confidence: 79 },
  ];

  lineItems: InvoiceLineItem[] = [
    { id: 1, description: 'Industrial Sensor Module A-204 (Precision Calibration)', hsnCode: '8536', quantity: 10, unitPrice: 4500, taxRate: 18, lineTotal: 45000 },
    { id: 2, description: 'PLC Automation Interface Unit (4-Channel Analog)', hsnCode: '8537', quantity: 4, unitPrice: 12000, taxRate: 18, lineTotal: 48000 },
    { id: 3, description: 'Heavy Duty Thermal Relay Assembly (400V 50Hz)', hsnCode: '8536', quantity: 6, unitPrice: 5000, taxRate: 18, lineTotal: 30000 },
  ];

  extractedGrandTotal = 145140.0;
  isDuplicateInvoice = false;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.documentId = id;
    }
    this.loadWorkbenchData();
  }

  loadWorkbenchData(): void {
    this.isLoading.set(true);
    this.hasError.set(false);

    const stateParam = this.route.snapshot.queryParamMap.get('state');

    if (this.documentId === 'processing' || stateParam === 'processing') {
      setTimeout(() => {
        this.errorVariant.set('processing');
        this.hasError.set(true);
        this.isLoading.set(false);
      }, 300);
      return;
    }

    if (this.documentId === 'corrupt' || stateParam === 'corrupt') {
      setTimeout(() => {
        this.errorVariant.set('corrupt-file');
        this.hasError.set(true);
        this.isLoading.set(false);
      }, 300);
      return;
    }

    this.reviewService.getReviewQueue().subscribe({
      next: () => {
        this.recalculateLineItems();
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
    this.loadWorkbenchData();
  }

  zoomIn(): void {
    if (this.zoomLevel < 175) this.zoomLevel += 15;
  }

  zoomOut(): void {
    if (this.zoomLevel > 60) this.zoomLevel -= 15;
  }

  resetZoom(): void {
    this.zoomLevel = 100;
    this.rotation = 0;
  }

  rotateDoc(): void {
    this.rotation = (this.rotation + 90) % 360;
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

  prevPage(): void {
    if (this.currentPage > 1) this.currentPage--;
  }

  selectField(fieldKey: string): void {
    this.activeFieldKey = fieldKey;
  }

  hoverField(fieldKey: string | null): void {
    this.hoveredFieldKey = fieldKey;
  }

  isBoxActive(fieldKey: string): boolean {
    return this.activeFieldKey === fieldKey || this.hoveredFieldKey === fieldKey;
  }

  acceptField(field: ExtractedField): void {
    field.status = 'verified';
    this.showToast(`Verified field "${field.label}"`, 'success');
  }

  flagField(field: ExtractedField): void {
    field.status = 'flagged';
    this.showToast(`Flagged anomaly on "${field.label}"`, 'warning');
  }

  onFieldValueChange(field: ExtractedField): void {
    if (field.value !== field.originalValue) {
      field.status = 'modified';
      field.confidence = 100;
    }
  }

  get calculatedSubtotal(): number {
    return this.lineItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  }

  get calculatedTaxTotal(): number {
    return this.lineItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice * item.taxRate) / 100, 0);
  }

  get calculatedGrandTotal(): number {
    return this.calculatedSubtotal + this.calculatedTaxTotal;
  }

  get arithmeticDifference(): number {
    return Math.abs(this.calculatedGrandTotal - this.extractedGrandTotal);
  }

  get isArithmeticMatch(): boolean {
    return this.arithmeticDifference < 0.01;
  }

  recalculateLineItems(): void {
    this.lineItems.forEach((item) => {
      item.lineTotal = item.quantity * item.unitPrice;
    });
  }

  onItemChange(item: InvoiceLineItem): void {
    item.lineTotal = item.quantity * item.unitPrice;
    item.isModified = true;
  }

  addLineItem(): void {
    const newId = this.lineItems.length + 1;
    this.lineItems.push({
      id: newId,
      description: 'Additional Line Item ' + newId,
      hsnCode: '8500',
      quantity: 1,
      unitPrice: 1000,
      taxRate: 18,
      lineTotal: 1000,
      isModified: true,
    });
    this.showToast('Added new line item row', 'success');
  }

  removeLineItem(index: number): void {
    if (this.lineItems.length > 1) {
      this.lineItems.splice(index, 1);
      this.showToast('Removed line item row', 'warning');
    }
  }

  autoFixGrandTotal(): void {
    this.extractedGrandTotal = this.calculatedGrandTotal;
    const totalField = this.fields.find((f) => f.key === 'invoiceTotal');
    if (totalField) {
      totalField.value = this.calculatedGrandTotal.toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      totalField.status = 'modified';
      totalField.confidence = 100;
    }
    this.showToast('Grand total reconciled with line-items sum!', 'success');
  }

  acceptAllExtractions(): void {
    this.fields.forEach((f) => (f.status = 'verified'));
    this.showToast('All extracted fields accepted as verified', 'success');
  }

  completeReviewAndEscalate(): void {
    if (!this.isArithmeticMatch && this.documentType === 'Purchase Invoice') {
      this.showToast('Warning: Arithmetic discrepancy exists. Please reconcile before approving.', 'error');
      return;
    }
    this.showToast('Document review verified! Successfully forwarded to Approvals Queue.', 'success');
    setTimeout(() => {
      this.router.navigate(['/review']);
    }, 1200);
  }

  showToast(message: string, type: 'success' | 'warning' | 'error'): void {
    this.toastMessage = message;
    this.toastType = type;
    setTimeout(() => {
      if (this.toastMessage === message) {
        this.toastMessage = null;
      }
    }, 3500);
  }
}
