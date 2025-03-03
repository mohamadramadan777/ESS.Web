import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Client } from '../../services/api-client';
import { LoadingService } from '../../services/loader.service';
import { AppConstants } from '../../constants/app.constants';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm!: FormGroup;
  passwordsDoNotMatch: boolean = false;
  passwordsInvalid: boolean = false;
  Appconstants = AppConstants;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private client: Client,
    private loadingService: LoadingService
  ) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.resetPasswordForm = this.fb.group({
      email: [{ value: localStorage.getItem(this.Appconstants.Session.SESSION_EMAIL_ID) ?? '', disabled: true }], // Set email as readonly
      oldPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.resetPasswordForm.invalid) {
      this.toastr.warning('Please fill all required fields.', 'Validation Error');
      return;
    }

    const formValues = this.resetPasswordForm.value;

    if (formValues.newPassword !== formValues.confirmPassword) {
      this.passwordsDoNotMatch = true;
      this.toastr.error('Passwords do not match.', 'Error');
      return;
    }
    else {
      this.passwordsDoNotMatch = false;
    }

    if (!this.isValidPassword(formValues.newPassword)) {
      this.toastr.error('Invalid Password.', 'Error');
      this.passwordsInvalid = true
      return;
    }
    else {
      this.passwordsInvalid = false;
    }


    this.loadingService.show(); // Show loader before API call

    this.client.resetPassword(formValues.newPassword).subscribe({
      next: (response) => {
        this.loadingService.hide(); // Hide loader after API call
        if (response && response.response) {
          this.toastr.success('Your password has been reset successfully!', 'Success');
          this.router.navigate(['/login']); // Navigate to login page
        } else {
          this.toastr.error('Failed to reset password. Please try again.', 'Error');
        }
      },
      error: (error) => {
        this.loadingService.hide(); // Hide loader on error
        console.error('Error resetting password:', error);
        this.toastr.error('An unexpected error occurred. Please try again later.', 'Error');
      },
    });
  }


  navigateToHome(): void {
    this.router.navigate(['/home']);
  }

  isLoggedIn(): boolean {
    const userId = localStorage.getItem(this.Appconstants.Session.SESSION_W_USERID);
    return userId !== null && userId !== undefined;
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']); // Replace '/login' with the actual login route
  }

  onCancel(): void {
    this.router.navigate(['/home']); // Redirect to home on cancel
  }

  isValidPassword(password: string): boolean {
    const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9\S]{8,14}$/;
    return regex.test(password);
  }

}
