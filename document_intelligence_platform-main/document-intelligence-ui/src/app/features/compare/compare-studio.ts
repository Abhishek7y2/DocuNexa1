import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute } from '@angular/router';

export interface ClauseDiff {
  id: string;
  sectionNumber: string;
  title: string;
  category: 'commercial' | 'legal' | 'compliance' | 'general';
  changeType: 'added' | 'removed' | 'modified' | 'unchanged';
  version1Text: string;
  version2Text: string;
  pageCitationV1?: string;
  pageCitationV2?: string;
  riskImpact: 'High' | 'Medium' | 'Low' | 'None';
  summaryDelta?: string;
}

@Component({
  selector: 'app-compare-studio',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './compare-studio.html',
  styleUrl: './compare-studio.scss',
})
export class CompareStudio implements OnInit {
  documentId = 'DOC-10245';
  documentTitle = 'Master Services & Vendor Agreement';
  version1Tag = 'v1.0 (Baseline - 15 Jan 2026)';
  version2Tag = 'v2.0 (Current Amendment - 06 Oct 2026)';

  activeFilter: 'all' | 'changed' | 'financial' | 'compliance' = 'changed';

  toastMessage: string | null = null;

  clauses: ClauseDiff[] = [
    {
      id: 'clause-1',
      sectionNumber: '1.0',
      title: 'Preamble and Scope of Services',
      category: 'general',
      changeType: 'unchanged',
      version1Text: 'This Master Services Agreement is entered into by and between Acme Corporation Global Pvt Ltd ("Client") and Apex Industrial Solutions Pvt Ltd ("Vendor") for provision of industrial automation and supply chain telemetry hardware.',
      version2Text: 'This Master Services Agreement is entered into by and between Acme Corporation Global Pvt Ltd ("Client") and Apex Industrial Solutions Pvt Ltd ("Vendor") for provision of industrial automation and supply chain telemetry hardware.',
      pageCitationV1: 'Page 1, Para 1',
      pageCitationV2: 'Page 1, Para 1',
      riskImpact: 'None',
    },
    {
      id: 'clause-2',
      sectionNumber: '2.4',
      title: 'Commercial Payment Terms & Discount Window',
      category: 'commercial',
      changeType: 'modified',
      version1Text: 'Invoices shall be payable within Net 30 days from official receipt. No early settlement discount applies.',
      version2Text: 'Invoices shall be payable within Net 60 days from official receipt. An early settlement rebate of 2.5% applies if cleared within 15 calendar days.',
      pageCitationV1: 'Page 2, Para 4',
      pageCitationV2: 'Page 2, Para 4',
      riskImpact: 'High',
      summaryDelta: 'Credit payment cycle extended from Net 30 to Net 60 Days; 2.5% early rebate added.',
    },
    {
      id: 'clause-3',
      sectionNumber: '4.2',
      title: 'Enterprise Data Protection & EU GDPR Compliance',
      category: 'compliance',
      changeType: 'added',
      version1Text: '[Clause did not exist in Version 1.0 Baseline]',
      version2Text: 'Section 4.2 Data Protection: The Vendor warrants full adherence to the EU General Data Protection Regulation (GDPR) and ISO 27001 cybersecurity frameworks. Vendor shall notify Client of any security anomaly within 24 hours.',
      pageCitationV1: 'N/A',
      pageCitationV2: 'Page 4, Para 2',
      riskImpact: 'Medium',
      summaryDelta: 'Mandatory GDPR undertaking & 24h breach notification obligation added.',
    },
    {
      id: 'clause-4',
      sectionNumber: '7.1',
      title: 'Limitation of Financial Liability & Indemnity',
      category: 'legal',
      changeType: 'modified',
      version1Text: 'Total aggregate liability of either party arising under this Agreement shall be limited to INR 10,00,000/- (Ten Lakhs).',
      version2Text: 'Total aggregate liability shall be capped at 2.0x the annual contract value, not to exceed INR 25,00,000/- (Twenty-Five Lakhs). Indemnity for IP breach remains uncapped.',
      pageCitationV1: 'Page 5, Para 2',
      pageCitationV2: 'Page 5, Para 3',
      riskImpact: 'High',
      summaryDelta: 'Maximum liability cap increased from ₹10 Lakhs to ₹25 Lakhs (2.5x increase).',
    },
    {
      id: 'clause-5',
      sectionNumber: '9.3',
      title: 'Unilateral Without-Cause Termination Provision',
      category: 'legal',
      changeType: 'removed',
      version1Text: 'Either party may unilaterally terminate this Agreement without cause upon providing thirty (30) days prior written notice to the other party.',
      version2Text: '[Clause removed in Version 2.0 Amendment - Termination now restricted to material breach with 90-day cure period only]',
      pageCitationV1: 'Page 7, Para 1',
      pageCitationV2: 'Page 7',
      riskImpact: 'High',
      summaryDelta: '30-day convenience exit clause eliminated to ensure multi-year operational continuity.',
    },
    {
      id: 'clause-6',
      sectionNumber: '11.2',
      title: 'Governing Law and Dispute Arbitration Seat',
      category: 'legal',
      changeType: 'modified',
      version1Text: 'This agreement is governed by the laws of India with exclusive legal jurisdiction vested in the courts of New Delhi.',
      version2Text: 'This agreement is governed by the laws of India. Any arbitration shall be conducted under SIAC Rules with seat of arbitration in Mumbai.',
      pageCitationV1: 'Page 8, Para 2',
      pageCitationV2: 'Page 8, Para 2',
      riskImpact: 'Medium',
      summaryDelta: 'Arbitration mechanism shifted from New Delhi domestic courts to SIAC Rules in Mumbai.',
    },
    {
      id: 'clause-7',
      sectionNumber: '12.0',
      title: 'Force Majeure and Supply Disruptions',
      category: 'general',
      changeType: 'unchanged',
      version1Text: 'Neither party shall be liable for failures caused by natural disasters, war, pandemics, or government-mandated industrial embargoes.',
      version2Text: 'Neither party shall be liable for failures caused by natural disasters, war, pandemics, or government-mandated industrial embargoes.',
      pageCitationV1: 'Page 9, Para 1',
      pageCitationV2: 'Page 9, Para 1',
      riskImpact: 'None',
    },
  ];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.documentId = id;
      }
    });
  }

  get filteredClauses(): ClauseDiff[] {
    if (this.activeFilter === 'changed') {
      return this.clauses.filter((c) => c.changeType !== 'unchanged');
    }
    if (this.activeFilter === 'financial') {
      return this.clauses.filter((c) => c.category === 'commercial');
    }
    if (this.activeFilter === 'compliance') {
      return this.clauses.filter(
        (c) => c.category === 'compliance' || c.category === 'legal',
      );
    }
    return this.clauses;
  }

  get addedCount(): number {
    return this.clauses.filter((c) => c.changeType === 'added').length;
  }

  get removedCount(): number {
    return this.clauses.filter((c) => c.changeType === 'removed').length;
  }

  get modifiedCount(): number {
    return this.clauses.filter((c) => c.changeType === 'modified').length;
  }

  get unchangedCount(): number {
    return this.clauses.filter((c) => c.changeType === 'unchanged').length;
  }

  setFilter(filter: 'all' | 'changed' | 'financial' | 'compliance'): void {
    this.activeFilter = filter;
  }

  exportDiffReport(): void {
    this.showToast(
      'Exporting Clause Diff Audit Package (PDF/CSV) with tamper-evident hash...',
    );
  }

  acknowledgeDelta(): void {
    this.showToast(
      'Version 2.0 contract differences acknowledged and logged to compliance trail.',
    );
  }

  showToast(message: string): void {
    this.toastMessage = message;
    setTimeout(() => {
      if (this.toastMessage === message) {
        this.toastMessage = null;
      }
    }, 3500);
  }
}
