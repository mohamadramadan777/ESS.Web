
export interface Project {
  projectId: number;
  projectName: string;
  projectDescription: string;
  startDate: Date;
  endDate: Date;
  status: string;
}

import { Workflow } from '../models/workflow.model';

export interface WorkflowResponse {
  items: Workflow[];
  totalItems: number;
}