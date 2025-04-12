import { Component, Inject, Input, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { WObjects, FunctionStatusType, IndividualDetailsValidation } from '../../../../enums/app.enums';
import { AppConstants } from '../../../../constants/app.constants';
import {
  Client,
  AttachmentDto,
  ObjectSOTaskStatus,
  IndividualDetails,
  ControledFunction,
  IndividualDetailsDto,
} from '../../../../services/api-client';
import { LoadingService } from '../../../../services/loader.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { MatTabGroup } from '@angular/material/tabs';

import Swal from 'sweetalert2';
import { FileUploaderComponent } from '../../../file-uploader/file-uploader.component';
import { lastValueFrom } from 'rxjs/internal/lastValueFrom';

@Component({
  selector: 'app-withdrawal',
  templateUrl: './withdrawal.component.html',
  styleUrls: ['./withdrawal.component.scss'],
})
export class WithdrawalComponent {
  AttObjectID = WObjects.IndividualApplications;
  public WithdrawalID: any = 0; // Default value to prevent null errors
  public DocSignText!: string;
  public Comments: string = '';
  validationErrors: { [key: string]: string } = {};

  @ViewChild(MatTabGroup, { static: true }) tabGroup!: MatTabGroup;
  @ViewChild(FileUploaderComponent) fileUploader!: FileUploaderComponent;
  @Input() ReadOnly: boolean = false;
  unsavedChanges: boolean = false; // Track unsaved changes
  FunctionStatusType = FunctionStatusType;
  ApplicationID = 0;
  ApplicationStatus = 0;
  familyName = "";
  otherName = "";
  AppConstants = AppConstants;

  // Arrays for dropdown and controlled functions
  applicantNames: IndividualDetails[] = [];
  controlledFunctions: ControledFunction[] | undefined = [];
  selectedApplicant: any = null;

  // Placeholder for the selected AI Number
  aiNumber: string = '';

  constructor(
    private client: Client,
    private loadingService: LoadingService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<WithdrawalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.setDocDescriptionTextForAttachments();
    this.WithdrawalID = this.data?.InstanceID ?? 0;
    this.DocSignText = this.data?.DocSignText || 'Default Signature Text';
    this.loadApplicants();
    // TODO: applySecurityOnceApplicationSubmitted();
  }

  // Load applicants via API
  loadApplicants(): void {
    this.loadingService.show();
    this.client.loadApplicantName(this.ApplicationID).subscribe({
      next: (response) => {
        this.loadingService.hide();
        // Check if response and response.response both exist
        if (response && response?.isSuccess && response?.response) {
          this.applicantNames = response.response;
        } else {
          this.toastr.error('Failed to load Applicants list.', 'Error');
          console.error('Failed to load Applicants:', response?.errorMessage);
        }
      },
      error: (err) => {
        this.loadingService.hide();
        // Handle any errors from the API call
        this.toastr.error(
          'An error occurred while fetching Applicants.',
          'Error'
        );
        console.error('Error fetching Applicants:', err);
      },
    });
  }

  // Fetch controlled functions and AI Number when applicant is selected
  onApplicantChange(): void {
    if (this.selectedApplicant) {
      this.aiNumber = this.selectedApplicant.aiNumber;
      this.loadControlledFunctions(this.selectedApplicant.id);
    }
  }

  // Load controlled functions based on the selected applicant
  loadControlledFunctions(applicantId: number): void {
    this.loadingService.show();
    this.client.loadControlledFunction(this.ApplicationID, this.aiNumber, this.ApplicationStatus).subscribe({
      next: (response) => {
        this.loadingService.hide();
        // Check if response and response.response both exist
        if (response && response?.isSuccess && response?.response) {
          this.controlledFunctions = response.response.controledFunctions;
          this.familyName = response.response.familyName ?? "";
          this.otherName = response.response.otherName ?? "";
        } else {
          this.toastr.error('Failed to load Controlled Functions.', 'Error');
          console.error('Failed to load Controlled Functions:', response?.errorMessage);
        }
      },
      error: (err) => {
        this.loadingService.hide();
        // Handle any errors from the API call
        this.toastr.error(
          'An error occurred while fetching Controlled Functions.',
          'Error'
        );
        console.error('Error fetching Controlled Functions:', err);
      },
    });
  }

  // Save functionality
  async onSave(): Promise<void> {
    const isValid = await this.validateForm(1);
    if (!isValid) {
      this.toastr.error('Please fix validation errors before saving.');
      return;
    }
    let appID = 0;
    try {
      appID = await this.saveApplicationData(); // Use await to get the resolved value
    } catch (error) {
      console.error('Error while saving application data', error);
    }

    if (appID > 0) {
      this.ApplicationID = appID;
      this.toastr.success('Application saved successfully!', 'Success');
      this.unsavedChanges = false; // Reset unsaved changes flag
    } else {
      this.validationErrors['savemessage'] = await this.getValidationMessage(
        IndividualDetailsValidation.REQUIREDFIELD_VALDATION.toString()
      );
    }
  }

  async saveApplicationData(): Promise<number> {
    let appID = 0;
    try {
      const individualDetails = IndividualDetailsDto.fromJS({
        applicationID: this.ApplicationID ?? this.data.ApplicationID ?? 0,
        userID: localStorage.getItem('w_userid') || 0,
        qfcNumber: localStorage.getItem('qfc_no') || undefined,
        aiNumber: this.aiNumber || undefined,
        formTypeID: this.data.WIndFromTypeID?.toString() || undefined,
        familyName: this.familyName || undefined,
        otherNames: this.otherName || undefined,
        wObjectSOStatusID: this.data.WObjectSOStatusID || undefined,
      });

      // const selectedFunctions: ControlledFunctionDto[] =
      //   this.getSelectedFunctions();

      // const applicationData: ApplicationDataDto = new ApplicationDataDto({
      //   objIndividualDetails: individualDetails,
      //   lstControledFunctionIDs: selectedFunctions, // Now properly instantiated
      // });

      // console.log('Submitting application data:', applicationData);
      // this.loadingService.show();
      // const response = await lastValueFrom(
      //   this.client.insertUpdateApplicationData(applicationData)
      // );
      // this.loadingService.hide();
      // if (response && response.response) {
      //   console.log('Application saved successfully:', response);
      //   appID = response.response;
      //   this.ApplicationID = appID;
      // } else {
      //   console.error('Application saving failed', response);
      //   this.toastr.error('Failed to save application. Please try again.');
      // }
    } catch (error) {
      console.error('Error saving application:', error);
      this.toastr.error('An error occurred while saving the application.');
    }
    return appID;
  }

  // Save and close functionality
  onSaveAndClose(): void {
    this.onSave();
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
  onSubmit(): void {
    console.log('Submit clicked');
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


  onWithdrawChange(index: number): void {
    // this.controlledFunctions?[index].isWithdrawn =
    //   !this.controlledFunctions[index].isWithdrawn;
  }

  onObjectInstanceIDChange(event: any) {
    this.WithdrawalID = event;
  }

  beforeFileUploaded() {
    try {
      this.fileUploader.proceedToUploadAfterSave();
    } catch (error) {
      console.error('Error while submitting application data', error);
    }
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

  async validateForm(flag: number): Promise<boolean> {
    this.validationErrors = {}; //reset the errors
    let isValid = true;
    if (!this.selectedApplicant) {
      this.validationErrors['applicantName'] = await this.getValidationMessage(
        '296'
      );
      isValid = false;
    }
    if (flag === 2) {
      if (isValid === true) {
        if (await this.checkDuplicateApplication()) {
          this.validationErrors['duplicate'] = await this.getValidationMessage(
            '298'
          );
          isValid = false;
        }
      }
    }

    return isValid;
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


  async checkDuplicateApplication(): Promise<boolean> {
    try {
      // Ensure values are properly set before calling the API
      const qfcNumber = localStorage.getItem('qfc_no') || '';
      const aiNumber = this.aiNumber || '';
      const formTypeID = this.data.WIndFromTypeID?.toString() || undefined;
      const windApplicationID = this.ApplicationID ?? this.data.ApplicationID ?? 0;

      // Get selected controlled function IDs
      const lstFunctions: number[] = []

      // Call the API
      //TODO: Fix this call
      this.loadingService.show();
      const response = await lastValueFrom(
        this.client.isDuplicateApplication(
          qfcNumber,
          aiNumber,
          formTypeID,
          lstFunctions,
          windApplicationID
        )
      );
      this.loadingService.hide();
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

}
