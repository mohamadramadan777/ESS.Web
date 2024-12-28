import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Client } from '../../services/api-client'; 
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

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private client: Client,
    private toastr: ToastrService 
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.fillFeedbackOptions();
  }

  // Initialize the form with default values and validation rules
  initializeForm(): void {
    this.contactForm = this.fb.group({
      name: ['', Validators.required], // Name field (required)
      qfcNumber: ['', Validators.required], // QFC Number field (required)
      email: ['', [Validators.required, Validators.email]], // Email field (required and must be a valid email)
      feedbackRelatingTo: [''], // Dropdown field (optional)
      description: ['', Validators.required], // Description field (required)
      captcha: [''] // Captcha field (required)
    });
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
      const formValues = this.contactForm.value;
      const feedbackRequest = new ContactUs({
        userName: formValues.name,
        firmQFCNumber: formValues.qfcNumber,
        userEmailAddress: formValues.email,
        wFeedbackTypeText: formValues.feedbackRelatingTo,
        feedbackDesc: formValues.description
      });

      this.client.sendFeedback(feedbackRequest).subscribe({
        next: (response) => {
          if (response) {
            this.toastr.success('Your feedback has been submitted successfully!', 'Success');
            this.resetForm(); // Reset the form after successful submission
          } else {
            this.toastr.error('Failed to submit feedback. Please try again.', 'Error');
          }
        },
        error: (error) => {
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
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']); // Replace '/login' with the actual login route
  }
}
