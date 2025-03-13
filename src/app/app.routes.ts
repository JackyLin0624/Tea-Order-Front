import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './admin/admin-layout/admin-layout.component';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  {
      path: '',
      component: AdminLayoutComponent,
      children: [
        { path: 'dashboard', loadComponent: () => import('./admin/dashboard/dashboard.component').then(m => m.DashboardComponent)},
        { path: 'accounts', loadComponent: () => import('./admin/account/account-management/account-management.component').then(m => m.AccountManagementComponent), canActivate: [authGuard] },
        { path: 'products', loadComponent: () => import('./admin/product/product-management/product-management.component').then(m => m.ProductManagementComponent), canActivate: [authGuard] },
        { path: 'orders', loadComponent: () => import('./admin/order/order-management/order-management.component').then(m => m.OrderManagementComponent), canActivate: [] },
        { path: '', redirectTo: 'dashboard', pathMatch: 'prefix'},
      ]
    }
,
];
