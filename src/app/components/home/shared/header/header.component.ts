import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService} from '../../../../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  name = 'Mohamed Ahmed';
  email = 'mahmed@newtecx.com';

  constructor(private router: Router,
    private authenticationService: AuthService,) {}

  logout(): void {
    // Clear token or user session
    localStorage.clear();
    this.authenticationService.logout();
  }
}
