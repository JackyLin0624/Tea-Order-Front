import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = `${environment.apiUrl}/Order`;
  constructor(
    private http: HttpClient
  ) { }

  getAllOrders(): Observable<any> {
    return this.http.get(`${this.apiUrl}/getAllOrders`);
  }

  createOrder(request: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }
    return this.http.post(`${this.apiUrl}/CreateOrder`, JSON.stringify(request), httpOptions);
  }

  modifyOrder(request: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }
    return this.http.post(`${this.apiUrl}/UdateOrder`, JSON.stringify(request), httpOptions);
  }

  GetOrderById(request: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }
    return this.http.post(`${this.apiUrl}/GetOrderById`, JSON.stringify(request), httpOptions);
  }

  deleteOrder(request: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }
    return this.http.post(`${this.apiUrl}/DeleteOrder`, JSON.stringify(request), httpOptions);
  }
}
