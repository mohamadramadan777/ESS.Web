import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { AppConstants } from '../../../constants/app.constants';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirmType, AccesRequestType, FunctionStatusType } from '../../../enums/app.enums';
import { ApplicationDetail, Client, ControledFunction, SubmitAccessRequest } from '../../../services/api-client';
import { LoadingService } from '../../../services/loader.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { SweetAlertIcon } from 'sweetalert2';

@Component({
  selector: 'app-access-modal',
  templateUrl: './access-modal.component.html',
  styleUrls: ['./access-modal.component.scss'],
})
export class AccessModalComponent implements OnInit {
  @Output() modalClosed = new EventEmitter<void>();
  isOpen = false;
  selectedAccessType: string = '';
  lblAIorRI: string = '';
  lblCFsLable: string = '';
  firmTypeString: string = localStorage.getItem(AppConstants.Session.SESSION_FIRM_TYPE) ?? '';
  firmType = 0;
  accessTypes: { value: string; text: string }[] = [];
  countries: string[] = []; // Options for the dropdown
  functionTypeIDs: string = "";
  AINumber: string = "";
  approvedIndividualName: string = "";
  ContactID = 0;
  contacts: {
    [key: string]: string;
  } = {};  // Options for the dropdown

  documentAdminForm!: FormGroup;
  approvedIndividualForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private client: Client,
    private loadingService: LoadingService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.firmType = this.firmTypeString != "" ? Number(this.firmTypeString) : 0;
    this.setLableasPerFirm();
    this.populateRequestAccessType();
    this.fillCountries();
    this.populateContacts();

    this.documentAdminForm = this.fb.group({
      name: ['', Validators.required],
      jobTitle: ['', Validators.required],
      dob: ['', Validators.required],
      nationality: ['', Validators.required],
      emailAddress: ['', [Validators.required, Validators.email]],
      confirmEmail: ['', Validators.required],
    });

