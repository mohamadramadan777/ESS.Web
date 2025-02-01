import { ColDef } from 'ag-grid-community';
import { Component, OnInit } from '@angular/core';
import * as config from './submission-record-config';
import { Client } from '../../services/api-client';
import { LoadingService } from '../../services/loader.service';
import { ToastrService } from 'ngx-toastr';
import { jwtDecode } from 'jwt-decode';
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
  public Pending:any[]=[];
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
    this.loadPendingRecords();
  }

  private decodeToken(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.currentUser = jwtDecode<CurrentUser>(token);
    } else {
      console.error('Token not found!');
    }
  }

  //Submitted Records
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
        this.toastr.error(
          'Error occurred while fetching applications.',
          'Error'
        );
        console.error('Error occurred while fetching applications:', error);
        this.loadingService.hide();
      },
    });
  }

  private processApplications(applications: any[]): any[] {
    const filteredApplications = applications.filter((item) => {
      let bCanView = false;

      // Handle Individual Applications
      if (
        item.objectID === 15 &&
        item.userCreated === this.currentUser?.WUserID
      ) {
        bCanView = true;
      }

      // Handle Notification of Competency
      if (item.objectID === 16 && this.hasRole('19')) {
        bCanView = true;
      }

      // Handle General Submission
      if (
        item.objectID === 17 &&
        (item.userCreated === this.currentUser?.WUserID || this.hasRole('19'))
      ) {
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

  //Pending Records
  private loadPendingRecords(): void {
    // this.loadingService.show();
    // this.client.getPendingApplications().subscribe({
    //   next: (response) => {
    //     if (response.isSuccess && response.response) {
    //       this.Pending = this.processApplications(response.response);
    //     } else {
    //       this.toastr.error('Failed to load applications.', 'Error');
    //       console.error('Failed to load applications:', response?.errorMessage);
    //     }
    //     this.loadingService.hide();
    //   },
    //   error: (error) => {
    //     this.toastr.error('Error occurred while fetching applications.', 'Error');
    //     console.error('Error occurred while fetching applications:', error);
    //     this.loadingService.hide();
    //   },
    // });
  }
  private processPendingApplications(applications: any[]): any[] {
    console.log('Processing Pending Applications:', applications);

    return applications.filter((item) => {
      let bCanView = false;

      console.log('Processing Item:', item);

      // Generate description based on application status
      if (!item.wObjectSOStatusID) {
        if (item.applicationStatus === 'Resubmission Required') {
          item.description = `Resubmission required for ${
            item.individualName || 'Unknown'
          } - ${item.formType} (Created on ${item.createdDate})`;
        } else if (
          item.applicationStatus === 'Accepted' &&
          item.attachmentResubmissionRequired
        ) {
          item.description = `Attachment resubmission required for ${
            item.individualName || 'Unknown'
          } - ${item.formType} (Created on ${item.createdDate})`;
        } else {
          item.description = `Application not submitted for ${
            item.individualName || 'Unknown'
          } - ${item.formType} (Created on ${item.createdDate})`;
        }
      } else {
        item.description = `Sign-off pending for ${
          item.individualName || 'Unknown'
        } - ${item.formType} (Created on ${item.createdDate})`;
      }

      // Allow access to Application Creator
      if (item.userCreated === this.currentUser?.WUserID) {
        console.log('Creator Match:', item);
        bCanView = true;
      }

      // Allow access to Signatories
      if (item.signatories?.length) {
        const isUserSignatory = item.signatories.some(
          (signatory: any) => signatory.assignedTo === this.currentUser?.WUserID
        );
        if (isUserSignatory) {
          console.log('Signatory Access:', item);
          bCanView = true;
        }
      }

      // Allow access to Senior Executives & Compliance Officers
      if (this.hasRole('19')) {
        console.log('SEF/CO Access Granted:', item);
        bCanView = true;
      }

      return bCanView;
    });
  }

  private hasRole(role: string): boolean {
    return this.currentUser?.role.split('@').includes(role) || false;
  }

  onRowClicked(event: any): void {
    console.log('Row clicked:', event.data);
    // Handle row click actions here (e.g., navigate or show modal)
  }
}
