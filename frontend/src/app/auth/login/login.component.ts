import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-md-6 col-lg-4">
            <div class="card shadow-lg border-0">
              <div class="card-body p-5">
                <div class="text-center mb-4">
                  <h2 class="fw-bold text-primary">Welcome Back</h2>
                  <p class="text-muted">Sign in to your account</p>
                </div>

                <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
                  <div class="mb-3">
                    <label for="usernameOrEmail" class="form-label">Username or Email</label>
                    <input
                      type="text"
                      class="form-control"
                      id="usernameOrEmail"
                      formControlName="usernameOrEmail"
                      [class.is-invalid]="loginForm.get('usernameOrEmail')?.invalid && loginForm.get('usernameOrEmail')?.touched"
                    >
                    <div class="invalid-feedback" *ngIf="loginForm.get('usernameOrEmail')?.invalid && loginForm.get('usernameOrEmail')?.touched">
                      Username or email is required
                    </div>
                  </div>

                  <div class="mb-4">
                    <label for="password" class="form-label">Password</label>
                    <input
                      type="password"
                      class="form-control"
                      id="password"
                      formControlName="password"
                      [class.is-invalid]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
                    >
                    <div class="invalid-feedback" *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched">
                      Password is required
                    </div>
                  </div>

                  <div class="alert alert-danger" *ngIf="errorMessage">
                    {{ errorMessage }}
                  </div>

                  <button
                    type="submit"
                    class="btn btn-primary w-100 mb-3"
                    [disabled]="loginForm.invalid || isLoading"
                  >
                    <span *ngIf="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                    {{ isLoading ? 'Signing in...' : 'Sign In' }}
                  </button>
                </form>

                <div class="text-center">
                  <p class="mb-0">Don't have an account? 
                    <a routerLink="/register" class="text-primary fw-medium">Sign up</a>
                  </p>
                </div>

                <hr class="my-4">

                <div class="text-center">
                  <p class="mb-2 text-muted">Track a parcel without login</p>
                  <a routerLink="/track" class="btn btn-outline-secondary btn-sm">
                    <i class="bi bi-search me-1"></i>
                    Track Parcel
                  </a>
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
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  returnUrl = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.formBuilder.group({
      usernameOrEmail: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Redirect if already logged in
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
      return;
    }

    // Get return url from route parameters or default to '/dashboard'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      Object.keys(this.loginForm.controls).forEach(key => {
        this.loginForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.router.navigate([this.returnUrl]);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.error || 'Login failed. Please try again.';
      }
    });
  }
}