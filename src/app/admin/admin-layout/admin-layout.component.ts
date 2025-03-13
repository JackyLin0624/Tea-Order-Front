import { AuthService } from './../../auth/auth.service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, MatToolbarModule, MatSidenavModule, MatListModule, MatIconModule, MatButtonModule],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss'
})
export class AdminLayoutComponent {
  toolBarTitle = '金順口茶大師';
  isExpanded = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {

  }
  get isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }

  login() {
    this.authService.openLoginDialog();
  }

  logout() {
    this.authService.logout();
  }

  closeSideNav(){
    this.isExpanded = false;
  }
}
