import { Component } from '@angular/core';

@Component({
  selector: 'app-general-communications',
  templateUrl: './general-communications.component.html',
  styleUrls: ['./general-communications.component.scss'],
})
export class GeneralCommunicationsComponent {
  items = [
    {
      title:
        'Operational risk and resilience rules and miscellaneous amendments email alert',
      dueDate: '05/Mar/2024',
    },
    {
      title: 'FATF Public Statements',
      dueDate: '25/Feb/2024',
    },
    {
      title: 'Webinar - ISSB standards and ESG reporting',
      dueDate: '25/Feb/2024',
    },
  ];
}
