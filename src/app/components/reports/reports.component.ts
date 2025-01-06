import { Component, OnInit,ViewEncapsulation  } from '@angular/core';

interface Report {
  reportName: string;
  submissionType?: string;
  attachedFile?: string;
  dueDate?: string;
  signedBy?: string;
  submissionDate?: string;
}

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
  encapsulation: ViewEncapsulation.Emulated, // Default
})
export class ReportsComponent implements OnInit {
  schedules = [
    { startDate: '01/Jan/2024', endDate: '31/Dec/2024' },
    { startDate: '01/Jan/2023', endDate: '31/Dec/2023' },
  ];
  selectedSchedule = this.schedules[0];

  selectedTabIndex = 0;

  reportsToBeSubmitted: Report[] = [];
  reportsSubmitted: Report[] = [];

  ngOnInit(): void {
    this.loadReports();
  }

  loadReports(): void {
    this.reportsToBeSubmitted = [
      {
        reportName: '2023 Annual MLRO Report',
        submissionType: 'Regular',
        attachedFile: undefined,
        dueDate: '31/May/2024',
        signedBy:
          'This report requires one electronic signature from an individual approved to exercise the MLRO Function.',
      },
      {
        reportName: 'March - 2024 Quarterly Lead Regulator Capital Resources Report',
        submissionType: 'Regular',
        dueDate: '31/May/2024',
        signedBy:
          'This report requires one electronic signature from the Senior Executive Function.',
      },
    ];

    this.reportsSubmitted = [
      {
        reportName: '2023 Annual Form Q27 AML/CFT Return',
        attachedFile: 'Addleshaw Goddard (GCC) LLP 2023 Q27 Return.pdf',
        signedBy: 'Trace Quigley',
        submissionDate: '31/Jan/2024 03:04 PM',
      },
    ];
  }

  onScheduleChange(): void {
    console.log('Selected schedule:', this.selectedSchedule);
    // Logic to fetch reports based on the selected schedule
  }
}
