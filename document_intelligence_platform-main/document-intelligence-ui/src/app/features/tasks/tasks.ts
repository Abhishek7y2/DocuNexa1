import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { LoadingState } from '../../shared/ui/loading-state/loading-state';
import { ErrorState } from '../../shared/ui/error-state/error-state';
import { REVIEW_SERVICE_TOKEN, MockReviewService } from '../../core/services/api-services';

export interface TaskItem {
  id: string;
  title: string;
  description: string;
  documentId: string;
  documentName: string;
  type: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'In Progress' | 'Completed' | 'Overdue';
  assignedBy: string;
  dueDate: string;
  createdAt: string;
}

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LoadingState, ErrorState],
  templateUrl: './tasks.html',
  styleUrl: './tasks.scss',
  providers: [{ provide: REVIEW_SERVICE_TOKEN, useClass: MockReviewService }],
})
export class Tasks implements OnInit {
  private readonly reviewService = inject(REVIEW_SERVICE_TOKEN);

  searchTerm = '';
  selectedStatus = 'All Status';
  selectedPriority = 'All Priority';

  isLoading = signal(true);
  hasError = signal(false);

  selectedTask: TaskItem | null = null;
  showTaskPanel = false;

  tasks: TaskItem[] = [];

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.isLoading.set(true);
    this.hasError.set(false);

    this.reviewService.getReviewQueue().subscribe({
      next: (queue) => {
        this.tasks = queue.map((q) => ({
          id: `TSK-${q.id.replace('REV-', '')}`,
          title: `Review ${q.documentTitle}`,
          description: 'Verify extracted metadata and resolve field anomalies.',
          documentId: q.docId,
          documentName: q.documentTitle,
          type: 'Review',
          priority: q.priority || 'High',
          status: q.status === 'Pending Review' ? 'Pending' : (q.status as any),
          assignedBy: 'Priya Mehta',
          dueDate: 'Today, 08:00 PM',
          createdAt: q.submittedAt || '06 Oct 2026',
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
    this.loadTasks();
  }

  get filteredTasks(): TaskItem[] {
    const search = this.searchTerm.trim().toLowerCase();

    return this.tasks.filter((task) => {
      const matchesSearch =
        !search ||
        task.title.toLowerCase().includes(search) ||
        task.description.toLowerCase().includes(search) ||
        task.documentName.toLowerCase().includes(search) ||
        task.documentId.toLowerCase().includes(search);

      const matchesStatus =
        this.selectedStatus === 'All Status' ||
        task.status === this.selectedStatus;

      const matchesPriority =
        this.selectedPriority === 'All Priority' ||
        task.priority === this.selectedPriority;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority
      );
    });
  }

  get pendingCount(): number {
    return this.tasks.filter((task) => task.status === 'Pending').length;
  }

  get inProgressCount(): number {
    return this.tasks.filter((task) => task.status === 'In Progress').length;
  }

  get overdueCount(): number {
    return this.tasks.filter((task) => task.status === 'Overdue').length;
  }

  get completedCount(): number {
    return this.tasks.filter((task) => task.status === 'Completed').length;
  }

  openTask(task: TaskItem): void {
    this.selectedTask = task;
    this.showTaskPanel = true;
  }

  closeTask(): void {
    this.selectedTask = null;
    this.showTaskPanel = false;
  }

  startTask(): void {
    if (!this.selectedTask) return;
    const task = this.tasks.find((item) => item.id === this.selectedTask?.id);
    if (!task) return;
    task.status = 'In Progress';
    this.selectedTask = task;
  }

  completeTask(): void {
    if (!this.selectedTask) return;
    const task = this.tasks.find((item) => item.id === this.selectedTask?.id);
    if (!task) return;
    task.status = 'Completed';
    this.selectedTask = task;
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedStatus = 'All Status';
    this.selectedPriority = 'All Priority';
  }
}