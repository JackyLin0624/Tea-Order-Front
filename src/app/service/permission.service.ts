import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  private apiUrl = `${environment.apiUrl}/Permission`;
  constructor(
    private http: HttpClient
  ) { }

  GetAllPemissions(): Observable<any> {
    return this.http.get(`${this.apiUrl}/GetAllPermissions`);
  }
}
