import { Injectable, inject, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { Role, DEMO_ROLES } from '../models/roles';
import { AuthUser } from '../models/auth.model';

export type { AuthUser } from '../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly storageKey = 'docintel-auth';
  private readonly platformId = inject(PLATFORM_ID);
  private readonly router = inject(Router);

  readonly currentUser = signal<AuthUser | null>(this.getStoredUser());

  private readonly usersList: AuthUser[] = DEMO_ROLES.map((role) => ({
    id: `USR-${role.id.toUpperCase()}`,
    name: `${role.name} User`,
    email: role.demoEmail,
    role: role.id,
    organization: role.organization,
    avatarInitials: role.avatarInitials,
    status: 'active',
  }));

  login(email: string, password: string, rememberMe = true): boolean {
    const matchedUser = this.usersList.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );

    const validPassword = password === 'password123' || password.length >= 8;

    if (!matchedUser || !validPassword) {
      return false;
    }

    this.setCurrentUser(matchedUser, rememberMe);
    return true;
  }

  loginByEmail(email: string): boolean {
    const matchedUser = this.usersList.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    ) || {
      id: 'USR-ADMIN',
      name: email.split('@')[0],
      email: email,
      role: 'org_admin' as Role,
      organization: 'Acme Enterprise',
      avatarInitials: 'AE',
      status: 'active' as const,
    };

    this.setCurrentUser(matchedUser, true);
    return true;
  }

  loginByRole(role: Role): boolean {
    const matchedUser = this.usersList.find((u) => u.role === role);
    if (!matchedUser) return false;

    this.setCurrentUser(matchedUser, true);
    return true;
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.storageKey);
      sessionStorage.removeItem(this.storageKey);
    }
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return this.currentUser() !== null;
  }

  getUser(): AuthUser | null {
    return this.currentUser();
  }

  getCurrentUser(): AuthUser | null {
    return this.currentUser();
  }

  private setCurrentUser(user: AuthUser, rememberMe: boolean): void {
    this.currentUser.set(user);
    if (isPlatformBrowser(this.platformId)) {
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem(this.storageKey, JSON.stringify(user));
    }
  }

  private getStoredUser(): AuthUser | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }

    const stored =
      localStorage.getItem(this.storageKey) ??
      sessionStorage.getItem(this.storageKey);

    if (!stored) {
      return null;
    }

    try {
      return JSON.parse(stored) as AuthUser;
    } catch {
      localStorage.removeItem(this.storageKey);
      sessionStorage.removeItem(this.storageKey);
      return null;
    }
  }
}