import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppConstants } from '../../constants/app.constants';
import { FirmType, WObjects, DocTypes } from '../../enums/app.enums';
import { Client, GeneralSubmissionForm, UserPendingItems, WNoticeList } from '../../services/api-client';
import { ToastrService } from 'ngx-toastr';
import { LoadingService } from '../../services/loader.service';
import { MatDialog } from '@angular/material/dialog';
import { ViewNoticeComponent } from '../notices/view-notice/view-notice.component';

import {
  ColDef,
  themeAlpine,
  ClientSideRowModelModule,
  TextFilterModule,
  RowSelectionModule,
  PaginationModule,
} from 'ag-grid-community';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { min } from 'rxjs';
import { WithdrawalComponent } from '../submission-records/forms/withdrawal/withdrawal.component';
import { ApprovalComponent } from '../submission-records/forms/approval/approval.component';
import { GensubComponent } from '../submission-records/forms/gensub/gensub.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  public modules = [
    ClientSideRowModelModule,
    TextFilterModule,
    RowSelectionModule,
    PaginationModule,
  ];
  firmTypeString: string = localStorage.getItem(AppConstants.Session.SESSION_FIRM_TYPE) ?? '';
  firmType = 0;
  constructor(
    private client: Client,
    private router: Router,
    private loadingService: LoadingService,
    private toastr: ToastrService,
    private dialog: MatDialog) { }

  requiredSignoff: { title: string; overdueDays: number; dueDate: string }[] = [
    { title: "Loading...", overdueDays: 0, dueDate: "" }
  ];

  generealCommunications: { title: string; wNoticeID: number; wFirmNoticeID: number; wsosStatusTypeID: number }[] = [
    { title: "Loading...", wNoticeID: 0, wFirmNoticeID: 0, wsosStatusTypeID: 0 }
  ];

  pendingSubmissions: { title: string; wNoticeID: number; wFirmNoticeID: number; wsosStatusTypeID: number }[] = [
    { title: "Loading...", wNoticeID: 0, wFirmNoticeID: 0, wsosStatusTypeID: 0 }
  ];

  generalSubmissionForms: { title: string; link: string; WIndFromTypeID: number; DocTypeId: number }[] = [
    { title: "Loading...", link: "", WIndFromTypeID: 0, DocTypeId: 0 }
  ];

  filteredTables: any[] = []; // Stores tables with data
  requiredSignoffLoaded = false;
  pendingSubmissionsLoaded = false;
  generalCommunicationLoaded = false;
  formsLoaded = false;
  defaultTableSelected = false;

  ngOnInit(): void {
    this.firmType = this.firmTypeString != "" ? Number(this.firmTypeString) : 0;
    this.loadingService.show();
    this.getXbrlDoctypes();
    this.displayESSAnncouncement();
    this.getPendingForLoggedInUser();
    this.getGeneralCommunication();
    this.getGeneralSubmissionForms();
    this.pendingSubmissionsLoaded = true;
    //this.startAutoSwitch();
  }

  ngOnDestroy(): void {
    //this.stopAutoSwitch();
  }

  getXbrlDoctypes(): void {
    const xbrlDocTypes = sessionStorage.getItem(AppConstants.Keywords.XBRLDocType); // Check session storage
    if (!xbrlDocTypes) {
      this.client.getXbrlDocTypes(Number(AppConstants.Keywords.XBRL_GENERALSUBMISSION_CATEGORYTYPE_ID)).subscribe({
        next: (response) => {
          if (response && response.isSuccess && response.response) {
            sessionStorage.setItem(AppConstants.Keywords.XBRL_GENERALSUBMISSION_CATEGORYTYPE_ID, JSON.stringify(response.response)); // Store in sessionStorage
          } else {
            this.toastr.error('Failed to load XbrlDocTypes.', 'Error');
            console.error('Failed to load XbrlDocTypes:', response?.errorMessage);
          }
        },
        error: (error) => {
          this.toastr.error('Error occurred while fetching XbrlDocTypes.', 'Error');
          console.error('Error occurred while fetching XbrlDocTypes:', error);
        },
      });
    }
  }

  // Notice Message
  showNoticeMessage: boolean = true;
  ESSAnnoucement: string = "";
  VIEWSTATE_NOTICE: string = "lstNotice";
  // Cards for Top-Right Section
  topCards = [
    { title: 'Reporting Schedules', icon: 'calendar_today', route: '/reports' },
    { title: 'Previous Submissions', icon: 'history', route: '/submission-records' },
    { title: 'Notices', icon: 'notifications', route: '/notices' },
  ];

  // Table Data
  tables = [
    {
      header: 'Required Sign-offs',
      icon: 'assignment_turned_in',
      data: this.requiredSignoff,
      columns: [
        { headerName: 'Your sign-off is required on the following:', field: 'title', flex: 1, minWidth: 800 },
      ],
    },
    {
      header: 'Pending Submissions',
      icon: 'pending_actions',
      data: [
        {
          title: 'Submission Overdue: 2023 Annual MLRO Report',
          dueDate: '31/May/2024',
          overdueDays: 162,
        },
        {
          title: 'Submission Overdue: March - 2024 Quarterly Lead Regulator Report',
          dueDate: '31/May/2024',
          overdueDays: 162,
        },
        {
          title: 'Submission Overdue: April - 2024 Monthly Prudential Return',
          dueDate: '31/May/2024',
          overdueDays: 162,
        },
        {
          title: 'Submission Overdue: May - 2024 Monthly Prudential Return (Solo)',
          dueDate: '30/Jun/2024',
          overdueDays: 144,
        },
        {
          title: 'Submission Overdue: June - 2024 Monthly Prudential Return (Solo)',
          dueDate: '31/Jul/2024',
          overdueDays: 121,
        },
        {
          title: 'Submission Overdue: June - 2024 Quarterly Prudential Returns',
          dueDate: '31/Jul/2024',
          overdueDays: 121,
        },
        {
          title: 'Submission Overdue: June - 2024 Semi-Annual Prudential Returns (Solo)',
          dueDate: '31/Jul/2024',
          overdueDays: 121,
        },
        {
          title: 'Submission Overdue: 2023 Annual Confirmation of CRS Submission',
          dueDate: '31/Jul/2024',
          overdueDays: 121,
        },
        {
          title: 'Submission Overdue: June - 2024 Quarterly Lead Regulator Report',
          dueDate: '31/Aug/2024',
          overdueDays: 100,
        },
        {
          title: 'Submission Overdue: July - 2024 Monthly Prudential Returns (Solo)',
          dueDate: '31/Aug/2024',
          overdueDays: 100,
        },
      ],
      columns: [
        { headerName: 'Following items are pending for submission:', field: 'title', flex: 1, minWidth: 800 },
        { field: 'dueDate', flex: 1 },
        {
          headerName: 'Overdue',
          field: 'overdueDays',
          cellRenderer: (params: any) =>
            `<span style="color: red; font-weight: bold;">${params.value} days</span>`,
          flex: 1,
        },
      ],
    },
    {
      header: 'General Communication',
      icon: 'info',
      data: this.generealCommunications,
      columns: [
        { headerName: 'General Communications:', field: 'title', flex: 1, minWidth: 800 }
      ],
    },
    {
      header: 'Forms to Download and Submit',
      icon: 'cloud_download',
      data: this.generalSubmissionForms,
      columns: [
        { headerName: 'Form', field: 'title', flex: 2, minWidth: 800 },
        {
          headerName: 'Download', field: 'linkToDownload', maxWidth: 120,
          cellRenderer: (params: any) => {
            const html = params.value;
            return `
                &nbsp&nbsp<button class="btn-icon btn-revoke" title="Download">
                  <span class="material-icons">download</span>
                </button>`;

          },
          flex: 2
        },
        {
          headerName: 'Submit', field: 'submitLink', maxWidth: 120,
          cellRenderer: (params: any) => {
            const html = params.value;
            return `
                <button class="btn-icon btn-revoke" title="Submit to RA">
                  <span class="material-icons">outgoing_mail</span>
                </button>`;

          },
          flex: 1
        },
      ],
    },
  ];

  onCellClicked(event: any) {
    const { colDef, event: mouseEvent, data } = event;
    if (colDef.field === 'linkToDownload') {
      // Determine the message based on the isRegistered field
      const message = data.link;
      // Display confirmation dialog
      Swal.fire({
        html: message,
        confirmButtonColor: '#a51e36',
        confirmButtonText: 'Close',
      }).then((result) => {
        if (result.isConfirmed) {
        }
      });
    }
    else if (colDef.field === 'submitLink') {
      if (data.DocTypeId == DocTypes.FormQ12) {
        const dialogRef = this.dialog.open(WithdrawalComponent, {
          width: '80%',
          height: '85%',
          data: {
            Form: data.title,
            WIndFromTypeID: data.WIndFromTypeID,
            DocTypeId: data.DocTypeId,
          },
        });
      }
      else if (data.DocTypeId == DocTypes.FormQ03) {
        const dialogRef = this.dialog.open(ApprovalComponent, {
          width: '80%',
          height: '85%',
          data: {
            Form: data.title,
            WIndFromTypeID: data.WIndFromTypeID,
            DocTypeId: data.DocTypeId,
          },
        });
      }
      else if (data.WIndFromTypeID != 0 && data.WIndFromTypeID != undefined) { //GenSub Here
        const dialogRef = this.dialog.open(GensubComponent, {
          width: '80%',
          height: '85%',
          data: {
            Form: data.title,
            WIndFromTypeID: data.WIndFromTypeID,
            DocTypeId: data.DocTypeId,
          },
        });
      }
      else {
        // Determine the message based on the isRegistered field
        const message = data.link;
        // Display confirmation dialog
        Swal.fire({
          html: message,
          confirmButtonColor: '#a51e36',
          confirmButtonText: 'Close',
        }).then((result) => {
          if (result.isConfirmed) {
          }
        });
      }
    }
  }

  currentTableIndex: number = 0;
  autoSwitchInterval: any;

  get currentTable() {
    return this.filteredTables[this.currentTableIndex];
  }

  updateFilteredTables(): void {
    this.filteredTables = this.tables.filter(table => !(table.header === 'General Communication' && table.data.length === 0));
  }

  defaultColDef: ColDef = {
    resizable: true,
    sortable: true,
    filter: true,
    tooltipField: '',
  };

  paginationPageSize = 8;
  paginationPageSizeSelector = [8];

  theme = themeAlpine.withParams(
    {
      backgroundColor: '#FFFFFF',
      foregroundColor: '#361008CC',
      browserColorScheme: 'light',
      headerBackgroundColor: 'rgb(220, 220, 220)',
      rowHoverColor: 'rgb(247, 230, 233)',
      borderRadius: '10px',
    },
    'light-red'
  ).withParams(
    {
      backgroundColor: '#201008',
      foregroundColor: '#FFFFFFCC',
      browserColorScheme: 'dark',
    },
    'dark-red'
  );

  // Close Notice Message
  closeNoticeMessage(): void {
    this.showNoticeMessage = false;
  }

  // Navigate to Card Routes
  navigate(route: string): void {
    console.log(`Navigate to: ${route}`);
    this.router.navigate([route]);
  }

  // Switch Table
  selectTable(index: number): void {
    this.currentTableIndex = index;
    this.stopAutoSwitch(); // Stop auto-switch when a tab is clicked
  }

  startAutoSwitch(): void {
    this.autoSwitchInterval = setInterval(() => {
      this.currentTableIndex = (this.currentTableIndex + 1) % 2;
    }, 5000);
  }

  stopAutoSwitch(): void {
    if (this.autoSwitchInterval) {
      clearInterval(this.autoSwitchInterval);
      this.autoSwitchInterval = null;
    }
  }

  download(): void {
    alert('Download clicked');
  }

  displayESSAnncouncement(): void {
    if (this.firmType == FirmType.Authorized) {
      this.ESSAnnoucement = "A new Q03 form was published on the Regulatory Authority’s website effective 14 July 2021 and is now available to download from the ‘Forms and Fees’ tab. All the authorised firms are required to use this new form for any controlled function application. Firms should take care to follow the new completion instructions detailed in the Q03 form."; //TODO: BALMessageSettings.GetMessageProperty((int)Announcement.AuthorisedHomePageAnnouncementMessage, true);
    } else if (this.firmType == FirmType.DNFBP) {
      this.ESSAnnoucement = ""; //TODO: BALMessageSettings.GetMessageProperty((int)Announcement.DNFBPHomePageAnnouncementMessage, true);
    }
    if (this.ESSAnnoucement == "") {
      this.showNoticeMessage = false;
    }
  }

  getPendingForLoggedInUser(): void {
    this.client.getPendingItemForLoggedInUser().subscribe({
      next: (response) => {
        this.requiredSignoff.pop();
        if (response && response.isSuccess && response.response) {
          this.processPendingItems(response.response);//map the response to the table data here.
          this.requiredSignoffLoaded = true;
          this.selectDefaultTable();
        } else {
          this.toastr.error('Failed to load Pending items.', 'Error');
          console.error('Failed to load Pending items:', response?.errorMessage);
          this.loadingService.hide();
        }
      },
      error: (error) => {
        this.requiredSignoff.pop();
        this.toastr.error('Error occurred while fetching Pending items.', 'Error');
        console.error('Error occurred while fetching Pending items:', error);
        this.loadingService.hide();
      },
    });
  }
  processPendingItems(responseData: UserPendingItems[]): void {
    for (const item of responseData) {
      let finalDescription = '';
      if (item.objectID === WObjects.ReportSchedule) {
        let reportDesc = "##ReportName## report due on ##DueDate##";//TODO: this.getMessageProperty(PendingItemsOnHomePage.ReportDesc);
        reportDesc = reportDesc.replace(AppConstants.Keywords.REPLACE_REPORT_NAME, item.reportOrIndName || '');
        reportDesc = reportDesc.replace(AppConstants.Keywords.REPLACE_DUE_DATE, item.rptDueDate || '');
        finalDescription = reportDesc;
      } else if (item.objectID === WObjects.IndividualApplications) {
        let purposeDesc = "AI Application for ##IndividualName## for ##Purpose##";//TODO: this.getMessageProperty(PendingItemsOnHomePage.AIDesc);
        purposeDesc = purposeDesc.replace('##IndividualName##', item.reportOrIndName || '');
        purposeDesc = purposeDesc.replace('##Purpose##', item.purpose || '');
        finalDescription = purposeDesc;
      } else if (item.objectID === WObjects.NotificationOfCompetency) {
        let purposeDesc = "Notification of Competency for ##IndividualName## created on ##CreatedDate## is pending for signature."; TODO: //this.getMessageProperty(PendingItemsOnHomePage.NocSignOffPending);
        purposeDesc = purposeDesc.replace('##IndividualName##', item.reportOrIndName || '');
        purposeDesc = purposeDesc.replace('##CreatedDate##', item.dateCreated || '');
        finalDescription = purposeDesc;
      } else if (item.objectID === WObjects.GeneralSubmission) {
        let purposeDesc = "##FormType## created on ##CreatedDate## is pending for signature.";//TODO: this.getMessageProperty(PendingItemsOnHomePage.GenSubSignOffPending);
        purposeDesc = purposeDesc.replace('##FormType##', item.purpose || '');
        purposeDesc = purposeDesc.replace('##CreatedDate##', item.dateCreated || '');
        finalDescription = purposeDesc;
        item.formTypeID = item.docTypeID ?? 0;
      } else if (item.objectID === WObjects.FirmNoticeResponse) {
        let purposeDesc = "A response to Notice Reference No. ##ReferenceNumber## titled ##Subject## and sent on ##NotificationSentDate## is waiting for your signature. A response is due to the Regulatory Authority by ##ResponseDueDate##.";//this.getMessageProperty(867);
        purposeDesc = purposeDesc.replace('##Subject##', item.purpose || '');
        purposeDesc = purposeDesc.replace('##ReferenceNumber##', item.rptFreqTypeDesc || '');
        purposeDesc = purposeDesc.replace('##NotificationSentDate##', item.reportOrIndName || '');
        purposeDesc = purposeDesc.replace('##ResponseDueDate##', item.dateCreated || '');
        finalDescription = purposeDesc;
      }

      // Push the processed data to the array
      this.requiredSignoff.push({
        title: finalDescription,
        overdueDays: 0,
        dueDate: ''
      });
    }
  }

  getGeneralCommunication(): void {
    const generealCommunications = sessionStorage.getItem(this.VIEWSTATE_NOTICE); // Check session storage
    if (generealCommunications) {
      this.generealCommunications.pop();
      this.processGeneralCommunication(JSON.parse(generealCommunications));
      return;
    }
    this.client.getWnoticeListForHome().subscribe({
      next: (response) => {
        this.generealCommunications.pop();
        if (response && response.isSuccess && response.response) {
          this.generalCommunicationLoaded = true;
          sessionStorage.setItem(this.VIEWSTATE_NOTICE, JSON.stringify(response.response)); // Store in sessionStorage
          this.processGeneralCommunication(response.response);//map the response to the table data here.
        } else {
          this.toastr.error('Failed to load General Communication.', 'Error');
          console.error('Failed to load General Communication:', response?.errorMessage);
          this.loadingService.hide();
        }
      },
      error: (error) => {
        this.generealCommunications.pop();
        this.toastr.error('Error occurred while fetching General Communication.', 'Error');
        console.error('Error occurred while fetching General Communication:', error);
        this.loadingService.hide();
      },
    });
  }

  processGeneralCommunication(responseData: WNoticeList[]): void {
    for (const item of responseData) {
      if (item.wResponseRequired) {
        continue;
      }
      // Push the processed data to the array
      this.generealCommunications.push({
        title: item.wSubject ?? "",
        wNoticeID: item.wNoticeID ?? 0,
        wFirmNoticeID: item.wFirmNoticeID ?? 0,
        wsosStatusTypeID: item.wsosStatusTypeID ?? 0,
      });
    }
    const generalCommunicationTable = this.tables.find(table => table.header === "General Communication");
    if (generalCommunicationTable) {
      generalCommunicationTable.data = this.generealCommunications;
    }

    this.updateFilteredTables();
  }

  getGeneralSubmissionForms(): void {

    this.client.getGeneralSubmissionForms(this.firmType).subscribe({
      next: (response) => {
        this.generalSubmissionForms.pop();
        if (response && response.isSuccess && response.response) {
          this.formsLoaded = true;
          this.processGeneralSubmissionForms(response.response);//map the response to the table data here.
          this.selectDefaultTable();
        } else {
          this.toastr.error('Failed to load General Submission Forms.', 'Error');
          console.error('Failed to load General Submission Forms:', response?.errorMessage);
          this.loadingService.hide();
        }
      },
      error: (error) => {
        this.generalSubmissionForms.pop();
        this.toastr.error('Error occurred while fetching General Submission Forms.', 'Error');
        console.error('Error occurred while fetching General Submission Forms:', error);
        this.loadingService.hide();
      },
    });
  }

  processGeneralSubmissionForms(responseData: GeneralSubmissionForm[]): void {
    for (const item of responseData) {
      // Push the processed data to the array
      this.generalSubmissionForms.push({
        title: item.docTypeDesc ?? "",
        link: item.linkToDownload ?? "",
        WIndFromTypeID: item.wIndFromTypeID ?? 0, // TODO: 
        DocTypeId: item.docTypeId ?? 0,
      });
    }
  }


  onRowDoubleClicked(event: any): void {
    if (event.data.wNoticeID) {
      this.loadingService.show();
      this.client.getWnoticeDetails(event.data.wNoticeID, event.data.wFirmNoticeID).subscribe({
        next: (response) => {
          this.loadingService.hide();
          if (response && response.isSuccess && response.response) {
            const noticeData = response.response;
            const dialogRef = this.dialog.open(ViewNoticeComponent, {
              width: '80%',
              height: '85%',
              data: {
                ...noticeData,
                wsosStatusTypeID: event.data.wsosStatusTypeID, // Pass the ReadOnly parameter
              },
            });

            dialogRef.afterClosed().subscribe((result) => {
              console.log('The dialog was closed', result);
            });
          } else {
            this.toastr.error('Failed to load notice data.', 'Error');
            console.error('Failed to load notice data:', response?.errorMessage);
          }
        },
        error: (error) => {
          this.loadingService.hide();
          this.toastr.error('Error occurred while fetching notice data.', 'Error');
          console.error('Error occurred while fetching notice data:', error);
        },
      });
    }
  }

  selectDefaultTable(): void {
    if (!this.defaultTableSelected) {
      setTimeout(() => {
        if (this.requiredSignoffLoaded && this.requiredSignoff.length > 0) {
          this.selectTable(1);
          setTimeout(() => {
            this.selectTable(0);
            this.defaultTableSelected = true;
            this.loadingService.hide();
          }, 100);
        }
        else if (this.requiredSignoffLoaded && this.pendingSubmissionsLoaded) {
          if (this.pendingSubmissions.length > 0) {
            this.selectTable(2);
            setTimeout(() => {
              this.selectTable(1);
              this.defaultTableSelected = true;
              this.loadingService.hide();
            }, 100);
          }
        }
        else if (this.requiredSignoffLoaded && this.pendingSubmissionsLoaded && this.generalCommunicationLoaded) {
          if (this.generealCommunications.length > 0) {
            this.selectTable(1);
            setTimeout(() => {
              this.selectTable(2);
              this.defaultTableSelected = true;
              this.loadingService.hide();
            }, 100);
          }
          else if (this.formsLoaded && this.generalSubmissionForms.length > 0) {
            this.selectTable(1);
            setTimeout(() => {
              this.selectTable(2);
              this.defaultTableSelected = true;
              this.loadingService.hide();
            }, 100);
          }
        }
      }, 100);
    }
    else if (this.currentTableIndex == (this.filteredTables.length - 1)) {
      setTimeout(() => {
        this.selectTable(this.filteredTables.length - 2);
        setTimeout(() => {
          this.selectTable(this.filteredTables.length - 1);
          this.defaultTableSelected = true;
          this.loadingService.hide();
        }, 100);
      }, 100);
    }
  }
}
