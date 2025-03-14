import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../service/product.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-modify-added-product-dialog',
  standalone: true,
  imports: [
    FormsModule,
    MatDialogModule,
    MatListModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatRadioModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  templateUrl: './modify-added-product-dialog.component.html',
  styleUrl: './modify-added-product-dialog.component.scss'
})
export class ModifyAddedProductDialogComponent {
  product: any;
  selectedSize: any;
  selectedVariants: { [key: number]: any } = {};
  count: number = 1;
  price: number = 0;
  isLoading = false;
  constructor(
    private productService: ProductService,
    public dialogRef: MatDialogRef<ModifyAddedProductDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar
  ) {

  }
  ngOnInit() {
    this.refresh();
  }
  loadByThisData() {
    if (!this.data) return;

    this.count = this.data.count || 1;
    this.selectedSize = this.product?.productSizes?.find((size: any) => size.id === this.data.size.id) || null;

    this.selectedVariants = {};
    if (this.data.variants && this.data.variants.length > 0) {
      this.data.variants.forEach((x: any) => {
        this.product.options?.forEach((option: any) => {
          const match = option.variantValues.find((v: any) => v.id === x.id);
          if (match) {
            this.selectedVariants[option.id] = match;
          }
        });
      });
    }
  }
  refresh() {
    if (this.isLoading) {
      return;
    }
    this.isLoading = true;
    var req = {
      id: this.data.productId
    };

    this.productService.GetProductById(req).subscribe({
      next: data => {
        if (data === null) {
          this.openSnackBar('商品已下架','確認');
          this.dialogRef.close();
        }
        this.product = data;
        this.loadByThisData()
      },
      error: error => {
        this.isLoading = false;
        this.dialogRef.close();
      },
      complete: () => {
        this.isLoading = false;
      }
    })
  }

  calculatePrice(): number {
    if (!this.selectedSize) return 0;
    let basePrice = this.selectedSize.price;
    let extraPrice = Object.values(this.selectedVariants)
      .map((v: any) => v.extraPrice || 0)
      .reduce((acc, price) => acc + price, 0);
    return (basePrice + extraPrice) * this.count;
  }
  increaseCount(): void {
    this.count++;
    this.calculatePrice();
  }

  decreaseCount(): void {
    if (this.count > 1) {
      this.count--;
      this.calculatePrice();
    }
  }
  closeDialog(): void {
    this.dialogRef.close();
  }

  confirmSelection(): void {
    if (!this.selectedSize) {
      this.openSnackBar('請選擇尺寸', '確定');
      return;
    }
    for (let option of this.product.options || []) {
      if (!this.selectedVariants[option.id]) {
        this.openSnackBar(`請選擇 ${option.typeName}`, '確定');
        return;
      }
    }
    const selectedData = {
      productName: this.product.name,
      productId: this.product.id,
      totalAmount: this.calculatePrice(),
      size: this.selectedSize,
      count: this.count,
      variants: Object.values(this.selectedVariants)
    };
    console.log(selectedData);
    //return;
    this.dialogRef.close(selectedData);
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 1300,
      verticalPosition: 'top'
    });
  }
}
