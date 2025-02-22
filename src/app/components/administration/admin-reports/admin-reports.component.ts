import { Component, OnInit } from '@angular/core';
import { Report, Firm } from '../../../models/report.model';

@Component({
  selector: 'app-admin-reports',
  templateUrl: './admin-reports.component.html',
  styleUrls: ['./admin-reports.component.scss']
})
export class AdminReportsComponent {
  selectedReportType: string = '';
  isLoading: boolean = false;
  lblErrorMessage: string = '';
    lblReportName: string = '';
  isExportVisible: boolean = false;
  isProcessRequestVisible: boolean = false;
  lblMessage: string = '';
  serviceProcesses: any[] = [];
  isFirmListVisible: boolean = false;
  lblFirmMessage: string = '';
  firmList: Firm[] = [];

  ngOnInit(): void {
    this.mockData();
  }

  mockData(): void {
    this.serviceProcesses = [
      {
        ServiceProcessID: 1,
        ServiceRequestNo: 'SR123',
        ServiceProcessDesc: 'Description 1',
        ServiceProcessUserNote: 'Note 1',
        CreatedByName: 'User 1',
        CreatedDate: '2023-10-01'
      },
      {
        ServiceProcessID: 2,
        ServiceRequestNo: 'SR124',
        ServiceProcessDesc: 'Description 2',
        ServiceProcessUserNote: 'Note 2',
        CreatedByName: 'User 2',
        CreatedDate: '2023-10-02'
      }
    ];

    this.firmList = [
      {
        FirmTypeDesc: 'Type 1',
        FirmName: 'Firm 1',
        LicensedTypeDesc: 'Licensed',
        AuthorisationStatus: 'Authorized',
        isEssActivestr: 'Yes',
        UserName: 'User 1',
        EmailAddress: 'user1@example.com',
        ActiveRoles: 'Role 1',
        ApproveFunctions: 'Function 1',
        IsUserAccessAuthorised: true,
        IsRegistered: true,
        IsActive: true,
        IsLocked: false
      },
      {
        FirmTypeDesc: 'Type 2',
        FirmName: 'Firm 2',
        LicensedTypeDesc: 'Not Licensed',
        AuthorisationStatus: 'Not Authorized',
        isEssActivestr: 'No',
        UserName: 'User 2',
        EmailAddress: 'user2@example.com',
        ActiveRoles: 'Role 2',
        ApproveFunctions: 'Function 2',
        IsUserAccessAuthorised: false,
        IsRegistered: false,
        IsActive: false,
        IsLocked: true
      }
    ];
  }

  generateReport() {
    // Implement report generation logic
  }

  exportToExcel() {
    // Implement export to Excel logic
  }
}