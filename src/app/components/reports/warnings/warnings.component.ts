import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FileDownloadService } from '../../../services/file-download.service';
import { ReportSchDetailsDto } from '../../../services/api-client';

@Component({
  selector: 'app-warnings',
  templateUrl: './warnings.component.html',
  styleUrls: ['./warnings.component.scss']
})
export class WarningsComponent implements OnInit {
  filesHistory: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<WarningsComponent>,
    private fileDownloadService: FileDownloadService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {

  }

  onClose(): void {
    this.dialogRef.close();
  }

  viewInExcel(report: ReportSchDetailsDto): void {
    this.fileDownloadService.downloadExcel(report.rptSchItemAttachmentID?.toString() ?? "", "2", report.fileName ?? "");
  }

  viewWarnings(file: any): void {
    console.log("Warnings for:", file);
  }
}
