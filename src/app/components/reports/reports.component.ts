import { Component, OnInit } from '@angular/core';
import { AppConstants } from '../../constants/app.constants';
import { ToastrService } from 'ngx-toastr';
import { LoadingService } from '../../services/loader.service';
import { Client ,ReportSchDetailsDtoListBaseResponse,ReportSchDto,ReportSchItem,InsertObjectSOStatusDetailsDto,InsertReportSchDetailsDto,ReportSchDetailsDto,ReportSchDetailsDtoBaseResponse, ObjTasks} from '../../services/api-client';
import { jwtDecode } from "jwt-decode";

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  schedules: any[] = [];
  selectedSchedule: any;
  reportsToBeSubmitted: any[] = [];
  reportsSubmitted: any[] = [];
  qfcNum: string = '00173';
  _SEFUsers: string[] = [];
  _lstObjTasks: ObjTasks[] =  []
  lstXBRLDocTypes: number[] = []
  firmTypeString: string = localStorage.getItem(AppConstants.Session.SESSION_FIRM_TYPE) ?? '';
  qfcNo: string = localStorage.getItem(AppConstants.Session.SESSION_QFC_NO) ?? '';
  firmType = 0;
  constructor(private client: Client,
    private loadingService: LoadingService,
    private toastr: ToastrService,) {}

  ngOnInit(): void {
    this.firmType = this.firmTypeString != "" ? Number(this.firmTypeString) : 0;
    this.loadSchedules();
    this.GetSEFUserDetails();
    this.getXbrlDoctypes();
    this.GetObjectTaskStatus();
  }
 
  GetSEFUserDetails(): void{
    this.client.getSefUsserDetails(this.qfcNo,this.firmType).subscribe({
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

  GetObjectTaskStatus(): void{
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

  /**
   * Fetch report schedules for the dropdown.
   */
  loadSchedules(): void {
    if (!this.qfcNum) {
      console.error('QFC number is missing from the token');
      return;
    }

    // this.Client.getSubmissionDetailsForHomePage(this.qfcNum)
    //   .subscribe(
    //     (response: ReportSchDetailsDtoListBaseResponse) => {
    //       if (response && response.response) {
    //         this.schedules = Array.isArray(response.response) ? response.response : [response.response];
    //         if (this.schedules.length > 0) {
    //           this.selectedSchedule = this.schedules[0];
    //           setTimeout(() => this.onScheduleChange(), 0);
    //         }
    //       }
    //     },
    //     (error) => console.error('Error fetching schedules:', error)
    //   );
  }

  /**
   * Load reports when the schedule selection changes.
   */
  onScheduleChange(): void {
    if (!this.selectedSchedule) return;
  
    // this.Client.getSubmissionDetailsForHomePage(this.qfcNum)
    //   .subscribe(
    //     (response) => {
    //       if (response && response.response) {
    //         const reports = Array.isArray(response.response) ? response.response : [response.response]; 
            
    //         this.reportsToBeSubmitted = reports.filter((report: any) => 
    //           new Date(report.rptPeriodFromDate) >= new Date(this.selectedSchedule.rptSchFinYearFromDate) &&
    //           new Date(report.rptPeriodToDate) <= new Date(this.selectedSchedule.rptSchFinYearToDate)
    //         );
            
    //         this.reportsSubmitted = reports.filter((report: any) => 
    //           new Date(report.rptPeriodFromDate) >= new Date(this.selectedSchedule.rptSchFinYearFromDate) &&
    //           new Date(report.rptPeriodToDate) <= new Date(this.selectedSchedule.rptSchFinYearToDate) &&
    //           !report.isReportDue
    //         );
    //       }
    //     },
    //     (error) => console.error('Error fetching reports:', error)
    //   );
  }
}
