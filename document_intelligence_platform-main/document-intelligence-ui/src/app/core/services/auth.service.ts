import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  AuthUser,
  LoginCredentials,
} from '../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly storageKey = 'docintel-auth-user';

  readonly currentUser = signal<AuthUser | null>(
    this.getStoredUser(),
  );

  constructor(private router: Router) {}

  login(credentials: LoginCredentials): boolean {
    if (
      !credentials.email.trim() ||
      !credentials.password.trim()
    ) {
      return false;
    }

    const user: AuthUser = {
      id: 'USR-001',
      name: 'Abhishek Yadav',
      email: credentials.email,
      role: 'organization-admin',
      organization: 'Acme Corporation',
      avatarInitials: 'AY',
    };

    this.currentUser.set(user);

    if (credentials.rememberMe) {
      localStorage.setItem(
        this.storageKey,
        JSON.stringify(user),
      );
    } else {
      sessionStorage.setItem(
        this.storageKey,
        JSON.stringify(user),
      );
    }

    return true;
  }

  logout(): void {
    localStorage.removeItem(this.storageKey);
    sessionStorage.removeItem(this.storageKey);

    this.currentUser.set(null);

    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return this.currentUser() !== null;
  }

  getUser(): AuthUser | null {
    return this.currentUser();
  }

  private getStoredUser(): AuthUser | null {
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