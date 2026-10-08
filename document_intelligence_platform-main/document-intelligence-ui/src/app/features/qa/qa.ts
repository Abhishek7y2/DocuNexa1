import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LoadingState } from '../../shared/ui/loading-state/loading-state';
import { EmptyState } from '../../shared/ui/empty-state/empty-state';
import { ErrorState } from '../../shared/ui/error-state/error-state';
import { QA_SERVICE_TOKEN, MockQaService } from '../../core/services/api-services';

interface QaCitation {
  documentId: string;
  documentName: string;
  page: number;
  section: string;
  excerpt: string;
}

interface QaMessage {
  id: number;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  citations?: QaCitation[];
}

interface QaDocument {
  id: string;
  name: string;
  type: string;
}

@Component({
  selector: 'app-qa',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LoadingState,
    EmptyState,
    ErrorState,
  ],
  templateUrl: './qa.html',
  styleUrl: './qa.scss',
  providers: [{ provide: QA_SERVICE_TOKEN, useClass: MockQaService }],
})
export class Qa {
  private readonly qaService = inject(QA_SERVICE_TOKEN);

  selectedDocumentId = 'DOC-10248';
  question = '';
  isLoading = false;
  isLoadingDocuments = false;
  hasDocumentError = false;
  showHistory = true;

  documents: QaDocument[] = [
    { id: 'DOC-10248', name: 'Supplier Agreement - Acme Industries', type: 'Supplier Contract' },
    { id: 'DOC-10247', name: 'Purchase Invoice - INV-78421', type: 'Purchase Invoice' },
    { id: 'DOC-10246', name: 'Information Security Policy', type: 'Internal Policy' },
  ];

  suggestedQuestions: string[] = [
    'What are the payment terms?',
    'When does this contract expire?',
    'What is the contract value?',
    'What is the renewal period?',
  ];

  messages: QaMessage[] = [
    {
      id: 1,
      role: 'assistant',
      text: 'Hello Abhishek! I can answer questions using the indexed documents available in your workspace. Select a document or ask a question across your document context.',
      timestamp: '06 Oct 2026 · 07:12 PM',
    },
  ];

  get selectedDocument(): QaDocument | undefined {
    return this.documents.find((d) => d.id === this.selectedDocumentId);
  }

  loadDocuments(): void {
    this.isLoadingDocuments = false;
    this.hasDocumentError = false;
  }

  retryDocuments(): void {
    this.loadDocuments();
  }

  selectSuggestion(question: string): void {
    if (this.isLoading) return;
    this.question = question;
    this.askQuestion();
  }

  askQuestion(): void {
    const q = this.question.trim();
    if (!q || this.isLoading) return;

    this.messages.push({
      id: Date.now(),
      role: 'user',
      text: q,
      timestamp: this.getCurrentTime(),
    });

    this.question = '';
    this.isLoading = true;

    this.qaService.askQuestion(q).subscribe({
      next: (resp) => {
        this.messages.push({
          id: Date.now() + 1,
          role: 'assistant',
          text: resp.answer,
          timestamp: this.getCurrentTime(),
          citations: resp.citations.map((c) => ({
            documentId: c.docId,
            documentName: this.selectedDocument?.name || 'Indexed Document',
            page: c.page,
            section: `Para ${c.paragraph}`,
            excerpt: c.snippet,
          })),
        });
        this.isLoading = false;
      },
      error: () => {
        this.messages.push({
          id: Date.now() + 1,
          role: 'assistant',
          text: 'Unable to connect to the RAG QA Service. Please check server connectivity.',
          timestamp: this.getCurrentTime(),
        });
        this.isLoading = false;
      },
    });
  }

  selectDocument(): void {
    const name = this.selectedDocument?.name ?? 'the selected document';
    this.messages = [
      {
        id: Date.now(),
        role: 'assistant',
        text: `I've switched the context to "${name}". Ask me anything about this document.`,
        timestamp: this.getCurrentTime(),
      },
    ];
    this.question = '';
  }

  openCitation(citation: QaCitation): void {
    alert(`Source: ${citation.documentName}\nPage: ${citation.page}\nSection: ${citation.section}`);
  }

  clearConversation(): void {
    this.messages = [
      {
        id: Date.now(),
        role: 'assistant',
        text: 'Conversation cleared. Ask a new question about the selected document.',
        timestamp: this.getCurrentTime(),
      },
    ];
    this.question = '';
  }

  toggleHistory(): void {
    this.showHistory = !this.showHistory;
  }

  private getCurrentTime(): string {
    return new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  }
}