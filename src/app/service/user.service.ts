import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/User`;
  constructor(
    private http: HttpClient
  ) { }

  getAllUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/GetAllUser`);
  }
  createUser(request: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }
    return this.http.post(`${this.apiUrl}/CreateUser`, JSON.stringify(request), httpOptions);
  }
  modifyUser(request: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }
    return this.http.post(`${this.apiUrl}/ModifyUser`, JSON.stringify(request), httpOptions);
  }
  getUserById(userId: number): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }
    return this.http.post(`${this.apiUrl}/GetUserById`, JSON.stringify(userId), httpOptions);
  }

  deleteUser(request: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }
    return this.http.post(`${this.apiUrl}/DeleteUser`, JSON.stringify(request), httpOptions);
  }
}
