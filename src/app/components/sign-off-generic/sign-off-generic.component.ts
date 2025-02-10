import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Client } from '../../services/api-client'; 
import { LoadingService } from '../../services/loader.service';
import { AppConstants } from '../../constants/app.constants';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-sign-off-generic',
  templateUrl: './sign-off-generic.component.html',
  styleUrls: ['./sign-off-generic.component.scss'],
})
export class SignOffGenericComponent implements OnInit {
  @Input() TermID: number = 0;
  @Input() ShowAcceptTermsCheckBox: boolean = false;

  TermsText: string = '';
  TermsTitle: string = '';
  RegisteredEmail: string = '';
  Password: string = '';

  constructor(    @Inject(MAT_DIALOG_DATA) public data: { TermID: number; ShowAcceptTermsCheckBox: boolean ,},
  private dialogRef: MatDialogRef<SignOffGenericComponent>,
  private client: Client, private toastr: ToastrService, private loadingService: LoadingService) {}

  ngOnInit(): void {
    this.loadTermsText(this.data.TermID);
  }

  loadTermsText(termId: number): void {
    this.loadingService.show();
    this.client.getTerms(termId).subscribe({
      next: (response) => {
        this.loadingService.hide();
        if (response && response.isSuccess && response.response) {
          this.TermsTitle = response.response?.wTermTitle ?? "";
          this.TermsText = response.response?.wTermDesc ?? "";
        } else {
          this.toastr.error('Failed to load Terms.', 'Error');
          console.error('Failed to load Terms:', response?.errorMessage);
        }
      },
      error: (error) => {
        this.loadingService.hide();
        this.toastr.error('Error occurred while fetching Terms.', 'Error');
        console.error('Error occurred while fetching Terms:', error);
      },
    });
  }

  onSignOff(): void {
    // Handle sign-off logic
    console.log('Sign-off clicked');
    console.log('Registered Email:', this.RegisteredEmail);
    console.log('Password:', this.Password);
  }

  onCancel(): void {
    this.dialogRef.close(null); // Close dialog without data
  }
}
