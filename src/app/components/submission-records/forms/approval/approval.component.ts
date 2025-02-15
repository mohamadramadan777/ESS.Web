import { Component, Inject, Input, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { WObjects, FirmsContactDetailPage } from '../../../../enums/app.enums';
import { AppConstants } from '../../../../constants/app.constants';
import { lastValueFrom } from 'rxjs';
import {
  ApplicationDataDto,
  IndividualDetailsDto,
  ControlledFunctionDto,
} from '../../../../services/api-client';
import {
  Client,
  AttachmentDto,
  ObjectSOTaskStatus,
} from '../../../../services/api-client';
import { LoadingService } from '../../../../services/loader.service';
import { MessagePropertyService } from '../../../../services/message-property.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { MatTabGroup } from '@angular/material/tabs';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
@Component({
  selector: 'app-approval',
  templateUrl: './approval.component.html',
  styleUrls: ['./approval.component.scss'],
})
export class ApprovalComponent {
  @ViewChild(MatTabGroup, { static: true }) tabGroup!: MatTabGroup;
  @Input() ReadOnly: boolean = false;
  unsavedChanges: boolean = false; // Track unsaved change
  AttObjectID = WObjects.IndividualApplications;
  ApplicationID = 0;
  DocSignText = '';
  aiNumberError: string = ''; // Error message for AI Number validation
  validationErrors: { [key: string]: string } = {};
  AI_ERROR_MESSAGE = '';
  jurisdictions: any[] = [];
  applicant = {
    familyName: '',
    otherName: '',
    dob: null,
    passportNumber: '',
    placeOfBirth: '',
    jurisdiction: '',
    aiNumber: '',
    email: '',
    isResident: null,
  };

  controlledFunctions = [
    { id: 1, name: 'Non-Executive Governance Function', isSelected: false },
    { id: 2, name: 'Executive Governance Function', isSelected: false },
    { name: 'Senior Executive Function', isSelected: false },
    { name: 'Senior Management Function', isSelected: false },
    { name: 'Finance Function', isSelected: false },
    { name: 'Risk Management Function', isSelected: false },
    { name: 'Compliance Oversight Function', isSelected: false },
    { name: 'MLRO Function', isSelected: false },
    { name: 'Internal Audit Function', isSelected: false },
    { name: 'Actuarial Function', isSelected: false },
  ];

  dropdwonvalues(): void {
    this.client.getObjectTypeTable('Countries').subscribe({
      next: (response) => {
        if (response && response.isSuccess && response.response) {
          this.jurisdictions = Object.values(response.response);
        } else {
          this.toastr.error('Failed to load countries list .', 'Error');
          console.error('Failed to load countires:', response?.errorMessage);
        }
      },
    });
  }

  showEmailField = false;
  showResidentQuestion = false;

  constructor(
    private router: Router,
    private client: Client,
    private loadingService: LoadingService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<ApprovalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private messagePropertyService: MessagePropertyService
  ) {}

  ngOnInit(): void {
    this.dropdwonvalues();
    this.setDocDescriptionTextForAttachments();
    this.loadMessageProperties();
  }

  loadMessageProperties(): void {
    this.messagePropertyService
      .getMessageProperty(FirmsContactDetailPage.AI_ERRORR_MSG.toString())
      .subscribe((message) => {
        this.AI_ERROR_MESSAGE = message;
      });
  }
  // AI Number Validation
  validateAiNumber(): void {
    let aiNumber = this.applicant.aiNumber.trim();
    this.aiNumberError = '';

    if (aiNumber !== '') {
      if (aiNumber.length > 8) {
        this.aiNumberError = this.AI_ERROR_MESSAGE;
        return;
      }

      if (aiNumber.startsWith('AI')) {
        aiNumber = aiNumber.substring(2).trim();
      }

      const num = parseInt(aiNumber, 10);

      if (isNaN(num) || num <= 0) {
        this.aiNumberError = this.AI_ERROR_MESSAGE;
        return;
      }

      // Ensure the number is 5 digits long (padded with zeros)
      this.applicant.aiNumber = 'AI ' + num.toString().padStart(5, '0');
    }
  }

  // Triggered when a controlled function checkbox is toggled
  onFunctionChange(functionName: string): void {
    this.showEmailField = this.controlledFunctions.some(
      (f) => f.name === 'Senior Executive Function' && f.isSelected
    );
    this.showResidentQuestion = this.controlledFunctions.some(
      (f) => f.name === 'MLRO Function' && f.isSelected
    );
  }

  setDocDescriptionTextForAttachments(): void {
    this.client
      .getDocSignatories(
        this.data.DocTypeId,
        '',
        Number(WObjects.GeneralSubmission)
      )
      .subscribe({
        next: (response) => {
          if (response && response.isSuccess && response.response) {
            const objDocSignatories = response.response;
            this.DocSignText = objDocSignatories.docSignText ?? '';
          } else {
            this.toastr.error('Failed to load Doc Signatories.', 'Error');
            console.error(
              'Failed to load Doc Signatories:',
              response?.errorMessage
            );
          }
        },
        error: (error) => {
          this.loadingService.hide();
          this.toastr.error(
            'Error occurred while fetching Doc Signatories.',
            'Error'
          );
          console.error(
            'Error occurred while fetching Doc Signatories:',
            error
          );
        },
      });
  }

  // Save functionality
  onSave(): void {
    this.toastr.success('Changes saved successfully!', 'Success');
  }

  // Save and close functionality
  onSaveAndClose(): void {
    this.toastr.success('Changes saved successfully!', 'Success');
    this.dialogRef.close();
  }

  onFileUploaded(uploadIds: number[]): void {
    console.log('Uploaded File IDs:', uploadIds);
  }

  onClose(): void {
    this.dialogRef.close();
  }

  // Navigate to a specific tab by index
  navigateToTab(index: number): void {
    this.tabGroup.selectedIndex = index;
  }

  // Submit functionality
  async onSubmit() {
    const isValid = await this.validateForm();
    if (!isValid) {
      this.toastr.error('Please fix validation errors before submitting.');
      return;
    }
    console.log('Submit clicked');
    this.saveApplicationData();
  }

  private async checkUnsavedChanges(): Promise<void> {
    if (this.unsavedChanges) {
      const result = await Swal.fire({
        title: 'Unsaved Changes',
        text: 'You have unsaved changes. Do you really want to close without saving?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#a51e36',
        cancelButtonColor: '#555555',
        confirmButtonText: 'Save Changes',
        cancelButtonText: 'Discard Changes',
      });

      if (result.isConfirmed) {
        this.toastr.success('Changes saved successfully!', 'Success');
        this.dialogRef.close();
      }
    } else {
      this.dialogRef.close();
    }
  }
  async getValidationMessage(key: string): Promise<string> {
    try {
      const response = await this.client.getMessageProperty(key).toPromise();
      if (!response || !response.response) {
        throw new Error('Error fetching message server error ');
      }
      return response.response;
    } catch (error) {
      console.error('Error fetching message property', error);
      return 'validation error';
    }
  }

  async validateForm(): Promise<boolean> {
    this.validationErrors = {}; //reset the errors
    let isValid = true;

    if (!this.applicant.familyName) {
      this.validationErrors['familyName'] = await this.getValidationMessage(
        '111'
      );
      isValid = false;
    }
    if (
      !this.applicant.familyName &&
      /[^a-zA-Z]/.test(this.applicant.familyName)
    ) {
      this.validationErrors['familyName'] = await this.getValidationMessage(
        '139'
      );
      isValid = false;
    }

    if (!this.applicant.otherName) {
      this.validationErrors['otherName'] = await this.getValidationMessage(
        '112'
      );
      isValid = false;
    }
    if (!this.applicant.dob) {
      this.validationErrors['dob'] = await this.getValidationMessage('2015');
      isValid = false;
    }
    if (this.applicant.dob && new Date(this.applicant.dob) > new Date()) {
      this.validationErrors['dob'] = await this.getValidationMessage('191');
      isValid = false;
    }

    if (!this.applicant.placeOfBirth) {
      this.validationErrors['placeOfBirth'] = await this.getValidationMessage(
        '299'
      );
      isValid = false;
    }

    if (!this.applicant.passportNumber) {
      this.validationErrors['passportNumber'] = await this.getValidationMessage(
        '162'
      );
      isValid = false;
    }

    if (!this.applicant.jurisdiction) {
      this.validationErrors['jurisdiction'] = await this.getValidationMessage(
        '163'
      );
      isValid = false;
    }

    // if (this.applicant.aiNumber) {
    //   const aiValidationResponse = await this.client.validateAiNumber(this.applicant.aiNumber);
    //   if (!aiValidationResponse.valid) {
    //     this.aiNumberError = await this.getValidationMessage("16019");
    //     isValid = false;
    //   }
    // }

    if (!this.isFunctionsSelected()) {
      this.validationErrors['controlledFunctions'] =
        await this.getValidationMessage('263');
      isValid = false;
    }
    if (isValid === true) {
      if (await this.checkDuplicateApplication()) {
        this.validationErrors['duplicate'] = await this.getValidationMessage(
          '298'
        );
        isValid = false;
      }
    }

    return isValid;
  }

  isFunctionsSelected(): boolean {
    return this.controlledFunctions.some((func) => func.isSelected);
  }

  async checkDuplicateApplication(): Promise<boolean> {
    try {
      // Ensure values are properly set before calling the API
      const qfcNumber = localStorage.getItem('qfc_no') || '';
      const aiNumber = this.applicant.aiNumber || '';
      const formTypeID = this.data.formTypeID || 0;
      const windApplicationID = this.ApplicationID || 0;

      // Get selected controlled function IDs
      const lstFunctions: number[] = this.controlledFunctions
        .filter((func) => func.isSelected && func.id !== undefined) // Ensure 'id' is defined
        .map((func) => func.id!) // Type assertion ensures 'id' is treated as number
        .filter((id): id is number => id !== undefined); // Filter out undefined values

      // Call the API
      const response = await lastValueFrom(
        this.client.isDuplicateApplication(
          qfcNumber,
          aiNumber,
          formTypeID,
          lstFunctions,
          windApplicationID
        )
      );
      if (response === null || response === undefined) {
        throw new Error('Error fetching message server error ');
      }
      return response.response ?? false;
      // Assuming API returns { duplicate: boolean }
    } catch (error) {
      console.error('Error checking duplicate application:', error);
      return false;
    }
  }

  async saveApplicationData(): Promise<void> {
    try {
      const individualDetails = IndividualDetailsDto.fromJS({
        applicationID: this.ApplicationID || undefined,
        aiNumber: this.applicant.aiNumber || undefined,
        formTypeID: this.data.formTypeID?.toString() || undefined,
        familyName: this.applicant.familyName || undefined,
        otherNames: this.applicant.otherName || undefined,
        dateOfBirth: this.applicant.dob || undefined,
        passportnumber: this.applicant.passportNumber || undefined,
        placeOfBirthCity: this.applicant.placeOfBirth || undefined,
        jurisdiction: this.applicant.jurisdiction || undefined,
        emailAddress: this.applicant.email || undefined,
        isOrdinarilyResidentFlag: this.applicant.isResident || undefined,
      });

      const selectedFunctionIDs: ControlledFunctionDto[] =
        this.controlledFunctions
          .filter((func) => func.isSelected)
          .map((func) => ControlledFunctionDto.fromJS({ id: func.id })); // Correct instantiation

      const applicationData: ApplicationDataDto = new ApplicationDataDto({
        objIndividualDetails: individualDetails,
        lstControledFunctionIDs: selectedFunctionIDs, // Now properly instantiated
      });

      console.log('Submitting application data:', applicationData);

      const response = await lastValueFrom(
        this.client.insertUpdateApplicationData(applicationData)
      );

      if (response && response.response) {
        console.log('Application submitted successfully:', response);
        this.redirectToApprovalForm(response.response);
      } else {
        console.error('Application submission failed', response);
        this.toastr.error('Failed to submit application. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      this.toastr.error('An error occurred while submitting the application.');
    }
  }

  redirectToApprovalForm(appID: number): void {
    // const encryptedID = this.encryptQueryParam(appID.toString());
    // const encryptedDocType = this.encryptQueryParam(this.data.DocTypeId);
    // const encryptedFormType = this.encryptQueryParam(this.data.WIndFromTypeID);

    this.router.navigate(['/approval'], {
      queryParams: {
        appID: appID.toString(),
        dt: this.data.DocTypeId,
        ft: this.data.WIndFromTypeID,
      },
    });
  }
}
