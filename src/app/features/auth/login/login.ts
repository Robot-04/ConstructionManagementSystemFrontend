import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {

  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  isLoading = false;
  errorMessage = '';

  loginForm = this.fb.nonNullable.group({
    email: [
      '',
      [
        Validators.required,
        Validators.email
      ]
    ],

    password: [
      '',
      [
        Validators.required,
        Validators.minLength(6)
      ]
    ]
  });

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService
      .login(this.loginForm.getRawValue())
      .subscribe({
        next: response => {
          const role = response.data.user.role;

          if (role === 'ADMIN') {
            this.router.navigate(['/admin/dashboard']);
          } else {
            this.router.navigate(['/manager/dashboard']);
          }
        },

        error: error => {
          this.isLoading = false;

          this.errorMessage =
            error?.error?.message ||
            'Unable to login. Please try again.';
        },

        complete: () => {
          this.isLoading = false;
        }
      });
  }
}
