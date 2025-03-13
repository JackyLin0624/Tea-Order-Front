import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
import { ProductService } from '../../../service/product.service';
import { ProductCategoryService } from '../../../service/product-category.service';
import { VariantService } from '../../../service/variant.service';
interface ProductCatogory {
  id: number;
  name: string;
  description: string;
}
interface VariantValue {
  id: number;
  value: string;
  extraPrice: number;
}
interface VariantType {
  id: number;
  typeName: string;
  variantValues: VariantValue[];
}
@Component({
  selector: 'app-create-product-dialog',
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
    MatCheckboxModule
  ],
  templateUrl: './create-product-dialog.component.html',
  styleUrl: './create-product-dialog.component.scss'
})
export class CreateProductDialogComponent implements OnInit {
  productForm!: FormGroup;
  categories: ProductCatogory[] = [];
  variantTypes: VariantType[] = [];
  pemissions = [];
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CreateProductDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private productService: ProductService,
    private productCategoryService: ProductCategoryService,
    private variantService: VariantService,
    private snackBar: MatSnackBar
  ) {
    this.dialogRef.disableClose = true;
    this.refresh();
  }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 1300
    });
  }
  refresh() {
    this.productCategoryService.GetAllProductCategories().subscribe({
      next: data => {

        this.categories = data;
        console.log(this.categories);
      },
      error: error => {

      },
      complete: () => {

      }
    })
    this.loadVariants();

  }
  loadVariants() {
    this.variantService.GetAllVariantTypes().subscribe({
      next: data => {
        this.variantTypes = data;

        this.variantTypes.forEach((variant) => {
          const variantGroup = this.fb.array([]);

          variant.variantValues.forEach(() => {
            variantGroup.push(this.fb.control(false));
          });

          (this.productForm.get('variantOptions') as FormArray).push(variantGroup);
        });
      },
      error: error => console.error(error)
    });
  }
  ngOnInit() {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required]],
      isActive: [true, [Validators.required]],
      categoryId: [1, Validators.required],
      productSizes: this.fb.array([]),
      variantOptions: this.fb.array([])
    });
    this.addProductSize();
  }

  get productSizes(): FormArray {
    return this.productForm.get('productSizes') as FormArray;
  }

  addProductSize(): void {
    const sizeGroup = this.fb.group({
      size: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(1)]]
    });
    this.productSizes.push(sizeGroup);
  }

  removeProductSize(index: number): void {
    this.productSizes.removeAt(index);
  }

  getVariantOption(variantIndex: number, valueIndex: number): FormControl {
    return ((this.productForm.get('variantOptions') as FormArray).at(variantIndex) as FormArray).at(valueIndex) as FormControl;
  }

  createProduct() {
    if (this.productForm.invalid) return;

    this.isLoading = true;

    const selectedVariantValueIds: number[] = [];
    this.variantTypes.forEach((variant, idx) => {
      const variantControls = (this.productForm.get('variantOptions') as FormArray).at(idx) as FormArray;
      variant.variantValues.forEach((value, valueIdx) => {
        if (variantControls.at(valueIdx).value) {
          selectedVariantValueIds.push(value.id);
        }
      });
    });
    const { variantOptions, ...formValues } = this.productForm.value;
    const requestData = {
      ...formValues,
      options: selectedVariantValueIds
    };
    console.log(requestData);
    //return;
    this.productService.createProduct(requestData).subscribe({
      next: data => {
        console.log(data);
        this.dialogRef.close();
        if (data.resultCode === 0) {
          this.openSnackBar('新建成功', '確認');
          this.dialogRef.close(true);
        }
        else if (data.resultCode === -1) {
          this.openSnackBar('無此組別', '確認');
        }
      },
      error: error => {
        if (error.status === 401) {
          this.dialogRef.close(false);
        }
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    })
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
