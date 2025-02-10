import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Client } from '../../services/api-client'; 
import { LoadingService } from '../../services/loader.service';
import { AppConstants } from '../../constants/app.constants';
@Component({
  selector: 'app-sign-off',
  templateUrl: './sign-off.component.html',
  styleUrls: ['./sign-off.component.scss'],
})
export class SignOffComponent implements OnInit {
  @Input() TermID: number = 0;
  @Input() ShowAcceptTermsCheckBox: boolean = false;

  TermsText: string = '';
  RegisteredEmail: string = '';
  Password: string = '';

  constructor() {}

  ngOnInit(): void {
    this.loadTermsText(this.TermID);
  }

  loadTermsText(termId: number): void {
    // Dummy implementation
    switch (termId) {
      case 1:
        this.TermsText = 'These are the terms and conditions for TermID 1.';
        break;
      case 2:
        this.TermsText = 'These are the terms and conditions for TermID 2.';
        break;
      default:
        this.TermsText = 'Default terms and conditions.';
    }
  }

  onSignOff(): void {
    // Handle sign-off logic
    console.log('Sign-off clicked');
    console.log('Registered Email:', this.RegisteredEmail);
    console.log('Password:', this.Password);
  }

  onCancel(): void {
    // Handle cancel logic
    console.log('Sign-off canceled');
  }
}
