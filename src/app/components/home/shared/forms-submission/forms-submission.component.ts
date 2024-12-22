import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-forms-submission',
  templateUrl: './forms-submission.component.html',
  styleUrls: ['./forms-submission.component.scss'],
})
export class FormsSubmissionComponent implements OnInit {
  displayedColumns: string[] = ['name', 'download', 'submit'];

  forms = [
    {
      id: 1,
      name: 'Form 012 - Controlled function withdrawal',
      downloadLink: 'https://example.com/form012',
    },
    {
      id: 2,
      name: 'Form 013 - Application by an Authorized Firm to Vary the Scope or Withdraw its Authorization',
      downloadLink: 'https://example.com/form013',
    },
    {
      id: 3,
      name: 'Form 017 - Notifications',
      downloadLink: 'https://example.com/form017',
    },
    {
      id: 4,
      name: 'XBRL Product Returns',
      downloadLink: 'https://example.com/xbrl-product-returns',
    },
  ];

  constructor() {}

  ngOnInit(): void {}

  downloadForm(formId: number): void {
    const form = this.forms.find((f) => f.id === formId);
    if (form) {
      console.log(`Downloading form with ID: ${formId}`);
      window.open(form.downloadLink, '_blank');
    } else {
      console.error(`Form with ID ${formId} not found`);
    }
  }

  submitForm(formId: number): void {
    console.log(`Submitting form with ID: ${formId}`);
    alert(`Form with ID ${formId} submitted successfully!`);
  }
}
