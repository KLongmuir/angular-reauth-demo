import { Component } from '@angular/core';
import { take } from 'rxjs';
import { ApiService } from './api.service';

@Component({
  selector: 'angular-reauth-demo-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  tokenId = '';

  contentLoading = false;
  tokenLoading = false;

  content: any;

  constructor(public apiService: ApiService) {}

  getToken() {
    this.tokenLoading = true;

    this.apiService.getNewToken(this.tokenId).pipe(take(1)).subscribe(result => {
      this.tokenLoading = false;
      this.apiService.accessToken$.next(result);
    });
  }

  getContent() {
    this.contentLoading = true;

    this.apiService.getContent().pipe(take(1)).subscribe({
      next: (result) => {
        this.contentLoading = false;
        this.content = result;
      },
      error: () => {
        this.contentLoading = false;
      }
    })
  }

  multipleGetContent() {
    this.contentLoading = true;

    this.apiService.multipleGetContent().pipe(take(1)).subscribe({
      next: (result) => {
        this.contentLoading = false;
        this.content = result;
      },
      error: () => {
        this.contentLoading = false;
      }
    })
  }
}
