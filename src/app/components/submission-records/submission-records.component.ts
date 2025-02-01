import { ColDef } from 'ag-grid-community';
import { Component, OnInit } from '@angular/core';
import * as config from './submission-record-config';
import { ICurrentUser, ISignatoryStatus } from './submission-record-config'; 
import { Client, ConfigMessage } from '../../services/api-client'; // ✅ Ensure correct import for ConfigMessage
import { LoadingService } from '../../services/loader.service';
import { ToastrService } from 'ngx-toastr';
import { jwtDecode } from 'jwt-decode';
import { catchError,map } from 'rxjs/operators';
import { Observable, forkJoin, of } from 'rxjs';
import {PendingItemsOnHomePage} from '../../enums/app.enums';
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
    this.decodeToken();
    this.loadSubmittedRecords();
    this.loadPendingRecords();
  }

  private decodeToken(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.ICurrentUser = jwtDecode<ICurrentUser>(token);
    } else {
      console.error('Token not found!');
    }
  }

  // ✅ Load Submitted Records
  private loadSubmittedRecords(): void {
    this.loadingService.show();

    this.client.getSubmittedApplications().subscribe({
      next: (response) => {

        if (response.isSuccess && response.response) {
          let applications = response.response;

          // Extract application IDs (ensure type safety)
          const applicationIds: number[] = applications
            .map((app) => app.applicationID)
            .filter((id) => id !== undefined) as number[];

          // Fetch signatory statuses
          this.getSignatoryStatuses(applicationIds).subscribe((signatoryData: ISignatoryStatus[][]) => {
            // Flatten the signatory data since forkJoin returns an array of arrays
            const flattenedSignatoryData: ISignatoryStatus[] = signatoryData.flat();

            // Process and filter applications with signatory data
            this.Submitted = this.processApplications(applications, flattenedSignatoryData);
            this.loadingService.hide();
          });
        } else {
          this.toastr.error('Failed to load applications.', 'Error');
          console.error('Failed to load applications:', response?.errorMessage);
          this.loadingService.hide();
        }
      },
      error: (error) => {
        this.toastr.error('Error occurred while fetching applications.', 'Error');
        console.error('Error occurred while fetching applications:', error);
        this.loadingService.hide();
      },
    });
  }

  // ✅ Fetch Signatory Statuses
  private getSignatoryStatuses(applicationIds: number[]): Observable<ISignatoryStatus[][]> {
    return applicationIds.length > 0
      ? forkJoin(
          applicationIds.map((appId) =>
            this.client.getObjectSoTaskStatus(15, appId, undefined).pipe(
              map((response) =>
                (response.response || []).map((task) => ({
                  objectID: task.objectID ?? 0, // ✅ Ensure number type
                  objectInstanceID: task.objectInstanceID ?? 0,
                  soTaskAssignedTo: task.soTaskAssignedTo ?? 0,
                  soTaskCompletionDate: task.soTaskCompletionDate ?? '',
                  soTaskSeqNo: task.soTaskSeqNo ?? 0,
                  groupSignOff: task.groupSignOff ?? false,
                  isLoggedInUser: task.isLoggedInUser ?? false,
                }))
              )
            )
          )
        )
      : of([]); // ✅ Return an empty array if no application IDs exist
  }
  
  

  // ✅ Process Applications
  private processApplications(applications: any[], signatoryData: ISignatoryStatus[]): any[] {
    return applications.filter((item) => {
      let bCanView = false;

      // Generate description
      this.generateDescription(item).subscribe((description) => (item.description = description));

      // Check if the current user is the creator
      if (item.userCreated === Number(this.ICurrentUser?.WUserID)) {
        bCanView = true;
      }

      // Check if the user is a signatory
      const signatoryInfo = signatoryData.find((signatory) => signatory.objectInstanceID === item.applicationID);
      if (signatoryInfo && signatoryInfo.soTaskAssignedTo === Number(this.ICurrentUser?.WUserID)) {

        bCanView = true;
      }

      // Allow access to SEF & Compliance Officers
      if (this.hasRole('19')) {
   
        bCanView = true;
      }

      // Apply firm-based filtering
      return this.ICurrentUser?.FirmQFCNo === '00173' && bCanView;
    });
  }

  // ✅ Generate Description Asynchronously
  private generateDescription(item: any): Observable<string> {
    let messageKey = 0;
  
    // ✅ Determine message key based on status (Submitted vs Pending)
    if (item.statusTypeID === 4) { // ✅ Status 4 → Submitted Applications
      switch (item.objectID) {
        case 15: // Individual Applications
          messageKey = PendingItemsOnHomePage.ApplicationSubmitted;
          break;
        case 16: // Notification of Competency
          messageKey = PendingItemsOnHomePage.SubmittedNOCOnHomePage;
          break;
        case 17: // General Submission
          messageKey = PendingItemsOnHomePage.SubmittedGenSubOnHomePage;
          break;
        default:
          return of('No description available.');
      }
    } else { // ✅ Any other status → Pending Applications
      switch (item.objectID) {
        case 15: // Individual Applications
          messageKey = item.wObjectSOStatusID ? PendingItemsOnHomePage.ApplicationSignOffPending : PendingItemsOnHomePage.ApplicationNotSubmitted;
          break;
        case 16: // Notification of Competency
          messageKey = PendingItemsOnHomePage.ApplicationSignOffPending;
          break;
        case 17: // General Submission
          messageKey = item.wObjectSOStatusID ? PendingItemsOnHomePage.GenSubSignOffPending : PendingItemsOnHomePage.GenSubNotSubmitted;
          break;
        default:
          return of('No description available.');
      }
    }
  
    // ✅ Fix: Use "-" instead of empty string to avoid rejection
    const configDesc = '-';  // Placeholder value
    const configValue = '-'; // Placeholder value
    const isEditable = false; // Boolean value
  
    return this.client.getConfigMessage(
        0,              // WConfigMessageID (default: 0)
        messageKey.toString(),     // ConfigKey (actual key)
        configDesc,     // ConfigDesc (placeholder instead of "")
        configValue,    // ConfigValue (placeholder instead of "")
        isEditable      // IsEditable (false)
      ).pipe(
      map((response) => {
        if (response.isSuccess && response.response && response.response.length > 0) {
          let msg = response.response[0].configValue ?? '';
          msg = msg.replace('{INDIVIDUAL_NAME}', item.individualName || 'Unknown');
          msg = msg.replace('{CREATED_DATE}', item.createdDate || 'Unknown Date');
          msg = msg.replace('{SUBMITTED_DATE}', item.submittedDate || 'Unknown Date');
          msg = msg.replace('{DOC_TYPE}', item.formType || 'Unknown Document');
          console.log(msg);
          return msg;
        }
  
        console.warn(`No config message found for key: ${messageKey}`);
        return 'No description available.';
      }),
      catchError((error) => {
        console.error('Error fetching config message:', error);
        return of('No description available.');
      })
    );
  }
  
  
  
  private loadPendingRecords(): void {
    this.loadingService.show();
  
    this.client.getPendingItems().subscribe({
      next: (response) => {
        if (response.isSuccess && response.response) {
          let applications = response.response;
  
          // Extract application IDs (ensure type safety)
          const applicationIds: number[] = applications
            .map((app) => app.applicationID)
            .filter((id) => id !== undefined) as number[];
  
          // Fetch signatory statuses
          this.getSignatoryStatuses(applicationIds).subscribe((signatoryData: ISignatoryStatus[][]) => {
            // Flatten the signatory data since forkJoin returns an array of arrays
            const flattenedSignatoryData: ISignatoryStatus[] = signatoryData.flat();
  
            // Process and filter applications with signatory data
            this.Pending = this.processPendingApplications(applications, flattenedSignatoryData);
            this.loadingService.hide();
          });
        } else {
          this.toastr.error('Failed to load pending applications.', 'Error');
          console.error('Failed to load pending applications:', response?.errorMessage);
          this.loadingService.hide();
        }
      },
      error: (error) => {
        this.toastr.error('Error occurred while fetching pending applications.', 'Error');
        console.error('Error occurred while fetching pending applications:', error);
        this.loadingService.hide();
      },
    });
  }
  
  private processPendingApplications(applications: any[], signatoryData: ISignatoryStatus[]): any[] {
    return applications.filter((item) => {
      let bCanView = false;
  
      // Generate description asynchronously
      this.generateDescription(item).subscribe((description) => (item.description = description));
  
      // ✅ Check if the current user is the creator
      if (item.userCreated === Number(this.ICurrentUser?.WUserID)) {
        bCanView = true;
      }
  
      // ✅ Check if the user is a signatory
      const signatoryInfo = signatoryData.find((signatory) => signatory.objectInstanceID === item.applicationID);
      if (signatoryInfo && signatoryInfo.soTaskAssignedTo === Number(this.ICurrentUser?.WUserID)) {
        bCanView = true;
      }
  
      // ✅ Allow access to SEF & Compliance Officers
      if (this.hasRole('19')) {
        bCanView = true;
      }
  
      // ✅ Apply firm-based filtering
      return this.ICurrentUser?.FirmQFCNo === '00173' && bCanView;
    });
  }
  
  

  // ✅ Check User Role
  private hasRole(role: string): boolean {
    return this.ICurrentUser?.role.split('@').includes(role) || false;
  }




  onRowClicked(event: any): void {
    console.log('Row clicked:', event.data);
    // Handle row click actions here (e.g., navigate or show modal)
  }
}
