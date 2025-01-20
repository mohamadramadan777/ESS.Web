import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  @Input() selectedPage: string = ''; // Default active page
  isDropdownOpen: boolean = false; // Dropdown visibility flag

  openDropdown(): void {
    this.isDropdownOpen = true;
  }

  closeDropdown(): void {
    this.isDropdownOpen = false;
  }
  setActivePage(page: string): void {
    this.selectedPage = page;
  }
}
