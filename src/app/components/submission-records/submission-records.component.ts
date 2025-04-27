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
  RowAutoHeightModule,
  PaginationModule,
  NumberFilterModule,
  RowSelectionModule,
} from 'ag-grid-community';
import { MatDialog } from '@angular/material/dialog';
import { FormType, WObjects } from '../../enums/app.enums';
import { GensubComponent } from './forms/gensub/gensub.component';
import Swal from 'sweetalert2';


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
    NumberFilterModule, RowAutoHeightModule,
    RowSelectionModule,
  ];
  public paginationPageSize = config.paginationPageSize;
  public paginationPageSizeSelector = config.paginationPageSizeSelector;
  public SubmittedColDef: ColDef[] = config.TableColDef;
  public PendingColDef: ColDef[] = config.PendingTableColDef;
  public Pending: any[] = [];
  public Submitted: any[] = [];
  public defaultColDef = config.defaultColDef;
  public theme = config.theme;
  isSubmittedLoaded = false;
  isPendingLoaded = false;
  XBRLDocType = "xbrlDocType";
  XBRLDocTypes: number[] = [];


  constructor(
    private client: Client,
    private loadingService: LoadingService,
    private toastr: ToastrService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.fetchSubmittedApplications();
    this.fetchPendingApplications();
  }

  fetchSubmittedApplications() {
    this.loadingService.show();
    this.client.getCompletedApplications().subscribe({
      next: (response) => {
        this.isSubmittedLoaded = true;
        if (this.isPendingLoaded) {
          this.loadingService.hide();
        }
        if (response && response.response) {
          this.Submitted = response.response.map(app => ({
            description: app.description,
            applicationID: app.applicationID,
            objectID: app.objectID,
            formTypeID: app.formTypeID,
            attachments: app.lstAttachments!.map(att => ({
              name: att.fileName,
              url: att.fileURI
            }))
          }));
        } else {
          this.toastr.error('Failed to load Completed applications.', 'Error');
          console.error('Failed to load Completed applications:', response?.errorMessage);
        }
      },
      error: (error) => {
        this.isSubmittedLoaded = true;
        if (this.isPendingLoaded) {
          this.loadingService.hide();
        }
        this.toastr.error('Error occurred while fetching Completed applications.', 'Error');
        console.error('Error occurred while fetching Completed applications:', error);
      },
    });
  }

  fetchPendingApplications() {

    this.loadingService.show();
    this.client.getPendingApplications().subscribe({
      next: (response) => {
        this.isPendingLoaded = true;
        if (this.isSubmittedLoaded) {
          this.loadingService.hide();
        }
        if (response && response.response) {
          this.Pending = response.response.map(app => ({
            description: app.description,
            showDelete: app.isItemAccessible,
            applicationID: app.applicationID,
            objectID: app.objectID,
            formTypeID: app.formTypeID
          }));
        } else {
          this.toastr.error('Failed to load Pending applications.', 'Error');
          console.error('Failed to load Pending applications:', response?.errorMessage);
        }
      },
      error: (error) => {
        this.isPendingLoaded = true;
        if (this.isSubmittedLoaded) {
          this.loadingService.hide();
        }
        this.toastr.error('Error occurred while fetching Pending applications.', 'Error');
        console.error('Error occurred while fetching Pending applications:', error);
      },
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

  onRowDoubleClickedSubmitted(event: any): void {
    const formTypeID = event.data.formTypeID;
    const objectID = event.data.objectID;
    const applicationID = event.data.applicationID;
    
    if (objectID == WObjects.IndividualApplications) {

      if (formTypeID == FormType.FormQO3) {
        // OPEN
        const dialogRef = this.dialog.open(GensubComponent, {
          width: '80%',
          height: '85%',
          data: {
            ...event.data,
            ReadOnly: false, // Pass the ReadOnly parameter
          },
        });
        dialogRef.afterClosed().subscribe((result) => {
          console.log('The dialog was closed', result);
        });
      }
      else if (formTypeID == FormType.FormQ12) {
        // OPEN
        const dialogRef = this.dialog.open(GensubComponent, {
          width: '80%',
          height: '85%',
          data: {
            ...event.data,
            ReadOnly: false, // Pass the ReadOnly parameter
          },
        });
        dialogRef.afterClosed().subscribe((result) => {
          console.log('The dialog was closed', result);
        });
      }
    }
    else if (objectID != WObjects.GeneralSubmission) {
      //openReportWindow(Convert.ToInt32(lblAppID.Text), Convert.ToInt32(lblFormTypeID.Text));
    }
    else { // if (objectID == WObjects.GeneralSubmission) 
      const iDocTypeID = formTypeID;
      const isXBRLDocType = this.isXBRL(formTypeID);
      var iFormTypeID = !isXBRLDocType ? -1 : formTypeID;
      if (iFormTypeID != -1) {
        // Open
        const dialogRef = this.dialog.open(GensubComponent, {
          width: '80%',
          height: '85%',
          data: {
            ...event.data,
            WIndFromTypeID: iFormTypeID,
            DocTypeId: iDocTypeID,
            ReadOnly: false, // Pass the ReadOnly parameter
          },
        });
        dialogRef.afterClosed().subscribe((result) => {
          console.log('The dialog was closed', result);
        });
      }
      else {
        this.loadingService.show();
        this.client.getFormTypeidOrDoctypeid(undefined, iDocTypeID).subscribe({
          next: (response) => {
            this.loadingService.hide();
            if (response && response.isSuccess && response.response) {
              // Open
              iFormTypeID = response.response.wIndFormTypeID ?? 0;
              const dialogRef = this.dialog.open(GensubComponent, {
                width: '80%',
                height: '85%',
                data: {
                  ...event.data,
                  WIndFromTypeID: iFormTypeID,
                  DocTypeId: iDocTypeID,
                  ReadOnly: false, // Pass the ReadOnly parameter
                },
              });
              dialogRef.afterClosed().subscribe((result) => {
                console.log('The dialog was closed', result);
              });
            } else {
              this.toastr.error('Failed to load form type.', 'Error');
              console.error('Failed to load form type:', response?.errorMessage);
            }
          },
          error: (error) => {
            this.loadingService.hide();
            this.toastr.error('Error occurred while fetching form type.', 'Error');
            console.error('Error occurred while fetching form type:', error);
          },
        });
      }
    }
  }

  onRowDoubleClickedPending(event: any): void {
    const formTypeID = event.data.formTypeID;
    const objectID = event.data.objectID;
    const applicationID = event.data.applicationID;
    if (objectID == WObjects.NotificationOfCompetency) {
      // Response.Redirect(Constants.URL_NOC_PAGE + Constants.QUESTIONMARK +
      //        Constants.QUERYSTRING_NOC_ID + Constants.CHAR_EQUAL +
      //         Encryption.EncryptQueryString(Convert.ToString(lblAppID.Text)), false);
    }
    else if (objectID == WObjects.GeneralSubmission) {
      const iDocTypeID = formTypeID;
      const isXBRLDocType = this.isXBRL(formTypeID);
      var iFormTypeID = !isXBRLDocType ? -1 : formTypeID;
      if (iFormTypeID != -1) {
        // Open
        const dialogRef = this.dialog.open(GensubComponent, {
          width: '80%',
          height: '85%',
          data: {
            ...event.data,
            WIndFromTypeID: iFormTypeID,
            DocTypeId: iDocTypeID,
            ReadOnly: false, // Pass the ReadOnly parameter
          },
        });
        dialogRef.afterClosed().subscribe((result) => {
          console.log('The dialog was closed', result);
        });
      }
      else {
        this.loadingService.show();
        this.client.getFormTypeidOrDoctypeid(undefined, iDocTypeID).subscribe({
          next: (response) => {
            this.loadingService.hide();
            if (response && response.isSuccess && response.response) {
              // Open
              iFormTypeID = response.response.wIndFormTypeID ?? 0;
              const dialogRef = this.dialog.open(GensubComponent, {
                width: '80%',
                height: '85%',
                data: {
                  ...event.data,
                  WIndFromTypeID: iFormTypeID,
                  DocTypeId: iDocTypeID,
                  ReadOnly: false, // Pass the ReadOnly parameter
                },
              });
              dialogRef.afterClosed().subscribe((result) => {
                console.log('The dialog was closed', result);
              });
            } else {
              this.toastr.error('Failed to load form type.', 'Error');
              console.error('Failed to load form type:', response?.errorMessage);
            }
          },
          error: (error) => {
            this.loadingService.hide();
            this.toastr.error('Error occurred while fetching form type.', 'Error');
            console.error('Error occurred while fetching form type:', error);
          },
        });
      }
    }
    else if (objectID.Text == WObjects.IndividualApplications) {

      if (formTypeID == FormType.FormQO3) {
        // OPEN
        const dialogRef = this.dialog.open(GensubComponent, {
          width: '80%',
          height: '85%',
          data: {
            ...event.data,
            ReadOnly: false, // Pass the ReadOnly parameter
          },
        });
        dialogRef.afterClosed().subscribe((result) => {
          console.log('The dialog was closed', result);
        });
      }
      else if (formTypeID == FormType.FormQ12) {
        // OPEN
        const dialogRef = this.dialog.open(GensubComponent, {
          width: '80%',
          height: '85%',
          data: {
            ...event.data,
            ReadOnly: false, // Pass the ReadOnly parameter
          },
        });
        dialogRef.afterClosed().subscribe((result) => {
          console.log('The dialog was closed', result);
        });
      }
    }
  }

  isXBRL(formTypeID: number): boolean {
    if (formTypeID != 0)
      return this.getDocType(formTypeID);
    else
      return false
  }

  getXbrlDoctypes(formTypeID: number): void {
    this.client.getXbrlDocTypes(0).subscribe({
      next: (response) => {
        if (response && response.isSuccess && response.response) {
          sessionStorage.setItem(this.XBRLDocType, JSON.stringify(response.response)); // Store in sessionStorage
          if (response.response != undefined) {
            this.XBRLDocTypes = response.response;
          }
        } else {
          this.toastr.error('Failed to load Xbrl Doctypes.', 'Error');
          console.error('Failed to load Xbrl Doctypes:', response?.errorMessage);
        }
      },
      error: (error) => {
        this.loadingService.hide();
        this.toastr.error('Error occurred while fetching Xbrl Doctypes.', 'Error');
        console.error('Error occurred while fetching Xbrl Doctypes:', error);
        return false;
      },
    });
  }

  getDocType(docTypeID: number): boolean {
    return this.XBRLDocTypes.some(docType => docType?.toString() === docTypeID?.toString());
  }

  onCellClicked(event: any) {
    const { colDef, event: mouseEvent, data } = event;
    if (colDef.field === 'showDelete') {
      const target = mouseEvent.target as HTMLElement;
      if (target.closest('.btn-revoke')) {
        // Determine the message based on the isRegistered field
        const message = "Are you sure you want to delete this application?";

        // Display confirmation dialog
        Swal.fire({
          html: message,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#a51e36',
          cancelButtonColor: '#555555',
          confirmButtonText: 'Yes, Delete',
          cancelButtonText: 'No, cancel',
        }).then((result) => {
          if (result.isConfirmed) {
            const applicationID = data.applicationID ?? 0;
            const objectID = data.objectID ?? 0;
            this.loadingService.show();
            this.client.deleteApplicationPOST(applicationID, objectID).subscribe({
              next: (response) => {
                this.loadingService.hide();
                if (response && response.response) {
                  // Optionally, show a success message
                  Swal.fire(
                    'Deleted!',
                    `Application Deleted.`,
                    'success'
                  );
                  this.fetchPendingApplications();

                } else {
                  console.error('Error deleting application.');
                  this.toastr.error('Error deleting application. Please try again.', 'Error');
                }
              },
              error: (error) => {
                this.loadingService.hide();
                console.error('Failed to delete application:', error);
                this.toastr.error('Failed to delete application. Please try again.', 'Error');
              }
            });

          }
        });
      }
    }
  }
}
