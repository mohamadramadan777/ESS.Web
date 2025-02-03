import { Component,HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';
import { AppConstants } from '../../../../constants/app.constants';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  AppConstants = AppConstants;
  name = localStorage.getItem(this.AppConstants.Session.SESSION_INDIVIDUAL_NAME);
  email = localStorage.getItem(this.AppConstants.Session.SESSION_EMAIL_ID);
  firmName = localStorage.getItem(this.AppConstants.Session.SESSION_FIRM_NAME) + " (" + localStorage.getItem(this.AppConstants.Session.SESSION_QFC_NO) + ")";
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
