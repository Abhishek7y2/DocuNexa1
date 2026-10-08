import { Injectable, InjectionToken } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

// Simulated latency helper (300-700ms)
function getRandomDelay(): number {
  return Math.floor(Math.random() * 400) + 300;
}

// Global failure toggle state for error testing
export const MOCK_SIMULATE_FAILURE = { enabled: false };

function handleMockResponse<T>(data: T): Observable<T> {
  if (MOCK_SIMULATE_FAILURE.enabled) {
    return throwError(() => new Error('Simulated Backend Service Error (500)')).pipe(
      delay(getRandomDelay())
    );
  }
  return of(data).pipe(delay(getRandomDelay()));
}

/* =========================================
   1. DOCUMENT SERVICE
   ========================================= */
export interface IDocumentItem {
  id: string;
  name: string;
  category: string;
  status: string;
  confidence: number;
  uploadedAt: string;
  uploadedBy: string;
  pages: number;
  fileSize: string;
}

export interface IDocumentService {
  getDocuments(filters?: any): Observable<IDocumentItem[]>;
  getDocumentById(id: string): Observable<IDocumentItem | null>;
  deleteDocument(id: string): Observable<boolean>;
}

export const DOCUMENT_SERVICE_TOKEN = new InjectionToken<IDocumentService>('DOCUMENT_SERVICE');

@Injectable({ providedIn: 'root' })
export class MockDocumentService implements IDocumentService {
  private documents: IDocumentItem[] = [
    {
      id: 'DOC-8921',
      name: 'Acme_Q3_Vendor_Invoice.pdf',
      category: 'Purchase Invoice',
      status: 'Verified',
      confidence: 98.4,
      uploadedAt: '2026-10-07 14:32',
      uploadedBy: 'Abhishek Yadav',
      pages: 4,
      fileSize: '2.4 MB',
    },
    {
      id: 'DOC-8922',
      name: 'Supplier_Master_Agreement_v2.pdf',
      category: 'Legal Contract',
      status: 'Pending Review',
      confidence: 84.2,
      uploadedAt: '2026-10-07 15:10',
      uploadedBy: 'Neha Verma',
      pages: 12,
      fileSize: '4.8 MB',
    },
    {
      id: 'DOC-8923',
      name: 'Logistics_Waybill_Oct2026.pdf',
      category: 'Shipping Manifest',
      status: 'Quarantined',
      confidence: 62.1,
      uploadedAt: '2026-10-07 16:45',
      uploadedBy: 'Karan Malhotra',
      pages: 2,
      fileSize: '1.1 MB',
    },
  ];

  getDocuments(): Observable<IDocumentItem[]> {
    return handleMockResponse(this.documents);
  }

  getDocumentById(id: string): Observable<IDocumentItem | null> {
    const doc = this.documents.find((d) => d.id === id) || this.documents[0];
    return handleMockResponse(doc);
  }

  deleteDocument(id: string): Observable<boolean> {
    this.documents = this.documents.filter((d) => d.id !== id);
    return handleMockResponse(true);
  }
}

/* =========================================
   2. EXTRACTION SERVICE
   ========================================= */
export interface IExtractionField {
  key: string;
  label: string;
  value: any;
  confidence: number;
  bbox?: number[];
  flagged?: boolean;
}

export interface IExtractionService {
  getExtractedFields(docId: string): Observable<IExtractionField[]>;
  updateField(docId: string, key: string, value: any): Observable<boolean>;
}

export const EXTRACTION_SERVICE_TOKEN = new InjectionToken<IExtractionService>('EXTRACTION_SERVICE');

@Injectable({ providedIn: 'root' })
export class MockExtractionService implements IExtractionService {
  getExtractedFields(docId: string): Observable<IExtractionField[]> {
    return handleMockResponse([
      { key: 'invoice_number', label: 'Invoice Number', value: 'INV-2026-9042', confidence: 99.1, bbox: [120, 80, 240, 30] },
      { key: 'vendor_name', label: 'Vendor Name', value: 'Acme Logistics Ltd', confidence: 97.8, bbox: [120, 130, 300, 35] },
      { key: 'net_total', label: 'Net Total', value: 12450.00, confidence: 94.5, bbox: [450, 600, 150, 30] },
      { key: 'tax_amount', label: 'Tax Amount', value: 2241.00, confidence: 92.0, bbox: [450, 640, 150, 30] },
      { key: 'grand_total', label: 'Grand Total', value: 14691.00, confidence: 98.9, bbox: [450, 690, 160, 35] },
    ]);
  }

  updateField(_docId: string, _key: string, _value: any): Observable<boolean> {
    return handleMockResponse(true);
  }
}

