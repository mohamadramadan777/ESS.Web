import { Component, Inject, Input, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { WObjects, FirmsContactDetailPage } from '../../../../enums/app.enums';
import { AppConstants } from '../../../../constants/app.constants';
import { Client, AttachmentDto, ObjectSOTaskStatus } from '../../../../services/api-client';
import { LoadingService } from '../../../../services/loader.service';
import { MessagePropertyService } from '../../../../services/message-property.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { MatTabGroup } from '@angular/material/tabs';
import Swal from 'sweetalert2';
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
  DocSignText = "";
  aiNumberError: string = ""; // Error message for AI Number validation
  AI_ERROR_MESSAGE = "";
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
    { name: 'Non-Executive Governance Function', isSelected: false },
    { name: 'Executive Governance Function', isSelected: false },
    { name: 'Senior Executive Function', isSelected: false },
    { name: 'Senior Management Function', isSelected: false },
    { name: 'Finance Function', isSelected: false },
    { name: 'Risk Management Function', isSelected: false },
    { name: 'Compliance Oversight Function', isSelected: false },
    { name: 'MLRO Function', isSelected: false },
    { name: 'Internal Audit Function', isSelected: false },
    { name: 'Actuarial Function', isSelected: false },
  ];


  jurisdictions = ['Jurisdiction 1', 'Jurisdiction 2', 'Jurisdiction 3'];

  showEmailField = false;
  showResidentQuestion = false;

  constructor(
    private client: Client,
    private loadingService: LoadingService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<ApprovalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private messagePropertyService: MessagePropertyService
  ) { }

  ngOnInit(): void {
    this.setDocDescriptionTextForAttachments();
    this.loadMessageProperties();
  }

  loadMessageProperties(): void {
    this.messagePropertyService.getMessageProperty(FirmsContactDetailPage.AI_ERRORR_MSG.toString()).subscribe((message) => {
      this.AI_ERROR_MESSAGE = message;
    });
  }
  // AI Number Validation
  validateAiNumber(): void {
    let aiNumber = this.applicant.aiNumber.trim();
    this.aiNumberError = "";

    if (aiNumber !== "") {
      if (aiNumber.length > 8) {
        this.aiNumberError = this.AI_ERROR_MESSAGE;
        return;
      }

      if (aiNumber.startsWith("AI")) {
        aiNumber = aiNumber.substring(2).trim();
      }

      const num = parseInt(aiNumber, 10);

      if (isNaN(num) || num <= 0) {
        this.aiNumberError = this.AI_ERROR_MESSAGE;
        return;
      }

      // Ensure the number is 5 digits long (padded with zeros)
      this.applicant.aiNumber = "AI " + num.toString().padStart(5, "0");
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
    this.client.getDocSignatories(this.data.DocTypeId, "", Number(WObjects.GeneralSubmission)).subscribe({
      next: (response) => {
        if (response && response.isSuccess && response.response) {
          const objDocSignatories = response.response;
          this.DocSignText = objDocSignatories.docSignText ?? "";
        } else {
          this.toastr.error('Failed to load Doc Signatories.', 'Error');
          console.error('Failed to load Doc Signatories:', response?.errorMessage);
        }
      },
      error: (error) => {
        this.loadingService.hide();
        this.toastr.error('Error occurred while fetching Doc Signatories.', 'Error');
        console.error('Error occurred while fetching Doc Signatories:', error);
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
      })

      if (result.isConfirmed) {
        this.toastr.success('Changes saved successfully!', 'Success');
        this.dialogRef.close();
      }
    } else {
      this.dialogRef.close();
    }
  }
}
