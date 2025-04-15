import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Workflow } from '../models/workflow.model';
import { WorkflowResponse } from './project-model';

@Injectable({
  providedIn: 'root'
})
export class WorkflowService {
  private apiUrl = 'https://apicom/workflows'; 
 
  constructor(private http: HttpClient) { }

  getWorkflows(params: any): Observable<{ workflows: Workflow[], totalItems: number }> {
    return this.http.get<{ workflows: Workflow[], totalItems: number }>(`${this.apiUrl}/workflows`, { params });
  }

  getMockWorkflows(): Observable<WorkflowResponse> {
    const mockWorkflows: Workflow[] = [
      {
        WObjectID: 1,
        WObjectInstanceID: 1,
        ObjectTypeDesc: 'Type 1',
        QFCNumber: '12345',
        ObjectDetails: 'Details 1',
        WObjectWorkFlowStatusDesc: 'Status 1'
      },
      {
        WObjectID: 2,
        WObjectInstanceID: 2,
        ObjectTypeDesc: 'Type 2',
        QFCNumber: '67890',
        ObjectDetails: 'Details 2',
        WObjectWorkFlowStatusDesc: 'Status 2'
      }
    ];
    return of({ items: mockWorkflows, totalItems: mockWorkflows.length });
  }
  unlockWorkflow(workflowId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${workflowId}/unlock`, {});
  }
  deleteWorkflow(workflowId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${workflowId}`);
  }
  getWorkflowsAll(params: any): Observable<{ workflows: Workflow[], totalItems: number }> {
    return this.http.get<{ workflows: Workflow[], totalItems: number }>(`${this.apiUrl}/workflows`, { params });
  }
  createWorkflow(workflow: Workflow): Observable<Workflow> {
    return this.http.post<Workflow>(this.apiUrl, workflow);
  }
  updateWorkflow(workflow: Workflow): Observable<Workflow> {
    return this.http.put<Workflow>(`${this.apiUrl}/${workflow.WObjectID}`, workflow);
  }
  getWorkflowById(workflowId: number): Observable<Workflow> {
    return this.http.get<Workflow>(`${this.apiUrl}/${workflowId}`);
  }
  getWorkflowTypes(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/types`);
  }
  getWorkflowStatuses(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/statuses`);
  }
  getWorkflowTasks(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/tasks`);
  }
  getWorkflowSignatories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/signatories`);
  }
  getWorkflowSignatoryRoles(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/signatory-roles`);
  }
  getWorkflowSignatoryEmails(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/signatory-emails`);
  }
  
}