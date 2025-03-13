import { OrderService } from './../../../service/order.service';
import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-order-detail-dialog',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatSlideToggleModule,
    MatIconModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardModule,
    CommonModule
  ],
  templateUrl: './order-detail-dialog.component.html',
  styleUrl: './order-detail-dialog.component.scss'
})
export class OrderDetailDialogComponent implements OnInit {
  order: any;
  constructor(
    public dialogRef: MatDialogRef<OrderDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private orderService: OrderService,
    private snackBar: MatSnackBar
  ) {
    this.dialogRef.disableClose = true;
  }
  isLoading = false;
  ngOnInit(): void {
    if (this.isLoading) {
      return;
    }
    this.isLoading = true;
    const req = {
      id: this.data
    };
    this.orderService.GetOrderById(req).subscribe({
      next: data => {
        this.order = data;
        console.log(data);
      },
      error: error => {
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    })
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 1300,
      verticalPosition: 'top'
    });
  }

  calculateItemTotal(item: any): number {
    const basePrice = item.price * item.count;
    const extraPrice = item.options.reduce((sum: number, variant: any) => sum + (variant.extraValue || 0), 0);
    return basePrice + (extraPrice * item.count);
  }
}
