import { Injectable, inject, InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { MockSettingsService } from './mock-settings.service';

/* =========================================
   1. DOCUMENT SERVICE
   ========================================= */
export interface IDocumentItem {
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

export interface IDocumentService {
  getDocuments(filters?: any): Observable<IDocumentItem[]>;
  getDocumentById(id: string): Observable<IDocumentItem | null>;
  deleteDocument(id: string): Observable<boolean>;
}

export const DOCUMENT_SERVICE_TOKEN = new InjectionToken<IDocumentService>('DOCUMENT_SERVICE');

@Injectable({ providedIn: 'root' })
export class MockDocumentService implements IDocumentService {
  private mockSettings = inject(MockSettingsService);

  private documents: IDocumentItem[] = [
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
  ];

  getDocuments(): Observable<IDocumentItem[]> {
    return this.mockSettings.simulateDelay(this.documents);
  }

  getDocumentById(id: string): Observable<IDocumentItem | null> {
    const doc = this.documents.find((d) => d.id === id) || this.documents[0];
    return this.mockSettings.simulateDelay(doc);
  }

  deleteDocument(id: string): Observable<boolean> {
    this.documents = this.documents.filter((d) => d.id !== id);
    return this.mockSettings.simulateDelay(true);
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
  private mockSettings = inject(MockSettingsService);

  getExtractedFields(_docId: string): Observable<IExtractionField[]> {
    return this.mockSettings.simulateDelay([
      { key: 'invoice_number', label: 'Invoice Number', value: 'INV-2026-9042', confidence: 99.1, bbox: [120, 80, 240, 30] },
      { key: 'vendor_name', label: 'Vendor Name', value: 'Acme Logistics Ltd', confidence: 97.8, bbox: [120, 130, 300, 35] },
      { key: 'net_total', label: 'Net Total', value: 12450.00, confidence: 94.5, bbox: [450, 600, 150, 30] },
      { key: 'tax_amount', label: 'Tax Amount', value: 2241.00, confidence: 92.0, bbox: [450, 640, 150, 30] },
      { key: 'grand_total', label: 'Grand Total', value: 14691.00, confidence: 98.9, bbox: [450, 690, 160, 35] },
    ]);
  }

  updateField(_docId: string, _key: string, _value: any): Observable<boolean> {
    return this.mockSettings.simulateDelay(true);
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
  status: 'Pending' | 'In Progress' | 'Completed' | 'Pending Review' | 'Approved' | 'Changes Requested';
  priority: 'High' | 'Medium' | 'Low';
  confidence: number;
  pages: number;
  submittedAt: string;
  type: string;
}

export interface IReviewService {
  getReviewQueue(): Observable<IReviewTask[]>;
  submitReview(taskId: string, payload: any): Observable<boolean>;
}

export const REVIEW_SERVICE_TOKEN = new InjectionToken<IReviewService>('REVIEW_SERVICE');

@Injectable({ providedIn: 'root' })
export class MockReviewService implements IReviewService {
  private mockSettings = inject(MockSettingsService);

  private queue: IReviewTask[] = [
    {
      id: 'DOC-10247',
      docId: 'DOC-10247',
      documentTitle: 'Purchase Invoice - INV-78421',
      assignee: 'Rahul Sharma',
      slaHoursLeft: 3.5,
      status: 'Pending Review',
      priority: 'High',
      confidence: 91,
      pages: 4,
      submittedAt: '06 Oct 2026 · 09:18 AM',
      type: 'Purchase Invoice',
    },
    {
      id: 'DOC-10245',
      docId: 'DOC-10245',
      documentTitle: 'Vendor Master Agreement',
      assignee: 'Abhishek Yadav',
      slaHoursLeft: 12.0,
      status: 'In Progress',
      priority: 'High',
      confidence: 87,
      pages: 32,
      submittedAt: '05 Oct 2026 · 03:42 PM',
      type: 'Supplier Contract',
    },
  ];

  getReviewQueue(): Observable<IReviewTask[]> {
    return this.mockSettings.simulateDelay(this.queue);
  }

  submitReview(_taskId: string, _payload: any): Observable<boolean> {
    return this.mockSettings.simulateDelay(true);
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
  private mockSettings = inject(MockSettingsService);

  getApprovals(): Observable<IApprovalItem[]> {
    return this.mockSettings.simulateDelay([
      { id: 'APP-501', docId: 'DOC-10248', documentTitle: 'Supplier Agreement - Acme', amount: 1250000, uploader: 'Neha Verma', currentStage: 2, totalStages: 4, status: 'Pending' },
    ]);
  }

  approveDocument(_id: string, _comment?: string): Observable<boolean> {
    return this.mockSettings.simulateDelay(true);
  }

  rejectDocument(_id: string, _reason: string): Observable<boolean> {
    return this.mockSettings.simulateDelay(true);
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
  private mockSettings = inject(MockSettingsService);

  semanticSearch(query: string): Observable<ISearchResult[]> {
    return this.mockSettings.simulateDelay([
      { docId: 'DOC-10248', title: 'Supplier Agreement - Acme Industries', snippet: `...matched query '${query}': Total payable ₹12,50,000 under Net 30 terms...`, matchScore: 0.94, category: 'Supplier Contract' },
      { docId: 'DOC-10245', title: 'Vendor Master Agreement 2026', snippet: `...found references to '${query}' in Clause 4.2 Data Protection & GDPR Compliance...`, matchScore: 0.88, category: 'Supplier Contract' },
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
  private mockSettings = inject(MockSettingsService);

  askQuestion(question: string): Observable<IQaAnswer> {
    return this.mockSettings.simulateDelay({
      answer: `Based on your indexed documents, the termination clause requires a 30-day prior written notice with full indemnity for open purchase orders.`,
      confidence: 0.96,
      citations: [
        { docId: 'DOC-10245', page: 4, paragraph: 2, snippet: 'Clause 9.3: Termination for Convenience requires thirty (30) days advance notice.' }
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
  private mockSettings = inject(MockSettingsService);

  compareDocuments(_docId1: string, _docId2: string): Observable<IClauseDiff[]> {
    return this.mockSettings.simulateDelay([
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
  private mockSettings = inject(MockSettingsService);

  getNotifications(): Observable<INotificationItem[]> {
    return this.mockSettings.simulateDelay([
      { id: 'N-1', title: 'SLA Breach Warning', message: 'Document DOC-10247 review SLA expires in 1.2 hours.', timestamp: '10 mins ago', unread: true, type: 'warning' },
      { id: 'N-2', title: 'Approval Required', message: 'Invoice DOC-10248 ready for your final sign-off.', timestamp: '45 mins ago', unread: true, type: 'alert' },
    ]);
  }

  markAsRead(_id: string): Observable<boolean> {
    return this.mockSettings.simulateDelay(true);
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
  private mockSettings = inject(MockSettingsService);
  private settings: IAdminSettings = {
    sessionTimeoutMinutes: 15,
    retentionDays: 90,
    lowDpiThreshold: 150,
    legalHoldEnabled: false,
  };

  getSettings(): Observable<IAdminSettings> {
    return this.mockSettings.simulateDelay(this.settings);
  }

  updateSettings(newSettings: Partial<IAdminSettings>): Observable<boolean> {
    this.settings = { ...this.settings, ...newSettings };
    return this.mockSettings.simulateDelay(true);
  }
}

/* =========================================
   10. REPORT SERVICE / DASHBOARD SERVICE
   ========================================= */
export interface IDashboardStats {
  categoryOverview: any[];
  reviewerRankings: any[];
  pipelineStages: any[];
  conversionRatios: any[];
  auditMatrix: any[];
}

export interface IReportService {
  getDashboardStats(): Observable<IDashboardStats>;
}

export const REPORT_SERVICE_TOKEN = new InjectionToken<IReportService>('REPORT_SERVICE');

@Injectable({ providedIn: 'root' })
export class MockReportService implements IReportService {
  private mockSettings = inject(MockSettingsService);

  getDashboardStats(): Observable<IDashboardStats> {
    return this.mockSettings.simulateDelay({
      categoryOverview: [
        { name: 'Supplier Contracts', activeIngestion: 142, extractedFields: 1240, approvedDocs: 98, archivedCount: 840, accuracy: 89 },
        { name: 'Purchase Invoices', activeIngestion: 86, extractedFields: 912, approvedDocs: 74, archivedCount: 620, accuracy: 82 },
        { name: 'Internal Policies', activeIngestion: 34, extractedFields: 480, approvedDocs: 30, archivedCount: 310, accuracy: 76 },
        { name: 'Compliance Reports', activeIngestion: 28, extractedFields: 390, approvedDocs: 24, archivedCount: 210, accuracy: 71 },
      ],
      reviewerRankings: [
        { rank: 1, name: 'Abhishek Yadav', initials: 'AY', assignedQueue: 48, verifiedCount: 340, accuracyRate: 98, targetAchieved: 96, avatarBg: '#4f46e5' },
        { rank: 2, name: 'Rahul Sharma', initials: 'RS', assignedQueue: 36, verifiedCount: 290, accuracyRate: 95, targetAchieved: 90, avatarBg: '#2563eb' },
        { rank: 3, name: 'Priya Mehta', initials: 'PM', assignedQueue: 28, verifiedCount: 240, accuracyRate: 92, targetAchieved: 88, avatarBg: '#7c3aed' },
      ],
      pipelineStages: [
        { id: 1, name: 'Ingestion Intake', count: 16 },
        { id: 2, name: 'OCR Scanned', count: 293 },
        { id: 3, name: 'Data Extracted', count: 256 },
        { id: 4, name: 'Confidence Validated', count: 87 },
        { id: 5, name: 'HITL Review', count: 100 },
        { id: 6, name: 'Approval Pending', count: 11 },
        { id: 7, name: 'Archived & Indexed', count: 9 },
      ],
      conversionRatios: [
        { title: 'OCR Validation Ratio', percentage: 34, ratioText: '87 / 256', subtitle: 'Scanned → Validated' },
        { title: 'HITL Review Ratio', percentage: 62, ratioText: '100 / 161', subtitle: 'Validated → Reviewed' },
        { title: 'Approval Ratio', percentage: 18, ratioText: '11 / 61', subtitle: 'Reviewed → Approved' },
        { title: 'Archival Indexing Ratio', percentage: 82, ratioText: '9 / 11', subtitle: 'Approved → Indexed' },
      ],
      auditMatrix: [
        { reviewer: 'Abhishek Yadav', ingested: 180, newOcr: 172, dataExtracted: 165, highConfidence: 150, lowConfidence: 15, manualCorrections: 14, approved: 142, rejected: 8, escalated: 4 },
        { reviewer: 'Rahul Sharma', ingested: 145, newOcr: 138, dataExtracted: 130, highConfidence: 115, lowConfidence: 15, manualCorrections: 12, approved: 110, rejected: 10, escalated: 3 },
      ],
    });
  }
}
