import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface SearchDocument {
  id: string;
  name: string;
  type: string;
  category: string;
  status: string;
  owner: string;
  updatedAt: string;
  pages: number;
  size: string;
  confidence: number;
  snippet: string;
  tags: string[];
}

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './search.html',
  styleUrl: './search.scss',
})
export class Search {
  searchTerm = '';

  selectedType = 'All Types';
  selectedStatus = 'All Status';
  selectedOwner = 'All Owners';
  selectedCategory = 'All Categories';

  hasSearched = false;

  documents: SearchDocument[] = [
    {
      id: 'DOC-10248',
      name: 'Supplier Agreement - Acme Industries',
      type: 'Supplier Contract',
      category: 'Contract',
      status: 'Approved',
      owner: 'Abhishek Yadav',
      updatedAt: '06 Oct 2026',
      pages: 18,
      size: '2.4 MB',
      confidence: 98,
      snippet:
        'This agreement establishes the commercial terms, payment obligations, delivery conditions and responsibilities between Acme Industries and the organization.',
      tags: ['Supplier', 'Contract', 'Commercial'],
    },
    {
      id: 'DOC-10247',
      name: 'Purchase Invoice - INV-78421',
      type: 'Purchase Invoice',
      category: 'Invoice',
      status: 'Pending Review',
      owner: 'Rahul Sharma',
      updatedAt: '06 Oct 2026',
      pages: 4,
      size: '1.8 MB',
      confidence: 91,
      snippet:
        'Invoice includes supplier information, purchase order reference, taxable amount, GST details and payment terms for the current transaction.',
      tags: ['Invoice', 'GST', 'Purchase'],
    },
    {
      id: 'DOC-10246',
      name: 'Information Security Policy',
      type: 'Internal Policy',
      category: 'Policy',
      status: 'Approved',
      owner: 'Priya Mehta',
      updatedAt: '05 Oct 2026',
      pages: 26,
      size: '3.1 MB',
      confidence: 99,
      snippet:
        'The information security policy defines access control, data protection, incident management and employee responsibilities for organizational systems.',
      tags: ['Security', 'Policy', 'Compliance'],
    },
    {
      id: 'DOC-10245',
      name: 'Vendor Master Agreement',
      type: 'Supplier Contract',
      category: 'Contract',
      status: 'Under Review',
      owner: 'Abhishek Yadav',
      updatedAt: '05 Oct 2026',
      pages: 32,
      size: '4.7 MB',
      confidence: 87,
      snippet:
        'Vendor agreement covers service levels, confidentiality, intellectual property, pricing, renewal and termination provisions.',
      tags: ['Vendor', 'Agreement', 'SLA'],
    },
    {
      id: 'DOC-10243',
      name: 'Employee Data Handling Policy',
      type: 'Internal Policy',
      category: 'Policy',
      status: 'Draft',
      owner: 'Abhishek Yadav',
      updatedAt: '03 Oct 2026',
      pages: 14,
      size: '2.8 MB',
      confidence: 95,
      snippet:
        'This policy describes how employee information should be collected, stored, accessed and securely deleted across business systems.',
      tags: ['Employee', 'Data', 'Privacy'],
    },
    {
      id: 'DOC-10240',
      name: 'Purchase Invoice - INV-78416',
      type: 'Purchase Invoice',
      category: 'Invoice',
      status: 'In Approval',
      owner: 'Neha Verma',
      updatedAt: '05 Oct 2026',
      pages: 5,
      size: '1.5 MB',
      confidence: 94,
      snippet:
        'Purchase invoice containing supplier billing information, line items, tax calculations and payment instructions.',
      tags: ['Invoice', 'Finance'],
    },
    {
      id: 'DOC-10237',
      name: 'Cloud Infrastructure Contract',
      type: 'Supplier Contract',
      category: 'Contract',
      status: 'Pending Approval',
      owner: 'Rahul Sharma',
      updatedAt: '04 Oct 2026',
      pages: 27,
      size: '5.2 MB',
      confidence: 96,
      snippet:
        'Cloud infrastructure agreement includes availability requirements, service credits, support obligations and data security commitments.',
      tags: ['Cloud', 'Infrastructure', 'SLA'],
    },
    {
      id: 'DOC-10235',
      name: 'Employee Benefits Policy',
      type: 'Internal Policy',
      category: 'Policy',
      status: 'Approved',
      owner: 'Abhishek Yadav',
      updatedAt: '03 Oct 2026',
      pages: 16,
      size: '2.1 MB',
      confidence: 97,
      snippet:
        'Policy describes employee benefits eligibility, enrollment requirements, reimbursement rules and organizational responsibilities.',
      tags: ['HR', 'Benefits', 'Policy'],
    },
  ];

  get filteredDocuments(): SearchDocument[] {
    const search = this.searchTerm.trim().toLowerCase();

    return this.documents.filter((document) => {
      const matchesSearch =
        !search ||
        document.name.toLowerCase().includes(search) ||
        document.id.toLowerCase().includes(search) ||
        document.owner.toLowerCase().includes(search) ||
        document.type.toLowerCase().includes(search) ||
        document.category.toLowerCase().includes(search) ||
        document.snippet.toLowerCase().includes(search) ||
        document.tags.some((tag) =>
          tag.toLowerCase().includes(search),
        );

      const matchesType =
        this.selectedType === 'All Types' ||
        document.type === this.selectedType;

      const matchesStatus =
        this.selectedStatus === 'All Status' ||
        document.status === this.selectedStatus;

      const matchesOwner =
        this.selectedOwner === 'All Owners' ||
        document.owner === this.selectedOwner;

      const matchesCategory =
        this.selectedCategory === 'All Categories' ||
        document.category === this.selectedCategory;

      return (
        matchesSearch &&
        matchesType &&
        matchesStatus &&
        matchesOwner &&
        matchesCategory
      );
    });
  }

  search(): void {
    this.hasSearched = true;
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.selectedType = 'All Types';
    this.selectedStatus = 'All Status';
    this.selectedOwner = 'All Owners';
    this.selectedCategory = 'All Categories';
    this.hasSearched = false;
  }

  get resultCount(): number {
    return this.filteredDocuments.length;
  }
}