import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserRole } from '../../models/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-vh-100 d-flex align-items-center justify-content-center bg-light py-5">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-md-8 col-lg-6">
            <div class="card shadow-lg border-0">
              <div class="card-body p-5">
                <div class="text-center mb-4">
                  <h2 class="fw-bold text-primary">Create Account</h2>
                  <p class="text-muted">Join our parcel management system</p>
                </div>

                <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
                  <div class="row">
                    <div class="col-md-6 mb-3">
                      <label for="firstName" class="form-label">First Name</label>
                      <input
                        type="text"
                        class="form-control"
                        id="firstName"
                        formControlName="firstName"
                        [class.is-invalid]="registerForm.get('firstName')?.invalid && registerForm.get('firstName')?.touched"
                      >
                      <div class="invalid-feedback" *ngIf="registerForm.get('firstName')?.invalid && registerForm.get('firstName')?.touched">
                        First name is required
                      </div>
                    </div>

                    <div class="col-md-6 mb-3">
                      <label for="lastName" class="form-label">Last Name</label>
                      <input
                        type="text"
                        class="form-control"
                        id="lastName"
                        formControlName="lastName"
                        [class.is-invalid]="registerForm.get('lastName')?.invalid && registerForm.get('lastName')?.touched"
                      >
                      <div class="invalid-feedback" *ngIf="registerForm.get('lastName')?.invalid && registerForm.get('lastName')?.touched">
                        Last name is required
                      </div>
                    </div>
                  </div>

                  <div class="mb-3">
                    <label for="username" class="form-label">Username</label>
                    <input
                      type="text"
                      class="form-control"
                      id="username"
                      formControlName="username"
                      [class.is-invalid]="registerForm.get('username')?.invalid && registerForm.get('username')?.touched"
                    >
                    <div class="invalid-feedback" *ngIf="registerForm.get('username')?.invalid && registerForm.get('username')?.touched">
                      <div *ngIf="registerForm.get('username')?.errors?.['required']">Username is required</div>
                      <div *ngIf="registerForm.get('username')?.errors?.['minlength']">Username must be at least 3 characters</div>
                    </div>
                  </div>

                  <div class="mb-3">
                    <label for="email" class="form-label">Email</label>
                    <input
                      type="email"
                      class="form-control"
                      id="email"
                      formControlName="email"
                      [class.is-invalid]="registerForm.get('email')?.invalid && registerForm.get('email')?.touched"
                    >
                    <div class="invalid-feedback" *ngIf="registerForm.get('email')?.invalid && registerForm.get('email')?.touched">
                      <div *ngIf="registerForm.get('email')?.errors?.['required']">Email is required</div>
                      <div *ngIf="registerForm.get('email')?.errors?.['email']">Please enter a valid email</div>
                    </div>
                  </div>

                  <div class="mb-3">
                    <label for="password" class="form-label">Password</label>
                    <input
                      type="password"
                      class="form-control"
                      id="password"
                      formControlName="password"
                      [class.is-invalid]="registerForm.get('password')?.invalid && registerForm.get('password')?.touched"
                    >
                    <div class="invalid-feedback" *ngIf="registerForm.get('password')?.invalid && registerForm.get('password')?.touched">
                      <div *ngIf="registerForm.get('password')?.errors?.['required']">Password is required</div>
                      <div *ngIf="registerForm.get('password')?.errors?.['minlength']">Password must be at least 6 characters</div>
                    </div>
                  </div>

                  <div class="mb-3">
                    <label for="phoneNumber" class="form-label">Phone Number (Optional)</label>
                    <input
                      type="tel"
                      class="form-control"
                      id="phoneNumber"
                      formControlName="phoneNumber"
                    >
                  </div>

                  <div class="mb-4">
                    <label for="address" class="form-label">Address (Optional)</label>
                    <textarea
                      class="form-control"
                      id="address"
                      rows="3"
                      formControlName="address"
                    ></textarea>
                  </div>

                  <div class="alert alert-success" *ngIf="successMessage">
                    {{ successMessage }}
                  </div>

                  <div class="alert alert-danger" *ngIf="errorMessage">
                    {{ errorMessage }}
                  </div>

                  <button
                    type="submit"
                    class="btn btn-primary w-100 mb-3"
                    [disabled]="registerForm.invalid || isLoading"
                  >
                    <span *ngIf="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                    {{ isLoading ? 'Creating Account...' : 'Create Account' }}
                  </button>
                </form>

                <div class="text-center">
                  <p class="mb-0">Already have an account? 
                    <a routerLink="/login" class="text-primary fw-medium">Sign in</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .min-vh-100 {
      min-height: 100vh;
    }
    
    .card {
      border-radius: 15px;
    }
    
    .form-control:focus {
      border-color: var(--bs-primary);
      box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
    }
    
    .btn-primary {
      padding: 12px 0;
      font-weight: 500;
    }
  `]
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phoneNumber: [''],
      address: ['']
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      Object.keys(this.registerForm.controls).forEach(key => {
        this.registerForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const formData = { ...this.registerForm.value, role: UserRole.CUSTOMER };

    this.authService.register(formData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = 'Account created successfully! Please login.';
        this.registerForm.reset();
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.error || 'Registration failed. Please try again.';
      }
    });
  }
}