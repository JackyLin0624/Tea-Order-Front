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
import { SelectProductDialogComponent } from '../select-product-dialog/select-product-dialog.component';
import { ModifyAddedProductDialogComponent } from '../modify-added-product-dialog/modify-added-product-dialog.component';
@Component({
  selector: 'app-create-order-dialog',
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
  templateUrl: './create-order-dialog.component.html',
  styleUrl: './create-order-dialog.component.scss'
})
export class CreateOrderDialogComponent implements OnInit {
  orderForm!: FormGroup;
  isLoading = false;
  orderItems: any[] = [];
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CreateOrderDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private orderService: OrderService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
  ) {
    this.dialogRef.disableClose = true;
  }
  ngOnInit(): void {
    this.orderForm = this.fb.group({
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      title: ['', [Validators.required, Validators.minLength(3)]],
      address: ['', [Validators.required]],
      remark: [''],
      orderDate: [new Date(), Validators.required],
      items: this.fb.array([])
    });
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
      this.orderService.createOrder(req).subscribe({
        next: data => {
          if (data.resultCode === 0) {
            this.openSnackBar('創建成功', '確定');
            this.dialogRef.close(true);
          }
          console.log(data);
        },
        error: error => {
          this.isLoading = false;
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
