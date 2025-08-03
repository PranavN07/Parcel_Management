import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ParcelService } from '../services/parcel.service';
import { User, UserRole } from '../models/user.model';
import { Parcel } from '../models/parcel.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet],
  template: `
    <div class="d-flex">
      <!-- Sidebar -->
      <nav class="bg-primary text-white" style="width: 250px; min-height: 100vh;">
        <div class="p-4">
          <h4 class="mb-4">
            <i class="bi bi-box-seam me-2"></i>
            Parcel Management
          </h4>
          
          <ul class="nav flex-column">
            <li class="nav-item mb-2">
              <a routerLink="/dashboard" class="nav-link text-white" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
                <i class="bi bi-speedometer2 me-2"></i>
                Dashboard
              </a>
            </li>
            
            <li class="nav-item mb-2">
              <a routerLink="/book-parcel" class="nav-link text-white" routerLinkActive="active">
                <i class="bi bi-plus-circle me-2"></i>
                Book Parcel
              </a>
            </li>
            
            <li class="nav-item mb-2">
              <a routerLink="/my-parcels" class="nav-link text-white" routerLinkActive="active">
                <i class="bi bi-box me-2"></i>
                My Parcels
              </a>
            </li>
            
            <li class="nav-item mb-2">
              <a routerLink="/track" class="nav-link text-white">
                <i class="bi bi-search me-2"></i>
                Track Parcel
              </a>
            </li>
            
            <!-- Admin Only -->
            <div *ngIf="currentUser?.role === 'ADMIN'">
              <hr class="my-3">
              <h6 class="text-white-50 mb-2">Administration</h6>
              
              <li class="nav-item mb-2">
                <a routerLink="/admin/dashboard" class="nav-link text-white" routerLinkActive="active">
                  <i class="bi bi-graph-up me-2"></i>
                  Admin Dashboard
                </a>
              </li>
              
              <li class="nav-item mb-2">
                <a routerLink="/admin/users" class="nav-link text-white" routerLinkActive="active">
                  <i class="bi bi-people me-2"></i>
                  User Management
                </a>
              </li>
              
              <li class="nav-item mb-2">
                <a routerLink="/admin/parcels" class="nav-link text-white" routerLinkActive="active">
                  <i class="bi bi-boxes me-2"></i>
                  Parcel Management
                </a>
              </li>
            </div>
            
            <!-- Staff Only -->
            <div *ngIf="currentUser?.role === 'STAFF'">
              <hr class="my-3">
              <h6 class="text-white-50 mb-2">Staff Operations</h6>
              
              <li class="nav-item mb-2">
                <a routerLink="/staff/dashboard" class="nav-link text-white" routerLinkActive="active">
                  <i class="bi bi-graph-up me-2"></i>
                  Staff Dashboard
                </a>
              </li>
              
              <li class="nav-item mb-2">
                <a routerLink="/staff/parcels" class="nav-link text-white" routerLinkActive="active">
                  <i class="bi bi-boxes me-2"></i>
                  Manage Parcels
                </a>
              </li>
            </div>
          </ul>
        </div>
      </nav>

      <!-- Main Content -->
      <div class="flex-grow-1">
        <!-- Top Navigation -->
        <nav class="navbar navbar-expand-lg navbar-light bg-white border-bottom">
          <div class="container-fluid">
            <span class="navbar-brand mb-0 h1">
              {{ getPageTitle() }}
            </span>
            
            <div class="navbar-nav ms-auto">
              <div class="nav-item dropdown">
                <a class="nav-link dropdown-toggle d-flex align-items-center" href="#" role="button" 
                   data-bs-toggle="dropdown" aria-expanded="false">
                  <i class="bi bi-person-circle me-2 fs-5"></i>
                  {{ currentUser?.firstName }} {{ currentUser?.lastName }}
                  <span class="badge bg-secondary ms-2">{{ currentUser?.role }}</span>
                </a>
                <ul class="dropdown-menu dropdown-menu-end">
                  <li>
                    <a class="dropdown-item" href="#">
                      <i class="bi bi-person me-2"></i>
                      Profile
                    </a>
                  </li>
                  <li>
                    <a class="dropdown-item" href="#">
                      <i class="bi bi-gear me-2"></i>
                      Settings
                    </a>
                  </li>
                  <li><hr class="dropdown-divider"></li>
                  <li>
                    <a class="dropdown-item text-danger" href="#" (click)="logout()">
                      <i class="bi bi-box-arrow-right me-2"></i>
                      Logout
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </nav>

        <!-- Page Content -->
        <div class="p-4">
          <!-- Customer Dashboard -->
          <div *ngIf="!isAdminOrStaff()" class="fade-in">
            <div class="row mb-4">
              <div class="col-12">
                <h2 class="mb-4">Welcome back, {{ currentUser?.firstName }}!</h2>
              </div>
            </div>

            <!-- Stats Cards -->
            <div class="row mb-4">
              <div class="col-md-3 mb-3">
                <div class="dashboard-card">
                  <div class="d-flex justify-content-between align-items-center">
                    <div>
                      <div class="card-title">Total Parcels</div>
                      <div class="card-value">{{ dashboardStats.totalParcels }}</div>
                    </div>
                    <i class="bi bi-box card-icon"></i>
                  </div>
                </div>
              </div>

              <div class="col-md-3 mb-3">
                <div class="dashboard-card bg-success">
                  <div class="d-flex justify-content-between align-items-center">
                    <div>
                      <div class="card-title">Delivered</div>
                      <div class="card-value">{{ dashboardStats.delivered }}</div>
                    </div>
                    <i class="bi bi-check-circle card-icon"></i>
                  </div>
                </div>
              </div>

              <div class="col-md-3 mb-3">
                <div class="dashboard-card bg-warning">
                  <div class="d-flex justify-content-between align-items-center">
                    <div>
                      <div class="card-title">In Transit</div>
                      <div class="card-value">{{ dashboardStats.inTransit }}</div>
                    </div>
                    <i class="bi bi-truck card-icon"></i>
                  </div>
                </div>
              </div>

              <div class="col-md-3 mb-3">
                <div class="dashboard-card bg-info">
                  <div class="d-flex justify-content-between align-items-center">
                    <div>
                      <div class="card-title">Pending</div>
                      <div class="card-value">{{ dashboardStats.pending }}</div>
                    </div>
                    <i class="bi bi-clock card-icon"></i>
                  </div>
                </div>
              </div>
            </div>

            <!-- Recent Parcels -->
            <div class="row">
              <div class="col-12">
                <div class="card">
                  <div class="card-header d-flex justify-content-between align-items-center">
                    <h5 class="mb-0">Recent Parcels</h5>
                    <a routerLink="/my-parcels" class="btn btn-primary btn-sm">View All</a>
                  </div>
                  <div class="card-body">
                    <div *ngIf="recentParcels.length === 0" class="text-center py-4 text-muted">
                      <i class="bi bi-inbox display-4"></i>
                      <p class="mt-3">No parcels found. <a routerLink="/book-parcel">Book your first parcel</a></p>
                    </div>

                    <div class="table-responsive" *ngIf="recentParcels.length > 0">
                      <table class="table table-hover">
                        <thead>
                          <tr>
                            <th>Tracking Number</th>
                            <th>Description</th>
                            <th>Status</th>
                            <th>Created</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr *ngFor="let parcel of recentParcels">
                            <td>
                              <span class="fw-medium">{{ parcel.trackingNumber }}</span>
                            </td>
                            <td>{{ parcel.description }}</td>
                            <td>
                              <span class="status-badge" [ngClass]="parcelService.getStatusClass(parcel.status)">
                                {{ parcelService.getStatusDisplayName(parcel.status) }}
                              </span>
                            </td>
                            <td>{{ parcel.createdAt | date:'short' }}</td>
                            <td>
                              <a [routerLink]="['/parcel', parcel.id]" class="btn btn-sm btn-outline-primary">
                                <i class="bi bi-eye me-1"></i>
                                View
                              </a>
                            </td>
                          </tr>
                        </tbody>
                      </table>
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
    .nav-link {
      border-radius: 8px;
      margin-bottom: 4px;
      transition: all 0.3s ease;
    }
    
    .nav-link:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
    
    .nav-link.active {
      background-color: rgba(255, 255, 255, 0.2);
      font-weight: 500;
    }
    
    .dropdown-menu {
      border: none;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
  `]
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  recentParcels: Parcel[] = [];
  dashboardStats = {
    totalParcels: 0,
    delivered: 0,
    inTransit: 0,
    pending: 0
  };

  constructor(
    private authService: AuthService,
    public parcelService: ParcelService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.parcelService.getUserParcels().subscribe({
      next: (parcels) => {
        this.recentParcels = parcels.slice(0, 5); // Show only 5 recent parcels
        this.calculateStats(parcels);
      },
      error: (error) => {
        console.error('Error loading dashboard data:', error);
      }
    });
  }

  calculateStats(parcels: Parcel[]): void {
    this.dashboardStats = {
      totalParcels: parcels.length,
      delivered: parcels.filter(p => p.status === 'DELIVERED').length,
      inTransit: parcels.filter(p => p.status === 'IN_TRANSIT' || p.status === 'OUT_FOR_DELIVERY').length,
      pending: parcels.filter(p => p.status === 'PENDING' || p.status === 'CONFIRMED').length
    };
  }

  isAdminOrStaff(): boolean {
    return this.currentUser?.role === UserRole.ADMIN || this.currentUser?.role === UserRole.STAFF;
  }

  getPageTitle(): string {
    const path = this.router.url;
    if (path.includes('/admin')) return 'Administration';
    if (path.includes('/staff')) return 'Staff Operations';
    if (path.includes('/book-parcel')) return 'Book New Parcel';
    if (path.includes('/my-parcels')) return 'My Parcels';
    if (path.includes('/parcel/')) return 'Parcel Details';
    return 'Dashboard';
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Logout error:', error);
        // Force logout even if API call fails
        this.router.navigate(['/login']);
      }
    });
  }
}