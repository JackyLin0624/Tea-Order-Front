import { OrderService } from './../../../service/order.service';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { ModifyAddedProductDialogComponent } from '../modify-added-product-dialog/modify-added-product-dialog.component';
import { SelectProductDialogComponent } from '../select-product-dialog/select-product-dialog.component';
@Component({
  selector: 'app-modify-order-dialog',
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
    MatCardModule
  ],
  providers: [
    provideNativeDateAdapter()
  ],
  templateUrl: './modify-order-dialog.component.html',
  styleUrl: './modify-order-dialog.component.scss'
})
export class ModifyOrderDialogComponent implements OnInit {
  orderForm!: FormGroup;
  isLoading = false;
  orderItems: any[] = [];
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ModifyOrderDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private orderService: OrderService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
  ) {
    this.dialogRef.disableClose = true;
  }
  orderStatusList = [
    { value: 0, label: '待處理' },
    { value: 1, label: '已確認' },
    { value: 2, label: '已取消' },
    { value: 3, label: '已完成' }
  ];
  loadByData(data: any) {
    console.log(data);
    this.orderForm.patchValue({
      phone: data.phone,
      title: data.title,
      address: data.address,
      remark: data.remark || '',
      orderDate: new Date(data.orderDate) || new Date(),
      orderStatus: data.orderStatus
    });
    this.orderItems = data.items.map((item: any) => ({
      id: item.id,
      productId: item.productId,
      productName: item.productName,
      count: item.count,
      totalAmount: this.calculateItemTotal(item),
      size: { id: item.productSizeId, name: item.productSizeName, price: item.price },
      variants: item.options.map((option: any) => ({
        typeId: option.variantTypeId,
        typeName: option.variantType,
        id: option.variantValueId,
        value: option.variantValue,
        extraPrice: option.extraValue
      }))
    }));
  }

  calculateItemTotal(item: any): number {
    const basePrice = item.price * item.count;
    const extraPrice = item.options.reduce((sum: number, variant: any) => sum + (variant.extraValue || 0), 0);
    return basePrice + (extraPrice * item.count);
  }

  refresh() {
    const req = {
      id: this.data
    };
    this.orderService.GetOrderById(req).subscribe({
      next: data => {
        this.loadByData(data);
      },
      error: error => {

      },
      complete: () => {

      }
    })
  }

  ngOnInit(): void {
    this.orderForm = this.fb.group({
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      title: ['', [Validators.required, Validators.minLength(3)]],
      address: ['', [Validators.required]],
      remark: [''],
      orderDate: [new Date(), Validators.required],
      orderStatus: [0, Validators.required],
      items: this.fb.array([])
    });
    this.refresh();
  }

  filterDate = (d: Date | null): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return d ? d >= today : false;
  };

  submitOrder(): void {
    if (this.isLoading) {
      return;
    }

    if (this.orderItems.length <= 0) {
      this.openSnackBar('請選擇訂單產品', '確定');
      return;
    }
    if (this.orderForm.valid) {
      this.isLoading = true;
      const req = {
        id: this.data,
        orderStatus: this.orderForm.value.orderStatus,
        phone: this.orderForm.value.phone,
        title: this.orderForm.value.title,
        address: this.orderForm.value.address,
        remark: this.orderForm.value.remark || '',
        orderDate: this.orderForm.value.orderDate.toISOString(),
        items: this.orderItems.map(item => ({
          productId: item.productId,
          count: item.count,
          selectedSize: item.size.id,
          remark: item.remark || '',
          selectedValues: item.variants.map((variant: any) => ({
            typeId: variant.typeId,
            valueId: variant.id
          }))
        }))
      };
      console.log(req);
      //return;
      this.orderService.modifyOrder(req).subscribe({
        next: data => {
          if (data.resultCode === 0) {
            this.openSnackBar('修改成功', '確定');
          }
          else if (data.resultCode === -1) {
            this.openSnackBar('訂單不存在', '確定');
          }
          else if (data.resultCode === -2) {
            this.openSnackBar('表單狀態已無法修改', '確定');
          }
          else if (data.resultCode === -3) {
            this.openSnackBar('產品資料庫錯誤', '確定');
          }
          else if (data.resultCode === -4) {
            this.openSnackBar('產品尺寸資料庫錯誤', '確定');
          }
          this.dialogRef.close(true);
          console.log(data);
        },
        error: error => {
          this.isLoading = false;
          this.dialogRef.close(false);
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    } else {

    }
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 1300,
      verticalPosition: 'top'
    });
  }
  removeOrderItem(item: any): void {
    this.orderItems = this.orderItems.filter(i => i !== item);
  }

  closeDialog() {
    this.dialogRef.close();
  }

  openSelect() {
    const dialogRef = this.dialog.open(SelectProductDialogComponent, {
      width: '850px',
    });

    dialogRef.afterClosed().subscribe(selectedData => {
      if (selectedData) {
        this.orderItems.push(selectedData);
      }
    });
  }
  openModify(item: any) {
    const dialogRef = this.dialog.open(ModifyAddedProductDialogComponent, {
      width: '850px',
      data: item
    });

    dialogRef.afterClosed().subscribe(selectedData => {
      if (selectedData) {
        Object.assign(item, selectedData);
      }
    });
  }
}
