import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ProductCategoryService {
  private apiUrl = `${environment.apiUrl}/ProductCategory`;
  constructor(
    private http: HttpClient
  ) { }

  GetAllProductCategories(): Observable<any> {
    return this.http.get(`${this.apiUrl}/GetAllProductCategories`);
  }
}
