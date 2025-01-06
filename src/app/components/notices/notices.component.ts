import { Component, OnInit } from '@angular/core';
import {
  ColDef,
  ClientSideRowModelModule,
  TextFilterModule,
  RowSelectionModule,
  PaginationModule
} from 'ag-grid-community';
import * as config from './notices-config';
import { Client, WNoticeList } from '../../services/api-client'; 
import { LoadingService } from '../../services/loader.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { ViewNoticeComponent } from './view-notice/view-notice.component';


interface Notice {
  noticeType: string;
  noticeSentDate: string;
  noticeReferenceNumber: string;
  subject: string;
  dueDate: string;
  responseSignedBy: string;
  responseSignedDate: string;
}

@Component({
  selector: 'app-notices',
  templateUrl: './notices.component.html',
  styleUrls: ['./notices.component.scss'],
})
export class NoticesComponent implements OnInit {
  public modules = [
    ClientSideRowModelModule,
    TextFilterModule,
    RowSelectionModule,
    PaginationModule,
  ];

  notices: WNoticeList[] = [];
  filteredNotices: WNoticeList[] = [];
  years: number[] = [];
  selectedYear!: number;
  paginationPageSize = config.paginationPageSize;
  paginationPageSizeSelector = config.paginationPageSizeSelector;
  theme = config.theme;
  defaultColDef: ColDef = {
    resizable: true,
    sortable: true,
    filter: true,
    tooltipField: '', // Add tooltips for cell content
  };

  columnDefs=config.colDef;

  constructor(
    private client: Client,
    private loadingService : LoadingService,
    private toastr: ToastrService,
    private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadNotices();
  }

  loadNotices(): void {
    // Set year to 0 as the filtering will be handled in the front-end
    const year = 0;
    this.loadingService.show();
    // Call the API method
    this.client.getWnoticeList(year).subscribe({
      next: (response) => {
        this.loadingService.hide();
        if (response && response.isSuccess && response.response) {
          this.notices = response.response;
          // Populate years and filter notices after loading them
          this.populateYears();
          this.filterNotices();
        } else {
          this.toastr.error('Failed to load notices.', 'Error');
          console.error('Failed to load notices:', response?.errorMessage);
        }
      },
      error: (error) => {
        this.loadingService.hide();
        this.toastr.error('Error occurred while fetching notices.', 'Error');
        console.error('Error occurred while fetching notices:', error);
      },
    });
  }
  
  populateYears(): void {
    this.years = Array.from(
      new Set(this.notices.map((notice) => new Date(notice.wNotificationSentDate ?? "").getFullYear()))
    ).sort((a, b) => b - a);
    this.selectedYear = this.years[0];
  }

  filterNotices(): void {
    this.filteredNotices = this.notices.filter(
      (notice) => new Date(notice.wNotificationSentDate ?? "").getFullYear() === Number(this.selectedYear)
    );
  }

  onRowDoubleClicked(event: any): void {
    const dummyNoticeData = {
        noticeType: "Request For Response",
        noticeName: "UNSC updates to the list of sanctioned individuals and/or entities",
        noticeIssuedBy: "United Nations Security Council",
        noticeIssuedDate: "01/Dec/2020",
        responseDueDate: "03/Dec/2020",
        subject: "Security Council Sanctions Committee Concerning Iraq Removes One Individual and Eleven Entities from Its Sanctions List",
        noticeReferenceNumber: "RFR/UNSC/2020-0057",
        noticeNumber: "SC/14368",
        references: "1518 (2003)",
        linkToNotice: "Link to Notice",
        linkToEmailNotification: "View Email Notification",
        signOffRequirements:
          "A response to this notice should be electronically signed off by any one of the individuals approved by the QFCRA to exercise any of the Senior Executive Function, MLRO Function and granted access to the system for this purpose.",
      questionnaire: [
        {
          question: "Did you screen your customer records against the list of sanctioned individuals or entities/groups provided in this notice?",
          response: "Yes",
          explanation:
            "The list of sanctioned individuals or entities/groups provided in this notice were screened against our customers' database and no match found.",
        },
        {
          question: "Did you find any matches in your customer records when they were screened against the list of sanctioned individuals or entities/groups provided in this notice? If yes, please provide a summary of actions taken thereafter.",
          response: "No",
          explanation:
            "The list of sanctioned individuals or entities/groups provided in this notice were screened against our customers' database and no match found.",
        },
      ],
      note: "The list of sanctioned individuals or entities/groups provided in this notice were screened against our customers' database and no match found.",
      attachments: [
        {
          name: "RFR-UNSC-2020-0057.docx",
          additionalInfo: "Any additional file attachments for this form?",
        },
      ],
      signatureName: "Christina Dietrich",
      signatureDate: "03/Dec/2020 02:27 PM",
    };
    
    const dialogRef = this.dialog.open(ViewNoticeComponent, {
      width: '70%', // Set the desired width
      height: '70%', // Set the desired height
      data: dummyNoticeData,//event.data, // Pass the selected row data to the modal
    });
  
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
    });
  }
}
