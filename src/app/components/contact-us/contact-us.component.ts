import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Client } from '../../services/api-client'; 
import { LoadingService } from '../../services/loader.service';
import { ContactUs } from '../../services/api-client'; 
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent implements OnInit {
  contactForm!: FormGroup; // FormGroup to handle form controls
  feedbackOptions: string[] = []; // Options for the dropdown
  private readonly TOKEN_KEY = 'token'; // TODO: Dictionary
  private readonly SESSION_W_USERID = 'w_userid';
  private readonly SESSION_INDIVIDUAL_NAME = 'individual_name';
  private readonly SESSION_QFC_NO  = 'qfc_no';
  private readonly SESSION_EMAIL_ID   = 'email_id';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private client: Client,
    private loadingService : LoadingService,
    private toastr: ToastrService 
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.fillFeedbackOptions();
    this.populateUserDetails();
  }

  // Initialize the form with default values and validation rules
  initializeForm(): void {
    this.contactForm = this.fb.group({
      name: [{ value: '', disabled: false }, Validators.required], // Name field (disabled when logged in)
      qfcNumber: [{ value: '', disabled: false }, Validators.required], // QFC Number field (disabled when logged in)
      email: [{ value: '', disabled: false }, [Validators.required, Validators.email]], // Email field (disabled when logged in)
      feedbackRelatingTo: [''], // Dropdown field (optional)
      description: ['', Validators.required], // Description field (required)
      captcha: [''] // Captcha field (required)
    });
  }

  // Populate name, QFC number, and email from localStorage if the user is logged in
  populateUserDetails(): void {
    if (this.isLoggedIn()) {
      const name = localStorage.getItem(this.SESSION_INDIVIDUAL_NAME) ?? '';
      const qfcNo = localStorage.getItem(this.SESSION_QFC_NO) ?? '';
      const email = localStorage.getItem(this.SESSION_EMAIL_ID) ?? '';

      this.contactForm.patchValue({
        name,
        qfcNumber: qfcNo,
        email
      });

      // Disable the fields for logged-in users
      this.contactForm.get('name')?.disable();
      this.contactForm.get('qfcNumber')?.disable();
      this.contactForm.get('email')?.disable();
    }
  }

  // Fetch feedback options from the API
  fillFeedbackOptions(): void {
    this.client.getMastertableData("v_WFeedbackTypes").subscribe({
      next: (response) => {
        if (response && response.response) {
          // Assuming response.response is a key-value dictionary
          this.feedbackOptions = Object.values(response.response);
        } else {
          console.error('No data received for feedback options.');
        }
      },
      error: (error) => {
        console.error('Failed to fetch feedback options:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      this.loadingService.show();
      const formValues = this.contactForm.getRawValue(); // Get raw values, including disabled fields
      const feedbackRequest = new ContactUs({
        userName: formValues.name,
        firmQFCNumber: formValues.qfcNumber,
        userEmailAddress: formValues.email,
        wFeedbackTypeText: formValues.feedbackRelatingTo,
        feedbackDesc: formValues.description
      });

      this.client.sendFeedback(feedbackRequest).subscribe({
        next: (response) => {
          this.loadingService.hide();
          if (response) {
            this.toastr.success('Your feedback has been submitted successfully!', 'Success');
            this.resetForm(); // Reset the form after successful submission
          } else {
            this.toastr.error('Failed to submit feedback. Please try again.', 'Error');
          }
        },
        error: (error) => {
          this.loadingService.hide();
          console.error('Error while submitting feedback:', error);
          this.toastr.error('An unexpected error occurred. Please try again.', 'Error');
        }
      });
    } else {
      console.error('Form is invalid');
      this.contactForm.markAllAsTouched(); // Highlight invalid fields
      this.toastr.warning('Please fill all required fields before submitting.', 'Validation Error');
    }
  }

  // Reset the form to its initial state
  resetForm(): void {
    this.contactForm.reset();
    if (this.isLoggedIn()) {
      this.populateUserDetails(); // Re-populate user details if logged in
    }
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']); // Replace '/login' with the actual login route
  }

  isLoggedIn(): boolean {
    const userId = localStorage.getItem(this.SESSION_W_USERID);
    return userId !== null && userId !== undefined;
  }
}
