import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { AppConstants } from '../../../constants/app.constants';
import { FirmType, AccesRequestType } from '../../../enums/app.enums';
import { Client } from '../../../services/api-client'; 
import { LoadingService } from '../../../services/loader.service';
import { ToastrService } from 'ngx-toastr';

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
  contacts: string[] = []; // Options for the dropdown

  documentAdminForm = {
    name: '',
    jobTitle: '',
    dob: '',
    nationality: '',
    email: '',
    confirmEmail: '',
  };

  approvedIndividualForm = {
    name: '',
    controlledFunctions: '',
  };
  constructor(
    private client: Client,
    private loadingService : LoadingService,
    private toastr: ToastrService) {}
  ngOnInit(): void {
    this.firmType = this.firmTypeString != "" ? Number(this.firmTypeString) : 0;
    this.setLableasPerFirm();
    this.populateRequestAccessType();
    this.fillCountries();
    this.populateContacts();
  }

  openModal(): void {
    this.isOpen = true;
  }

  closeModal(): void {
    this.isOpen = false;
    this.resetForm();
    this.modalClosed.emit();
  }

  onAccessTypeChange(event: any): void {
    this.selectedAccessType = event.value;
  }

  private resetForm(): void {
    this.selectedAccessType = '';
    this.documentAdminForm = {
      name: '',
      jobTitle: '',
      dob: '',
      nationality: '',
      email: '',
      confirmEmail: '',
    };
    this.approvedIndividualForm = {
      name: '',
      controlledFunctions: '',
    };
  }

  isFormValid(): boolean {
    if (this.selectedAccessType === 'documentAdmin') {
      const { name, jobTitle, dob, nationality, email, confirmEmail } =
        this.documentAdminForm;
      return (
        name.trim() !== '' &&
        jobTitle.trim() !== '' &&
        dob.trim() !== '' &&
        nationality.trim() !== '' &&
        email.trim() !== '' &&
        confirmEmail.trim() !== '' &&
        email === confirmEmail
      );
    } else if (this.selectedAccessType === 'approvedIndividual') {
      const { name, controlledFunctions } = this.approvedIndividualForm;
      return name.trim() !== '' && controlledFunctions.trim() !== '';
    }
    return false;
  }

  onRequest(): void {
    if (this.isFormValid()) {
      console.log('Form submitted successfully!');
    }
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
    else{
      this.accessTypes = [ { value: Number(AccesRequestType.DocumentAdmin).toString(), text: AppConstants.Keywords.DOCUMENT_ADMIN },];
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
          this.contacts = Object.values(response.response);
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
          this.contacts = Object.values(response.response);
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