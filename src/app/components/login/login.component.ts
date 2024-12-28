import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';
import { AuthenticateRequest } from '../../services/api-client';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  idType: string = 'qfc';
  isSubmitting: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private authenticationService: AuthService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      idType: ['qfc', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      QfcNumber: ['', Validators.required],
      registrationDetails: [''],
      termsAgreed: [false],
    });
  }

  onIdTypeChange(value: string): void {
    this.idType = value;
    if (value === 'qfc') {
      this.loginForm.get('QfcNumber')?.setValidators([Validators.required]);
      this.loginForm.get('registrationDetails')?.clearValidators();
    } else if (value === 'rf') {
      this.loginForm
        .get('registrationDetails')
        ?.setValidators([Validators.required]);
      this.loginForm.get('QfcNumber')?.clearValidators();
    }
    this.loginForm.get('QfcNumber')?.updateValueAndValidity();
    this.loginForm.get('registrationDetails')?.updateValueAndValidity();
  }

  async login(): Promise<void> {
    if (!this.loginForm.value.termsAgreed) {
      this.toastr.warning('You must agree to the terms of use.');
      return;
    }

    if (this.loginForm.valid) {
      this.isSubmitting = true;
      const formValues = this.loginForm.value;
      const user = new AuthenticateRequest({
        qfcNumber: formValues.idType === 'qfc' ? formValues.QfcNumber : undefined,
        userLoginName: formValues.email,
        userPassword: formValues.password,
        userIPAddress: '',
        termID: 1,
        userSessionID: 'sessionIDHere',
      });

      try {
        this.authenticationService.login(user).subscribe({
          next: response => {
            this.isSubmitting = false;
            switch (response) {
              case 'AccountLocked':
                this.toastr.error('Your account has been Locked', 'Login Failed');
                this.setInstruction(
                  'Your account has been locked for security reasons.<br/> Please contact QFCRA IT Support <a href="../contactus" onclick="/contactus()" style="color: #9c1f2f; text-decoration:underline;">here</a>.'
                );
                break;
              case 'LoggedInOtherSystem':
                this.toastr.error('Logged in to another system', 'Login Failed');
                this.setInstruction(
                  '<span style=" color: red;">You are logged in to another system, please log out from the other system first.</span>'
                );
                break;
              case 'Deactivated':
                this.toastr.error('Account has been deactivated', 'Login Failed');
                this.setInstruction(
                  '<span style=" color: red;">Your Account has been deactivated.</span>'
                );
                break;
              case 'InvalidUserCredentials':
                this.toastr.error('Invalid Credentials', 'Login Failed');
                this.setInstruction(
                  '<span style=" color: red;">Invalid user credentials.</span>'
                );
                break;
              case 'Unauthorized':
                this.toastr.error('Unauthorized', 'Login Failed');
                break;
              case 'NoToken':
                this.toastr.error('Error', 'Login Failed');
                break;
              case 'Error':
                this.toastr.error('An error occurred', 'Login Failed');
                break;
              case 'resetpassword':
                this.toastr.info('Redirecting to reset password', 'Password Reset Required');
                break;
              case 'success':
                this.toastr.success('Welcome!', 'Login Successful');
                break;
              default:
                this.toastr.error('An unexpected error occurred', 'Login Failed');
                break;
            }
          },
          error: err => {
            console.error('Unexpected error:', err);
            this.toastr.error('An unexpected error occurred.', 'Login Failed');
          },
        });
      } catch (error) {
        this.isSubmitting = false;
        this.toastr.error('An unexpected error occurred', 'Login Failed');
      }
    } else {
      this.toastr.warning('Fill Mandatory Fields', 'Invalid Data');
    }
  }

  setInstruction(text: string): void {
    const instructionElement = document.getElementById('instruction');
    if (instructionElement) {
      instructionElement.innerHTML = text;
    }
  }

  contactus(): void {
    this.router.navigate(['/contactus']);
  }
}