    this.approvedIndividualForm = this.fb.group({
      contactsDDL: ['', Validators.required],
      cfLabel: [{ value: '', disabled: true }],
      email: [{ value: '', disabled: true }],
      jobTitle: [''],
      dob: [{ value: '', disabled: true }],
      nationality: [{ value: '', disabled: true }],
    });
  }

  openModal(): void {
    this.isOpen = true;
  }

  closeModal(): void {
    this.isOpen = false;
    this.resetForms();
    this.modalClosed.emit();
  }

  onAccessTypeChange(event: any): void {
    this.selectedAccessType = event.value;
  }

  onContactChange(event: any): void {
    this.functionTypeIDs = "";
    this.AINumber = "";
    const selectedValue = event.value;
    this.loadingService.show();
    this.client.getAis("").subscribe({
      next: (response) => {
        this.loadingService.hide();
        if (response && response.response) {
          const AIApp: ApplicationDetail | undefined = response.response.find(a => a.objIndividualDetails?.aiNumber === selectedValue);
          this.approvedIndividualName = AIApp?.objIndividualDetails?.fullName ?? "";
          let singleFuncID: string = "";
          let singleFuncDesc: string = "";
          let functionTypeDesc: string = "";
          this.ContactID = AIApp?.objFirmContactDetails?.contactID ?? 0;
          AIApp?.lstControledFunction?.forEach((CF: ControledFunction) => {
            if (
              CF.functionStatusID === FunctionStatusType.Approved ||
              CF.functionStatusID === FunctionStatusType.ConditionallyApproved ||
              CF.functionStatusID === FunctionStatusType.APPROVED_INACTIVE ||
              CF.functionStatusID === FunctionStatusType.APPROVED_FIRM_INLIQUIDATION
            ) {
              singleFuncID = CF.functionTypeID?.toString() ?? "";
              singleFuncDesc = CF.functionTypeDesc ?? "";

              if (!this.functionTypeIDs.includes(singleFuncID ?? ""))
                this.functionTypeIDs += singleFuncID + ",";
              if (!functionTypeDesc.includes(singleFuncDesc ?? ""))
                functionTypeDesc += singleFuncDesc + ",";
            }
          });

          if (this.functionTypeIDs.length > 0) {
            this.functionTypeIDs = this.functionTypeIDs.slice(0, -1);
            this.AINumber = AIApp?.objIndividualDetails?.aiNumber ?? "";
          }


          this.approvedIndividualForm.patchValue({
            email: AIApp?.objIndividualDetails?.businessEmail, // Fill email
            jobTitle: AIApp?.currentJobTitle, // Fill controlled functions
            dob: AIApp?.objIndividualDetails?.dateOfBirth, // Fill controlled functions
            nationality: AIApp?.objIndividualDetails?.nationality, // Fill controlled functions
            cfLabel: functionTypeDesc.slice(0, -1), // Fill controlled functions
          });
          // Assuming response.response is a key-value dictionary
        } else {
          console.error('Error onContactChange.');
        }
      },
      error: (error) => {
        this.loadingService.hide();
        console.error('Failed: onContactChange.', error);
      }
    });

  }

  resetForms(): void {
    this.selectedAccessType = '';
    this.documentAdminForm.reset();
    this.approvedIndividualForm.reset();
  }

  onRequest(): void {
    const requestDto: SubmitAccessRequest = new SubmitAccessRequest();
    if (this.selectedAccessType === '19' && this.documentAdminForm.valid) {
      requestDto.individualName = this.documentAdminForm.controls['name'].value;
      requestDto.nationality = this.documentAdminForm.controls['nationality'].value;
      requestDto.jobTitle = this.documentAdminForm.controls['jobTitle'].value;
      requestDto.dob = this.documentAdminForm.controls['dob'].value;
      requestDto.selectedAccessValue = this.selectedAccessType;
      requestDto.aiNumber = "";
      requestDto.email = this.documentAdminForm.controls['emailAddress'].value;
    } else if (this.selectedAccessType != '19' && this.approvedIndividualForm.valid) {
      requestDto.individualName = this.approvedIndividualName;
      requestDto.nationality = this.approvedIndividualForm.controls['nationality'].value;
      requestDto.jobTitle = this.approvedIndividualForm.controls['jobTitle'].value;
      requestDto.dob = this.approvedIndividualForm.controls['dob'].value;
      requestDto.selectedAccessValue = this.selectedAccessType;
      requestDto.aiNumber = this.AINumber;
      requestDto.wFunctionTypeIDsList = this.functionTypeIDs;
      requestDto.email = this.approvedIndividualForm.controls['email'].value;
    }
    this.loadingService.show();
    this.client.submitAccessRequest(requestDto).subscribe({
      next: (response) => {
        this.loadingService.hide();
        if (response && response.response?.message != "") {
          Swal.fire(
            'Submit Request',
            response.response?.message,
            response.response?.type as SweetAlertIcon ?? "warning"
          );
          this.closeModal();
        } else {
          console.error('Empty Submit Response.');
          this.toastr.error('An error occured while sumbitting the request. Please try again.', 'Error');
        }
      },
      error: (error) => {
        this.loadingService.hide();
        console.error('Failed to fetch Countries:', error);
        this.toastr.error('Failed to submit the request. Please try again.', 'Error');
      }
    });
  }

  private populateRequestAccessType(): void {
    if (this.firmType == FirmType.Authorized) {
      this.accessTypes = [
        { value: Number(AccesRequestType.DocumentAdmin).toString(), text: AppConstants.Keywords.DOCUMENT_ADMIN },
        { value: Number(AccesRequestType.ApprovedIndividual).toString(), text: AppConstants.Keywords.APPROVED_INDIVIDUAL },
      ];
    } else if (this.firmType == FirmType.DNFBP) {
      this.accessTypes = [
        { value: Number(AccesRequestType.DocumentAdmin).toString(), text: AppConstants.Keywords.DOCUMENT_ADMIN },
        { value: Number(AccesRequestType.RequiredIndividual).toString(), text: AppConstants.Keywords.REGISTERED_INDIVIDUAL },
      ];
    }
    else {
      this.accessTypes = [{ value: Number(AccesRequestType.DocumentAdmin).toString(), text: AppConstants.Keywords.DOCUMENT_ADMIN },];
    }
  }

  fillCountries(): void {
    this.client.getMastertableData("Countries").subscribe({
      next: (response) => {
        if (response && response.response) {
          // Assuming response.response is a key-value dictionary
          this.countries = Object.values(response.response);
        } else {
          console.error('No data received for Countries.');
          this.toastr.error('No data received for Countries. Please try again.', 'Error');
        }
      },
      error: (error) => {
        console.error('Failed to fetch Countries:', error);
        this.toastr.error('Failed to fetch Countries. Please try again.', 'Error');
      }
    });
  }

  fillContacts(): void {
    this.client.loadContacts().subscribe({
      next: (response) => {
        if (response && response.response) {
          // Assuming response.response is a key-value dictionary
          this.contacts = response.response;
        } else {
          console.error('No data received for Contacts.');
          this.toastr.error('No data received for Contacts. Please try again.', 'Error');
        }
      },
      error: (error) => {
        console.error('Failed to fetch Contacts:', error);
        this.toastr.error('Failed to fetch Contacts. Please try again.', 'Error');
      }
    });
  }

  fillRequiredIndividuals(): void {
    this.client.loadRequiredIndividuals().subscribe({
      next: (response) => {
        if (response && response.response) {
          // Assuming response.response is a key-value dictionary
          this.contacts = response.response;
        } else {
          console.error('No data received for Contacts.');
          this.toastr.error('No data received for Contacts. Please try again.', 'Error');
        }
      },
      error: (error) => {
        console.error('Failed to fetch Contacts:', error);
        this.toastr.error('Failed to fetch Contacts. Please try again.', 'Error');
      }
    });
  }
  populateContacts(): void {
    if (this.firmType == FirmType.Authorized) {
      this.fillContacts();
    } else if (this.firmType == FirmType.DNFBP) {
      this.fillRequiredIndividuals();
    }
  }

  setLableasPerFirm(): void {
    if (this.firmType == FirmType.Authorized) {
      this.lblAIorRI = AppConstants.Keywords.SELECT_AN_APPROVED_INDIVIDUAL;
      this.lblCFsLable = AppConstants.Keywords.APPROVED_CONTROLLED_FUNCTIONS;
    } else if (this.firmType == FirmType.DNFBP) {
      this.lblAIorRI = AppConstants.Keywords.SELECT_A_REGISTERED_INDIVIDUAL;
      this.lblCFsLable = AppConstants.Keywords.REQUIRED_FUNCTIONS_ASSIGNED;
    }
  }
}


// TODO: Captcha validation
// TODO: applyAppSecurity(WObjects.Administration, this.Page);