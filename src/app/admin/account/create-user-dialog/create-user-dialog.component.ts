import { RoleService } from './../../../service/role.service';
import { PermissionService } from './../../../service/permission.service';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
import { UserService } from '../../../service/user.service';
interface Role {
  id: number;
  name: string;
}
@Component({
  standalone: true,
  selector: 'app-create-user-dialog',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule],
  templateUrl: './create-user-dialog.component.html',
  styleUrl: './create-user-dialog.component.scss'
})
export class CreateUserDialogComponent implements OnInit {
  userForm!: FormGroup;
  roles: Role[] = [];
  pemissions = [];
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CreateUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private permissionService: PermissionService,
    private roleService: RoleService,
    private userService: UserService,
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
    this.roleService.getAllRoles().subscribe({
      next: data => {

        this.roles = data;
        console.log(this.roles);
      },
      error: error => {

      },
      complete: () => {

      }
    })
    this.permissionService.GetAllPemissions().subscribe({
      next: data => {
        console.log(data);
        this.pemissions = data;
      },
      error: error => {

      },
      complete: () => {

      }
    })
  }
  ngOnInit() {
    this.userForm = this.fb.group({
      account: ['', [Validators.required, Validators.minLength(6)]],
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(4)]],
      roleId: [3, Validators.required]
    });

  }

  createUser() {
    if (this.userForm.invalid) return;

    this.isLoading = true;
    console.log(this.userForm.value);
    this.userService.createUser(this.userForm.value).subscribe({
      next: data => {
        console.log(data);
        this.dialogRef.close();
        if (data.resultCode === 0) {
          this.openSnackBar('新建成功', '確認');
          this.dialogRef.close(true);
        }
        else if (data.resultCode === -1) {
          this.openSnackBar('帳號已存在', '確認');
        }
        else if (data.resultCode === -2) {
          this.openSnackBar('無此權限', '確認');
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
