import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ParcelService } from '../../services/parcel.service';
import { Parcel } from '../../models/parcel.model';

@Component({
  selector: 'app-parcel-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container-fluid">
      <div class="row mb-4">
        <div class="col-md-6">
          <h2>My Parcels</h2>
          <p class="text-muted">View and manage all your parcels</p>
        </div>
        <div class="col-md-6 text-end">
          <a routerLink="/book-parcel" class="btn btn-primary">
            <i class="bi bi-plus-circle me-2"></i>
            Book New Parcel
          </a>
        </div>
      </div>

      <!-- Filter Tabs -->
      <div class="card mb-4">
        <div class="card-header">
          <ul class="nav nav-tabs card-header-tabs">
            <li class="nav-item">
              <button 
                class="nav-link" 
                [class.active]="activeTab === 'all'"
                (click)="setActiveTab('all')"
              >
                All Parcels ({{ parcels.length }})
              </button>
            </li>
            <li class="nav-item">
              <button 
                class="nav-link"
                [class.active]="activeTab === 'sent'"
                (click)="setActiveTab('sent')"
              >
                Sent ({{ sentParcels.length }})
              </button>
            </li>
            <li class="nav-item">
              <button 
                class="nav-link"
                [class.active]="activeTab === 'received'"
                (click)="setActiveTab('received')"
              >
                Received ({{ receivedParcels.length }})
              </button>
            </li>
          </ul>
        </div>

        <div class="card-body">
          <!-- Loading State -->
          <div *ngIf="isLoading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-3 text-muted">Loading parcels...</p>
          </div>

          <!-- Empty State -->
          <div *ngIf="!isLoading && getDisplayParcels().length === 0" class="text-center py-5">
            <i class="bi bi-inbox display-4 text-muted"></i>
            <h4 class="mt-3">No parcels found</h4>
            <p class="text-muted">You haven't {{ activeTab === 'all' ? 'booked any' : activeTab }} parcels yet.</p>
            <a routerLink="/book-parcel" class="btn btn-primary">
              <i class="bi bi-plus-circle me-2"></i>
              Book Your First Parcel
            </a>
          </div>

          <!-- Parcels Table -->
          <div *ngIf="!isLoading && getDisplayParcels().length > 0" class="table-responsive">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th>Tracking Number</th>
                  <th>Description</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Weight</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let parcel of getDisplayParcels()" class="fade-in">
                  <td>
                    <span class="fw-medium text-primary">{{ parcel.trackingNumber }}</span>
                  </td>
                  <td>
                    <div>
                      <div class="fw-medium">{{ parcel.description }}</div>
                      <small class="text-muted">{{ parcel.priority }} Priority</small>
                    </div>
                  </td>
                  <td>
                    <span class="badge" [ngClass]="{
                      'bg-success': isCurrentUserSender(parcel),
                      'bg-info': !isCurrentUserSender(parcel)
                    }">
                      {{ isCurrentUserSender(parcel) ? 'Sent' : 'Received' }}
                    </span>
                  </td>
                  <td>
                    <span class="status-badge" [ngClass]="parcelService.getStatusClass(parcel.status)">
                      {{ parcelService.getStatusDisplayName(parcel.status) }}
                    </span>
                  </td>
                  <td>{{ parcel.weight }} kg</td>
                  <td>
                    <div>
                      <div>{{ parcel.createdAt | date:'short' }}</div>
                      <small class="text-muted" *ngIf="parcel.estimatedDeliveryDate">
                        Est: {{ parcel.estimatedDeliveryDate | date:'short' }}
                      </small>
                    </div>
                  </td>
                  <td>
                    <div class="btn-group btn-group-sm">
                      <a [routerLink]="['/parcel', parcel.id]" class="btn btn-outline-primary">
                        <i class="bi bi-eye"></i>
                      </a>
                      <button class="btn btn-outline-secondary" (click)="trackParcel(parcel.trackingNumber)">
                        <i class="bi bi-geo-alt"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="row" *ngIf="!isLoading && parcels.length > 0">
        <div class="col-md-3 mb-3">
          <div class="card bg-primary text-white">
            <div class="card-body text-center">
              <i class="bi bi-box display-6"></i>
              <h3 class="mt-2">{{ parcels.length }}</h3>
              <p class="mb-0">Total Parcels</p>
            </div>
          </div>
        </div>
        
        <div class="col-md-3 mb-3">
          <div class="card bg-success text-white">
            <div class="card-body text-center">
              <i class="bi bi-check-circle display-6"></i>
              <h3 class="mt-2">{{ getParcelsByStatus('DELIVERED').length }}</h3>
              <p class="mb-0">Delivered</p>
            </div>
          </div>
        </div>
        
        <div class="col-md-3 mb-3">
          <div class="card bg-warning text-white">
            <div class="card-body text-center">
              <i class="bi bi-truck display-6"></i>
              <h3 class="mt-2">{{ getParcelsByStatus('IN_TRANSIT').length + getParcelsByStatus('OUT_FOR_DELIVERY').length }}</h3>
              <p class="mb-0">In Transit</p>
            </div>
          </div>
        </div>
        
        <div class="col-md-3 mb-3">
          <div class="card bg-info text-white">
            <div class="card-body text-center">
              <i class="bi bi-clock display-6"></i>
              <h3 class="mt-2">{{ getParcelsByStatus('PENDING').length + getParcelsByStatus('CONFIRMED').length }}</h3>
              <p class="mb-0">Pending</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .table th {
      border-top: none;
      font-weight: 600;
      color: var(--bs-primary);
    }
    
    .btn-group-sm .btn {
      padding: 0.25rem 0.5rem;
    }
    
    .nav-tabs .nav-link {
      border: none;
      color: #6c757d;
    }
    
    .nav-tabs .nav-link.active {
      background-color: transparent;
      border-bottom: 2px solid var(--bs-primary);
      color: var(--bs-primary);
      font-weight: 500;
    }
    
    .card.bg-primary,
    .card.bg-success,
    .card.bg-warning,
    .card.bg-info {
      border: none;
    }
  `]
})
export class ParcelListComponent implements OnInit {
  parcels: Parcel[] = [];
  sentParcels: Parcel[] = [];
  receivedParcels: Parcel[] = [];
  activeTab: 'all' | 'sent' | 'received' = 'all';
  isLoading = true;

  constructor(public parcelService: ParcelService) {}

  ngOnInit(): void {
    this.loadParcels();
  }

  loadParcels(): void {
    this.isLoading = true;
    
    // Load all user parcels
    this.parcelService.getUserParcels().subscribe({
      next: (parcels) => {
        this.parcels = parcels;
        this.loadSentParcels();
      },
      error: (error) => {
        console.error('Error loading parcels:', error);
        this.isLoading = false;
      }
    });
  }

  loadSentParcels(): void {
    this.parcelService.getSentParcels().subscribe({
      next: (sentParcels) => {
        this.sentParcels = sentParcels;
        this.loadReceivedParcels();
      },
      error: (error) => {
        console.error('Error loading sent parcels:', error);
        this.loadReceivedParcels();
      }
    });
  }

  loadReceivedParcels(): void {
    this.parcelService.getReceivedParcels().subscribe({
      next: (receivedParcels) => {
        this.receivedParcels = receivedParcels;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading received parcels:', error);
        this.isLoading = false;
      }
    });
  }

  setActiveTab(tab: 'all' | 'sent' | 'received'): void {
    this.activeTab = tab;
  }

  getDisplayParcels(): Parcel[] {
    switch (this.activeTab) {
      case 'sent':
        return this.sentParcels;
      case 'received':
        return this.receivedParcels;
      default:
        return this.parcels;
    }
  }

  getParcelsByStatus(status: string): Parcel[] {
    return this.parcels.filter(p => p.status === status);
  }

  isCurrentUserSender(parcel: Parcel): boolean {
    // This would normally check against current user
    // For now, assume all parcels in sentParcels are sent by current user
    return this.sentParcels.some(p => p.id === parcel.id);
  }

  trackParcel(trackingNumber: string): void {
    // Navigate to public tracking page
    window.open(`/track?number=${trackingNumber}`, '_blank');
  }
}