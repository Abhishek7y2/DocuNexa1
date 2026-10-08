import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type LifecycleStatus =
  | 'Received'
  | 'Quarantined'
  | 'Validated'
  | 'Processing'
  | 'Review'
  | 'Pending approval'
  | 'Approved/Published'
  | 'Approved'
  | 'Published'
  | 'Rejected'
  | 'Superseded'
  | 'Held'
  | 'Expired'
  | 'Purged';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="status-badge" [class]="normalizedClass">
      <span class="dot"></span>
      <span>{{ displayLabel }}</span>
    </span>
  `,
  styles: [`
    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0.2rem 0.6rem;
      border-radius: 9999px;
      font-size: 0.72rem;
      font-weight: 700;
      line-height: 1;
      white-space: nowrap;

      .dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: currentColor;
      }

      &.received { background: rgba(148, 163, 184, 0.2); color: #cbd5e1; border: 1px solid rgba(148, 163, 184, 0.3); }
      &.quarantined { background: rgba(239, 68, 68, 0.25); color: #fca5a5; border: 1px solid rgba(239, 68, 68, 0.4); }
      &.validated { background: rgba(59, 130, 246, 0.2); color: #93c5fd; border: 1px solid rgba(59, 130, 246, 0.4); }
      &.processing { background: rgba(168, 85, 247, 0.2); color: #d8b4fe; border: 1px solid rgba(168, 85, 247, 0.4); }
      &.review { background: rgba(245, 158, 11, 0.2); color: #fde047; border: 1px solid rgba(245, 158, 11, 0.4); }
      &.pending-approval { background: rgba(234, 179, 8, 0.2); color: #fef08a; border: 1px solid rgba(234, 179, 8, 0.4); }
      &.approved-published, &.approved, &.published { background: rgba(16, 185, 129, 0.2); color: #6ee7b7; border: 1px solid rgba(16, 185, 129, 0.4); }
      &.rejected { background: rgba(220, 38, 38, 0.2); color: #fca5a5; border: 1px solid rgba(220, 38, 38, 0.4); }
      &.superseded { background: rgba(100, 116, 139, 0.25); color: #94a3b8; border: 1px solid rgba(100, 116, 139, 0.4); }
      &.held { background: rgba(217, 119, 6, 0.25); color: #fcd34d; border: 1px solid rgba(217, 119, 6, 0.4); }
      &.expired { background: rgba(156, 163, 175, 0.2); color: #d1d5db; border: 1px solid rgba(156, 163, 175, 0.3); }
      &.purged { background: rgba(75, 85, 99, 0.3); color: #9ca3af; border: 1px solid rgba(75, 85, 99, 0.4); text-decoration: line-through; }
    }
  `]
})
export class StatusBadge {
  @Input({ required: true }) status: string = 'Received';

  get normalizedClass(): string {
    const raw = (this.status || '').toLowerCase().trim();
    if (raw.includes('approved') || raw.includes('published')) return 'approved-published';
    if (raw.includes('pending')) return 'pending-approval';
    if (raw.includes('quarantine')) return 'quarantined';
    if (raw.includes('process')) return 'processing';
    if (raw.includes('review')) return 'review';
    if (raw.includes('supersede')) return 'superseded';
    if (raw.includes('reject')) return 'rejected';
    if (raw.includes('held')) return 'held';
    if (raw.includes('expire')) return 'expired';
    if (raw.includes('purge')) return 'purged';
    if (raw.includes('validate')) return 'validated';
    return 'received';
  }

  get displayLabel(): string {
    const raw = (this.status || '').trim();
    if (raw.toLowerCase() === 'approved' || raw.toLowerCase() === 'published') return 'Approved/Published';
    return raw;
  }
}
