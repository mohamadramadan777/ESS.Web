import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {Client} from './api-client';
@Injectable({
  providedIn: 'root'
})
export class SubmissionRecordsService {

  constructor(private client :Client) { }
  

  getSubmissionRecords(): Observable<any> {
    return this.client.getSubmittedApplications();
  }
}
