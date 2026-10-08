import { Component, OnInit, OnDestroy, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { EmailValidator, PasswordValidator } from '../../../core/validators';
import { DEMO_ROLES, Role } from '../../../core/models/roles';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  email = '';
  password = '';
  rememberMe = false;
  showPassword = false;

  // Validation States
  emailError: string | null = null;
  emailTouched = false;
  emailValid = false;

  passwordError: string | null = null;
  passwordTouched = false;
  passwordValid = false;

  isSubmitted = false;
  isLoading = false;
  errorMessage = '';

  // Security & Connectivity States (BRD Section 13)
  demoRoles = DEMO_ROLES;
  failedAttempts = 0;
  isLockedOut = false;
  lockoutSecondsLeft = 0;
  private lockoutInterval: any;

  isRateLimited = false;
  isOffline = false;

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.isOffline = !navigator.onLine;
      window.addEventListener('online', this.updateOnlineStatus);
      window.addEventListener('offline', this.updateOnlineStatus);
    }
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.removeEventListener('online', this.updateOnlineStatus);
      window.removeEventListener('offline', this.updateOnlineStatus);
    }
    if (this.lockoutInterval) {
      clearInterval(this.lockoutInterval);
    }
  }

  private updateOnlineStatus = (): void => {
    if (isPlatformBrowser(this.platformId)) {
      this.isOffline = !navigator.onLine;
    }
  };

  validateEmail(isRealtime = false): boolean {
    if (isRealtime && !this.emailTouched && !this.isSubmitted) {
      return true;
    }
    const result = EmailValidator.validate(this.email);
    this.emailError = result.isValid ? null : result.error;
    this.emailValid = result.isValid;
    return result.isValid;
  }

  onEmailChange(): void {
    if (this.emailTouched || this.isSubmitted) {
      this.validateEmail(true);
    }
  }

  onEmailBlur(): void {
    this.emailTouched = true;
    this.validateEmail(false);
  }

  validatePassword(isRealtime = false): boolean {
    if (isRealtime && !this.passwordTouched && !this.isSubmitted) {
      return true;
    }
    const result = PasswordValidator.validateLoginPassword(this.password);
    this.passwordError = result.isValid ? null : result.error;
    this.passwordValid = result.isValid;
    return result.isValid;
  }

  onPasswordChange(): void {
    if (this.passwordTouched || this.isSubmitted) {
      this.validatePassword(true);
    }
  }

  onPasswordBlur(): void {
    this.passwordTouched = true;
    this.validatePassword(false);
  }

  login(): void {
    if (this.isLoading || this.isLockedOut || this.isOffline) {
      return;
    }

    this.isSubmitted = true;
    this.emailTouched = true;
    this.passwordTouched = true;
    this.errorMessage = '';

    const isEmailValid = this.validateEmail(false);
    const isPasswordValid = this.validatePassword(false);

    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    this.isLoading = true;

    setTimeout(() => {
      const success = this.authService.login(this.email, this.password, this.rememberMe);
      this.isLoading = false;

      if (success) {
        this.failedAttempts = 0;
        this.router.navigate(['/dashboard']);
      } else {
        this.failedAttempts++;

        if (this.failedAttempts >= 5) {
          this.triggerLockout();
        } else {
          this.errorMessage = `Invalid credentials. Attempt ${this.failedAttempts} of 5 before account lockout.`;
        }
      }
    }, 600);
  }

  private triggerLockout(): void {
    this.isLockedOut = true;
    this.lockoutSecondsLeft = 60; // 60s lockout
    this.errorMessage = 'Account locked due to 5 consecutive failed login attempts.';

    if (this.lockoutInterval) {
      clearInterval(this.lockoutInterval);
    }

    this.lockoutInterval = setInterval(() => {
      this.lockoutSecondsLeft--;
      if (this.lockoutSecondsLeft <= 0) {
        clearInterval(this.lockoutInterval);
        this.isLockedOut = false;
        this.failedAttempts = 0;
        this.errorMessage = '';
      }
    }, 1000);
  }

  selectRoleByObject(role: Role, email: string): void {
    if (this.isLockedOut) return;
    this.authService.loginByRole(role);
    this.router.navigate(['/dashboard']);
  }

  selectRole(roleEmail: string): void {
    if (this.isLockedOut) return;
    this.email = roleEmail;
    this.password = 'password123';
    this.errorMessage = '';
    this.emailError = null;
    this.passwordError = null;
    this.emailValid = true;
    this.passwordValid = true;
    this.emailTouched = true;
    this.passwordTouched = true;
  }

  loginWithSso(): void {
    if (this.isLockedOut) return;
    this.selectRole('admin@docnexa.io');
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }
}