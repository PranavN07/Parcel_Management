import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ParcelService } from '../../../services/parcel.service';

@Component({
  selector: 'app-public-tracking',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-vh-100 bg-light">
      <!-- Navigation -->
      <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
        <div class="container">
          <a class="navbar-brand fw-bold text-primary" href="#">
            <i class="bi bi-box-seam me-2"></i>
            Parcel Management
          </a>
          <div class="navbar-nav ms-auto">
            <a routerLink="/login" class="btn btn-outline-primary me-2">Login</a>
            <a routerLink="/register" class="btn btn-primary">Register</a>
          </div>
        </div>
      </nav>

      <!-- Main Content -->
      <div class="container py-5">
        <div class="row justify-content-center">
          <div class="col-md-8 col-lg-6">
            <!-- Tracking Form -->
            <div class="card shadow-lg border-0 mb-4">
              <div class="card-body p-5">
                <div class="text-center mb-4">
                  <i class="bi bi-search display-4 text-primary"></i>
                  <h2 class="mt-3 mb-2">Track Your Parcel</h2>
                  <p class="text-muted">Enter your tracking number to see real-time status updates</p>
                </div>

                <form [formGroup]="trackingForm" (ngSubmit)="onSubmit()">
                  <div class="mb-3">
                    <label for="trackingNumber" class="form-label">Tracking Number</label>
                    <input
                      type="text"
                      class="form-control form-control-lg"
                      id="trackingNumber"
                      formControlName="trackingNumber"
                      placeholder="Enter tracking number (e.g., TRK1234567890)"
                      [class.is-invalid]="trackingForm.get('trackingNumber')?.invalid && trackingForm.get('trackingNumber')?.touched"
                    >
                    <div class="invalid-feedback" *ngIf="trackingForm.get('trackingNumber')?.invalid && trackingForm.get('trackingNumber')?.touched">
                      Please enter a valid tracking number
                    </div>
                  </div>

                  <div class="alert alert-danger" *ngIf="errorMessage">
                    <i class="bi bi-exclamation-circle me-2"></i>
                    {{ errorMessage }}
                  </div>

                  <button
                    type="submit"
                    class="btn btn-primary btn-lg w-100"
                    [disabled]="trackingForm.invalid || isLoading"
                  >
                    <span *ngIf="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                    <i class="bi bi-search me-2" *ngIf="!isLoading"></i>
                    {{ isLoading ? 'Tracking...' : 'Track Parcel' }}
                  </button>
                </form>
              </div>
            </div>

            <!-- Tracking Results -->
            <div class="card shadow-lg border-0" *ngIf="trackingResult">
              <div class="card-header bg-primary text-white">
                <h5 class="mb-0">
                  <i class="bi bi-box me-2"></i>
                  Parcel Details
                </h5>
              </div>
              
              <div class="card-body">
                <!-- Parcel Information -->
                <div class="row mb-4">
                  <div class="col-md-6">
                    <h6 class="text-muted">Tracking Number</h6>
                    <p class="fw-bold">{{ trackingResult.parcel.trackingNumber }}</p>
                  </div>
                  <div class="col-md-6">
                    <h6 class="text-muted">Current Status</h6>
                    <span class="status-badge" [ngClass]="parcelService.getStatusClass(trackingResult.parcel.status)">
                      {{ parcelService.getStatusDisplayName(trackingResult.parcel.status) }}
                    </span>
                  </div>
                </div>

                <div class="row mb-4">
                  <div class="col-md-6">
                    <h6 class="text-muted">Description</h6>
                    <p>{{ trackingResult.parcel.description }}</p>
                  </div>
                  <div class="col-md-6">
                    <h6 class="text-muted">Weight</h6>
                    <p>{{ trackingResult.parcel.weight }} kg</p>
                  </div>
                </div>

                <div class="row mb-4">
                  <div class="col-md-6">
                    <h6 class="text-muted">Pickup Location</h6>
                    <p>{{ trackingResult.parcel.pickupLocation }}</p>
                  </div>
                  <div class="col-md-6">
                    <h6 class="text-muted">Delivery Location</h6>
                    <p>{{ trackingResult.parcel.deliveryLocation }}</p>
                  </div>
                </div>

                <div class="row mb-4">
                  <div class="col-md-6">
                    <h6 class="text-muted">Estimated Delivery</h6>
                    <p>{{ trackingResult.parcel.estimatedDeliveryDate | date:'medium' }}</p>
                  </div>
                  <div class="col-md-6" *ngIf="trackingResult.parcel.actualDeliveryDate">
                    <h6 class="text-muted">Actual Delivery</h6>
                    <p>{{ trackingResult.parcel.actualDeliveryDate | date:'medium' }}</p>
                  </div>
                </div>

                <!-- Tracking History -->
                <h5 class="border-bottom pb-2 mb-3">
                  <i class="bi bi-clock-history me-2"></i>
                  Tracking History
                </h5>

                <div class="timeline">
                  <div class="timeline-item" *ngFor="let track of trackingResult.trackingHistory; let isFirst = first" 
                       [class.timeline-item-current]="isFirst">
                    <div class="timeline-marker">
                      <i class="bi" [ngClass]="{
                        'bi-check-circle-fill text-success': track.status === 'DELIVERED',
                        'bi-truck text-primary': track.status === 'IN_TRANSIT' || track.status === 'OUT_FOR_DELIVERY',
                        'bi-box text-info': track.status === 'PICKED_UP',
                        'bi-clock text-warning': track.status === 'PENDING' || track.status === 'CONFIRMED',
                        'bi-x-circle text-danger': track.status === 'CANCELLED' || track.status === 'RETURNED'
                      }"></i>
                    </div>
                    <div class="timeline-content">
                      <div class="d-flex justify-content-between align-items-start">
                        <div>
                          <h6 class="mb-1">{{ parcelService.getStatusDisplayName(track.status) }}</h6>
                          <p class="text-muted mb-1">{{ track.location }}</p>
                          <p class="mb-0" *ngIf="track.description">{{ track.description }}</p>
                        </div>
                        <small class="text-muted">{{ track.timestamp | date:'short' }}</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .timeline {
      position: relative;
      padding-left: 30px;
    }
    
    .timeline::before {
      content: '';
      position: absolute;
      left: 15px;
      top: 0;
      bottom: 0;
      width: 2px;
      background: #dee2e6;
    }
    
    .timeline-item {
      position: relative;
      margin-bottom: 20px;
    }
    
    .timeline-marker {
      position: absolute;
      left: -22px;
      top: 0;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background: white;
      border: 2px solid #dee2e6;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
    }
    
    .timeline-item-current .timeline-marker {
      border-color: var(--bs-primary);
      background: var(--bs-primary);
      color: white;
    }
    
    .timeline-content {
      background: #f8f9fa;
      padding: 15px;
      border-radius: 8px;
      border-left: 3px solid #dee2e6;
    }
    
    .timeline-item-current .timeline-content {
      border-left-color: var(--bs-primary);
      background: #e7f3ff;
    }
    
    .form-control-lg {
      padding: 15px;
      font-size: 1.1rem;
    }
    
    .btn-lg {
      padding: 15px 30px;
      font-weight: 500;
    }
  `]
})
export class PublicTrackingComponent {
  trackingForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  trackingResult: any = null;

  constructor(
    private formBuilder: FormBuilder,
    public parcelService: ParcelService
  ) {
    this.trackingForm = this.formBuilder.group({
      trackingNumber: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  onSubmit(): void {
    if (this.trackingForm.invalid) {
      this.trackingForm.get('trackingNumber')?.markAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.trackingResult = null;

    const trackingNumber = this.trackingForm.value.trackingNumber;

    this.parcelService.trackParcel(trackingNumber).subscribe({
      next: (result) => {
        this.isLoading = false;
        this.trackingResult = result;
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.error || 'Parcel not found. Please check your tracking number.';
      }
    });
  }
}