import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule, MatProgressSpinnerModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  constructor(
    private authService: AuthService,
    public dialogRef: MatDialogRef<LoginComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.dialogRef.disableClose = true;
    this.loginForm = new FormGroup({
      account: new FormControl('', [Validators.required, Validators.minLength(5)]),
      password: new FormControl('', [Validators.required, Validators.minLength(4)])
    });
  }

  get account() {
    return this.loginForm.get('account');
  }
  get password() {
    return this.loginForm.get('password');
  }
  get invalidLogin(): boolean {
    return this.loginForm.errors?.['invalidLogin'] ?? false;
  }
  login() {
    if (this.loginForm.hasError('invalidLogin')) {
      this.loginForm.setErrors(null);
    }

    if (this.loginForm.invalid) return;
    this.loginForm.disable();
    this.isLoading = true;
    const { account, password } = this.loginForm.value;
    this.authService.login(account, password).subscribe({
      next: (response) => {
        this.dialogRef.close(true);
      },
      error: () => {
        this.loginForm.enable();
        this.isLoading = false;
        this.loginForm.setErrors({ invalidLogin: true });
      },
      complete: () => {
        this.loginForm.enable();
        this.isLoading = false;
      }
    });
  }

}

