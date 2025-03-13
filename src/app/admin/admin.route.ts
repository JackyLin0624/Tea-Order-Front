import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { authGuard } from '../auth/auth.guard';

export const adminRoutes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: 'dashboard', loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent)},
      { path: 'accounts', loadComponent: () => import('./account/account-management/account-management.component').then(m => m.AccountManagementComponent), canActivate: [authGuard] },
      { path: 'products', loadComponent: () => import('./product/product-management/product-management.component').then(m => m.ProductManagementComponent), canActivate: [authGuard] },
      { path: 'orders', loadComponent: () => import('./order/order-management/order-management.component').then(m => m.OrderManagementComponent), canActivate: [authGuard] },
      { path: '', redirectTo: 'dashboard', pathMatch: 'prefix'},
    ]
  }
]
