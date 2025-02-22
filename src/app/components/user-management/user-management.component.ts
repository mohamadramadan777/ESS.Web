import { ColDef } from 'ag-grid-community';
import { Component, ViewChild,OnInit } from '@angular/core';
import { AccessModalComponent } from '../system-access/access-modal/access-modal.component';
import * as config from '../system-access/system-access-config';
import Swal from 'sweetalert2';

import { UserService } from '../../services/user.service';

import {
  TextFilterModule,
  ClientSideRowModelModule,
  NumberEditorModule,
  ValidationModule,
  TextEditorModule,
  PaginationModule,
  NumberFilterModule,
  PaginationNumberFormatterParams,
  RowSelectionModule,
} from 'ag-grid-community';
import { Client, WAccessRequests } from '../../services/api-client';
import { LoadingService } from '../../services/loader.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss'],
})
export class UserManagementComponent implements OnInit {
  
  searchCriteria = {
    firmName: '',
    qfcNumber: '',
    firmType: '',
    userRole: '',
    aiNumber: '',
    emailAddress: ''
  };

  @ViewChild(AccessModalComponent) accessModal!: AccessModalComponent;
  firms = ['Firm1', 'Firm2', 'Firm3'];
  firmTypes = ['Type1', 'Type2', 'Type3'];
  userRoles = ['Role1', 'Role2', 'Role3'];
  users: any[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  onSearch(): void {
    this.userService.searchUsers(this.searchCriteria).subscribe(users => {
      this.users = users;
    });
  }

  onReset(): void {
    this.searchCriteria = {
      firmName: '',
      qfcNumber: '',
      firmType: '',
      userRole: '',
      aiNumber: '',
      emailAddress: ''
    };
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe(users => {
      this.users = users;
    });
  }
}