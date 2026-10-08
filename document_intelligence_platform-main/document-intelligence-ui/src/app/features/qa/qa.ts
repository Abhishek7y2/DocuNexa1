import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { LoadingState } from '../../shared/ui/loading-state/loading-state';
import { EmptyState } from '../../shared/ui/empty-state/empty-state';
import { ErrorState } from '../../shared/ui/error-state/error-state';

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
    FormsModule,
    LoadingState,
    EmptyState,
    ErrorState,
  ],
  templateUrl: './qa.html',
  styleUrl: './qa.scss',
})
export class Qa {
  selectedDocumentId = 'DOC-10248';

  question = '';

  isLoading = false;

  isLoadingDocuments = false;

  hasDocumentError = false;

  showHistory = true;

  documents: QaDocument[] = [
    {
      id: 'DOC-10248',
      name: 'Supplier Agreement - Acme Industries',
      type: 'Supplier Contract',
    },
    {
      id: 'DOC-10247',
      name: 'Purchase Invoice - INV-78421',
      type: 'Purchase Invoice',
    },
    {
      id: 'DOC-10246',
      name: 'Information Security Policy',
      type: 'Internal Policy',
    },
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
      text:
        'Hello Abhishek! I can answer questions using the indexed documents available in your workspace. Select a document or ask a question across your document context.',
      timestamp: '06 Oct 2026 · 07:12 PM',
    },
  ];

  constructor() {
    this.loadDocuments();
  }

  get selectedDocument(): QaDocument | undefined {
    return this.documents.find(
      (document) => document.id === this.selectedDocumentId,
    );
  }

  /**
   * Mock document loading.
   * This will later be replaced with an API call.
   */
  loadDocuments(): void {
    this.isLoadingDocuments = true;
    this.hasDocumentError = false;

    setTimeout(() => {
      this.isLoadingDocuments = false;
    }, 700);
  }

  /**
   * Retry document loading after an error.
   */
  retryDocuments(): void {
    this.loadDocuments();
  }

  selectSuggestion(question: string): void {
    if (this.isLoading) {
      return;
    }

    this.question = question;

    this.askQuestion();
  }

  askQuestion(): void {
    const question = this.question.trim();

    if (!question || this.isLoading) {
      return;
    }

    this.messages.push({
      id: Date.now(),
      role: 'user',
      text: question,
      timestamp: this.getCurrentTime(),
    });

    this.question = '';

    this.isLoading = true;

    setTimeout(() => {
      const answer = this.generateMockAnswer(question);

      this.messages.push({
        id: Date.now() + 1,
        role: 'assistant',
        text: answer.text,
        timestamp: this.getCurrentTime(),
        citations: answer.citations,
      });

      this.isLoading = false;
    }, 900);
  }

  generateMockAnswer(question: string): {
    text: string;
    citations: QaCitation[];
  } {
    const normalizedQuestion = question.toLowerCase();

    const document =
      this.selectedDocument ??
      this.documents[0];

    if (
      normalizedQuestion.includes('payment') ||
      normalizedQuestion.includes('terms')
    ) {
      return {
        text:
          'The payment terms are Net 30 Days. Payment is due within 30 days from the date of invoice or receipt of the relevant billing document, as specified in the commercial terms.',
        citations: [
          {
            documentId: document.id,
            documentName: document.name,
            page: 3,
            section: 'Commercial Terms',
            excerpt:
              'Payment Terms: Net 30 Days from the date of invoice.',
          },
        ],
      };
    }

    if (
      normalizedQuestion.includes('expire') ||
      normalizedQuestion.includes('expiry') ||
      normalizedQuestion.includes('expiration')
    ) {
      return {
        text:
          'The current agreement is effective from 01 October 2026 through 30 September 2028. Based on the indexed contract information, the agreement expires on 30 September 2028 unless renewed or terminated earlier according to its terms.',
        citations: [
          {
            documentId: document.id,
            documentName: document.name,
            page: 1,
            section: 'Contract Overview',
            excerpt:
              'Effective Date: 01 October 2026. Expiry Date: 30 September 2028.',
          },
        ],
      };
    }

    if (
      normalizedQuestion.includes('value') ||
      normalizedQuestion.includes('amount') ||
      normalizedQuestion.includes('price')
    ) {
      return {
        text:
          'The contract value is ₹48,50,000. The value is recorded in the commercial terms section of the current document version.',
        citations: [
          {
            documentId: document.id,
            documentName: document.name,
            page: 3,
            section: 'Commercial Terms',
            excerpt:
              'Total Contract Value: ₹48,50,000.',
          },
        ],
      };
    }

    if (
      normalizedQuestion.includes('renewal') ||
      normalizedQuestion.includes('renew')
    ) {
      return {
        text:
          'The renewal period is 24 months. The current version of the agreement specifies a 24-month renewal period subject to the applicable renewal conditions.',
        citations: [
          {
            documentId: document.id,
            documentName: document.name,
            page: 5,
            section: 'Renewal Clause',
            excerpt:
              'Renewal Period: 24 months, subject to the terms of renewal.',
          },
        ],
      };
    }

    if (
      normalizedQuestion.includes('notice')
    ) {
      return {
        text:
          'The notice period specified in the current agreement is 60 days. The relevant requirement is documented under the termination and notice provisions.',
        citations: [
          {
            documentId: document.id,
            documentName: document.name,
            page: 8,
            section: 'Termination & Notice',
            excerpt:
              'Notice Period: 60 days prior written notice.',
          },
        ],
      };
    }

    return {
      text:
        `I cannot answer this question based on the provided document context. The platform strict groundedness policy (BRD AI-004) prevents speculation or hallucinations when requested information is not explicitly verified in "${document.name}".`,
      citations: [
        {
          documentId: document.id,
          documentName: document.name,
          page: 1,
          section: 'Groundedness Guardrail (AI-004)',
          excerpt:
            'Out-of-context query rejected by RAG citation verification engine.',
        },
      ],
    };
  }

  selectDocument(): void {
    const documentName =
      this.selectedDocument?.name ??
      'the selected document';

    this.messages = [
      {
        id: Date.now(),
        role: 'assistant',
        text:
          `I've switched the context to "${documentName}". Ask me anything about this document.`,
        timestamp: this.getCurrentTime(),
      },
    ];

    this.question = '';
  }

  openCitation(citation: QaCitation): void {
    alert(
      `Source: ${citation.documentName}\nPage: ${citation.page}\nSection: ${citation.section}`,
    );
  }

  clearConversation(): void {
    this.messages = [
      {
        id: Date.now(),
        role: 'assistant',
        text:
          'Conversation cleared. Ask a new question about the selected document.',
        timestamp: this.getCurrentTime(),
      },
    ];

    this.question = '';
  }

  toggleHistory(): void {
    this.showHistory = !this.showHistory;
  }

  private getCurrentTime(): string {
    return new Date().toLocaleTimeString(
      'en-IN',
      {
        hour: '2-digit',
        minute: '2-digit',
      },
    );
  }
}