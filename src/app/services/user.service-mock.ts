import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { PaginatedResponse } from '../models/user.model';
import { User } from '../models/user-interface.model';

@Injectable()
export class MockUserManagementService {
  private mockUsers: User[] = [
    {
      wUserId: 1,
      wAccessRequestId: '101',
      qfcNumber: 'QFC001',
      firmName: 'Test Firm 1',
      individualName: 'John Doe',
      individualEmailAddress: 'john@example.com',
      isRegistered: true,
      isActive: true,
      isAccountLocked: false,
      isUserAccessAuthorised: true,
      firmTypeId: 1,
      firmTypeDesc: 'Corporate',
      roleIds: [1, 2],
      activeRoleIds: [1],
      roleDescription: 'Admin, User',
      emailAddress: 'john.doe@example.com',
      userName: 'johndoe',
      roles: ['Admin', 'User'],
      serviceRequestId: '201',
      note: 'Sample note'
    }
    // Add more mock users as needed
  ];

  getUserList(page: number, pageSize: number): Observable<PaginatedResponse<User>> {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const items = this.mockUsers.slice(startIndex, endIndex);
    
    return of({
      items,
      totalPages: Math.ceil(this.mockUsers.length / pageSize),
      currentPage: page,
      pageSize: pageSize,
      totalItems: this.mockUsers.length
    });
  }

  getFirmTypes(): Observable<{ id: number; name: string }[]> {
    return of([
      { id: 1, name: 'Corporate' },
      { id: 2, name: 'Individual' }
    ]);
  }

  getFirmNames(): Observable<{ qfcNumber: string; name: string }[]> {
    return of([
      { qfcNumber: 'QFC001', name: 'Test Firm 1' },
      { qfcNumber: 'QFC002', name: 'Test Firm 2' }
    ]);
  }

  getUserRoles(): Observable<{ id: number; name: string }[]> {
    return of([
      { id: 1, name: 'Admin' },
      { id: 2, name: 'User' }
    ]);
  }
}
