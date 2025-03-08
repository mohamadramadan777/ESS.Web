import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Workflow } from '../models/workflow.model';

@Injectable({
  providedIn: 'root'
})
export class WorkflowService {
  private apiUrl = 'https://api.example.com/workflows'; // Replace with your API URL

  constructor(private http: HttpClient) { }

  getWorkflows(params: any): Observable<Workflow[]> {
    // Replace with actual HTTP request
    return this.http.get<Workflow[]>(this.apiUrl, { params });
  }

  getMockWorkflows(): Observable<Workflow[]> {
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
    return of(mockWorkflows);
  }
}import { Component, OnInit } from '@angular/core';
import { WorkflowService } from 'src/app/services/workflow.service';
import { Workflow } from 'src/app/models/workflow.model';

@Component({
  selector: 'app-workflow',
  templateUrl: './workflow.component.html',
  styleUrls: ['./workflow.component.css']
})
export class WorkflowComponent implements OnInit {
  workflows: Workflow[] = [];
  displayedColumns: string[] = ['QFCNumber', 'ObjectTypeDesc', 'ObjectDetails', 'WObjectWorkFlowStatusDesc'];

  constructor(private workflowService: WorkflowService) { }

  ngOnInit(): void {
    this.loadWorkflows();
  }

  loadWorkflows(): void {
    this.workflowService.getMockWorkflows().subscribe(data => {
      this.workflows = data;
    });
  }
}
```
<!-- filepath: src/app/components/workflow/workflow.component.html -->
<table mat-table [dataSource]="workflows" class="mat-elevation-z8">
  <ng-container matColumnDef="QFCNumber">
    <th mat-header-cell *matHeaderCellDef> QFC Number </th>
    <td mat-cell *matCellDef="let element"> {{element.QFCNumber}} </td>
  </ng-container>

  <ng-container matColumnDef="ObjectTypeDesc">
    <th mat-header-cell *matHeaderCellDef> Object Type </th>
    <td mat-cell *matCellDef="let element"> {{element.ObjectTypeDesc}} </td>
  </ng-container>

  <ng-container matColumnDef="ObjectDetails">
    <th mat-header-cell *matHeaderCellDef> Object Details </th>
    <td mat-cell *matCellDef="let element"> {{element.ObjectDetails}} </td>
  </ng-container>

  <ng-container matColumnDef="WObjectWorkFlowStatusDesc">
    <th mat-header-cell *matHeaderCellDef> Workflow Status </th>
    <td mat-cell *matCellDef="let element"> {{element.WObjectWorkFlowStatusDesc}} </td>
  </ng-container>

  <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
  <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
</table>