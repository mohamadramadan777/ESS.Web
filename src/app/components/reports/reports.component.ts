import { Component, OnInit } from '@angular/core';
import { Client, ReportSchDetailsDtoListBaseResponse } from '../../services/api-client';


@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  schedules: any[] = [];
  selectedSchedule: any;
  reports: any[] = [];
  reportsToBeSubmitted: any[] = [];
  reportsSubmitted: any[] = [];
  qfcNum: string = '00173';

  constructor(private Client: Client) {}

  ngOnInit(): void {
    // this.extractQfcNumFromToken();
    this.loadReports();
  }

  /**
   * Extracts the QFC number from the JWT token.
   */
  // extractQfcNumFromToken(): void {
  //   const token = localStorage.getItem('token'); // Adjust based on where the token is stored
  //   if (token) {
  //     const decodedToken = this.jwtHelper.decodeToken(token);
  //     this.qfcNum = decodedToken?.['qfcNum'] || ''; // Ensure correct property name
  //   }
  // }

  /**
   * Fetch all reports using QFC number.
   */
  loadReports(): void {
    if (!this.qfcNum) {
      console.error('QFC number is missing from the token');
      return;
    }

    this.Client.getSubmissionDetailsForHomePage(this.qfcNum)
      .subscribe(
        (response: ReportSchDetailsDtoListBaseResponse) => {
          if (response && response.response) {
            this.reports = Array.isArray(response.response) ? response.response : [response.response];
            this.extractFinancialYears(); // Populate dropdown after extracting years
          }
        },
        (error) => console.error('Error fetching reports:', error)
      );
  }

  /**
   * Extract unique financial years from reports and populate dropdown.
   */
  extractFinancialYears(): void {
    const uniqueYears = new Set();
    this.reports.forEach(report => {
      if (report.rptSchFinYearFromDate && report.rptSchFinYearToDate) {
        const yearRange = `${report.rptSchFinYearFromDate} to ${report.rptSchFinYearToDate}`;
        uniqueYears.add(yearRange);
      }
    });
    
    this.schedules = Array.from(uniqueYears).map(year => ({
      text: year,
      value: year
    }));
    
    if (this.schedules.length > 0) {
      this.selectedSchedule = this.schedules[0];
      this.onScheduleChange();
    }
  }

  /**
   * Load reports when the schedule selection changes.
   */
  onScheduleChange(): void {
    if (!this.selectedSchedule) return;
    
    const [fromDate, toDate] = this.selectedSchedule.value.split(' to ');
    this.filterReportsByYear(fromDate, toDate);
  }

  /**
   * Filter reports based on the selected financial year.
   */
  filterReportsByYear(fromDate: string, toDate: string): void {
    const from = new Date(fromDate);
    const to = new Date(toDate);
  
    this.reportsToBeSubmitted = this.reports.filter(report => {
      const periodFrom = new Date(report.rptPeriodFromDate);
      const periodTo = new Date(report.rptPeriodToDate);
      const submissionDate = new Date(report.submittedOn); // Ensure filtering includes submission date
  
      return (
        periodFrom >= from &&
        periodTo <= to &&
        submissionDate <= to && // Ensure submission date is within the financial year
        report.isReportDue
      );
    });
  
    this.reportsSubmitted = this.reports.filter(report => {
      const periodFrom = new Date(report.rptPeriodFromDate);
      const periodTo = new Date(report.rptPeriodToDate);
      const submissionDate = new Date(report.submittedOn);
  
      return (
        periodFrom >= from &&
        periodTo <= to &&
        submissionDate <= to && // Ensure submission date is within the selected financial year
        !report.isReportDue
      );
    });
  }
  
}
