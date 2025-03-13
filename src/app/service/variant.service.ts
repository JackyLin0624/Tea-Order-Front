import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class VariantService {
  private apiUrl = `${environment.apiUrl}/Variant`;
  constructor(
    private http: HttpClient
  ) {

  }
  GetAllVariantTypes(): Observable<any> {
    return this.http.get(`${this.apiUrl}/GetAllVariantTypes`);
  }
}
