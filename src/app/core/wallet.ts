import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WalletService {
  private baseUrl = 'http://yaduvanshisangathan.cloud/api/wallet';

  constructor(private http: HttpClient) {}

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  getBalance(): Observable<any> {
    return this.http.get(`${this.baseUrl}/balance`);
  }

  addTransaction(tx: any): Observable<any> {
    return this.http.post(this.baseUrl, tx);
  }
}
