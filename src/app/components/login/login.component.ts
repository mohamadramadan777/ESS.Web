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
    this.toastr.success('Welcome!', 'Login Successful');
        this.router.navigate(['/home']);
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
