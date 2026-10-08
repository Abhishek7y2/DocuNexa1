import { Injectable, inject } from '@angular/core';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  organization: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly storageKey = 'docintel-auth';
  private readonly platformId = inject(PLATFORM_ID);

  private readonly usersList: AuthUser[] = [
    {
      id: 'USR-001',
      name: 'Abhishek Yadav',
      email: 'abhishek7y2@gmail.com',
      role: 'Organization Admin',
      organization: 'Acme Corporation',
    },
    {
      id: 'USR-002',
      name: 'Rahul Sharma',
      email: 'rahul7y2@gmail.com',
      role: 'Senior Operations Reviewer',
      organization: 'Acme Corporation',
    },
    {
      id: 'USR-003',
      name: 'Priya Mehta',
      email: 'priya7y2@gmail.com',
      role: 'Financial Approver',
      organization: 'Acme Corporation',
    },
    {
      id: 'USR-004',
      name: 'Neha Verma',
      email: 'neha7y2@gmail.com',
      role: 'Procurement Contributor',
      organization: 'Acme Corporation',
    },
    {
      id: 'USR-005',
      name: 'Arjun Kapoor',
      email: 'arjun7y2@gmail.com',
      role: 'Compliance Reader / Auditor',
      organization: 'Acme Corporation',
    },
    {
      id: 'USR-006',
      name: 'Karan Malhotra',
      email: 'karan7y2@gmail.com',
      role: 'Procurement Contributor',
      organization: 'Acme Corporation',
    },
  ];

  login(
    email: string,
    password: string,
    _rememberMe = true,
  ): boolean {
    const matchedUser = this.usersList.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase(),
    );
    const validPassword = password === 'password123';

    if (!matchedUser || !validPassword) {
      return false;
    }

    if (!isPlatformBrowser(this.platformId)) {
      return false;
    }

    // Keep demo login persistent until user explicitly logs out.
    localStorage.setItem(
      this.storageKey,
      JSON.stringify(matchedUser),
    );

    return true;
  }

  loginByEmail(email: string): boolean {
    const matchedUser = this.usersList.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase(),
    ) || {
      id: 'USR-001',
      name: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      email: email,
      role: 'Organization Admin',
      organization: 'Acme Corporation',
    };

    if (!isPlatformBrowser(this.platformId)) {
      return false;
    }

    localStorage.setItem(this.storageKey, JSON.stringify(matchedUser));
    return true;
  }

  logout(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    localStorage.removeItem(this.storageKey);
    sessionStorage.removeItem(this.storageKey);
  }

  isAuthenticated(): boolean {
    if (!isPlatformBrowser(this.platformId)) {
      return false;
    }

    return Boolean(
      localStorage.getItem(this.storageKey),
    );
  }

  getCurrentUser(): AuthUser | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }

    const user = localStorage.getItem(this.storageKey);

    if (!user) {
      return null;
    }

    try {
      return JSON.parse(user) as AuthUser;
    } catch {
      localStorage.removeItem(this.storageKey);
      return null;
    }
  }
}