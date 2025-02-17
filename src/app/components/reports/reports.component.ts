import { Component, OnInit } from '@angular/core';
import { Client, ObjectSOTaskStatus, ObjTasks, ReportSchDto, HistoryDetailsDto, InsertObjectSOStatusDetailsDto, InsertReportSchDetailsDto, ReportSchDetailsDto, ReportSchDetailsDtoBaseResponse } from '../../services/api-client';
import { AppConstants } from '../../constants/app.constants';
import { ToastrService } from 'ngx-toastr';
import { LoadingService } from '../../services/loader.service';
import { MatDialog } from '@angular/material/dialog';
import { HistoryComponent } from './history/history.component';
import { WObjects } from '../../enums/app.enums';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent implements OnInit {
  schedules: ReportSchDto[] = [];
  selectedSchedule: ReportSchDto | null = null;
  reports: ReportSchDetailsDto[] | undefined = [];
  reportsToBeSubmitted: ReportSchDetailsDto[] | undefined = [];
  reportsSubmitted: ReportSchDetailsDto[] | undefined = [];
  submittedLstObjectSOTaskStatus: {
    [key: string]: ObjectSOTaskStatus[];
  } | undefined = undefined;
  _SEFUsers: string[] = [];
  _lstObjTasks: ObjTasks[] = []
  lstXBRLDocTypes: number[] = []
  firmTypeString: string = localStorage.getItem(AppConstants.Session.SESSION_FIRM_TYPE) ?? '';
  qfcNo: string = localStorage.getItem(AppConstants.Session.SESSION_QFC_NO) ?? '';
  firmType = 0;
  constructor(private client: Client,
    private loadingService: LoadingService,
    private toastr: ToastrService,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.firmType = this.firmTypeString != "" ? Number(this.firmTypeString) : 0;
    this.FillDropdown();
    // this.GetSEFUserDetails();
    // this.getXbrlDoctypes();
    // this.GetObjectTaskStatus();
  }

  FillDropdown(): void {
    this.loadingService.show();
    this.client.getReportSch().subscribe({
      next: (response) => {
        if (response && response.isSuccess && response.response) {
          if (response.response != undefined) {
            this.schedules = response.response;
            this.selectedSchedule = this.schedules[0];
            this.onScheduleChange();
          }
        } else {
          this.loadingService.hide();
          console.error('Failed to load dropdown list:', response?.errorMessage);
        }
      },
      error: (error) => {
        this.loadingService.hide();
        this.toastr.error('Error occurred while fetching dropdown list.', 'Error');
        console.error('Error occurred while fetching dropdown list:', error);
      },
    });
  }

  GetSEFUserDetails(): void {
    this.client.getSefUsserDetails(this.qfcNo, this.firmType).subscribe({
      next: (response) => {
        if (response && response.isSuccess && response.response) {
          if (response.response != undefined) {
            this._SEFUsers = response.response?.split(',');
          }
        } else {
          console.error('Failed to load SEFUserDetails:', response?.errorMessage);
        }
      },
      error: (error) => {
        console.error('Error occurred while fetching SEFUserDetails:', error);
      },
    });
  }

  GetObjectTaskStatus(): void {
    this.client.getObjectTaskStatus().subscribe({
      next: (response) => {
        if (response && response.isSuccess && response.response) {
          if (response.response != undefined) {
            this._lstObjTasks = response.response;
          }
        } else {
          console.error('Failed to load GetObjectTaskStatus:', response?.errorMessage);
        }
      },
      error: (error) => {
        console.error('Error occurred while fetching GetObjectTaskStatus:', error);
      },
    });
  }

  getXbrlDoctypes(): void {
    // TODO: Replace with API call to fetch applicants
    this.client.getXbrlDocTypes(0).subscribe({
      next: (response) => {
        if (response && response.isSuccess && response.response) {
          if (response.response != undefined) {
            this.lstXBRLDocTypes = response.response;
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
      },
    });
  }

  onScheduleChange(): void {
    this.loadingService.show();
    this.client.loadReportSchDetails(this.selectedSchedule?.rptSchFinYearFromDate, this.selectedSchedule?.rptSchFinYearToDate).subscribe({
      next: (response) => {
        this.loadingService.hide();
        if (response && response.isSuccess && response.response) {
          if (response.response != undefined) {
            this.reports = response.response?.allReports;
            this.reportsSubmitted = response.response?.submittedReports;
            this.reportsToBeSubmitted = response.response?.dueReports;
            this.submittedLstObjectSOTaskStatus = response.response?.submittedLstObjectSOTaskStatus;
          }
        } else {
          console.error('Failed to load reports list:', response?.errorMessage);
        }
      },
      error: (error) => {
        this.loadingService.hide();
        this.toastr.error('Error occurred while fetching reports list.', 'Error');
        console.error('Error occurred while fetching reports list:', error);
      },
    });
  }

  openHistory(id: number): void {
    this.loadingService.show();
    var obj = new HistoryDetailsDto();
    obj.objectID = WObjects.ReportSchedule;
    obj.rptSchItemID = id;
    obj.docTypeID = 0;
    this.client.getHistoryDetailsWithAttachments(obj).subscribe({
      next: (response) => {
        this.loadingService.hide();
        if (response && response.isSuccess && response.response) {
          if (response.response != undefined) {
            const dialogRef = this.dialog.open(HistoryComponent, {
              width: '80%',
              height: '85%',
              data: response.response
            });
          }
        } else {
          this.toastr.error('Failed to load History.', 'Error');
          console.error('Failed to load History:', response?.errorMessage);
        }
      },
      error: (error) => {
        this.loadingService.hide();
        this.toastr.error('Error occurred while fetching History.', 'Error');
        console.error('Error occurred while fetching History:', error);
      },
    });
  }
  attachFile() { }
  submitReport() { }
  signOff() { }
}
