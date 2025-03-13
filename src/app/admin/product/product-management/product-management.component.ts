import { ProductService } from './../../../service/product.service';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from '../../../components/confirm-dialog/confirm-dialog.component';
import { CreateProductDialogComponent } from '../create-product-dialog/create-product-dialog.component';
import { ModifyProductDialogComponent } from '../modify-product-dialog/modify-product-dialog.component';

@Component({
  selector: 'app-product-management',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatSnackBarModule],
  templateUrl: './product-management.component.html',
  styleUrl: './product-management.component.scss'
})
export class ProductManagementComponent implements AfterViewInit {
  displayedColumns: string[] = ['position', 'name', 'isActive', 'description', 'category', 'modify', 'delete'];
  dataSource: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {

  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 1300
    });
  }

  constructor(
    private productService: ProductService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.refresh();
  }
  refresh() {
    this.productService.getAllProducts().subscribe({
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
  openCreateUserDialog() {
    const dialogRef = this.dialog.open(CreateProductDialogComponent, {
      width: '850px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        location.reload();
      }

    });
  }
  openModifyUserDialog(user: any) {
    const dialogRef = this.dialog.open(ModifyProductDialogComponent, {
      width: '850px',
      data: user.id
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
      data: { title: '刪除產品', message: `確定要刪除這個產品:${product.name}嗎？` }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        var req = {
          id: product.id
        }
        this.productService.deleteProduct(req).subscribe({
          next: data => {
            if (data.resultCode === 0) {
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
}
