import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Client } from '../../services/api-client'; 
import { environment } from '../../../environments/environment'; 

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
    private client: Client // Inject the Client service directly
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
      captcha: ['', Validators.required] // Captcha field (required)
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

  // Handle form submission
  onSubmit(): void {
    if (this.contactForm.valid) {
      const formData = this.contactForm.value;
      console.log('Form Data:', formData);

      // Simulate form submission logic (e.g., send formData to the server)
      alert('Form submitted successfully!');
      this.resetForm(); // Reset the form after submission
    } else {
      console.error('Form is invalid');
      this.contactForm.markAllAsTouched(); // Highlight invalid fields
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
