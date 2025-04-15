import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { WorkflowService } from '../../services/workflow.service';
import { Workflow } from '../../models/workflow.model';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule } from '@angular/material/paginator';
 
@Component({
  selector: 'app-workflow',
  templateUrl: './workflows.component.html',
  styleUrls: ['./workflows.component.scss']
})
export class WorkflowsComponent implements OnInit {
  searchForm: FormGroup;
  workflows: MatTableDataSource<Workflow> = new MatTableDataSource<Workflow>([]);
  displayedColumns: string[] = ['qfcNumber', 'objectTypeDesc', 'objectDetails', 'workflowStatusDesc', 'actions'];
  totalItems: number = 0;
  pageSize: number = 10;
  currentPage: number = 1;

  constructor(private fb: FormBuilder, private workflowService: WorkflowService) {
    this.searchForm = this.fb.group({
      qfcNumber: [''],
      objectTypeDesc: [''],
      objectDetails: [''],
      workflowStatusDesc: ['']
    });
  }

  ngOnInit(): void {
    this.loadWorkflows();
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadWorkflows();
  }

  onReset(): void {
    this.searchForm.reset();
    this.currentPage = 1;
    this.loadWorkflows();
  }

  loadWorkflows(): void {
    const params = {
      ...this.searchForm.value,
      page: this.currentPage,
      pageSize: this.pageSize
    };

    this.workflowService.getWorkflows(params).subscribe({
      next: (response: { workflows: Workflow[], totalItems: number }): void => {
        this.workflows.data = response.workflows;
        this.totalItems = response.totalItems;
      },
      error: (err) => {
        console.error('Error loading workflows', err);
      }
    });
  }

  onPageChange(event: any): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex + 1;
    this.loadWorkflows();
  }

  unlockWorkflow(workflowId: number): void {
    this.workflowService.unlockWorkflow(workflowId).subscribe(() => {
      this.loadWorkflows();
    });
  }

  editWorkflow(workflowId: number): void {
    // Implement edit workflow functionality
  }

  deleteWorkflow(workflowId: number): void {
    this.workflowService.deleteWorkflow(workflowId).subscribe(() => {
      this.loadWorkflows();
    });
  }
}