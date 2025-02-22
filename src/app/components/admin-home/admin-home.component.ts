import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrl: './admin-home.component.scss'
})
export class AdminHomeComponent {

  isMaintenanceMode: boolean = false;

  toggleMaintenanceMode() {
    this.isMaintenanceMode = !this.isMaintenanceMode;
  }

  refreshTask() {
    console.log("Task refreshed.");
  }

  runTask() {
    console.log("Task executed.");
  }

  enableDisableTask() {
    console.log("Task enabled/disabled.");
  }
}
