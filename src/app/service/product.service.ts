import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/Product`;
  constructor(
    private http: HttpClient
  ) { }

  getAllProducts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/GetAllProducts`);
  }

  createProduct(request: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }
    return this.http.post(`${this.apiUrl}/CreateProduct`, JSON.stringify(request), httpOptions);
  }

  modifyProduct(request: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }
    return this.http.post(`${this.apiUrl}/UpdateProduct`, JSON.stringify(request), httpOptions);
  }

  GetProductById(request: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }
    return this.http.post(`${this.apiUrl}/GetProductById`, JSON.stringify(request), httpOptions);
  }

  deleteProduct(request: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }
    return this.http.post(`${this.apiUrl}/DeleteProduct`, JSON.stringify(request), httpOptions);
  }
}
