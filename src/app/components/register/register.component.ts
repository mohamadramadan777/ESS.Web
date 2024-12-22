import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  idType: string = 'qfc';

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      idType: ['qfc', Validators.required],
      number: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      QfcNumber: [''],
      registrationDetails: [''],
    });
  }

  onIdTypeChange(value: string): void {
    this.idType = value;

    if (value === 'qfc') {
      this.registerForm.get('QfcNumber')?.setValidators([Validators.required]);
      this.registerForm.get('registrationDetails')?.clearValidators();
    } else if (value === 'rf') {
      this.registerForm
        .get('registrationDetails')
        ?.setValidators([Validators.required]);
      this.registerForm.get('QfcNumber')?.clearValidators();
    }

    this.registerForm.get('QfcNumber')?.updateValueAndValidity();
    this.registerForm.get('registrationDetails')?.updateValueAndValidity();
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      console.log('Form Submitted', this.registerForm.value);
    }
  }

  register() {
    this.router.navigate(['/home']);
  }
}
