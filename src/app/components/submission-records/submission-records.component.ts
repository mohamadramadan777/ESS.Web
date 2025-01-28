import { MatTableDataSource } from '@angular/material/table';
import { ColDef } from 'ag-grid-community';
import { Component, ViewChild } from '@angular/core';
import * as config from './submission-record-config';
import Swal from 'sweetalert2';
import {
  TextFilterModule,
  ClientSideRowModelModule,
  NumberEditorModule,
  ValidationModule,
  TextEditorModule,
  themeQuartz,
  PaginationModule,
  NumberFilterModule,
  PaginationNumberFormatterParams,
  RowSelectionModule,
} from 'ag-grid-community';
import { Client, WAccessRequests } from '../../services/api-client';
import { LoadingService } from '../../services/loader.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-submission-records',
  templateUrl: './submission-records.component.html',
  styleUrls: ['./submission-records.component.scss'],
})
export class SubmissionRecordsComponent {
  public modules = [
    TextFilterModule,
    NumberEditorModule,
    TextEditorModule,
    ClientSideRowModelModule,
    ValidationModule,
    PaginationModule,
    NumberFilterModule,
    RowSelectionModule,
  ];
  paginationPageSize = config.paginationPageSize;
  theme = config.theme;
  paginationPageSizeSelector = config.paginationPageSizeSelector;
  paginationNumberFormatter = (params: PaginationNumberFormatterParams) => {
    return '[' + params.value.toLocaleString() + ']';
  };
  SubmittedColDef: ColDef[] = config.TableColDef;
  PendingColDef: ColDef[] = config.TableColDef;
  constructor(
    private client: Client,
    private loadingService: LoadingService,
    private toastr: ToastrService
  ) {}
  ngOnInit(): void {
    this.loadSubmittedRecords();
    this.loadPendingRecords();
  }
  Submitted : WAccessRequests[] = [];
  Pending: WAccessRequests[] = [];
  SubmittedLoaded: boolean = false;
  PendingLoaded: boolean = false;

  defaultColDef = {
    flex: 1,
    minWidth: 150,
    resizable: true,
  };

  loadSubmittedRecords(): void {
    this.client.getSubmittedApplications().subscribe({
      next: (response) => {
        this.SubmittedLoaded=true;
        if(this.PendingLoaded){
          this.loadingService.hide()
        }
        if (response && response.isSuccess && response.response) {
          this.Submitted = response.response;
        } else {
          this.toastr.error('Failed to load Submitted.', 'Error');
          console.error('Failed to load Submitted:', response?.errorMessage);
        }

    },
    error: (error) => {
      this.SubmittedLoaded = true;
      if (this.PendingLoaded) {
        this.loadingService.hide();
      }
      this.toastr.error('Error occurred while fetching Submitted.', 'Error');
      console.error('Error occurred while fetching Submitted:', error);
    },
    
  });}

  loadPendingRecords(): void {
   
  }

  onCellClicked(event: any) {
   
  }
}

//TODO: Check applyAppSecurity in Administration.aspx.cs line 84
