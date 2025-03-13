import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private apiUrl = `${environment.apiUrl}/Role`;
  constructor(
    private http: HttpClient
  ) { }

  getAllRoles(): Observable<any> {
    return this.http.get(`${this.apiUrl}/GetAllRoles`);
  }
}
