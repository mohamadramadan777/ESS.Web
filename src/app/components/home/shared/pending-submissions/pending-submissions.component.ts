import { Component } from '@angular/core';

@Component({
  selector: 'app-pending-submissions',
  templateUrl: './pending-submissions.component.html',
  styleUrls: ['./pending-submissions.component.scss'],
})
export class PendingSubmissionsComponent {
  overdueSubmissions = [
    {
      title: 'February - 2024 Monthly Prudential Returns (Solo)',
      dueDate: '31/Mar/2024',
    },
    {
      title: '2023 Annual Form Q30 - Controllers and Close Links Report',
      dueDate: '31/Mar/2024',
    },
    {
      title: 'February - 2024 Monthly Prudential Returns (Consolidated)',
      dueDate: '31/Mar/2024',
    },
    {
      title: 'February - 2024 - ALCO Report',
      dueDate: '31/Mar/2024',
    },
    {
      title: 'February - 2024 - Liquidity Report',
      dueDate: '31/Mar/2024',
    },

  ];

  submissions = [
    {
      title: '2023 Annual Shariah Supervisory Board Report',
      dueDate: '31/Mar/2024',
    },
  ];
}
