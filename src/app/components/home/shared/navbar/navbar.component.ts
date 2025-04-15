import { Component, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  @Input() selectedPage: string = 'admin-home'; 
  
  @Output() itemSelected = new EventEmitter<string>();

  setActivePage(page: string): void {
    this.selectedPage = page;
  }

  menuItems = [

    { 
      name: 'Home',
      value: 'admin-home',
      submenus: [],
      isCurrent: false,
      route: '/admin-home',
      isDropdownOpen: false  
    },
  
    {
      name: 'User-Management',
      value: 'user-management',
      route: '/user-management',
      submenus: [
        { name: 'Create New User', route: '/create-new-user', isCurrent: false },
        { name: 'User', route: '/user', isCurrent: false }
      ],
      isCurrent: false,
      isDropdownOpen: false  
    },
    {
      name: 'AI-Applications',
      value: 'ai-applications',
      submenus: [
        { name: 'Create New AI Application', route: '/create-new-ai-application', isCurrent: false },
        { name: 'AI Applications', route: '/ai-applications', isCurrent: false }
      ],
      isCurrent: false,
      route: '/ai-applications',
      isDropdownOpen: false 
    },
    {
      name: 'Workflows',
      value: 'workflows',
      submenus: [
        { name: 'Create-New-Workflow', route: '/create-new-workflow', isCurrent: false },
        { name: 'Workflows', route: '/workflows', isCurrent: false }
      ],
      isCurrent: false,
      route: '/workflows',
      isDropdownOpen: false  
    },
    {
      name: 'Notifications',
      value: 'notifications',
      submenus: [
        { name: 'Create New Notification', route: '/create-new-notification', isCurrent: false },
        { name: 'Notifications', route: '/notifications', isCurrent: false }
      ],
      isCurrent: false,
      route: '/notifications',
      isDropdownOpen: false  
    },
    {
      name: 'Administration',
      value: 'administration',
      submenus: [
        { name: 'Manage Firms', route: '/manage-firms', isCurrent: false },
        { name: 'Manage Configuration', route: '/manage-configuration', isCurrent: false },
        { name: 'Admin Reports', route: '/admin-reports', isCurrent: false }
      ],
      isCurrent: false,
      route: '/administration',
      isDropdownOpen: false  
    },
  ];

  toggleDropdown(item: any): void {
    item.isDropdownOpen = !item.isDropdownOpen;
  }

  selectItem(item: any): void {
    this.itemSelected.emit(item.name);
  }
}