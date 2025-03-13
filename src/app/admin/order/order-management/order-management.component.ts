import { AuthService } from './../../../auth/auth.service';
import { OrderService } from './../../../service/order.service';
import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from '../../../components/confirm-dialog/confirm-dialog.component';
import { CreateOrderDialogComponent } from '../create-order-dialog/create-order-dialog.component';
import { ModifyOrderDialogComponent } from '../modify-order-dialog/modify-order-dialog.component';
import { OrderDetailDialogComponent } from '../order-detail-dialog/order-detail-dialog.component';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-order-management',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatSnackBarModule,
    CommonModule],
  templateUrl: './order-management.component.html',
  styleUrl: './order-management.component.scss'
})
export class OrderManagementComponent {
  displayedColumns: string[] = ['position', 'title', 'orderStatus', 'phone', 'address', 'totalAmount', 'remark', 'orderDate', 'view', 'modify', 'delete'];
  dataSource: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 1300,
      verticalPosition: 'top'
    });
  }

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private orderService: OrderService,
    private authService: AuthService
  ) {
    this.refresh();
  }

  refresh() {
    this.orderService.getAllOrders().subscribe({
      next: data => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        console.log(data);
      },
      error: error => {

      },
      complete: () => {

      }
    })
  }

  openCreateOrderDialog() {
    const dialogRef = this.dialog.open(CreateOrderDialogComponent, {
      width: '850px',
      maxHeight: '900px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        location.reload();
      }

    });
  }

  openModifyOrderDialog(order: any) {
    const dialogRef = this.dialog.open(ModifyOrderDialogComponent, {
      width: '850px',
      maxHeight: '900px',
      data: order.id
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.refresh();
      }

    });
  }

  delete(product: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { title: '刪除訂單', message: `確定要刪除這個訂單:${product.id}嗎？` }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        var req = {
          id: product.id
        }
        this.orderService.deleteOrder(req).subscribe({
          next: data => {
            if (data.resultCode === 0) {
              this.openSnackBar('刪除成功', '確定');
              this.refresh();
            }
          },
          error: error => {
            if (error.status === 401) {
              this.refresh();
            }
          },
          complete: () => {

          }
        })
      } else {

      }
    });
  }

  canEdit(): boolean {
    return this.authService.isAuthenticated();

  }

  openDetail(order: any) {
    const dialogRef = this.dialog.open(OrderDetailDialogComponent, {
      width: '850px',
      maxHeight: '900px',
      data: order.id
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        location.reload();
      }

    });
  }

  orderStatusToDescription(orderStatus: number) {
    if (orderStatus == 0) {
      return '待辦中'
    }
    else if (orderStatus == 1) {
      return '已確認'
    }
    else if (orderStatus == 2) {
      return '已取消'
    }
    else if (orderStatus == 3) {
      return '已完成'
    }
    return '';
  }
}
