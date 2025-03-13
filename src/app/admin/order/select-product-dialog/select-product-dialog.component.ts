import { Component, Inject, OnInit } from '@angular/core';
import { ProductService } from '../../../service/product.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { KeyValuePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AddProductDialogComponent } from '../add-product-dialog/add-product-dialog.component';
interface Product {
  id: number;
  name: string;
  isActive: boolean;
  description: string;
  categoryId: number;
  category: { id: number; name: string; description: string };
  productSizes: { id: number; size: string; price: number }[];
  options: any;
}
@Component({
  selector: 'app-select-product-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatListModule,
    KeyValuePipe,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './select-product-dialog.component.html',
  styleUrl: './select-product-dialog.component.scss'
})
export class SelectProductDialogComponent implements OnInit {
  isLoading = false;
  products: Product[] = [];
  groupedProducts: { [categoryName: string]: Product[] } = {};
  constructor(
    private productService: ProductService,
    public dialogRef: MatDialogRef<SelectProductDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.dialogRef.disableClose = true;
  }
  ngOnInit() {
    this.refresh();
  }
  refresh() {
    if (this.isLoading) {
      return;
    }
    this.isLoading = true;
    this.productService.getAllProducts().subscribe({
      next: data => {
        this.products = data;
        this.groupProductsByCategory();
        this.isLoading = false;
      },
      error: error => {
        this.isLoading = false;
        this.openSnackBar('無法獲取產品資料', '關閉');

      },
      complete: () => {

      }
    });
  }
  groupProductsByCategory() {
    this.groupedProducts = this.products.reduce((acc, product) => {
      const categoryName = product.category.name;
      if (!acc[categoryName]) {
        acc[categoryName] = [];
      }
      acc[categoryName].push(product);
      return acc;
    }, {} as { [categoryName: string]: Product[] });
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000
    });
  }

  selectProduct(product: Product) {
    this.dialogRef.close(product);
  }

  closeDialog() {
    this.dialogRef.close();
  }

  openProductDialog(product: Product) {
    const dialogRef = this.dialog.open(AddProductDialogComponent, {
      width: '850px',
      data: product.id
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dialogRef.close(result);
      }
    });
  }
}
