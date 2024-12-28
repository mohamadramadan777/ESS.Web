import { Component,HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  name = 'Mohamed Ahmed';
  email = 'mahmed@newtecx.com';
  firmName = 'Abu Dhabi Islamic Bank - Qatar Financial Center (000143)'; // Replace with the actual firm name
  menuOpen = false;

  constructor(private router: Router, private authenticationService: AuthService) {}

  logout(): void {
    // Clear token or user session
    localStorage.clear();
    this.authenticationService.logout();
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  navigateTo(route: string): void {
    this.menuOpen = false; // Close the menu after navigating
    this.router.navigate([`/${route}`]);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    const isMenu = target.closest('.menu') !== null;
    const isMoreIcon = target.closest('.more-icon') !== null;

    if (!isMenu && !isMoreIcon) {
      this.menuOpen = false; // Close the menu if clicked outside
    }
  }
}
