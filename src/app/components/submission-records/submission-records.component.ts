import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SubmissionRecordsService } from '../../services/submission-records.service';

@Component({
  selector: 'app-submission-records',
  templateUrl: './submission-records.component.html',
  styleUrls: ['./submission-records.component.scss'],
})
export class SubmissionRecordsComponent implements OnInit {
  displayedColumns: string[] = [
    'application',
    'submittedDate',
    'status',
    'actions',
  ];
  dataSource = new MatTableDataSource<any>([]);
  currentUser: any;

  constructor(private submissionService: SubmissionRecordsService) {}

  ngOnInit(): void {
    this.decodeUserInfo();
    this.fetchCompletedApplications();
  }

  // Decode user info from JWT token
  decodeUserInfo(): void {
    this.currentUser = this.submissionService.decodeToken();
    console.log('Current User:', this.currentUser);
  }

  // Fetch and process completed applications
  fetchCompletedApplications(): void {
    this.submissionService.getSubmittedApplications().subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this.dataSource.data = response.response; // Assign data to the Material table
        } else {
          console.error('Error fetching applications:', response.errorMessage);
        }
      },
      error: (err) => {
        console.error('Error fetching applications:', err);
      },
    });
  }

  viewApplication(application: any): void {
    // You can log the application or perform navigation logic here
    console.log('Viewing application:', application);

    // Example: Navigate to a detailed view page (if implemented)
    // this.router.navigate(['/application-details', application.applicationID]);
  }
  // Process applications logic
  private processApplications(applications: any[]): any[] {
    const lstOldApplications = [];
    const lstDelete = [];
    const SEFCOFound = false;

    // Process each application
    const filteredApplications = applications.filter((item) => {
      let bCanView = false;

      // Individual Applications
      if (item.objectID === 15) {
        // Assuming 15 represents Individual Applications
        if (item.userCreated === this.currentUser.WUserID) {
          bCanView = true;
          if (
            new Date(item.submittedDate) <
            new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          ) {
            lstOldApplications.push(item);
          }
        }
      }

      // Notification of Competency
      if (item.objectID === 16) {
        // Assuming 16 represents Notification of Competency
        bCanView = this.currentUser.role.includes('19'); // Example role check
      }

      // General Submission
      if (item.objectID === 17) {
        // Assuming 17 represents General Submission
        if (
          item.userCreated === this.currentUser.WUserID ||
          this.currentUser.role.includes('19')
        ) {
          bCanView = true;
        }
      }

      // Filter logic for firm type
      if (this.currentUser.FirmQFCNo === '00173' && bCanView) {
        return true;
      } else {
        lstDelete.push(item);
        return false;
      }
    });

    return filteredApplications;
  }
}
