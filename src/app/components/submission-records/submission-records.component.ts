import { ColDef } from 'ag-grid-community';
import { Component, OnInit } from '@angular/core';
import * as config from './submission-record-config';
import { Client } from '../../services/api-client';
import { LoadingService } from '../../services/loader.service';
import { ToastrService } from 'ngx-toastr';
import { jwtDecode } from "jwt-decode";
import {
  TextFilterModule,
  ClientSideRowModelModule,
  NumberEditorModule,
  ValidationModule,
  TextEditorModule,
  PaginationModule,
  NumberFilterModule,
  PaginationNumberFormatterParams,
  RowSelectionModule,
} from 'ag-grid-community';

interface CurrentUser {
  name: string;
  WUserID: string;
  FirmQFCNo: string;
  role: string;
}

@Component({
  selector: 'app-submission-records',
  templateUrl: './submission-records.component.html',
  styleUrls: ['./submission-records.component.scss'],
})
export class SubmissionRecordsComponent implements OnInit {
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
  public paginationPageSize = config.paginationPageSize;
  public paginationPageSizeSelector = config.paginationPageSizeSelector;
  public SubmittedColDef: ColDef[] = config.TableColDef;
  public PendingColDef: ColDef[] = config.TableColDef;
  public Submitted: any[] = [];
  public defaultColDef = config.defaultColDef;
  private currentUser: CurrentUser | null = null;
  public theme = config.theme;

  constructor(
    private client: Client,
    private loadingService: LoadingService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.decodeToken();
    this.loadSubmittedRecords();
  }

  private decodeToken(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.currentUser = jwtDecode<CurrentUser>(token);
    } else {
      console.error('Token not found!');
    }
  }

  private loadSubmittedRecords(): void {
    this.loadingService.show();
    this.client.getSubmittedApplications().subscribe({
      next: (response) => {

        if (response.isSuccess && response.response) {
          this.Submitted = this.processApplications(response.response);
        } else {
          this.toastr.error('Failed to load applications.', 'Error');
          console.error('Failed to load applications:', response?.errorMessage);
        }
        this.loadingService.hide();
      },
      error: (error) => {
        this.toastr.error('Error occurred while fetching applications.', 'Error');
        console.error('Error occurred while fetching applications:', error);
        this.loadingService.hide();
      },
    });
  }
  

  private processApplications(applications: any[]): any[] {
    
  
    const filteredApplications = applications.filter((item) => {
      let bCanView = false;
  
      // Handle Individual Applications
      if (item.objectID === 15 && item.userCreated === this.currentUser?.WUserID) {
        bCanView = true;
      }
  
      // Handle Notification of Competency
      if (item.objectID === 16 && this.hasRole('19')) {
        bCanView = true;
      }
  
      // Handle General Submission
      if (item.objectID === 17 && (item.userCreated === this.currentUser?.WUserID || this.hasRole('19'))) {
        bCanView = true;
      }
  
      // Firm Role-Based Access
      if (this.currentUser?.FirmQFCNo === '00173') {
        return true;
      } else {
        return false;
      }
    });
  
    return filteredApplications;
    // also the filtering according to signatories is still to be set wwaiting for api 
  }
  

  private hasRole(role: string): boolean {
    return this.currentUser?.role.split('@').includes(role) || false;
  }

  onRowClicked(event: any): void {
    console.log('Row clicked:', event.data);
    // Handle row click actions here (e.g., navigate or show modal)
  }
}
