import { Component } from '@angular/core';
import { Workflow } from '../../models/workflow.model';
import { WorkflowService } from '../../services/workflow.service';

@Component({
  selector: 'app-workflows',
  templateUrl: './workflows.component.html',
  styleUrls: ['./workflows.component.scss'],
})
export class WorkflowsComponent {
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
