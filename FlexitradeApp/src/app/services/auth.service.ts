import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';

import { TokenResponse } from './../model/TokenResponse.model';
import { RefreshTokenResponse } from '../model/RefreshTokenResponse.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly ACCESS_TOKEN = 'ACCESS_TOKEN';
  private readonly REFRESH_TOKEN = 'REFRESH_TOKEN';
  private readonly API_SYSTEM_USER_NAME = 'API_SYSTEM_USER_NAME';

  jwtPayload: any;
  tokenURL: string = environment.apiURLBase + environment.tokenUrl
  refreshTokenUrl: string = environment.apiURLBase + environment.refreshTokenUrl
  jwtHelper: JwtHelperService = new JwtHelperService();

  private _isLoggedIn$ = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this._isLoggedIn$.asObservable();

  constructor(private http: HttpClient,
    private router: Router) { }

  private getJwtPayload() {
    if (!this.jwtPayload) {
      const token = this.getToken();
      if (token) {
        this.jwtPayload = this.jwtHelper.decodeToken(token);
      }
    }
    return this.jwtPayload;
  }

  getToken() {
    return localStorage.getItem(this.ACCESS_TOKEN);
  }

  getRefreshToken() {
    return localStorage.getItem(this.REFRESH_TOKEN);
  }

  saveToken(response: any) {
    this.deleteToken();
    this.jwtPayload = this.jwtHelper.decodeToken(response.accessToken);
    localStorage.setItem(this.ACCESS_TOKEN, response.accessToken);
    localStorage.setItem(this.REFRESH_TOKEN, response.refreshToken);
  }

  deleteToken() {
    localStorage.removeItem(this.ACCESS_TOKEN);
    localStorage.removeItem(this.REFRESH_TOKEN);
    this.jwtPayload = null;
  }

  getUsername() {
    return localStorage.getItem(this.API_SYSTEM_USER_NAME);
  }

  saveUsername(username: string) {
    this.deleteUsername();
    localStorage.setItem(this.API_SYSTEM_USER_NAME, username);
  }

  deleteUsername() {
    localStorage.removeItem(this.API_SYSTEM_USER_NAME);
  }

  isTokenExpired(): boolean {
    const accessToken = this.getToken();
    return !accessToken || this.jwtHelper.isTokenExpired(accessToken);
  }

  isRefreshTokenExpired(): boolean {
    const refreshToken = this.getRefreshToken();
    return !refreshToken || this.jwtHelper.isTokenExpired(refreshToken);
  }

  isAuthenticated(): boolean {
    return !this.isTokenExpired();
  }

  getUserAuthenticated() {
    const accessToken = this.getToken();
    return accessToken ? this.jwtHelper.decodeToken(accessToken).username : null;
  }

  hasRole(role: string) {
    return this.getJwtPayload() && this.getJwtPayload().authorities.includes(role);
  }

  hasWhichRole(roles: Array<string>) {
    return roles.find(role => this.hasRole(role)) !== undefined ? true : false;
  }

  login(username: string, password: string): Observable<TokenResponse> {
    const body = '{"username": "' + username + '", "password": "' + password + '"}';
    const headers = { 'Content-Type': 'application/json' }

    return this.http.post<TokenResponse>(this.tokenURL, body, { headers });
  }

  refreshToken(): Observable<RefreshTokenResponse> {
    const body = '{"refreshToken": "' + this.getRefreshToken() + '"}';
    const headers = { 'Content-Type': 'application/json' }

    return this.http.post<RefreshTokenResponse>(this.refreshTokenUrl, body, { headers });
  }

  setIsLoggedIn() {
    this._isLoggedIn$.next(true);
  }

  logout() {
    this.deleteToken();
    this.router.navigate(['/login']);
    this._isLoggedIn$.next(false);
  }
}
