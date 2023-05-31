import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public refreshingTokens$ = new BehaviorSubject<boolean>(false);

  public isAccessTokenValid$ = new BehaviorSubject<boolean>(false);

  public accessToken$ = new BehaviorSubject<string>('');

  private token = '';

  constructor(private http: HttpClient) {}

  public getNewToken(id: string): Observable<any> {
    this.refreshingTokens$.next(true);

    return this.http.get('/api/oauth/token', { params: { id }, responseType: 'text' })
      .pipe(tap(token => {
        this.refreshingTokens$.next(false);
        this.accessToken$.next(token);
        this.token = token;

        if (token === 'good token') {
          this.isAccessTokenValid$.next(true);
        } else {
          this.isAccessTokenValid$.next(false);
        }
      }));
  }

  public getContent(): Observable<any> {
    return this.http.get('/api/content', { responseType: 'text' });
  }

  public multipleGetContent(): Observable<any> {
    return forkJoin([this.getContent(), this.getContent(), this.getContent()]);
  }

  public currentToken(): string {
    return this.token;
  }
}
