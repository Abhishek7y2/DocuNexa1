import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: 'org_admin' | 'reviewer' | 'approver' | 'contributor' | 'auditor' | 'platform_operator';
  workspaceScope: string;
  status: 'active' | 'deactivated';
  mfaEnabled: boolean;
  mfaRequired: boolean;
  lastActive: string;
}

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-users-page">
      <div class="header-bar">
        <div>
          <h2>User Accounts & Role Permissions</h2>
          <p>Invite organization members, assign scoped roles, enforce MFA policies, and manage access.</p>
        </div>
        <button type="button" class="btn-primary" (click)="openInviteModal()">+ Invite New User</button>
      </div>

      <!-- FILTER BAR -->
      <div class="filter-card">
        <div class="search-box">
          <span>⌕</span>
          <input type="text" [(ngModel)]="searchTerm" placeholder="Search by name, email, or workspace..." />
        </div>

        <select [(ngModel)]="selectedRole">
          <option value="all">All Roles</option>
          <option value="org_admin">Organization Admin</option>
          <option value="reviewer">Reviewer</option>
          <option value="approver">Approver</option>
          <option value="contributor">Contributor</option>
          <option value="auditor">Auditor</option>
        </select>

        <select [(ngModel)]="selectedStatus">
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="deactivated">Deactivated</option>
        </select>
      </div>

      <!-- USERS TABLE -->
      <div class="table-card">
        <table class="users-table">
          <thead>
            <tr>
              <th>USER NAME & EMAIL</th>
              <th>ASSIGNED ROLE</th>
              <th>WORKSPACE SCOPE</th>
              <th>MFA STATUS</th>
              <th>STATUS</th>
              <th class="text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            @for (u of filteredUsers; track u.id) {
              <tr [class.deactivated-row]="u.status === 'deactivated'">
                <td>
                  <strong>{{ u.name }}</strong>
                  <span class="email-sub">{{ u.email }}</span>
                </td>
                <td><span class="role-badge {{ u.role }}">{{ u.role | uppercase }}</span></td>
                <td><span class="scope-tag">{{ u.workspaceScope }}</span></td>
                <td>
                  <div class="mfa-cell">
                    <span class="mfa-dot" [class.enabled]="u.mfaEnabled"></span>
                    <span>{{ u.mfaEnabled ? 'MFA Active' : 'Not Set' }}</span>
                    <button type="button" class="btn-toggle-mfa" (click)="toggleRequireMfa(u)">
                      {{ u.mfaRequired ? 'Required ★' : 'Optional' }}
                    </button>
                  </div>
                </td>
                <td>
                  <span class="status-chip {{ u.status }}">{{ u.status | uppercase }}</span>
                </td>
                <td class="text-right">
                  <button type="button" class="btn-act-edit" (click)="openEditModal(u)">Edit Role</button>
                  @if (u.status === 'active') {
                    <button type="button" class="btn-act-deactivate" (click)="confirmDeactivateUser(u)">Deactivate</button>
                  } @else {
                    <button type="button" class="btn-act-activate" (click)="reactivateUser(u)">Reactivate</button>
                  }
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <!-- INVITE / EDIT MODAL -->
      @if (showInviteModal) {
        <div class="modal-backdrop" (click)="showInviteModal = false">
          <div class="user-modal-card" (click)="$event.stopPropagation()">
            <h3>{{ editingUser ? 'Edit User Role & Scope' : 'Invite New Organization User' }}</h3>
            <div class="form-group">
              <label>Full Name:</label>
              <input type="text" [(ngModel)]="userForm.name" class="modal-input" placeholder="e.g. Ankit Verma" />
            </div>
            <div class="form-group">
              <label>Email Address:</label>
              <input type="email" [(ngModel)]="userForm.email" class="modal-input" placeholder="ankit@acme.com" [disabled]="!!editingUser" />
            </div>
            <div class="form-group">
              <label>Assigned Role:</label>
              <select [(ngModel)]="userForm.role" class="modal-select">
                <option value="org_admin">Organization Admin</option>
                <option value="reviewer">Reviewer</option>
                <option value="approver">Approver</option>
                <option value="contributor">Contributor</option>
                <option value="auditor">Auditor</option>
              </select>
            </div>
            <div class="form-group">
              <label>Workspace Scope:</label>
              <select [(ngModel)]="userForm.workspaceScope" class="modal-select">
                <option value="All Workspaces (Global)">All Workspaces (Global)</option>
                <option value="Finance & Accounting Workspace">Finance & Accounting Workspace</option>
                <option value="Legal & Contracting Workspace">Legal & Contracting Workspace</option>
                <option value="Operations Workspace">Operations Workspace</option>
              </select>
            </div>
            <div class="modal-actions">
              <button type="button" class="btn-secondary" (click)="showInviteModal = false">Cancel</button>
              <button type="button" class="btn-primary" (click)="saveUser()">Save User & Send Invitation</button>
            </div>
          </div>
        </div>
      }

      @if (toastMessage) {
        <div class="toast-popup"><span>{{ toastMessage }}</span></div>
      }
    </div>
  `,
  styles: [`
    .admin-users-page { display: flex; flex-direction: column; gap: 1.25rem; }
    .header-bar { display: flex; justify-content: space-between; align-items: flex-start; h2 { margin: 0; font-size: 1.25rem; color: #0f172a; } p { margin: 0.2rem 0 0 0; color: #64748b; font-size: 0.85rem; } }
    .btn-primary { background: #4f46e5; color: #ffffff; border: none; border-radius: 6px; padding: 0.55rem 1.1rem; font-weight: 700; font-size: 0.85rem; cursor: pointer; }
    .filter-card { display: flex; gap: 1rem; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 0.85rem; box-shadow: 0 2px 8px rgba(15,23,42,0.04); .search-box { flex: 1; display: flex; align-items: center; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 6px; padding: 0 0.65rem; span { color: #64748b; margin-right: 0.4rem; } input { width: 100%; background: transparent; border: none; color: #0f172a; padding: 0.45rem 0; font-size: 0.82rem; &:focus { outline: none; } } } select { background: #f8fafc; border: 1px solid #cbd5e1; color: #0f172a; border-radius: 6px; padding: 0.45rem; font-size: 0.82rem; } }
    .table-card { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow-x: auto; box-shadow: 0 2px 8px rgba(15,23,42,0.04); }
    .users-table { width: 100%; border-collapse: collapse; font-size: 0.82rem; th { background: #f8fafc; color: #64748b; padding: 0.65rem 0.85rem; text-align: left; font-size: 0.72rem; border-bottom: 1px solid #e2e8f0; } td { padding: 0.75rem 0.85rem; border-bottom: 1px solid #f1f5f9; color: #0f172a; } .email-sub { font-size: 0.7rem; color: #64748b; display: block; } .role-badge { background: #e0e7ff; color: #4338ca; padding: 0.15rem 0.45rem; border-radius: 4px; font-weight: 700; font-size: 0.7rem; } .scope-tag { background: #f1f5f9; color: #475569; font-size: 0.7rem; padding: 0.1rem 0.4rem; border-radius: 4px; border: 1px solid #e2e8f0; } .mfa-cell { display: flex; align-items: center; gap: 0.4rem; .mfa-dot { width: 6px; height: 6px; border-radius: 50%; background: #ef4444; &.enabled { background: #16a34a; } } .btn-toggle-mfa { background: #ffffff; border: 1px solid #cbd5e1; color: #475569; border-radius: 4px; font-size: 0.68rem; padding: 0.1rem 0.35rem; cursor: pointer; } } .status-chip { padding: 0.15rem 0.45rem; border-radius: 9999px; font-size: 0.7rem; font-weight: 700; &.active { background: #dcfce7; color: #15803d; } &.deactivated { background: #fef2f2; color: #b91c1c; } } .btn-act-edit { background: #f1f5f9; color: #334155; border: 1px solid #cbd5e1; border-radius: 4px; padding: 0.25rem 0.5rem; font-size: 0.72rem; cursor: pointer; margin-right: 0.35rem; } .btn-act-deactivate { background: #fef2f2; color: #b91c1c; border: 1px solid #fecaca; border-radius: 4px; padding: 0.25rem 0.5rem; font-size: 0.72rem; cursor: pointer; } .btn-act-activate { background: #dcfce7; color: #15803d; border: 1px solid #bbf7d0; border-radius: 4px; padding: 0.25rem 0.5rem; font-size: 0.72rem; cursor: pointer; } .deactivated-row { opacity: 0.6; } }
    .modal-backdrop { position: fixed; inset: 0; background: rgba(15,23,42,0.6); backdrop-filter: blur(3px); z-index: 100; }
    .user-modal-card { position: fixed; top: 50%; left: 50%; transform: translate(-50%,-50%); width: 440px; background: #ffffff; border: 1px solid #cbd5e1; border-radius: 12px; padding: 1.5rem; box-shadow: 0 10px 30px rgba(0,0,0,0.15); z-index: 105; h3 { margin: 0 0 1rem 0; font-size: 1.1rem; color: #0f172a; } .form-group { margin-bottom: 1rem; label { font-size: 0.78rem; color: #475569; display: block; margin-bottom: 0.35rem; } .modal-input, .modal-select { width: 100%; background: #f8fafc; border: 1px solid #cbd5e1; color: #0f172a; padding: 0.5rem; border-radius: 6px; box-sizing: border-box; } } .modal-actions { display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.25rem; .btn-secondary { background: #f1f5f9; color: #475569; border: 1px solid #cbd5e1; border-radius: 6px; padding: 0.5rem 1rem; font-size: 0.82rem; cursor: pointer; } .btn-primary { background: #4f46e5; color: #ffffff; border: none; border-radius: 6px; padding: 0.5rem 1.1rem; font-size: 0.82rem; font-weight: 700; cursor: pointer; } } }
    .toast-popup { position: fixed; bottom: 2rem; right: 2rem; z-index: 300; background: #15803d; color: #ffffff; padding: 0.75rem 1.25rem; border-radius: 8px; font-weight: 600; font-size: 0.85rem; }
  `]
})
export class AdminUsers implements OnInit {
  searchTerm = '';
  selectedRole = 'all';
  selectedStatus = 'all';

  showInviteModal = false;
  editingUser: UserAccount | null = null;
  toastMessage: string | null = null;

  userForm: Partial<UserAccount> = {
    name: '',
    email: '',
    role: 'reviewer',
    workspaceScope: 'Finance & Accounting Workspace',
  };

  users: UserAccount[] = [
    { id: 'USR-1', name: 'Abhishek Yadav', email: 'admin@docnexa.io', role: 'org_admin', workspaceScope: 'All Workspaces (Global)', status: 'active', mfaEnabled: true, mfaRequired: true, lastActive: 'Just now' },
    { id: 'USR-2', name: 'Rahul Sharma', email: 'reviewer@docnexa.io', role: 'reviewer', workspaceScope: 'Finance & Accounting Workspace', status: 'active', mfaEnabled: true, mfaRequired: false, lastActive: '12 min ago' },
    { id: 'USR-3', name: 'Priya Mehta', email: 'approver@docnexa.io', role: 'approver', workspaceScope: 'Finance & Accounting Workspace', status: 'active', mfaEnabled: true, mfaRequired: true, lastActive: '34 min ago' },
    { id: 'USR-4', name: 'Neha Verma', email: 'contributor@docnexa.io', role: 'contributor', workspaceScope: 'Operations Workspace', status: 'active', mfaEnabled: false, mfaRequired: false, lastActive: '1 hour ago' },
    { id: 'USR-5', name: 'Arjun Kapoor', email: 'auditor@docnexa.io', role: 'auditor', workspaceScope: 'All Workspaces (Global)', status: 'active', mfaEnabled: true, mfaRequired: false, lastActive: '2 hours ago' },
  ];

  ngOnInit(): void {}

  get filteredUsers(): UserAccount[] {
    const s = this.searchTerm.trim().toLowerCase();
    return this.users.filter(u => {
      const matchSearch = !s || u.name.toLowerCase().includes(s) || u.email.toLowerCase().includes(s) || u.workspaceScope.toLowerCase().includes(s);
      const matchRole = this.selectedRole === 'all' || u.role === this.selectedRole;
      const matchStatus = this.selectedStatus === 'all' || u.status === this.selectedStatus;
      return matchSearch && matchRole && matchStatus;
    });
  }

  openInviteModal(): void {
    this.editingUser = null;
    this.userForm = { name: '', email: '', role: 'reviewer', workspaceScope: 'Finance & Accounting Workspace' };
    this.showInviteModal = true;
  }

  openEditModal(user: UserAccount): void {
    this.editingUser = user;
    this.userForm = { ...user };
    this.showInviteModal = true;
  }

  saveUser(): void {
    if (!this.userForm.name || !this.userForm.email) return;

    if (this.editingUser) {
      this.editingUser.role = this.userForm.role as any;
      this.editingUser.workspaceScope = this.userForm.workspaceScope || 'All Workspaces';
      this.showToast(`Updated user roles and scope for ${this.editingUser.name}`);
    } else {
      const newUser: UserAccount = {
        id: `USR-${Date.now()}`,
        name: this.userForm.name,
        email: this.userForm.email,
        role: this.userForm.role as any,
        workspaceScope: this.userForm.workspaceScope || 'All Workspaces',
        status: 'active',
        mfaEnabled: false,
        mfaRequired: this.userForm.role === 'org_admin' || this.userForm.role === 'approver',
        lastActive: 'Invited',
      };
      this.users.unshift(newUser);
      this.showToast(`Invited ${newUser.name} as ${newUser.role.toUpperCase()}`);
    }
    this.showInviteModal = false;
  }

  confirmDeactivateUser(user: UserAccount): void {
    if (confirm(`Deactivate access for ${user.name}? Access to UI, API, files, and exports will be revoked immediately.`)) {
      user.status = 'deactivated';
      this.showToast(`Deactivated access for ${user.name}. Access revoked immediately.`);
    }
  }

  reactivateUser(user: UserAccount): void {
    user.status = 'active';
    this.showToast(`Reactivated user account for ${user.name}`);
  }

  toggleRequireMfa(user: UserAccount): void {
    user.mfaRequired = !user.mfaRequired;
    this.showToast(`MFA enforcement policy updated for ${user.name}`);
  }

  showToast(msg: string): void {
    this.toastMessage = msg;
    setTimeout(() => { if (this.toastMessage === msg) this.toastMessage = null; }, 3500);
  }
}
