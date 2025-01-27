import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import{environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SubmissionRecordsService {
  constructor(private http: HttpClient) {}

  // Fetch submitted applications
  getSubmittedApplications(): Observable<any> {
    return this.http.get(`${environment.apiBaseUrl}/api/GenSubmission/get-submitted-applications`);
  }

  // Decode JWT token
  decodeToken(): any {
    const token = localStorage.getItem('token'); 
    if (!token) return null;
    return JSON.parse(atob(token.split('.')[1]));
  }
}
