// banner.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Banner {
  id: number;
  title: string;
  description: string;
  route?: string;
  imageUrl: string;
}

@Injectable({
  providedIn: 'root',
})
export class BannerService {
  private apiUrl = 'http://yaduvanshisangathan.cloud/api/home-sections/banner';

  constructor(private http: HttpClient) {}

 getBanners(): Observable<Banner[]> {
  return this.http.get<Banner[]>('http://yaduvanshisangathan.cloud/api/home-sections/banner');
}
}
