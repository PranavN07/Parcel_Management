import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ParcelService } from '../../services/parcel.service';
import { Priority } from '../../models/parcel.model';

@Component({
  selector: 'app-book-parcel',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container-fluid">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <div class="card shadow-lg border-0">
            <div class="card-header bg-primary text-white">
              <h4 class="mb-0">
                <i class="bi bi-plus-circle me-2"></i>
                Book New Parcel
              </h4>
            </div>
            
            <div class="card-body p-4">
              <form [formGroup]="bookingForm" (ngSubmit)="onSubmit()">
                
                <!-- Parcel Information -->
                <div class="row mb-4">
                  <div class="col-12">
                    <h5 class="border-bottom pb-2 mb-3">
                      <i class="bi bi-box me-2"></i>
                      Parcel Information
                    </h5>
                  </div>
                  
                  <div class="col-md-8 mb-3">
                    <label for="description" class="form-label">Description *</label>
                    <input
                      type="text"
                      class="form-control"
                      id="description"
                      formControlName="description"
                      placeholder="What are you sending?"
                      [class.is-invalid]="bookingForm.get('description')?.invalid && bookingForm.get('description')?.touched"
                    >
                    <div class="invalid-feedback" *ngIf="bookingForm.get('description')?.invalid && bookingForm.get('description')?.touched">
                      Description is required
                    </div>
                  </div>
                  
                  <div class="col-md-4 mb-3">
                    <label for="weight" class="form-label">Weight (kg) *</label>
                    <input
                      type="number"
                      class="form-control"
                      id="weight"
                      formControlName="weight"
                      step="0.1"
                      min="0"
                      placeholder="0.0"
                      [class.is-invalid]="bookingForm.get('weight')?.invalid && bookingForm.get('weight')?.touched"
                    >
                    <div class="invalid-feedback" *ngIf="bookingForm.get('weight')?.invalid && bookingForm.get('weight')?.touched">
                      Weight is required and must be greater than 0
                    </div>
                  </div>
                  
                  <div class="col-md-6 mb-3">
                    <label for="declaredValue" class="form-label">Declared Value ($) *</label>
                    <input
                      type="number"
                      class="form-control"
                      id="declaredValue"
                      formControlName="declaredValue"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      [class.is-invalid]="bookingForm.get('declaredValue')?.invalid && bookingForm.get('declaredValue')?.touched"
                    >
                    <div class="invalid-feedback" *ngIf="bookingForm.get('declaredValue')?.invalid && bookingForm.get('declaredValue')?.touched">
                      Declared value is required
                    </div>
                  </div>
                  
                  <div class="col-md-6 mb-3">
                    <label for="priority" class="form-label">Priority *</label>
                    <select
                      class="form-select"
                      id="priority"
                      formControlName="priority"
                      [class.is-invalid]="bookingForm.get('priority')?.invalid && bookingForm.get('priority')?.touched"
                    >
                      <option value="">Select Priority</option>
                      <option value="STANDARD">Standard (5-7 days) - Base Rate</option>
                      <option value="EXPRESS">Express (2-3 days) - 50% Extra</option>
                      <option value="OVERNIGHT">Overnight (1 day) - 100% Extra</option>
                    </select>
                    <div class="invalid-feedback" *ngIf="bookingForm.get('priority')?.invalid && bookingForm.get('priority')?.touched">
                      Priority is required
                    </div>
                  </div>
                </div>

                <!-- Receiver Information -->
                <div class="row mb-4">
                  <div class="col-12">
                    <h5 class="border-bottom pb-2 mb-3">
                      <i class="bi bi-person me-2"></i>
                      Receiver Information
                    </h5>
                  </div>
                  
                  <div class="col-md-6 mb-3">
                    <label for="receiverName" class="form-label">Full Name *</label>
                    <input
                      type="text"
                      class="form-control"
                      id="receiverName"
                      formControlName="receiverName"
                      placeholder="Receiver's full name"
                      [class.is-invalid]="bookingForm.get('receiverName')?.invalid && bookingForm.get('receiverName')?.touched"
                    >
                    <div class="invalid-feedback" *ngIf="bookingForm.get('receiverName')?.invalid && bookingForm.get('receiverName')?.touched">
                      Receiver name is required
                    </div>
                  </div>
                  
                  <div class="col-md-6 mb-3">
                    <label for="receiverPhone" class="form-label">Phone Number *</label>
                    <input
                      type="tel"
                      class="form-control"
                      id="receiverPhone"
                      formControlName="receiverPhone"
                      placeholder="Phone number"
                      [class.is-invalid]="bookingForm.get('receiverPhone')?.invalid && bookingForm.get('receiverPhone')?.touched"
                    >
                    <div class="invalid-feedback" *ngIf="bookingForm.get('receiverPhone')?.invalid && bookingForm.get('receiverPhone')?.touched">
                      Receiver phone is required
                    </div>
                  </div>
                  
                  <div class="col-md-6 mb-3">
                    <label for="receiverEmail" class="form-label">Email (Optional)</label>
                    <input
                      type="email"
                      class="form-control"
                      id="receiverEmail"
                      formControlName="receiverEmail"
                      placeholder="Receiver's email"
                    >
                  </div>
                </div>

                <!-- Pickup Location -->
                <div class="row mb-4">
                  <div class="col-12">
                    <h5 class="border-bottom pb-2 mb-3">
                      <i class="bi bi-geo-alt me-2"></i>
                      Pickup Location
                    </h5>
                  </div>
                  
                  <div class="col-md-12 mb-3">
                    <label for="pickupAddress" class="form-label">Address *</label>
                    <input
                      type="text"
                      class="form-control"
                      id="pickupAddress"
                      formControlName="pickupAddress"
                      placeholder="Street address"
                      [class.is-invalid]="bookingForm.get('pickupAddress')?.invalid && bookingForm.get('pickupAddress')?.touched"
                    >
                    <div class="invalid-feedback" *ngIf="bookingForm.get('pickupAddress')?.invalid && bookingForm.get('pickupAddress')?.touched">
                      Pickup address is required
                    </div>
                  </div>
                  
                  <div class="col-md-6 mb-3">
                    <label for="pickupCity" class="form-label">City *</label>
                    <input
                      type="text"
                      class="form-control"
                      id="pickupCity"
                      formControlName="pickupCity"
                      placeholder="City"
                      [class.is-invalid]="bookingForm.get('pickupCity')?.invalid && bookingForm.get('pickupCity')?.touched"
                    >
                    <div class="invalid-feedback" *ngIf="bookingForm.get('pickupCity')?.invalid && bookingForm.get('pickupCity')?.touched">
                      City is required
                    </div>
                  </div>
                  
                  <div class="col-md-6 mb-3">
                    <label for="pickupState" class="form-label">State/Province *</label>
                    <input
                      type="text"
                      class="form-control"
                      id="pickupState"
                      formControlName="pickupState"
                      placeholder="State or Province"
                      [class.is-invalid]="bookingForm.get('pickupState')?.invalid && bookingForm.get('pickupState')?.touched"
                    >
                    <div class="invalid-feedback" *ngIf="bookingForm.get('pickupState')?.invalid && bookingForm.get('pickupState')?.touched">
                      State is required
                    </div>
                  </div>
                  
                  <div class="col-md-6 mb-3">
                    <label for="pickupCountry" class="form-label">Country *</label>
                    <input
                      type="text"
                      class="form-control"
                      id="pickupCountry"
                      formControlName="pickupCountry"
                      placeholder="Country"
                      [class.is-invalid]="bookingForm.get('pickupCountry')?.invalid && bookingForm.get('pickupCountry')?.touched"
                    >
                    <div class="invalid-feedback" *ngIf="bookingForm.get('pickupCountry')?.invalid && bookingForm.get('pickupCountry')?.touched">
                      Country is required
                    </div>
                  </div>
                  
                  <div class="col-md-6 mb-3">
                    <label for="pickupZipCode" class="form-label">ZIP/Postal Code *</label>
                    <input
                      type="text"
                      class="form-control"
                      id="pickupZipCode"
                      formControlName="pickupZipCode"
                      placeholder="ZIP or Postal Code"
                      [class.is-invalid]="bookingForm.get('pickupZipCode')?.invalid && bookingForm.get('pickupZipCode')?.touched"
                    >
                    <div class="invalid-feedback" *ngIf="bookingForm.get('pickupZipCode')?.invalid && bookingForm.get('pickupZipCode')?.touched">
                      ZIP code is required
                    </div>
                  </div>
                </div>

                <!-- Delivery Location -->
                <div class="row mb-4">
                  <div class="col-12">
                    <h5 class="border-bottom pb-2 mb-3">
                      <i class="bi bi-geo-alt-fill me-2"></i>
                      Delivery Location
                    </h5>
                  </div>
                  
                  <div class="col-md-12 mb-3">
                    <label for="deliveryAddress" class="form-label">Address *</label>
                    <input
                      type="text"
                      class="form-control"
                      id="deliveryAddress"
                      formControlName="deliveryAddress"
                      placeholder="Street address"
                      [class.is-invalid]="bookingForm.get('deliveryAddress')?.invalid && bookingForm.get('deliveryAddress')?.touched"
                    >
                    <div class="invalid-feedback" *ngIf="bookingForm.get('deliveryAddress')?.invalid && bookingForm.get('deliveryAddress')?.touched">
                      Delivery address is required
                    </div>
                  </div>
                  
                  <div class="col-md-6 mb-3">
                    <label for="deliveryCity" class="form-label">City *</label>
                    <input
                      type="text"
                      class="form-control"
                      id="deliveryCity"
                      formControlName="deliveryCity"
                      placeholder="City"
                      [class.is-invalid]="bookingForm.get('deliveryCity')?.invalid && bookingForm.get('deliveryCity')?.touched"
                    >
                    <div class="invalid-feedback" *ngIf="bookingForm.get('deliveryCity')?.invalid && bookingForm.get('deliveryCity')?.touched">
                      City is required
                    </div>
                  </div>
                  
                  <div class="col-md-6 mb-3">
                    <label for="deliveryState" class="form-label">State/Province *</label>
                    <input
                      type="text"
                      class="form-control"
                      id="deliveryState"
                      formControlName="deliveryState"
                      placeholder="State or Province"
                      [class.is-invalid]="bookingForm.get('deliveryState')?.invalid && bookingForm.get('deliveryState')?.touched"
                    >
                    <div class="invalid-feedback" *ngIf="bookingForm.get('deliveryState')?.invalid && bookingForm.get('deliveryState')?.touched">
                      State is required
                    </div>
                  </div>
                  
                  <div class="col-md-6 mb-3">
                    <label for="deliveryCountry" class="form-label">Country *</label>
                    <input
                      type="text"
                      class="form-control"
                      id="deliveryCountry"
                      formControlName="deliveryCountry"
                      placeholder="Country"
                      [class.is-invalid]="bookingForm.get('deliveryCountry')?.invalid && bookingForm.get('deliveryCountry')?.touched"
                    >
                    <div class="invalid-feedback" *ngIf="bookingForm.get('deliveryCountry')?.invalid && bookingForm.get('deliveryCountry')?.touched">
                      Country is required
                    </div>
                  </div>
                  
                  <div class="col-md-6 mb-3">
                    <label for="deliveryZipCode" class="form-label">ZIP/Postal Code *</label>
                    <input
                      type="text"
                      class="form-control"
                      id="deliveryZipCode"
                      formControlName="deliveryZipCode"
                      placeholder="ZIP or Postal Code"
                      [class.is-invalid]="bookingForm.get('deliveryZipCode')?.invalid && bookingForm.get('deliveryZipCode')?.touched"
                    >
                    <div class="invalid-feedback" *ngIf="bookingForm.get('deliveryZipCode')?.invalid && bookingForm.get('deliveryZipCode')?.touched">
                      ZIP code is required
                    </div>
                  </div>
                </div>

                <!-- Special Instructions -->
                <div class="row mb-4">
                  <div class="col-12">
                    <h5 class="border-bottom pb-2 mb-3">
                      <i class="bi bi-chat-left-text me-2"></i>
                      Additional Information
                    </h5>
                  </div>
                  
                  <div class="col-12 mb-3">
                    <label for="specialInstructions" class="form-label">Special Instructions (Optional)</label>
                    <textarea
                      class="form-control"
                      id="specialInstructions"
                      formControlName="specialInstructions"
                      rows="3"
                      placeholder="Any special delivery instructions..."
                    ></textarea>
                  </div>
                </div>

                <!-- Error/Success Messages -->
                <div class="alert alert-success" *ngIf="successMessage">
                  <i class="bi bi-check-circle me-2"></i>
                  {{ successMessage }}
                </div>

                <div class="alert alert-danger" *ngIf="errorMessage">
                  <i class="bi bi-exclamation-circle me-2"></i>
                  {{ errorMessage }}
                </div>

                <!-- Form Actions -->
                <div class="row">
                  <div class="col-12">
                    <div class="d-flex justify-content-between">
                      <button type="button" class="btn btn-outline-secondary" (click)="resetForm()">
                        <i class="bi bi-arrow-clockwise me-2"></i>
                        Reset Form
                      </button>
                      
                      <button
                        type="submit"
                        class="btn btn-primary btn-lg"
                        [disabled]="bookingForm.invalid || isLoading"
                      >
                        <span *ngIf="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                        <i class="bi bi-check-lg me-2" *ngIf="!isLoading"></i>
                        {{ isLoading ? 'Booking Parcel...' : 'Book Parcel' }}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .form-control:focus,
    .form-select:focus {
      border-color: var(--bs-primary);
      box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
    }
    
    .card-header {
      border-radius: 0.375rem 0.375rem 0 0 !important;
    }
    
    h5 {
      color: var(--bs-primary);
      font-weight: 600;
    }
    
    .btn-lg {
      padding: 12px 30px;
      font-weight: 500;
    }
  `]
})
export class BookParcelComponent {
  bookingForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private parcelService: ParcelService,
    private router: Router
  ) {
    this.bookingForm = this.createForm();
  }

  createForm(): FormGroup {
    return this.formBuilder.group({
      // Parcel Information
      description: ['', Validators.required],
      weight: ['', [Validators.required, Validators.min(0.1)]],
      declaredValue: ['', [Validators.required, Validators.min(0)]],
      priority: ['', Validators.required],
      
      // Receiver Information
      receiverName: ['', Validators.required],
      receiverPhone: ['', Validators.required],
      receiverEmail: [''],
      
      // Pickup Location
      pickupAddress: ['', Validators.required],
      pickupCity: ['', Validators.required],
      pickupState: ['', Validators.required],
      pickupCountry: ['', Validators.required],
      pickupZipCode: ['', Validators.required],
      
      // Delivery Location
      deliveryAddress: ['', Validators.required],
      deliveryCity: ['', Validators.required],
      deliveryState: ['', Validators.required],
      deliveryCountry: ['', Validators.required],
      deliveryZipCode: ['', Validators.required],
      
      // Additional Information
      specialInstructions: ['']
    });
  }

  onSubmit(): void {
    if (this.bookingForm.invalid) {
      Object.keys(this.bookingForm.controls).forEach(key => {
        this.bookingForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const formData = this.bookingForm.value;
    
    this.parcelService.bookParcel(formData).subscribe({
      next: (parcel) => {
        this.isLoading = false;
        this.successMessage = `Parcel booked successfully! Tracking number: ${parcel.trackingNumber}`;
        
        // Redirect to parcel details after 3 seconds
        setTimeout(() => {
          this.router.navigate(['/parcel', parcel.id]);
        }, 3000);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.error || 'Failed to book parcel. Please try again.';
      }
    });
  }

  resetForm(): void {
    this.bookingForm.reset();
    this.errorMessage = '';
    this.successMessage = '';
  }
}