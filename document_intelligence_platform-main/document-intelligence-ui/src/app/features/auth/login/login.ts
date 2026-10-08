import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { EmailValidator, PasswordValidator } from '../../../core/validators';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
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

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {}

  /**
   * Realtime/Blur email validation.
   */
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

  /**
   * Realtime/Blur password validation.
   */
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

  /**
   * Enterprise-grade submit validation and login handler.
   */
  login(): void {
    if (this.isLoading) {
      return; // Prevent accidental double submission
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
    const normalizedEmail = EmailValidator.normalize(this.email);

    setTimeout(() => {
      const success = this.authService.login(
        normalizedEmail,
        this.password,
        this.rememberMe,
      );

      this.isLoading = false;

      if (success) {
        this.router.navigate(['/dashboard']);
      } else {
        // Generic enterprise security message: never reveal whether email exists
        this.errorMessage = 'Invalid email or password. Please verify your credentials and try again.';
      }
    }, 600);
  }

  selectRole(roleEmail: string): void {
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
    this.email = 'abhishek7y2@gmail.com';
    this.password = 'password123';
    this.login();
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }
}