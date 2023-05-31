import {
  HttpEvent, HttpHandler, HttpInterceptor, HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../api.service';

@Injectable()
export class AuthorizationInterceptor implements HttpInterceptor {

  constructor(private apiService: ApiService) {}

  /**
   * This interceptor appends the currenet auth token to all outgoing requests
   */
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const newRequest = request.clone({
      headers: request.headers.set('Authorization', `Bearer ${this.apiService.currentToken()}`)
    });

    return next.handle(newRequest);
  }
}
