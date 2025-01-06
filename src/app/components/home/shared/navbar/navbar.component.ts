import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  @Input() selectedPage: string = ''; // Default active page

  setActivePage(page: string): void {
    this.selectedPage = page;
  }
}
