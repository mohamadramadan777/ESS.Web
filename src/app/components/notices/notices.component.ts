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
  years: (number | 'All')[] = [];
  selectedYear!: number | 'All';
  paginationPageSize = config.paginationPageSize;
  paginationPageSizeSelector = config.paginationPageSizeSelector;
  theme = config.theme;
  defaultColDef: ColDef = {
    resizable: true,
    sortable: true,
    filter: true,
    tooltipField: '', // Add tooltips for cell content
  };

  columnDefs = config.colDef;
  rowClassRules = config.rowClassRules;
  constructor(
    private client: Client,
    private loadingService: LoadingService,
    private toastr: ToastrService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.populateYears();
    this.loadNotices(Number(this.selectedYear));
  }

  populateYears(): void {
    const currentYear = new Date().getFullYear();// TODO: BALMessageSettings.GetMessageProperty(853)
    this.years = ['All', ...Array.from({ length: currentYear - 2019 + 1 }, (_, i) => 2019 + i)];
    this.selectedYear = currentYear; // Default to current year
  }

  loadNotices(year: number): void {
    this.loadingService.show();
    this.client.getWnoticeList(year).subscribe({
      next: (response) => {
        this.loadingService.hide();
        if (response && response.isSuccess && response.response) {
          this.notices = response.response;
          this.filteredNotices = [...this.notices];
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

  filterNotices(): void {
    const year = this.selectedYear === 'All' ? 0 : Number(this.selectedYear);
    this.loadNotices(year);
  }

  onRowDoubleClicked(event: any): void {
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

          dialogRef.afterClosed().subscribe((shouldRefresh: boolean) => {
            if (shouldRefresh) {
              this.loadNotices(Number(this.selectedYear));
            }
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
