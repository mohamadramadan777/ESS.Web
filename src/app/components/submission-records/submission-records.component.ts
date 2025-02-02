import { ColDef } from 'ag-grid-community';
import { Component, OnInit } from '@angular/core';
import * as config from './submission-record-config';
import { ICurrentUser, ISignatoryStatus } from './submission-record-config';
import { Client } from '../../services/api-client';
import { LoadingService } from '../../services/loader.service';
import { ToastrService } from 'ngx-toastr';

import {
  TextFilterModule,
  ClientSideRowModelModule,
  NumberEditorModule,
  ValidationModule,
  TextEditorModule,
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
    TextEditorModule,
    PaginationModule,
    NumberFilterModule,
    RowSelectionModule,
  ];
  public paginationPageSize = config.paginationPageSize;
  public paginationPageSizeSelector = config.paginationPageSizeSelector;
  public SubmittedColDef: ColDef[] = config.TableColDef;
  public PendingColDef: ColDef[] = config.TableColDef;
  public Pending: any[] = [];
  public Submitted: any[] = [];
  public defaultColDef = config.defaultColDef;
  private ICurrentUser: ICurrentUser | null = null;
  public theme = config.theme;

  


  constructor(
    private client: Client,
    private loadingService: LoadingService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
     this.fetchSubmittedApplications();
     this.fetchPendingApplications();
  }

  fetchSubmittedApplications(){
    this.client.getCompletedApplications().subscribe(response => {
      if (response && response.response) {
        this.Submitted = response.response.map(app => ({
          description: app.description,
          // attachments: this.getAttachments()
        }));
      }
    });
  }

  fetchPendingApplications(){
    this.client.getPendingItems().subscribe(response => {
      if (response && response.response) {
        this.Submitted = response.response.map(app => ({
          description: app.description,
          // attachments: this.getAttachments()
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

  getAttachments() {
    //code to get the attachments
  }

  onRowClicked(event: any): void {
    console.log('Row clicked:', event.data);
    // Handle row click actions here (e.g., navigate or show modal)
  }
}
