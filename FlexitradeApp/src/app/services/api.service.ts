
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TokenResponse } from '../model/TokenResponse.model';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) { }

  login(username: string, password: string) {
    return this.http.post<TokenResponse>('login', { username, password });
  }
}