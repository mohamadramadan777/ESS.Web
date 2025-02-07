import { ColDef } from 'ag-grid-community';
import { Component, OnInit } from '@angular/core';
import * as config from './submission-record-config';
import { Client } from '../../services/api-client';
import { LoadingService } from '../../services/loader.service';
import { ToastrService } from 'ngx-toastr';

import {
  TextFilterModule,
  ClientSideRowModelModule,
  ValidationModule,
  TextEditorModule,
  CellStyleModule,
  RowAutoHeightModule ,
  PaginationModule,
  NumberFilterModule,
  RowSelectionModule,
} from 'ag-grid-community';


@Component({
  selector: 'app-submission-records',
  templateUrl: './submission-records.component.html',
  styleUrls: ['./submission-records.component.scss'],
})
export class SubmissionRecordsComponent implements OnInit {
  public modules = [
    TextFilterModule,
    ClientSideRowModelModule,
    ValidationModule,
    CellStyleModule,
    TextEditorModule,
    PaginationModule,
    NumberFilterModule,RowAutoHeightModule ,
    RowSelectionModule,
  ];
  public paginationPageSize = config.paginationPageSize;
  public paginationPageSizeSelector = config.paginationPageSizeSelector;
  public SubmittedColDef: ColDef[] = config.TableColDef;
  public PendingColDef: ColDef[] = config.TableColDef;
  public Pending: any[] = [];
  public Submitted: any[] = [];
  public defaultColDef = config.defaultColDef;
  public theme = config.theme;

  


  constructor(
    private client: Client,
  ) {}

  ngOnInit(): void {
     this.fetchSubmittedApplications();
     this.fetchPendingApplications();
  }

  fetchSubmittedApplications(){
    // const response = mockData; 
    this.client.getCompletedApplications().subscribe(response => {
      if (response && response.response) {
        
        this.Submitted = response.response.map(app => ({
          description: app.description,
          attachments: app.lstAttachments!.map(att => ({
            name: att.fileName,
            url: att.fileURI
          }))
        }));
      }
    });
  }

  fetchPendingApplications(){
    // const response = mockData; 
    this.client.getPendingItems().subscribe(response => {
      if (response && response.response) {
        this.Pending = response.response.map(app => ({
          description: app.description,
          attachments: app.lstAttachments!.map(att => ({
            name: att.fileName,
            url: att.fileURI
          }))
        }));
      }
    });
  }

  getRowHeight(params: any): number {
    if (params.data && params.data.attachments) {
      return 30 + params.data.attachments.length * 20; // Adjust row height dynamically
    }
    return 30; // Default row height
  }

  onRowClicked(event: any): void {
    console.log('Row clicked:', event.data);
    // Handle row click actions here (e.g., navigate or show modal)
  }
}
