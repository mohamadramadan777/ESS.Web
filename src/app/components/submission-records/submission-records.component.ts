import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {
  ISubmissionRecord,
  SUBMISSION_RECORDS_CONFIG_COLUMNS,
} from './submission-record-config';
import { SubmissionRecordsService } from '../../services/submission-records.service';

@Component({
  selector: 'app-submission-records',
  templateUrl: './submission-records.component.html',
  styleUrls: ['./submission-records.component.scss'],
})
export class SubmissionRecordsComponent implements OnInit {
  displayedColumns: string[] =
    SUBMISSION_RECORDS_CONFIG_COLUMNS.displayedColumns;
  dataSource: MatTableDataSource<ISubmissionRecord> =
    new MatTableDataSource<ISubmissionRecord>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private submissionRecordsService: SubmissionRecordsService) {}

  ngOnInit() {
    this.fetchData();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  fetchData(): void {
    this.submissionRecordsService.getSubmissionRecords().subscribe({
      next: (data) => {
        this.dataSource.data = data; // Assign API response to the table's data source
      },
      error: (err) => {
        console.error('Error fetching submitted applications', err);
      },
    });
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
