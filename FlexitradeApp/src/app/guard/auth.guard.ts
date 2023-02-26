import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

    if (this.authService.isTokenExpired()) {
      if (!this.authService.getRefreshToken() || this.authService.isRefreshTokenExpired()) {
        console.log('Auth Guard ==> User not logged in!');
        this.router.navigate(['/auth/login']);
        return false;
      }

      console.log('Auth Guard ==> Token expired! Generating new token.');

      this.authService.refreshToken().subscribe(response => {
        this.authService.saveToken(response);
        console.log('Auth Guard ==> New token created.');
        return true;
      }, errorResponse => {
        console.error('Auth Guard ==> User not logged in!');
        this.router.navigate(['/auth/login']);
        return false;
      });

    }

    return true;
  }
}
