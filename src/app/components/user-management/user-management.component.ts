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
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MessagePropertyService } from '../../services/message-property.service';
import { User, UserSearchCriteria } from '../../models/user.model';

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
  totalItems: number = 0;
  @ViewChild(AccessModalComponent) accessModal!: AccessModalComponent;
  firms = ['Firm1', 'Firm2', 'Firm3'];
  firmTypes = ['Type1', 'Type2', 'Type3'];
  userRoles = ['Role1', 'Role2', 'Role3'];
  users: any[] = [];
  searchForm!: FormGroup;
   currentPage = 1;
  pageSize = 10;
  totalPages = 0;
  selectedUser: User | null = null;
   firmNames: any[] = [];
   loading = false;

  constructor(private userService: UserService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private messageService: MessagePropertyService

  ) {    this.initializeForm();
  }
  private initializeForm(): void {
    this.searchForm = this.fb.group({
      qfcNumber: [''],
      firmName: [''],
      aiNumber: [''],
      emailAddress: [''],
      userRole: [''],
      isAccountActive: [''],
      isAccountLocked: [''],
      isRegistered: [''],
      firmType: [''],
      isUserAuthorized: ['']
    });
  }

  
  displayedColumns: string[] = ['qfcNumber', 'username', 'email', 'status', 'actions'];
  ngOnInit(): void {
    this.loadUsers();
  }

  onSearch(): void {
    this.currentPage = 1;

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

  async updateUserStatus(userId: number, operation: 'unlock' | 'activate' | 'deactivate'): Promise<void> {
    try {
      this.loading = true;
      await this.userService.updateUserStatus(userId, operation).toPromise();
      //this.messageService.showSuccess(`User ${operation}d successfully`);
      await this.refreshUserList();
    } catch (error) {
      //this.messageService.showError(`Failed to ${operation} user`);
    } finally {
      this.loading = false;
    }
  }

  private async refreshUserList(): Promise<void> {
    const criteria: UserSearchCriteria = this.searchForm.value;
       this.onSearch;

    await this.userService.getUsers().toPromise();

    
    
    //this.getUserList(this.currentPage, this.pageSize, criteria);
  }

  onPageChange(event: any): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex + 1;
    this.loadUsers();
}

unlockUser(userId: string): void {
    this.userService.unlockUser(userId).subscribe(() => {
        this.loadUsers();
    });
}

editUser(userId: string): void {
    // Implement edit user functionality
}

deleteUser(userId: string): void {
    this.userService.deleteUser(userId).subscribe(() => {
        this.loadUsers();
    });
}
}