/* =========================================
   3. REVIEW SERVICE
   ========================================= */
export interface IReviewTask {
  id: string;
  docId: string;
  documentTitle: string;
  assignee: string;
  slaHoursLeft: number;
  status: 'Pending' | 'In Progress' | 'Completed';
  lowConfidenceCount: number;
}

export interface IReviewService {
  getReviewQueue(): Observable<IReviewTask[]>;
  submitReview(taskId: string, payload: any): Observable<boolean>;
}

export const REVIEW_SERVICE_TOKEN = new InjectionToken<IReviewService>('REVIEW_SERVICE');

@Injectable({ providedIn: 'root' })
export class MockReviewService implements IReviewService {
  getReviewQueue(): Observable<IReviewTask[]> {
    return handleMockResponse([
      { id: 'REV-101', docId: 'DOC-8922', documentTitle: 'Supplier_Master_Agreement_v2.pdf', assignee: 'Rahul Sharma', slaHoursLeft: 3.5, status: 'In Progress', lowConfidenceCount: 3 },
      { id: 'REV-102', docId: 'DOC-8923', documentTitle: 'Logistics_Waybill_Oct2026.pdf', assignee: 'Unassigned', slaHoursLeft: 1.2, status: 'Pending', lowConfidenceCount: 5 },
    ]);
  }

  submitReview(_taskId: string, _payload: any): Observable<boolean> {
    return handleMockResponse(true);
  }
}

/* =========================================
   4. APPROVAL SERVICE
   ========================================= */
export interface IApprovalItem {
  id: string;
  docId: string;
  documentTitle: string;
  amount: number;
  uploader: string;
  currentStage: number;
  totalStages: number;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export interface IApprovalService {
  getApprovals(): Observable<IApprovalItem[]>;
  approveDocument(id: string, comment?: string): Observable<boolean>;
  rejectDocument(id: string, reason: string): Observable<boolean>;
}

export const APPROVAL_SERVICE_TOKEN = new InjectionToken<IApprovalService>('APPROVAL_SERVICE');

@Injectable({ providedIn: 'root' })
export class MockApprovalService implements IApprovalService {
  getApprovals(): Observable<IApprovalItem[]> {
    return handleMockResponse([
      { id: 'APP-501', docId: 'DOC-8921', documentTitle: 'Acme_Q3_Vendor_Invoice.pdf', amount: 14691.00, uploader: 'Neha Verma', currentStage: 2, totalStages: 4, status: 'Pending' },
    ]);
  }

  approveDocument(_id: string, _comment?: string): Observable<boolean> {
    return handleMockResponse(true);
  }

  rejectDocument(_id: string, _reason: string): Observable<boolean> {
    return handleMockResponse(true);
  }
}

/* =========================================
   5. SEARCH SERVICE
   ========================================= */
export interface ISearchResult {
  docId: string;
  title: string;
  snippet: string;
  matchScore: number;
  category: string;
}

export interface ISearchService {
  semanticSearch(query: string): Observable<ISearchResult[]>;
}

export const SEARCH_SERVICE_TOKEN = new InjectionToken<ISearchService>('SEARCH_SERVICE');

@Injectable({ providedIn: 'root' })
export class MockSearchService implements ISearchService {
  semanticSearch(query: string): Observable<ISearchResult[]> {
    return handleMockResponse([
      { docId: 'DOC-8921', title: 'Acme_Q3_Vendor_Invoice.pdf', snippet: `...matched query '${query}': Total payable \$14,691.00 under Net 30 terms...`, matchScore: 0.94, category: 'Purchase Invoice' },
      { docId: 'DOC-8922', title: 'Supplier_Master_Agreement_v2.pdf', snippet: `...found references to '${query}' in Clause 4.2 Data Protection & GDPR Compliance...`, matchScore: 0.88, category: 'Legal Contract' },
    ]);
  }
}

/* =========================================
   6. QA SERVICE
   ========================================= */
export interface IQaAnswer {
  answer: string;
  confidence: number;
  citations: { docId: string; page: number; paragraph: number; snippet: string }[];
}

export interface IQaService {
  askQuestion(question: string): Observable<IQaAnswer>;
}

export const QA_SERVICE_TOKEN = new InjectionToken<IQaService>('QA_SERVICE');

@Injectable({ providedIn: 'root' })
export class MockQaService implements IQaService {
  askQuestion(question: string): Observable<IQaAnswer> {
    return handleMockResponse({
      answer: `Based on your indexed documents, the termination clause requires a 30-day prior written notice with full indemnity for open purchase orders.`,
      confidence: 0.96,
      citations: [
        { docId: 'DOC-8922', page: 4, paragraph: 2, snippet: 'Clause 9.3: Termination for Convenience requires thirty (30) days advance notice.' }
      ]
    });
  }
}

/* =========================================
   7. COMPARE SERVICE
   ========================================= */
export interface IClauseDiff {
  id: string;
  type: 'added' | 'removed' | 'modified' | 'unchanged';
  baselineText: string;
  amendedText: string;
  riskLevel: 'High' | 'Medium' | 'Low' | 'None';
  section: string;
}

export interface ICompareService {
  compareDocuments(docId1: string, docId2: string): Observable<IClauseDiff[]>;
}

export const COMPARE_SERVICE_TOKEN = new InjectionToken<ICompareService>('COMPARE_SERVICE');

@Injectable({ providedIn: 'root' })
export class MockCompareService implements ICompareService {
  compareDocuments(_docId1: string, _docId2: string): Observable<IClauseDiff[]> {
    return handleMockResponse([
      { id: 'DIFF-1', type: 'modified', baselineText: 'Payment terms: Net 30 days from receipt of valid invoice.', amendedText: 'Payment terms: Net 60 days from end of billing month.', riskLevel: 'Medium', section: 'Clause 3.1 Payment' },
      { id: 'DIFF-2', type: 'added', baselineText: '', amendedText: 'Subcontractors must adhere to EU GDPR Data Processing Regulations.', riskLevel: 'High', section: 'Clause 4.2 Security' },
      { id: 'DIFF-3', type: 'removed', baselineText: 'Either party may terminate for convenience with 15 days notice.', amendedText: '', riskLevel: 'High', section: 'Clause 9.3 Termination' },
    ]);
  }
}

/* =========================================
   8. NOTIFICATION SERVICE
   ========================================= */
export interface INotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  unread: boolean;
  type: 'info' | 'warning' | 'alert';
}

