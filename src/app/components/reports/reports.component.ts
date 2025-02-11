import { Component, OnInit } from '@angular/core';
import { Client ,ReportSchDetailsDtoListBaseResponse,ReportSchDto,ReportSchItem,InsertObjectSOStatusDetailsDto,InsertReportSchDetailsDto,ReportSchDetailsDto,ReportSchDetailsDtoBaseResponse} from '../../services/api-client';
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
  constructor(private Client: Client) {}

  ngOnInit(): void {
    this.loadSchedules();
  
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
