import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoadingService } from '../../services/loader.service';
import { Client} from '../../services/api-client'; 
import { AppConstants } from '../../constants/app.constants';

@Component({
  selector: 'app-change-email',
  templateUrl: './change-email.component.html',
  styleUrls: ['./change-email.component.scss']
})
export class ChangeEmailComponent implements OnInit {
  changeEmailForm!: FormGroup;
  emailsDoNotMatch: boolean = false;
  AppConstants = AppConstants;
  constructor(
    private fb: FormBuilder,
    private client: Client,
    private loadingService : LoadingService,
    private router: Router,
    private toastr: ToastrService
  ) {}


  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.changeEmailForm = this.fb.group({
      registeredEmail: [{ value: localStorage.getItem(this.AppConstants.Session.SESSION_EMAIL_ID), disabled: true }],
      newEmail: ['', [Validators.required, Validators.email]],
      confirmEmail: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    const formValues = this.changeEmailForm.getRawValue(); // Get form values including disabled fields
  
    // Check if newEmail and confirmEmail match
    if (formValues.newEmail !== formValues.confirmEmail) {
      this.emailsDoNotMatch = true;
      this.toastr.error('Emails do not match.', 'Error');
      return;
    }
  
    this.emailsDoNotMatch = false;
    this.loadingService.show();
    // Call the API to update the registered email
    this.client.updateRegisteredEmail(formValues.newEmail).subscribe({
      next: (response) => {
        // Show success toaster
        this.loadingService.hide();
        this.toastr.success('Email updated successfully!', 'Success');
  
        // Update local storage with the new email
        localStorage.setItem(this.AppConstants.Session.SESSION_EMAIL_ID, formValues.newEmail);
  
        // Redirect to home
        this.router.navigate(['/home']);
      },
      error: (error) => {
        this.loadingService.hide();
        console.error('Error updating email:', error);
        this.toastr.error('Failed to update email. Please try again.', 'Error');
      },
    });
  }
  

  onCancel(): void {
    this.router.navigate(['/home']); // Redirect to home on cancel
  }

  navigateToHome(): void {
    this.router.navigate(['/home']);
  }
}