export interface INotificationService {
  getNotifications(): Observable<INotificationItem[]>;
  markAsRead(id: string): Observable<boolean>;
}

export const NOTIFICATION_SERVICE_TOKEN = new InjectionToken<INotificationService>('NOTIFICATION_SERVICE');

@Injectable({ providedIn: 'root' })
export class MockNotificationService implements INotificationService {
  getNotifications(): Observable<INotificationItem[]> {
    return handleMockResponse([
      { id: 'N-1', title: 'SLA Breach Warning', message: 'Document DOC-8923 review SLA expires in 1.2 hours.', timestamp: '10 mins ago', unread: true, type: 'warning' },
      { id: 'N-2', title: 'Approval Required', message: 'Invoice DOC-8921 ready for your final sign-off.', timestamp: '45 mins ago', unread: true, type: 'alert' },
    ]);
  }

  markAsRead(_id: string): Observable<boolean> {
    return handleMockResponse(true);
  }
}

/* =========================================
   9. ADMIN SERVICE
   ========================================= */
export interface IAdminSettings {
  sessionTimeoutMinutes: number;
  retentionDays: number;
  lowDpiThreshold: number;
  legalHoldEnabled: boolean;
}

export interface IAdminService {
  getSettings(): Observable<IAdminSettings>;
  updateSettings(settings: Partial<IAdminSettings>): Observable<boolean>;
}

export const ADMIN_SERVICE_TOKEN = new InjectionToken<IAdminService>('ADMIN_SERVICE');

@Injectable({ providedIn: 'root' })
export class MockAdminService implements IAdminService {
  private settings: IAdminSettings = {
    sessionTimeoutMinutes: 15,
    retentionDays: 90,
    lowDpiThreshold: 150,
    legalHoldEnabled: false,
  };

  getSettings(): Observable<IAdminSettings> {
    return handleMockResponse(this.settings);
  }

  updateSettings(newSettings: Partial<IAdminSettings>): Observable<boolean> {
    this.settings = { ...this.settings, ...newSettings };
    return handleMockResponse(true);
  }
}

/* =========================================
   10. REPORT SERVICE
   ========================================= */
export interface IReportSummary {
  totalProcessed: number;
  ocrAccuracy: number;
  slaBreachRate: number;
  autoReconciliationRate: number;
}

export interface IReportService {
  getSummaryReport(): Observable<IReportSummary>;
}

export const REPORT_SERVICE_TOKEN = new InjectionToken<IReportService>('REPORT_SERVICE');

@Injectable({ providedIn: 'root' })
export class MockReportService implements IReportService {
  getSummaryReport(): Observable<IReportSummary> {
    return handleMockResponse({
      totalProcessed: 1248,
      ocrAccuracy: 96.4,
      slaBreachRate: 1.8,
      autoReconciliationRate: 91.2,
    });
  }
}
