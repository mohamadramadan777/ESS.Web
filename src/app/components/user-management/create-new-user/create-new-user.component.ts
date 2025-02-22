import { Component } from '@angular/core';

@Component({
  selector: 'app-create-new-user',
  templateUrl: './create-new-user.component.html',
  styleUrls: ['./create-new-user.component.scss']
})
export class CreateNewUserComponent {
  selectedFirm: string = '';
  qfcNumber: string = '';
  selectedFormType: string = '';
  selectedApplicationStatus: string = '';
  searchFlag: string = '0'; // Add this property
  firms = [
    { value: 'firm1', text: 'Firm 1' },
    { value: 'firm2', text: 'Firm 2' }
  ];
  formTypes = [
    { value: 'type1', text: 'Type 1' },
    { value: 'type2', text: 'Type 2' }
  ];
  applicationStatuses = [
    { value: 'status1', text: 'Status 1' },
    { value: 'status2', text: 'Status 2' }
  ];
  applications = [
    // Your application data here
  ];
  selectedApplication: any;
  signOffDetails = [
    // Your sign-off details here
  ];
  isLoading: boolean = false;
  message: string = '';
  lblErrorMessage: string = '';
  lblReportName: string = '';
  isExportVisible: boolean = false;
  isProcessRequestVisible: boolean = false;
  isFirmListVisible: boolean = false;
  lblFirmMessage: string = '';

  onFirmChange() {
    // Handle firm change
  }

  onSearch() {
    // Handle search
  }

  onReset() {
    // Handle reset
  }

  onSelect(application: any) {
    this.selectedApplication = application;
  }

  exportToExcel() {
    // Handle export to Excel
  }
}