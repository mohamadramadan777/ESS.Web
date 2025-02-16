import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
  filesHistory: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<HistoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {

  }

  onClose(): void {
    this.dialogRef.close();
  }

  viewInExcel(file: any): void {
    console.log("View in Excel:", file);
  }

  viewWarnings(file: any): void {
    console.log("Warnings for:", file);
  }
}
