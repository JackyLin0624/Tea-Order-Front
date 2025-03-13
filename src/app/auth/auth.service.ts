import { MatSnackBar } from '@angular/material/snack-bar';
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LoginComponent } from './login/login.component';
import { MatDialog } from '@angular/material/dialog';
import { environment } from '../../environments/environment.development';
import { tap, catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = `${environment.apiUrl}/Auth`;
  private jwtHelper = new JwtHelperService();
  private userSubject = new BehaviorSubject<any>(this.getDecodedToken());

  constructor(
    private http: HttpClient,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  openLoginDialog(): void {
    const dialogRef = this.dialog.open(LoginComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        location.reload();
      }
    });
  }

  login(account: string, password: string): Observable<any> {
    return new Observable(observer => {
      this.http.post(`${this.apiUrl}/login`, { account, password }, { withCredentials: true }).subscribe({
        next: (response: any) => {
          console.log(response.accessToken);
          if (response.accessToken) {
            sessionStorage.setItem('access_token', response.accessToken);
            const decodedUser = this.decodeToken(response.accessToken);
            console.log(decodedUser);
            this.userSubject.next(decodedUser);
          }
          observer.next(response);
          observer.complete();
        },
        error: err => observer.error(err)
      });
    });
  }

  logout(): void {
    sessionStorage.removeItem('access_token');
    this.userSubject.next(null);
    this.router.navigate(['/']);
  }

  isAuthenticated(): boolean {
    const token = sessionStorage.getItem('access_token');
    return token != null && !this.jwtHelper.isTokenExpired(token);
  }

  getUser(): Observable<any> {
    return this.userSubject.asObservable();
  }

  decodeToken(token: string): any {
    return this.jwtHelper.decodeToken(token);
  }

  getToken(): string | null {
    return sessionStorage.getItem('access_token');
  }

  getDecodedToken(): any {
    const token = this.getToken();
    return token ? this.decodeToken(token) : null;
  }

  handleUnauthorized(): void {
    this.logout();
  }

  toHome() {
    this.snackBar.open('權限不足', '確定', {
      duration: 2000,
      verticalPosition: 'top'
    });
    this.dialog.closeAll();
    this.router.navigate(['/']);
  }

  refreshToken(): Observable<string> {
    return this.http.post<{ accessToken: string }>(`${this.apiUrl}/RefreshToken`, '', { withCredentials: true }).pipe(
      tap((response) => {
        this.setAccessToken(response.accessToken);
      }),
      map(response => response.accessToken)
    );
  }

  setAccessToken(token: string): void {
    sessionStorage.setItem('access_token', token);
  }
}
