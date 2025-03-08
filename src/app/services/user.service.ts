import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { User } from '../models/user.model';
// import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'https://api.example.com/users';

  constructor(private http: HttpClient) {}
 

  searchUsers(criteria: any): Observable<any[]> {
    return this.http.post<any[]>(`${this.apiUrl}/search`, criteria);
  }

  
 

  createUser(user:any): Observable<any> {
    // Mocking an HTTP call
    return of({ success: true, message: 'User created successfully' });
  }

  getUsers(): Observable<User[]> {
    // Mocking an HTTP call
    const users: User[] = [
      { emailAddress: 'user1@example.com', 
        userName: 'User One', roles: ['Admin'], serviceRequestId: '12345',
         note: 'Note 1', wUserId: 1, wAccessRequestId: 'req1',
          qfcNumber: 'QFC1', firmName: 'Firm One',
          individualName: 'Individual One', individualEmailAddress: 'ind1@example.com',
          isRegistered: true, isActive: true, createdDate: new Date(), updatedDate: new Date(),
          createdBy: 'Admin', updatedBy: 'Admin', modifiedDate: new Date() },
      { emailAddress: 'user2@example.com', userName: 'User Two', 
        roles: ['User'], serviceRequestId: '67890', note: 'Note 2',
         wUserId: 2, wAccessRequestId: 'req2', qfcNumber: 'QFC2', 
         firmName: 'Firm Two', individualName: 'Individual Two', 
         individualEmailAddress: 'ind2@example.com', isRegistered: true, 
         isActive: true, createdDate: new Date(), updatedDate: new Date(),
         createdBy: 'Admin', updatedBy: 'Admin', modifiedDate: new Date() }
    ];
    return of(users);
  }


  /**
   * getUserList(page: number, pageSize: number, criteria?: UserSearchCriteria): Observable<PaginatedResponse<User>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (criteria) {
      Object.keys(criteria).forEach(key => {
        if (criteria[key] !== undefined && criteria[key] !== null && criteria[key] !== '') {
          params = params.set(key, criteria[key].toString());
        }
      });
    }

    return this.http.get<PaginatedResponse<User>>(`${this.apiUrl}/list`, { params });
  }*/

  getFirmTypes(): Observable<{ id: number; name: string }[]> {
    return this.http.get<{ id: number; name: string }[]>(`${this.apiUrl}/firm-types`);
  }

  getFirmNames(): Observable<{ qfcNumber: string; name: string }[]> {
    return this.http.get<{ qfcNumber: string; name: string }[]>(`${this.apiUrl}/firm-names`);
  }

  getUserRoles(): Observable<{ id: number; name: string }[]> {
    return this.http.get<{ id: number; name: string }[]>(`${this.apiUrl}/roles`);
  }

  updateUserStatus(userId: number, operation: 'unlock' | 'activate' | 'deactivate'): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${userId}/${operation}`, {});
  }

  resetUserQA(userId: number, newQA: string, serviceRequestId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${userId}/reset-qa`, { 
      newQA,
      serviceRequestId 
    });
  }

  updateUserRoles(userId: number, roleIds: number[], operation: 'activate' | 'deactivate'): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${userId}/roles/${operation}`, { roleIds });
  }

  unlockUser(userId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${userId}/unlock`, {});
  }

  deleteUser(userId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${userId}`);
  }
}