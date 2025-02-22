import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ai-applications',
  templateUrl: './ai-applications.component.html',
  styleUrls: ['./ai-applications.component.scss']
})
export class AiApplicationsComponent implements OnInit {
  isLoading: boolean = false;
  message: string = '';
  searchFlag: number = 0;
  selectedFirm: string = '';
  qfcNumber: string = '';
  selectedFormType: string = '';
  selectedApplicationStatus: string = '';
  applications: any[] = [];
  selectedApplication: any = null;
  firms: { value: string, text: string }[] = [];
  formTypes: { value: string, text: string }[] = [];
  applicationStatuses: { value: string, text: string }[] = [];
  signOffDetails: any[] = [];

  ngOnInit() {
    this.loadMockData();
  }

  loadMockData() {
    this.firms = [
      { value: '1', text: 'Firm A' },
      { value: '2', text: 'Firm B' }
    ];
    this.formTypes = [
      { value: '1', text: 'Form Type 1' },
      { value: '2', text: 'Form Type 2' }
    ];
    this.applicationStatuses = [
      { value: '1', text: 'Status 1' },
      { value: '2', text: 'Status 2' }
    ];
    this.applications = [
      {
        firmName: 'Firm A',
        applicantName: 'John Doe',
        formTypeDesc: 'Form Type 1',
        functions: 'Function 1',
        applicationStatus: 'Status 1',
        createdDate: '2023-01-01'
      },
      {
        firmName: 'Firm B',
        applicantName: 'Jane Smith',
        formTypeDesc: 'Form Type 2',
        functions: 'Function 2',
        applicationStatus: 'Status 2',
        createdDate: '2023-02-01'
      }
    ];
    this.signOffDetails = [
      {
        taskSeq: 1,
        signatoryName: 'Signatory 1',
        signatoryRole: 'Role 1',
        signatoryEmailAddress: 'signatory1@example.com',
        wObjectSoTaskStatusDesc: 'Completed',
        soStatusAssignedDate: '2023-01-01',
        soStatusCompletedDate: '2023-01-02'
      }
    ];
  }

  onFirmChange() {
    // Handle firm change
  }

  onSearch() {
    // Handle search
  }

  onReset() {
    this.selectedFirm = '';
    this.qfcNumber = '';
    this.selectedFormType = '';
    this.selectedApplicationStatus = '';
    this.searchFlag = 0;
    this.selectedApplication = null;
  }

  onSelect(application: any) {
    this.selectedApplication = application;
  }
}
