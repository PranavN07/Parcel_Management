import { Routes } from '@angular/router';
import { authGuard, adminGuard, staffGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'track',
    loadComponent: () => import('./shared/components/public-tracking/public-tracking.component').then(m => m.PublicTrackingComponent)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'book-parcel',
    canActivate: [authGuard],
    loadComponent: () => import('./parcel/book-parcel/book-parcel.component').then(m => m.BookParcelComponent)
  },
  {
    path: 'my-parcels',
    canActivate: [authGuard],
    loadComponent: () => import('./parcel/parcel-list/parcel-list.component').then(m => m.ParcelListComponent)
  },
  {
    path: 'parcel/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./parcel/parcel-detail/parcel-detail.component').then(m => m.ParcelDetailComponent)
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent)
      },
      {
        path: 'users',
        loadComponent: () => import('./dashboard/user-management/user-management.component').then(m => m.UserManagementComponent)
      },
      {
        path: 'parcels',
        loadComponent: () => import('./dashboard/parcel-management/parcel-management.component').then(m => m.ParcelManagementComponent)
      }
    ]
  },
  {
    path: 'staff',
    canActivate: [staffGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/staff-dashboard/staff-dashboard.component').then(m => m.StaffDashboardComponent)
      },
      {
        path: 'parcels',
        loadComponent: () => import('./dashboard/parcel-management/parcel-management.component').then(m => m.ParcelManagementComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];