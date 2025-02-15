import { Component, Inject, Input, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  WObjects,
  FirmsContactDetailPage,
  IndividualDetailsValidation,
  UserRegistrationPage,
  ControlledFunctionMessage,
} from '../../../../enums/app.enums';
import { AppConstants } from '../../../../constants/app.constants';
import { lastValueFrom } from 'rxjs';
import { DatePipe } from '@angular/common';
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
    {
      id: 1,
      name: 'Non-Executive Governance Function',
      typeId: 101,
      isSelected: false,
    },
    {
      id: 2,
      name: 'Executive Governance Function',
      typeId: 102,
      isSelected: false,
    },
    {
      id: 3,
      name: 'Senior Executive Function',
      typeId: 103,
      isSelected: false,
    },
    {
      id: 4,
      name: 'Senior Management Function',
      typeId: 104,
      isSelected: false,
    },
    { id: 5, name: 'Finance Function', typeId: 105, isSelected: false },
    { id: 6, name: 'Risk Management Function', typeId: 106, isSelected: false },
    {
      id: 7,
      name: 'Compliance Oversight Function',
      typeId: 107,
      isSelected: false,
    },
    { id: 8, name: 'MLRO Function', typeId: 108, isSelected: false },
    { id: 9, name: 'Internal Audit Function', typeId: 109, isSelected: false },
    { id: 10, name: 'Actuarial Function', typeId: 110, isSelected: false },
  ];
  getSelectedFunctions(): ControlledFunctionDto[] {
    return this.controlledFunctions
      .filter((func) => func.isSelected)
      .map((func) =>
        ControlledFunctionDto.fromJS({
          controlFunctionID: func.id, // C# equivalent of hdnFunctionID
          applicationID: this.ApplicationID ?? undefined, // Equivalent of lblAppicationID
          functionTypeID: func.typeId, // C# equivalent of hdnFunctionTypeID
          functionTypeDesc: func.name.replace(/<i>|<\/i>/g, ''), // Remove <i> tags if present
          actionTypeID: 1, // Equivalent of ActionType.Add in C#
          userID: this.data.userID, // Equivalent of _userID
          pageFlag: 'CF',
        })
      );
  }
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
    private messagePropertyService: MessagePropertyService,
    private datePipe: DatePipe
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
  validateAiNumber(): boolean {
    let aiNumber = this.applicant.aiNumber.trim();
    this.aiNumberError = '';

    if (aiNumber !== '') {
      // Remove "AI " prefix if present (case insensitive)
      if (aiNumber.toUpperCase().startsWith('AI')) {
        aiNumber = aiNumber.substring(2).trim();
      }

      // Ensure it contains only digits
      if (!/^\d+$/.test(aiNumber)) {
        this.aiNumberError = this.AI_ERROR_MESSAGE;
        return false;
      }

      const num = parseInt(aiNumber, 10);

      // Ensure valid number (positive and up to 5 digits)
      if (isNaN(num) || num <= 0 || num.toString().length > 5) {
        this.aiNumberError = this.AI_ERROR_MESSAGE;
        return false;
      }

      // Format AI number correctly as "AI 00001" (5-digit format)
      this.applicant.aiNumber = 'AI ' + num.toString().padStart(5, '0');
    }
    return true;
  }

  async validateAiNumberwithFirms(dob: string): Promise<boolean> {
    try {
      let aiNumber = this.applicant.aiNumber.trim();
      let datetosend = this.datePipe.transform(dob, 'dd-MMM-yyyy') || undefined;
      // If AI number is empty, return true (matching WebForms behavior)
      if (!aiNumber) {
        return true;
      }

      // Ensure AI number format is valid (assuming you have a method for this)
      if (!this.validateAiNumber()) {
        return false;
      }

      const response = await this.client
        .isValidAiNumber(aiNumber, datetosend)
        .toPromise();

      if (!response || response.response === undefined) {
        throw new Error('Error fetching AI number: Server error');
      }

      return response.response === 1;
    } catch (error) {
      console.error('Error validating AI number:', error);
      return false; // Return false instead of 'error' to match boolean return type
    }
  }
  // Mock of the email check
  validateEmail(): boolean {
    const email = this.applicant.email?.trim() || '';

    // Check if email is empty (Required field)
    if (!email) {
      return false; // Invalid: Email is required
    }

    // Email format validation (Basic regex pattern for email)
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailPattern.test(email)) {
      return false; // Invalid: Email format is incorrect
    }

    return true; // Valid email
  }
  // Mock of the TextDataValidation check
  isValidTextData(value: string): boolean {
    // Check if the value contains special characters
    const regex = /^[a-zA-Z\s]*$/; // Only letters and spaces allowed
    return regex.test(value);
  }

  // Mock of the Passport validation check
  isValidPassport(value: string): boolean {
    // Passport validation: for simplicity, assume alphanumeric with no special characters
    const regex = /^[a-zA-Z0-9]*$/; // Only alphanumeric characters allowed
    return regex.test(value);
  }

  isDocumentSelected(): boolean {
    return this.uploadedFiles.length > 0; // Returns true if files exist, false otherwise
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
  async onSave(): Promise<void> {
    const isValid = await this.validateForm(1);
    if (!isValid) {
      this.toastr.error('Please fix validation errors before submitting.');
      return;
    }
    let appID = 0;
    try {
      appID = await this.saveApplicationData(); // Use await to get the resolved value
    } catch (error) {
      console.error('Error while saving application data', error);
    }

    if (appID > 0) {
      this.toastr.success('Application saved successfully!', 'Success');
      this.unsavedChanges = false; // Reset unsaved changes flag
    } else {
      this.validationErrors['savemessage'] = await this.getValidationMessage(
        IndividualDetailsValidation.REQUIREDFIELD_VALDATION.toString()
      );
    }
  }

  // Save and close functionality
  onSaveAndClose(): void {
    this.onSave();
    this.toastr.success('Changes saved successfully!', 'Success');
    this.dialogRef.close();
  }

  uploadedFiles: any[] = []; // Array to store uploaded file details

  onFileUploaded(file: any) {
    this.uploadedFiles.push(file); // Store the uploaded file
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
    const isValid = await this.validateForm(2);
    if (!isValid) {
      this.toastr.error('Please fix validation errors before submitting.');
      return;
    }
    let appID = 0;
    try {
      appID = await this.saveApplicationData(); // Use await to get the resolved value
    } catch (error) {
      console.error('Error while saving application data', error);
    }

    if (appID > 0) {
      // this.submitAIApplicationData();
      this.toastr.success('Application saved successfully!', 'Success');
      this.unsavedChanges = false; // Reset unsaved changes flag
    } else {
      this.validationErrors['savemessage'] = await this.getValidationMessage(
        IndividualDetailsValidation.REQUIREDFIELD_VALDATION.toString()
      );
    }
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

  async validateForm(flag: number): Promise<boolean> {
    this.validationErrors = {}; //reset the errors
    let isValid = true;

    if (flag == 2) {
      if (!this.applicant.familyName) {
        this.validationErrors['familyName'] = await this.getValidationMessage(
          IndividualDetailsValidation.FamilyName.toString()
        );
        isValid = false;
      }
      if (
        !this.applicant.familyName &&
        /[^a-zA-Z]/.test(this.applicant.familyName)
      ) {
        this.validationErrors['familyName'] = await this.getValidationMessage(
          IndividualDetailsValidation.FamilyNamenotspecialcharacters.toString()
        );
        isValid = false;
      }

      if (!this.applicant.otherName) {
        this.validationErrors['othersName'] = await this.getValidationMessage(
          IndividualDetailsValidation.OthersName.toString()
        );
        isValid = false;
      }
    }
    let dovalidate = true;
    if (flag === 2) {
      if (!this.applicant.dob) {
        this.validationErrors['dob'] = await this.getValidationMessage(
          IndividualDetailsValidation.CompleteDOB.toString()
        );
        isValid = false;
        dovalidate = false;
      }
      if (this.applicant.dob && new Date(this.applicant.dob) > new Date()) {
        this.validationErrors['dob'] = await this.getValidationMessage(
          IndividualDetailsValidation.DOBGreaterToday.toString()
        );
        isValid = false;
        dovalidate = false;
      }

      if (!this.applicant.placeOfBirth) {
        this.validationErrors['placeOfBirth'] = await this.getValidationMessage(
          '299'
        );
        isValid = false;
      }
      if (
        this.applicant.placeOfBirth.trim() !== '' &&
        !this.isValidTextData(this.applicant.placeOfBirth.trim())
      ) {
        this.validationErrors['placeOfBirth'] = await this.getValidationMessage(
          IndividualDetailsValidation.BirthPlaceSpecialChar.toString()
        );
        isValid = false;
      }

      // Validate Passport Number
      if (!this.applicant.passportNumber) {
        this.validationErrors['passportNumber'] =
          await this.getValidationMessage(
            IndividualDetailsValidation.PassportNumber.toString()
          );
        isValid = false;
      }
      if (
        this.applicant.passportNumber.trim() !== '' &&
        !this.isValidPassport(this.applicant.passportNumber.trim())
      ) {
        this.validationErrors['passportNumber'] =
          await this.getValidationMessage(
            IndividualDetailsValidation.PassportNumnotspecialcharacters.toString()
          );
        isValid = false;
      }

      if (!this.applicant.jurisdiction) {
        this.validationErrors['jurisdiction'] = await this.getValidationMessage(
          IndividualDetailsValidation.Jurisdiction.toString()
        );
        isValid = false;
      }
      if (dovalidate) {
        if (this.applicant.aiNumber) {
          let aiValidationResponse = await this.validateAiNumberwithFirms(
            this.applicant.dob || ''
          );

          if (!aiValidationResponse) {
            this.aiNumberError = await this.getValidationMessage(
              FirmsContactDetailPage.AI_ERRORR_MSG.toString()
            );
            isValid = false;
          }
        }
      }

      //check if visibile email
      if (this.showEmailField) {
        if (!this.validateEmail()) {
          this.validationErrors['email'] = await this.getValidationMessage(
            FirmsContactDetailPage.MainEmailId.toString()
          );
          isValid = false;
        }
      }
      //check trIsOrdinarilyResident

      if (this.showResidentQuestion) {
        if (this.applicant.isResident === null) {
          this.validationErrors['isResident'] = await this.getValidationMessage(
            '294'
          );
          isValid = false;
        }
      }

      //check selected function
      if (!this.isFunctionsSelected()) {
        this.validationErrors['controlledFunctions'] =
          await this.getValidationMessage(
            ControlledFunctionMessage.ControlledFunctionSelect.toString()
          );
        isValid = false;
      }

      //check duplicate application
      if (isValid === true) {
        if (await this.checkDuplicateApplication()) {
          this.validationErrors['duplicate'] = await this.getValidationMessage(
            '298'
          );
          isValid = false;
        }
      }
      if (!this.isDocumentSelected()) {
        this.validationErrors['docselected'] = await this.getValidationMessage(
          '295'
        );
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

  async saveApplicationData(): Promise<number> {
    let appID = 0;
    try {
      const individualDetails = IndividualDetailsDto.fromJS({
        applicationID: this.data.ApplicationID || undefined,
        qfcNumber: localStorage.getItem('qfc_no') || undefined,
        userID: this.data.userID || undefined,
        aiNumber: this.applicant.aiNumber || undefined,
        formTypeID: this.data.formTypeID?.toString() || undefined,
        familyName: this.applicant.familyName || undefined,
        otherNames: this.applicant.otherName || undefined,
        dateOfBirth: this.applicant.dob || undefined,
        wObjectSOStatusID: this.data.WObjectSOStatusID || undefined,
        passportnumber: this.applicant.passportNumber || undefined,
        placeOfBirthCity: this.applicant.placeOfBirth || undefined,
        jurisdiction: this.applicant.jurisdiction || undefined,
        emailAddress: this.applicant.email || undefined,
        isOrdinarilyResidentFlag: this.applicant.isResident || undefined,
      });

      const selectedFunctions: ControlledFunctionDto[] =
        this.getSelectedFunctions();

      const applicationData: ApplicationDataDto = new ApplicationDataDto({
        objIndividualDetails: individualDetails,
        lstControledFunctionIDs: selectedFunctions, // Now properly instantiated
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
    return appID;
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
