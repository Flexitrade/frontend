import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

    constructor(private authService: AuthService,
        private router: Router) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let accessToken = this.authService.getToken();

        if (accessToken && !request.url.endsWith('/auth/token')) {
            request = this.addToken(request, accessToken);
        }

        return next.handle(request).pipe(catchError(error => {
            if (error instanceof HttpErrorResponse && error.status === 401) {
                console.log('Token Interceptor ==> Token expired! Need new token');

                return this.chamarRefreshToken(request, next).pipe(catchError(error => {
                    if (this.authService.isTokenExpired()) {
                        console.error('Token Interceptor ==> New token creation failed.');
                        this.authService.logout();
                    }
                    throw error;
                }));
            } else {
                if (error.error.error === 'invalid_grant') {
                    console.log('Login invalid!');
                } else if (error.error.status === 500) {
                    error.error.error = 'Internal error';
                    console.log(error);
                    this.router.navigate(['/home']);
                } else if (error.error.status === 503) {
                    error.error.error = 'Service: ' + error.url + ' unavailable.';
                    console.log(error);
                } else if (error.error.status === 504) {
                    error.error.error = 'Service not responding.';
                    console.log(error);
                }
                throw error;
            }
        }));
    }

    private addToken(request: HttpRequest<any>, token: string) {
        return request.clone({
            setHeaders: {
                'Authorization': `Bearer ${token}`
            }
        });
    }

    private chamarRefreshToken(request: HttpRequest<any>, next: HttpHandler) {
        return this.authService.refreshToken().pipe(switchMap((response) => {
            this.authService.saveToken(response);
            const accessToken = this.authService.getToken() as string;
            console.log('Token Interceptor ==> New token generated.');
            return next.handle(this.addToken(request, accessToken));
        }));
    }

}
