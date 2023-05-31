import {
  HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, combineLatest, filter, switchMap, take, throwError } from 'rxjs';
import { ApiService } from '../api.service';

@Injectable()
export class UnauthErrorInterceptor implements HttpInterceptor {

  constructor(private apiService: ApiService) {}

  /**
   * This interceptor will catch HTTP errors, and retry 401 requests
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            return combineLatest([this.apiService.refreshingTokens$, this.apiService.isAccessTokenValid$]).pipe(
              take(1),
              switchMap(([refreshingTokens, isAccessTokenValid]) => {
                if (refreshingTokens || isAccessTokenValid) {
                  return this.apiService.isAccessTokenValid$;
                } else {
                  return this.apiService.getNewToken('refreshToken').pipe(
                    switchMap(() => this.apiService.isAccessTokenValid$)
                  );
                }
              }),
              filter(isAccessTokenValid => isAccessTokenValid === true),
              switchMap(() => this.apiService.accessToken$),
              take(1),
              switchMap(encodedAccessToken => {
                return next.handle(req.clone({
                  headers: req.headers.set('Authorization', `Bearer ${encodedAccessToken}`),
                }));
              }),
            );
          } else {
            return throwError(() => error);
          }
        }),
      )
  }

  // Simpler Interceptor without Semaphore
  // intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
  //   return next.handle(req)
  //     .pipe(
  //       catchError((error: HttpErrorResponse) => {
  //         if (error.status === 401) {
  //           return this.apiService.getNewToken('refreshToken').pipe(
  //             switchMap(encodedAccessToken => {
  //               return next.handle(req.clone({
  //                 headers: req.headers.set('Authorization', `Bearer ${encodedAccessToken}`),
  //               }));
  //             }),
  //           );
  //         } else {
  //           return throwError(() => error);
  //         }
  //       }),
  //     )
  // }
}
