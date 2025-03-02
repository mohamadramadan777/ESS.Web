import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ReportSchDetailsDto, Client } from '../../../services/api-client';
import { LoadingService } from '../../../services/loader.service';
import { WarningsComponent } from '../warnings/warnings.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
  filesHistory: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<HistoryComponent>,private client: Client,
      private loadingService: LoadingService,
    @Inject(MAT_DIALOG_DATA) public data: any,
        private dialog: MatDialog,
        private toastr: ToastrService
  ) {}

  ngOnInit(): void {

  }

  onClose(): void {
    this.dialogRef.close();
  }

  viewInExcel(file: any): void {
    console.log("View in Excel:", file);
  }

  viewWarnings(id: number, report: ReportSchDetailsDto): void {
      this.loadingService.show();
      this.client.getWarningsOrErrorsInFormat(id.toString(), 2).subscribe({
        next: (response) => {
          this.loadingService.hide();
          if (response && response.isSuccess && response.response) {
            if (response.response != undefined) {
              const dialogRef = this.dialog.open(WarningsComponent, {
                width: '70%',
                height: '75%',
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
}
