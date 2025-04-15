import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-create-new-user',
  templateUrl: './create-new-user.component.html',
  styleUrls: ['./create-new-user.component.scss']
})
export class CreateNewUserComponent {
  user: User = {
    emailAddress: 'mockemail@example.com',
    userName: 'mockuser',
    roles: ['Admin'],
    serviceRequestId: '12345',
    note: 'This is a mock user',
    wUserId: 1,
    wAccessRequestId: '1',
    qfcNumber: 'QFC123',
    firmName: 'Mock Firm',
    individualName: 'Mock Individual',
    individualEmailAddress: 'mockindividual@example.com',
    isRegistered: true,
    isActive: true,
    createdDate: new Date(),
    modifiedDate: new Date(),
    createdBy: 'admin',
    updatedBy: 'admin',
    isAccountLocked: false,
    isUserAccessAuthorised: true,
    firmTypeId: 1,
    firmTypeDesc: 'Mock Firm Type',
    roleIds: [1],
    activeRoleIds: [1],
    roleDescription: 'Mock Role Description',
    updatedDate: new Date() // Add this missing property
  };
  roles: string[] = ['Admin', 'User', 'Manager'];
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private userService: UserService) {}

  createUser() {
    if (this.isDataFilledIn()) {
      this.userService.createUser(this.user).subscribe(response => {
        if (response.success) {
          this.successMessage = response.message;
          this.errorMessage = '';
          this.clearAllFields();
        } else {
          this.errorMessage = response.message;
          this.successMessage = '';
        }
      });
    } else {
      this.errorMessage = 'Please fill in all required fields.';
    }
  }

  isDataFilledIn(): boolean {
    return this.user.emailAddress !== '' && this.user.userName !== '' && this.user.roles.length > 0;
  }

  clearAllFields() {
    this.user = {
      emailAddress: '',
      userName: '',
      roles: [],
      serviceRequestId: '',
      note: '',
      wUserId: 0,
      wAccessRequestId: '0',
      qfcNumber: '',
      firmName: '',
      individualName: '',
      individualEmailAddress: '',
      isRegistered: false,
      isActive: false,
      createdDate: new Date(),
      modifiedDate: new Date(),
      createdBy: '',
      updatedBy: '',
      isAccountLocked: false,
      isUserAccessAuthorised: false,
      firmTypeId: 0,
      firmTypeDesc: '',
      roleIds: [],
      activeRoleIds: [],
      roleDescription: '',
      updatedDate: new Date() // Add this missing property
    };
  }
}