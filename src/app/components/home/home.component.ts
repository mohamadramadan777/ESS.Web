import { Component, OnInit, OnDestroy } from '@angular/core';
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

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.startAutoSwitch();
  }

  ngOnDestroy(): void {
    this.stopAutoSwitch();
  }

  // Notice Message
  showNoticeMessage: boolean = true;
  noticeMessage: string =
    'A new G03 form was published on the Regulatory Authority’s website effective 14 July 2021 and is now available to download from the “Forms and Fees” tab. All the authorised firms are required to use this new form for any controlled function application.';

  // Cards for Top-Right Section
  topCards = [
    { title: 'Reporting Schedules', icon: 'calendar_today', route: '/reports' },
    { title: 'Previous Submissions', icon: 'history', route: '/previous-submissions' },
    { title: 'Notices', icon: 'notifications', route: '/notices' },
  ];

  // Table Data
  tables = [
    {
      header: 'Required Sign-offs',
      icon: 'assignment_turned_in',
      data: [{ title: '2023 Annual MLRO Report due on 31/May/2024',  dueDate: '31/May/2024' }],
      columns: [
        { headerName: 'Your sign-off is required on the following:', field: 'title', flex: 1, minWidth: 800 },
        {
          headerName: 'Overdue',
          hide: true,
          field: 'overdueDays',
          cellRenderer: (params: any) =>
            `<span style="color: red; font-weight: bold;">${params.value} days</span>`,
          flex: 1,
        },
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
      header: 'Forms to Download and Submit',
      icon: 'cloud_download',
      data: [
        {
          formName: 'Form G03 - Controlled function application',
          downloadLink: 'Download G03 from here',
          submitLink: 'Submit to RA',
        },
        {
          formName: 'Form Q12 - Controlled function withdrawal',
          downloadLink: 'Download Q12 from here',
          submitLink: 'Submit to RA',
        },
        {
          formName: 'Form Q13 - Application by an Authorised Firm to Vary the Scope or Withdraw its Authorisation',
          downloadLink: 'Download Q13 from here',
          submitLink: 'Submit to RA',
        },
        {
          formName: 'Form G07 - Notifications',
          downloadLink: 'Download G07 from here',
          submitLink: 'Submit to RA',
        },
        {
          formName: 'Form Q05 - Application for Waiver or Modification',
          downloadLink: 'Download Q05 from here',
          submitLink: 'Submit to RA',
        },
        {
          formName: 'Form Q06A - Controller Notice - Authorised Firms',
          downloadLink: 'Download Q06A from here',
          submitLink: 'Submit to RA',
        },
        {
          formName: 'Form Q14 - General Submission Form',
          downloadLink: 'Download Q14 from here',
          submitLink: 'Submit to RA',
        },
      ],
      columns: [
        { headerName: 'Form', field: 'formName', flex: 2, minWidth: 800 },
        {
          headerName: 'Download', field: 'downloadLink', maxWidth: 120,
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
    if (colDef.field === 'downloadLink') {
      const target = mouseEvent.target as HTMLElement;
      // Determine the message based on the isRegistered field
      const message = `          <span id="ctl00_LegislationMasterBody_gwGenSubmissionForm_ctl02_lblLnkToDownload">Download Q03 from <a href="https://qfcra-en.thomsonreuters.com/rulebook/qfc-form-03-controlled-function-application" target="_blank">here</a>, complete the form with the required signatures and attach a scanned copy using the "Submit to RA" link.
<br><br>
<b>NOTE:</b> <i>If you are applying for approval of a Non-Resident MLRO, download the "Appendix AML/CFT Systems and Control, Non-resident MLRO" from <a href="https://qfcra-en.thomsonreuters.com/sites/default/files/net_file_store/Appendix_AML_CFT_Final_FormQ3.docx" target="_blank">here</a>, complete the form and attach a scanned copy along with your Q03 application.</i></span>`;

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

  currentTableIndex: number = 0;
  autoSwitchInterval: any;

  get currentTable() {
    return this.tables[this.currentTableIndex];
  }

  defaultColDef: ColDef = {
    resizable: true,
    sortable: true,
    filter: true,
    tooltipField: '',
  };

  paginationPageSize = 6;
  paginationPageSizeSelector = [6, 15, 30];

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
}
