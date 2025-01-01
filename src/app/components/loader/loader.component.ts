import { Component } from '@angular/core';
import { LoadingService } from '../../services/loader.service';

@Component({
  selector: 'app-loader',
  template: `
    <div class="loader-mask" *ngIf="loadingService.isLoading$ | async">
      <div class="spinner"></div>
    </div>
  `,
  styleUrls: ['./loader.component.scss'],
})
export class LoaderComponent {
  constructor(public loadingService: LoadingService) {}
}
