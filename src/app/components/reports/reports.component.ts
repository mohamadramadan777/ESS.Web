import { Component, OnInit } from '@angular/core';
import { Client, ObjectSOTaskStatus, ObjTasksDto, ReportSchDto, HistoryDetailsDto, InsertReportSchDetailsDto, ReportSchDetailsDto, ReportSchDetailsDtoBaseResponse } from '../../services/api-client';
import { AppConstants } from '../../constants/app.constants';
import { ToastrService } from 'ngx-toastr';
import { LoadingService } from '../../services/loader.service';
import { MatDialog } from '@angular/material/dialog';
import { HistoryComponent } from './history/history.component';
import { TermSubject, WObjects } from '../../enums/app.enums';
import { WarningsComponent } from './warnings/warnings.component';
import { ReportUploadComponent } from './report-upload/report-upload.component';
import { SignOffComponent } from '../sign-off/sign-off.component';
import { SignOffGenericComponent } from '../sign-off-generic/sign-off-generic.component';
import Swal, { SweetAlertIcon } from 'sweetalert2';

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
  _lstObjTasks: ObjTasksDto[] = []
  lstXBRLDocTypes: number[] = []
  firmTypeString: string = localStorage.getItem(AppConstants.Session.SESSION_FIRM_TYPE) ?? '';
  qfcNo: string = localStorage.getItem(AppConstants.Session.SESSION_QFC_NO) ?? '';
  firmType = 0;
  selectedReport: ReportSchDetailsDto | null = null; // Store the selected report
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

  public onScheduleChange(): void {
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

  openHistory(id: number, report: ReportSchDetailsDto): void {
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
              data: {
                history: response.response,
                report: report,
              },
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

  openWarnings(id: number, report: ReportSchDetailsDto): void {
    this.loadingService.show();
    this.client.getWarningsOrErrorsInFormat(id.toString(), 2).subscribe({
      next: (response) => {
        this.loadingService.hide();
        if (response && response.isSuccess && response.response) {
          if (response.response != undefined) {
            const dialogRef = this.dialog.open(WarningsComponent, {
              width: '80%',
              height: '85%',
              data: {
                warnings: response.response,
                report: report,
              },
            });
          }
        } else {
          this.toastr.error('Failed to load Warnings.', 'Error');
          console.error('Failed to load Warnings:', response?.errorMessage);
        }
      },
      error: (error) => {
        this.loadingService.hide();
        this.toastr.error('Error occurred while fetching Warnings.', 'Error');
        console.error('Error occurred while fetching Warnings:', error);
      },
    });
  }

  attachFile(id: number, report: ReportSchDetailsDto): void {
    const docTypesToValidate = '80';//BALMessageSettings.GetMessageProperty((int)ReportSchedule.DocTypes_To_Validate);

    if (docTypesToValidate.indexOf((report.docTypeID ?? 'nothing').toString()) > -1) {
      // redirect to ReportValidation.aspx
    }
    else {
      const dialogRef = this.dialog.open(ReportUploadComponent, {
        data: { report: report, parent: this }
      });
    }
  }
  submitReport(report: ReportSchDetailsDto) {
    if (report.fileName?.length ?? 0 > 0) {
      this.loadingService.show();
      this.client.submitReport(report.fileName, report.rptName, report.rptDueDate, report.rptSchItemAttachmentID, report.rptSchItemID, report.docTypeID, report.rptPeriodTypeDesc, report.allowReSubmit).subscribe({
        next: (response) => {
          this.loadingService.hide();
          if (response && response.isSuccess && response.response != "") {
            if (response.response == "signoff") {
              this.onScheduleChange();
              this.openSignOffDialog(report);
            }
            else if (response.response != undefined) {
              this.onScheduleChange();
              this.toastr.success(response.response, 'Success');
            }
          } else {
            this.toastr.error('Failed to submit Report.', 'Error');
            console.error('Failed to submit Report:', response?.errorMessage);
          }
        },
        error: (error) => {
          this.loadingService.hide();
          this.toastr.error('Error occurred while submitting Report.', 'Error');
          console.error('Error occurred while submitting Report:', error);
        },
      });
    }
    else {
      this.toastr.warning('Please attach a file before submit.', 'Wanring');
    }
  }

  openSignOffDialog(report: ReportSchDetailsDto): void {
    this.selectedReport = report;
    const dialogRef = this.dialog.open(SignOffGenericComponent, {
      width: 'auto',
      height: 'auto',
      data: {
        TermID: TermSubject.UserSignOffSubject, // Pass the TermID dynamically
        ShowAcceptTermsCheckBox: false, // Pass the ShowAcceptTermsCheckBox dynamically
        signOffMethod: () => this.signOff(),
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('Dialog closed with result:', result);
      // Handle any logic after dialog closes
    });
  }

  signOff() {
    this.loadingService.show();
    this.client.signOffReport(this.selectedReport?.rptSchItemID, this.selectedReport?.docTypeID, this.selectedReport?.rptPeriodToDate, this.selectedReport?.fileAttachedUserEmail, this.selectedReport?.rptSchItemAttachmentID,
      this.selectedReport?.attachmentStatusTypeID, this.selectedReport?.rptFreqTypeDesc, this.selectedReport?.soseqno, this.selectedReport?.objectSOStatusID, this.selectedReport?.fileName, this.selectedReport?.rptName,
      this.selectedReport?.rptDueDate, this.selectedReport?.lateFeeFlag ?? false).subscribe({
        next: (response) => {
          this.loadingService.hide();
          if (response && response.isSuccess) {
            Swal.fire(
              'Sign Off',
              response.response?.message,
              response.response?.type as SweetAlertIcon ?? "warning"
            );
            this.onScheduleChange();
          } else {
            this.toastr.error('Failed to sign off Report.', 'Error');
            console.error('Failed to sign off Report:', response?.errorMessage);
          }
        },
        error: (error) => {
          this.loadingService.hide();
          this.toastr.error('Error occurred while signing Report.', 'Error');
          console.error('Error occurred while signing Report:', error);
        },
      });
  }

  deleteAttachment(id: number | undefined, fileName: string, filePath: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to remove the file "${fileName}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, remove it!',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#a51e36',
      cancelButtonColor: '#555555',
    }).then((result) => {
      if (result.isConfirmed) {
        this.client.deleteAttachment(id, fileName, filePath, true).subscribe({
          next: (response) => {
            if (response && response.isSuccess && response.response) {
              this.toastr.success('The file has been removed.', 'Removed!');
              this.onScheduleChange();
            } else {
              this.toastr.error('Failed to remove file.', 'Error');
              console.error('Failed to remove file:', response?.errorMessage);
            }
          },
          error: (error) => {
            this.toastr.error('Error occurred while removing file.', 'Error');
            console.error('Error occurred while removing file:', error);
          },
        });
      }
    });
  }
}
