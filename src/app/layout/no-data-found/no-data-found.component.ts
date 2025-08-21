import { Component } from '@angular/core';

@Component({
  selector: 'app-no-data-found',
  standalone: true,
  template: `
    <div class="no-data-container">
      <h1>No Data Found</h1>
      <p>The page you are looking for does not exist.</p>
    </div>
  `,
  styles: [`
    .no-data-container {
      text-align: center;
      margin-top: 50px;
    }
  `]
})
export class NoDataFoundComponent {}
