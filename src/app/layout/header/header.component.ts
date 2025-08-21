import { CommonModule } from '@angular/common';
import { Component, inject, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  isDarkTheme: boolean = false;
  private renderer = inject(Renderer2);
  private router = inject(Router);

  toggleTheme(): void {
    if (this.isDarkTheme) {
      this.renderer.removeClass(document.body, 'dark-theme');
      this.renderer.addClass(document.body, 'light-theme');
    } else {
      this.renderer.removeClass(document.body, 'light-theme');
      this.renderer.addClass(document.body, 'dark-theme');
    }
    this.isDarkTheme = !this.isDarkTheme;
  }
  goToUsers(): void {
    this.router.navigate(['/users']);
  }
}
