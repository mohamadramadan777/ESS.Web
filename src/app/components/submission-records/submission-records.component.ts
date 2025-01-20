import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ISubmissionRecord } from './submission-record.model';



@Component({
  selector: 'app-submission-records',
  templateUrl: './submission-records.component.html',
  styleUrls: ['./submission-records.component.scss'],
})
export class SubmissionRecordsComponent implements OnInit {
  displayedColumns: string[] = ['application', 'date', 'view'];
  dataSource: MatTableDataSource<ISubmissionRecord> = new MatTableDataSource<ISubmissionRecord>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  records: ISubmissionRecord[] = [
    { application: 'Form G03', date: new Date('2024-02-07') },
    { application: 'Form C12', date: new Date('2023-11-30') },
    { application: 'Form G07', date: new Date('2023-04-13') },
    // Add more records here...
  ];

  ngOnInit() {
    this.dataSource = new MatTableDataSource(this.records);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
