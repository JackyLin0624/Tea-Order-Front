import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSnackBarModule } from '@angular/material/snack-bar';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatGridListModule, MatSnackBarModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  stats = [
    { title: 'Total Users', value: 1200, color: 'primary' },
    { title: 'Orders Today', value: 150, color: 'accent' },
    { title: 'Revenue', value: '$12,500', color: 'warn' },
    { title: 'Active Sessions', value: 342, color: 'primary' }
  ];
}
