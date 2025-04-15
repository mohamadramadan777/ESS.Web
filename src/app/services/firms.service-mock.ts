import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { PaginatedResponse, Project } from '../models/user.model';
 
@Injectable()
export class MockProjectService {
  private mockProjects: Partial<Project>[] = [
    {
      projectId: 1,
      projectName: 'Project One',
      projectDescription: 'Description for Project One',
      startDate: new Date(),
      endDate: new Date(),
      status: 'Active'
    },
    {
      projectId: 2,
      projectName: 'Project Two',
      projectDescription: 'Description for Project Two',
      startDate: new Date(),
      endDate: new Date(),
      status: 'Completed'
    },
    {
      projectId: 3,
      projectName: 'Project Three',
      projectDescription: 'Description for Project Three',
      startDate: new Date(),
      endDate: new Date(),
      status: 'Active'
    },
    {
      projectId: 4,
      projectName: 'Project Four',
      projectDescription: 'Description for Project Four',
      startDate: new Date(),
      endDate: new Date(),
      status: 'On Hold'
    },
    {
      projectId: 5,
      projectName: 'Project Five',
      projectDescription: 'Description for Project Five',
      startDate: new Date(),
      endDate: new Date(),
      status: 'Cancelled'
    },
    {
      projectId: 6,
      projectName: 'Project Six',
      projectDescription: 'Description for Project Six',
      startDate: new Date(),
      endDate: new Date(),
      status: 'Active'
    },
    {
      projectId: 7,
      projectName: 'Project Seven',
      projectDescription: 'Description for Project Seven',
      startDate: new Date(),
      endDate: new Date(),
      status: 'Completed'
    },
    {
      projectId: 8,
      projectName: 'Project Eight',
      projectDescription: 'Description for Project Eight',
      startDate: new Date(),
      endDate: new Date(),
      status: 'On Hold'
    },
    {
      projectId: 9,
      projectName: 'Project Nine',
      projectDescription: 'Description for Project Nine',
      startDate: new Date(),
      endDate: new Date(),
      status: 'Cancelled'
    },
    {
      projectId: 10,
      projectName: 'Project Ten',
      projectDescription: 'Description for Project Ten',
      startDate: new Date(),
      endDate: new Date(),
      status: 'Active'
    }
  ];

  getProjectList(page: number, pageSize: number): Observable<PaginatedResponse<Project>> {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const items = this.mockProjects.slice(startIndex, endIndex) as Project[];
    
    return of({
      items,
      totalPages: Math.ceil(this.mockProjects.length / pageSize),
      currentPage: page,
      pageSize: pageSize,
      totalItems: this.mockProjects.length
    });
  }
}