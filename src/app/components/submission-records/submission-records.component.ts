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
interface SubmissionRecord {
  description: string;
  attachments: { name: string; url: string }[];
}

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
  // public SubmittedColDef: ColDef[] = config.TableColDef;
  // public PendingColDef: ColDef[] = config.TableColDef;
  // public Pending: any[] = [];
  // public Submitted: any[] = [];
  public defaultColDef = config.defaultColDef;
  private ICurrentUser: ICurrentUser | null = null;
  public theme = config.theme;

  Submitted = [
    {
      description: 'Controlled function application for Alice Kemmer',
      attachments: [
        { name: 'Application Form', url: 'https://example.com/form.pdf' },
        {
          name: 'Compliance Document',
          url: 'https://example.com/compliance.pdf',
        },
      ],
    },
    {
      description: 'Controlled function withdrawal for Sharon Thiel',
      attachments: [],
    },
    {
      description: 'Notification submission',
      attachments: [
        {
          name: 'Notification.pdf',
          url: 'https://example.com/notification.pdf',
        },
      ],
    },
  ];

  // Hardcoded Pending Data
  Pending = [
    {
      description: 'Pending review for Marshall Blanc',
      attachments: [
        { name: 'Review Document', url: 'https://example.com/review.pdf' },
      ],
    },
    {
      description: 'Awaiting applicant sign-off',
      attachments: [],
    },
  ];

  // Define columns
  SubmittedColDef: ColDef<SubmissionRecord>[] = [
    {
      headerName: 'Description',
      field: 'description',
      sortable: true,
      filter: true,
    },
    {
      headerName: 'Attachments',
      field: 'attachments',
      autoHeight: true, // This allows rows to expand based on content
      wrapText: true,
      cellRenderer: (params: { value: { name: string; url: string }[] }) => {
        if (params.value && params.value.length > 0) {
          return params.value
            .map(
              (file: { name: string; url: string }) =>
                `<a href="${file.url}" target="_blank">${file.name}</a>`
            )
            .join('<br>');
        }
        return 'No Attachments';
      },
      sortable: false,
      filter: false,
      maxWidth: 400,
    },
  ];

  PendingColDef: ColDef<SubmissionRecord>[] = [...this.SubmittedColDef];

  constructor(
    private client: Client,
    private loadingService: LoadingService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    //  this.fetchSubmittedApplications();
    //  this.fetchPendingApplications();
  }

  // fetchSubmittedApplications(){
  //   this.client.getCompletedApplications().subscribe(response => {
  //     if (response && response.response) {
  //       this.Submitted = response.response.map(app => ({
  //         description: app.description,
  //         // attachments: this.getAttachments()
  //       }));
  //     }
  //   });
  // }

  // fetchPendingApplications(){
  //   this.client.getPendingItems().subscribe(response => {
  //     if (response && response.response) {
  //       this.Submitted = response.response.map(app => ({
  //         description: app.description,
  //         // attachments: this.getAttachments()
  //       }));
  //     }
  //   });
  // }

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
