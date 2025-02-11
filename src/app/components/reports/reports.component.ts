import { Component, OnInit } from '@angular/core';
import { Client ,ReportSchDetailsDtoListBaseResponse,ObjTasks, ReportSchDto,ReportSchItem,InsertObjectSOStatusDetailsDto,InsertReportSchDetailsDto,ReportSchDetailsDto,ReportSchDetailsDtoBaseResponse} from '../../services/api-client';
import { AppConstants } from '../../constants/app.constants';
import { ToastrService } from 'ngx-toastr';
import { LoadingService } from '../../services/loader.service';
import { jwtDecode } from "jwt-decode";

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent implements OnInit {
  schedules: any[] = [];
  selectedSchedule: any;
  reports: any[] = [];
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
    this.loadReports();
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
   * Fetch all reports using QFC number.
   */
  loadReports(): void {
    this.client.getSubmissionDetailsForHomePage().subscribe(
      (response: ReportSchDetailsDtoListBaseResponse) => {
        if (response && response.response) {
          this.reports = Array.isArray(response.response)
            ? response.response
            : [response.response];
          this.extractFinancialYears();
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
    this.reports.forEach((report) => {
      if (report.rptSchFinYearFromDate && report.rptSchFinYearToDate) {
        const yearRange = `${report.rptSchFinYearFromDate} to ${report.rptSchFinYearFromDate}`;
        uniqueYears.add(yearRange);
      }
    });

    this.schedules = Array.from(uniqueYears).map((year) => ({
      text: year,
      value: year,
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
   * Filter reports based on the selected financial year and submission status.
   */
  filterReportsByYear(fromDate: string, toDate: string): void {
    const from = new Date(fromDate);
    const to = new Date(toDate);

    this.reportsToBeSubmitted = this.reports.filter((report) => {
      const manuallyReceived = report.manuallyReceived === true;
      const allowResubmit = report.allowReSubmit === false;
      const isSubmitted = report.soStatusTypeID; // Adjust based on actual pending ID

      return (
        new Date(report.rptSchFinYearFromDate) <= to &&
        new Date(report.rptSchFinYearToDate) >= from &&
        !(manuallyReceived && allowResubmit) && // Equivalent of ASP.NET logic
        !isSubmitted // Not submitted
      );
    });

    this.reportsSubmitted = this.reports
      .filter((report) => {
        const isSubmitted = report.soStatusTypeID === 2; // Adjust based on actual submitted ID
        return (
          new Date(report.rptSchFinYearFromDate) <= to &&
          new Date(report.rptSchFinYearToDate) >= from &&
          isSubmitted // Matches submission logic
        );
      })
      .map((report) => {
        //  Add signedByMessage dynamically
        const signedByMessage =
          report.fileUploadedByName && report.rptAttachmentStatusDate
            ? `Report signed by ${report.fileUploadedByName} on ${report.rptAttachmentStatusDate}`
            : '';

        return {
          ...report,
          signedByMessage,
          showHistory: !!report.fileName, // Show history if a file is attached
          showExcel:
            report.attachmentStatusTypeID === 1 ||
            report.attachmentStatusTypeID === 2,
          showWarnings: report.attachmentStatusTypeID === 3,
          showErrors: report.attachmentStatusTypeID === 4,
          historyLink: report.fileName
            ? `https://history.example.com/${report.rptSchItemID}`
            : '',
          excelLink:
            report.attachmentStatusTypeID === 1 ||
            report.attachmentStatusTypeID === 2
              ? `https://excel.example.com/${report.rptSchItemID}`
              : '',
          warningsLink:
            report.attachmentStatusTypeID === 3
              ? `https://warnings.example.com/${report.rptSchItemID}`
              : '',
          errorsLink:
            report.attachmentStatusTypeID === 4
              ? `https://errors.example.com/${report.rptSchItemID}`
              : '',
        }; 
      });
  }
  attachFile() {}
  submitReport() {}
  signOff() {}
}
