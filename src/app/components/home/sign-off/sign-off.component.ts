import { Component } from '@angular/core';

@Component({
  selector: 'app-sign-off',
  templateUrl: './sign-off.component.html',
  styleUrl: './sign-off.component.scss',
})
export class SignOffComponent {
  items = [
    {
      title:
        'September - 2022 Quartelrly Lead Regulator Capital Recourses Report due on ',
      dueDate: '30 / NOV / 2022',
    },
  ];
}
