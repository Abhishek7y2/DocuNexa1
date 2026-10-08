import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface TaskItem {
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
  imports: [FormsModule, RouterLink],
  templateUrl: './tasks.html',
  styleUrl: './tasks.scss',
})
export class Tasks {
  searchTerm = '';
  selectedStatus = 'All Status';
  selectedPriority = 'All Priority';

  selectedTask: TaskItem | null = null;
  showTaskPanel = false;

  tasks: TaskItem[] = [
    {
      id: 'TSK-00421',
      title: 'Review extracted invoice fields',
      description:
        'Verify vendor name, invoice amount, tax details and invoice date.',
      documentId: 'DOC-10247',
      documentName: 'Purchase Invoice - INV-78421',
      type: 'Review',
      priority: 'High',
      status: 'Pending',
      assignedBy: 'Priya Mehta',
      dueDate: 'Today, 08:00 PM',
      createdAt: '06 Oct 2026 · 09:18 AM',
    },
    {
      id: 'TSK-00420',
      title: 'Approve supplier agreement',
      description:
        'Final approval is required after reviewer validation.',
      documentId: 'DOC-10245',
      documentName: 'Vendor Master Agreement',
      type: 'Approval',
      priority: 'High',
      status: 'In Progress',
      assignedBy: 'Rahul Sharma',
      dueDate: '07 Oct 2026',
      createdAt: '05 Oct 2026 · 03:42 PM',
    },
    {
      id: 'TSK-00419',
      title: 'Validate policy extraction',
      description:
        'Check extracted policy sections against the source document.',
      documentId: 'DOC-10243',
      documentName: 'Employee Data Handling Policy',
      type: 'Review',
      priority: 'Medium',
      status: 'Pending',
      assignedBy: 'Priya Mehta',
      dueDate: '08 Oct 2026',
      createdAt: '05 Oct 2026 · 11:26 AM',
    },
    {
      id: 'TSK-00418',
      title: 'Review contract changes',
      description:
        'Review the requested changes in the supplier contract.',
      documentId: 'DOC-10239',
      documentName: 'Technology Services Agreement',
      type: 'Review',
      priority: 'Medium',
      status: 'Overdue',
      assignedBy: 'Rahul Sharma',
      dueDate: '05 Oct 2026',
      createdAt: '04 Oct 2026 · 01:08 PM',
    },
    {
      id: 'TSK-00417',
      title: 'Confirm invoice classification',
      description:
        'Confirm that the uploaded document has been classified correctly.',
      documentId: 'DOC-10241',
      documentName: 'Purchase Invoice - INV-78415',
      type: 'Validation',
      priority: 'Low',
      status: 'Completed',
      assignedBy: 'Neha Verma',
      dueDate: '04 Oct 2026',
      createdAt: '04 Oct 2026 · 05:14 PM',
    },
    {
      id: 'TSK-00416',
      title: 'Review information security policy',
      description:
        'Perform final reader-level verification before publishing.',
      documentId: 'DOC-10246',
      documentName: 'Information Security Policy',
      type: 'Review',
      priority: 'Low',
      status: 'Completed',
      assignedBy: 'Priya Mehta',
      dueDate: '03 Oct 2026',
      createdAt: '03 Oct 2026 · 10:42 AM',
    },
  ];

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
    return this.tasks.filter(
      (task) => task.status === 'Pending',
    ).length;
  }

  get inProgressCount(): number {
    return this.tasks.filter(
      (task) => task.status === 'In Progress',
    ).length;
  }

  get overdueCount(): number {
    return this.tasks.filter(
      (task) => task.status === 'Overdue',
    ).length;
  }

  get completedCount(): number {
    return this.tasks.filter(
      (task) => task.status === 'Completed',
    ).length;
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
    if (!this.selectedTask) {
      return;
    }

    const task = this.tasks.find(
      (item) => item.id === this.selectedTask?.id,
    );

    if (!task) {
      return;
    }

    task.status = 'In Progress';
    this.selectedTask = task;
  }

  completeTask(): void {
    if (!this.selectedTask) {
      return;
    }

    const task = this.tasks.find(
      (item) => item.id === this.selectedTask?.id,
    );

    if (!task) {
      return;
    }

    task.status = 'Completed';
    this.selectedTask = task;
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedStatus = 'All Status';
    this.selectedPriority = 'All Priority';
  }
}