import { Component, Inject, Input, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { WObjects } from '../../../../enums/app.enums';
import { AppConstants } from '../../../../constants/app.constants';
import {
  Client,
  AttachmentDto,
  ObjectSOTaskStatus,
} from '../../../../services/api-client';
import { LoadingService } from '../../../../services/loader.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { MatTabGroup } from '@angular/material/tabs';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-withdrawal',
  templateUrl: './withdrawal.component.html',
  styleUrls: ['./withdrawal.component.scss'],
})
export class WithdrawalComponent {
  public WithdrawalObjectID: any = 0; // Default value to prevent null errors
  public WithdrawalID: any = 0; // Default value to prevent null errors
  public DocSignText!: string;
  public Comments: string = '';

  @ViewChild(MatTabGroup, { static: true }) tabGroup!: MatTabGroup;
  @Input() ReadOnly: boolean = false;
  unsavedChanges: boolean = false; // Track unsaved changes

  AppConstants = AppConstants;

  // Arrays for dropdown and controlled functions
  applicantNames: { id: number; name: string; aiNumber: string }[] = [];
  controlledFunctions: {
    name: string;
    approvedDate: string;
    isWithdrawn: boolean;
  }[] = [];
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
  ) {}

  ngOnInit(): void {
    this.WithdrawalObjectID = this.data?.ObjectID ?? 0;
    this.WithdrawalID = this.data?.InstanceID ?? 0;
    this.DocSignText = this.data?.DocSignText || 'Default Signature Text';
  }

  // Load applicants via API
  loadApplicants(): void {
    // TODO: Replace with API call to fetch applicants
    this.applicantNames = [
      { id: 1, name: 'Cecelia Cecila Carter', aiNumber: 'AI00969' },
      { id: 2, name: 'John Doe', aiNumber: 'AI00888' },
      { id: 3, name: 'Jane Smith', aiNumber: 'AI00777' },
    ];
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
    // Generate different options based on applicantId % 3
    switch (applicantId % 3) {
      case 0:
        this.controlledFunctions = [
          {
            name: 'Non-Executive Governance Function',
            approvedDate: '03/Oct/2021',
            isWithdrawn: false,
          },
        ];
        break;
      case 1:
        this.controlledFunctions = [
          {
            name: 'Operational Function',
            approvedDate: '20/Aug/2021',
            isWithdrawn: false,
          },
          {
            name: 'Risk Management Function',
            approvedDate: '12/Jan/2022',
            isWithdrawn: false,
          },
        ];
        break;
      case 2:
        this.controlledFunctions = [
          {
            name: 'Compliance Function',
            approvedDate: '05/Jun/2021',
            isWithdrawn: false,
          },
          {
            name: 'Internal Audit Function',
            approvedDate: '10/Nov/2021',
            isWithdrawn: false,
          },
          {
            name: 'IT Governance Function',
            approvedDate: '22/Mar/2022',
            isWithdrawn: false,
          },
        ];
        break;
      default:
        this.controlledFunctions = []; // Default to an empty array if no match
        break;
    }
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
    this.controlledFunctions[index].isWithdrawn =
      !this.controlledFunctions[index].isWithdrawn;
  }

  onObjectInstanceIDChange(event: any) {
    this.WithdrawalID = event;
  }
  onNotesChange(): void {
    console.log('Notes changed:', this.Comments);
  }
}
