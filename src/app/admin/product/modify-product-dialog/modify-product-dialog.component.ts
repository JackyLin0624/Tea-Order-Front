import { VariantService } from './../../../service/variant.service';
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
interface ProductCatogory {
  id: number;
  name: string;
  description: string;
}
interface ProductSize {
  id: number;
  size: string;
  price: number;
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
  selector: 'app-modify-product-dialog',
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
    MatCheckboxModule],
  templateUrl: './modify-product-dialog.component.html',
  styleUrl: './modify-product-dialog.component.scss'
})
export class ModifyProductDialogComponent {
  variantTypes: VariantType[] = [];
  productForm!: FormGroup;
  categories: ProductCatogory[] = [];
  pemissions = [];
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ModifyProductDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private productService: ProductService,
    private productCategoryService: ProductCategoryService,
    private variantService: VariantService,
    private snackBar: MatSnackBar
  ) {
    this.dialogRef.disableClose = true;

  }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 1300
    });
  }

  get productSizes(): FormArray {
    return this.productForm.get('productSizes') as FormArray;
  }


  getVariantOption(variantIndex: number, valueIndex: number): FormControl {
    return ((this.productForm.get('variantOptions') as FormArray).at(variantIndex) as FormArray).at(valueIndex) as FormControl;
  }
  async refresh() {
    await this.loadVariants();
    var req = {
      id: this.data
    };
    this.productService.GetProductById(req).subscribe({
      next: data => {
        console.log(data);
        this.productForm.patchValue({
          id: data.id,
          name: data.name,
          description: data.description,
          isActive: data.isActive,
          price: data.price,
          categoryId: data.category.id
        });
        this.productSizes.clear();
        if (data.productSizes && data.productSizes.length > 0) {
          const arr = data.productSizes as ProductSize[];
          arr.forEach(size => this.addProductSize(size.size, size.price));
        } else {
          this.addProductSize();
        }
        this.loadVariantOptions(data.options || []);
      },
      error: error => {

      },
      complete: () => {

      }
    })
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

  }
  loadVariantOptions(selectedOptions: VariantType[]) {
    const variantFormArray = this.productForm.get('variantOptions') as FormArray;

    this.variantTypes.forEach((variant, variantIdx) => {
      const matchedOption = selectedOptions.find(opt => opt.id === variant.id);

      if (matchedOption) {
        matchedOption.variantValues.forEach(selectedValue => {
          const valueIdx = variant.variantValues.findIndex(v => v.id === selectedValue.id);
          if (valueIdx !== -1) {
            (variantFormArray.at(variantIdx) as FormArray).at(valueIdx).setValue(true);
          }
        });
      }
    });
  }


  loadVariants(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.variantService.GetAllVariantTypes().subscribe({
        next: data => {
          this.variantTypes = data;
          const variantFormArray = this.productForm.get('variantOptions') as FormArray;
          variantFormArray.clear();

          this.variantTypes.forEach(variant => {
            const variantGroup = this.fb.array([]);

            variant.variantValues.forEach(() => {
              variantGroup.push(this.fb.control(false));
            });

            variantFormArray.push(variantGroup);
          });

          resolve();
        },
        error: error => {
          console.error(error);
          reject(error);
        }
      });
    });
  }

  ngOnInit() {
    this.productForm = this.fb.group({
      id: [0, [Validators.required]],
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required]],
      isActive: [true, [Validators.required]],
      categoryId: [1, Validators.required],
      productSizes: this.fb.array([]),
      variantOptions: this.fb.array([])
    });
    this.refresh();
  }

  addProductSize(size: string = '', price: number = 0): void {
    const sizeGroup = this.fb.group({
      size: [size, Validators.required],
      price: [price, [Validators.required, Validators.min(1)]]
    });
    this.productSizes.push(sizeGroup);
  }

  removeProductSize(index: number): void {
    this.productSizes.removeAt(index);
  }

  modifyProduct() {
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
    this.productService.modifyProduct(requestData).subscribe({
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
