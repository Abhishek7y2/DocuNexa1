import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { LoadingState } from '../../shared/ui/loading-state/loading-state';
import { ErrorState } from '../../shared/ui/error-state/error-state';
import { SEARCH_SERVICE_TOKEN, MockSearchService } from '../../core/services/api-services';

export interface SearchDocument {
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
  imports: [CommonModule, FormsModule, RouterLink, LoadingState, ErrorState],
  templateUrl: './search.html',
  styleUrl: './search.scss',
  providers: [{ provide: SEARCH_SERVICE_TOKEN, useClass: MockSearchService }],
})
export class Search implements OnInit {
  private readonly searchService = inject(SEARCH_SERVICE_TOKEN);

  searchTerm = '';
  selectedType = 'All Types';
  selectedStatus = 'All Status';
  selectedOwner = 'All Owners';
  selectedCategory = 'All Categories';

  hasSearched = false;
  isLoading = signal(false);
  hasError = signal(false);

  documents: SearchDocument[] = [];

  ngOnInit(): void {
    this.executeSearch('contract');
  }

  executeSearch(query = this.searchTerm): void {
    this.isLoading.set(true);
    this.hasError.set(false);
    this.hasSearched = true;

    this.searchService.semanticSearch(query || 'invoice').subscribe({
      next: (results) => {
        this.documents = results.map((r) => ({
          id: r.docId,
          name: r.title,
          type: r.category,
          category: r.category,
          status: 'Approved',
          owner: 'Abhishek Yadav',
          updatedAt: '06 Oct 2026',
          pages: 18,
          size: '2.4 MB',
          confidence: Math.round(r.matchScore * 100),
          snippet: r.snippet,
          tags: [r.category, 'Semantic Match'],
        }));
        this.isLoading.set(false);
      },
      error: () => {
        this.hasError.set(true);
        this.isLoading.set(false);
      },
    });
  }

  retryLoad(): void {
    this.executeSearch();
  }

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
        document.tags.some((tag) => tag.toLowerCase().includes(search));

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
    this.executeSearch();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.selectedType = 'All Types';
    this.selectedStatus = 'All Status';
    this.selectedOwner = 'All Owners';
    this.selectedCategory = 'All Categories';
    this.hasSearched = false;
    this.executeSearch('all');
  }

  get resultCount(): number {
    return this.filteredDocuments.length;
  }
}