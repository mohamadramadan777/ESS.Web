import { ColDef } from 'ag-grid-community';
import { Component, ViewChild } from '@angular/core';
import { AccessModalComponent } from './access-modal/access-modal.component';
import * as config from './system-access-config';
import Swal from 'sweetalert2';
import {
  TextFilterModule,
  ClientSideRowModelModule,
  NumberEditorModule,
  ValidationModule,
  TextEditorModule,
  themeQuartz,
  PaginationModule,
  NumberFilterModule,
  PaginationNumberFormatterParams,
  RowSelectionModule,
} from 'ag-grid-community';
import { Client, WAccessRequests } from '../../services/api-client';
import { LoadingService } from '../../services/loader.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-system-access',
  templateUrl: './system-access.component.html',
  styleUrls: ['./system-access.component.scss'],
})
export class SystemAccessComponent {
  public modules = [
    TextFilterModule,
    NumberEditorModule,
    TextEditorModule,
    ClientSideRowModelModule,
    ValidationModule,
    PaginationModule,
    NumberFilterModule,
    RowSelectionModule,
  ];
  @ViewChild('accessModal') accessModal!: AccessModalComponent;
  paginationPageSize = config.paginationPageSize;
  theme = config.theme;
  paginationPageSizeSelector = config.paginationPageSizeSelector;
  paginationNumberFormatter = (params: PaginationNumberFormatterParams) => {
    return '[' + params.value.toLocaleString() + ']';
  };
  openAccessModal(): void {
    document.body.classList.add('modal-open');
    this.accessModal.openModal();
  }

  onModalClosed(): void {
    document.body.classList.remove('modal-open');
  }

  individualsColDef: ColDef[] = config.individualsColDef
  systemAccountColDef: ColDef[] = config.systemAccountColDef
  constructor(
    private client: Client,
    private loadingService: LoadingService,
    private toastr: ToastrService) { }
  ngOnInit(): void {
    this.loadIndividials();
    this.loadSystemAccounts();
  }
  individuals: WAccessRequests[] = [];
  systemAccounts: WAccessRequests[] = [];
  individualsLoaded: boolean = false;
  systemAccountsLoaded: boolean = false;

  defaultColDef = {
    flex: 1,
    minWidth: 150,
    resizable: true,
  };



  loadIndividials(): void {
    // Set year to 0 as the filtering will be handled in the front-end
    const year = 0;
    this.loadingService.show();
    // Call the API method
    this.client.getIndividualList().subscribe({
      next: (response) => {
        this.individualsLoaded = true;
        if (this.systemAccountsLoaded) {
          this.loadingService.hide();
        }
        if (response && response.isSuccess && response.response) {
          this.individuals = response.response;
        } else {
          this.toastr.error('Failed to load individuals.', 'Error');
          console.error('Failed to load individuals:', response?.errorMessage);
        }
      },
      error: (error) => {
        this.individualsLoaded = true;
        if (this.systemAccountsLoaded) {
          this.loadingService.hide();
        }
        this.toastr.error('Error occurred while fetching individuals.', 'Error');
        console.error('Error occurred while fetching individuals:', error);
      },
    });
  }

  loadSystemAccounts(): void {
    // Set year to 0 as the filtering will be handled in the front-end
    const year = 0;
    this.loadingService.show();
    // Call the API method
    this.client.getSystemAccounts().subscribe({
      next: (response) => {
        this.systemAccountsLoaded = true;
        if (this.individualsLoaded) {
          this.loadingService.hide();
        }
        if (response && response.isSuccess && response.response) {
          this.systemAccounts = response.response;
        } else {
          this.toastr.error('Failed to load individuals.', 'Error');
          console.error('Failed to load individuals:', response?.errorMessage);
        }
      },
      error: (error) => {
        this.systemAccountsLoaded = true;
        if (this.individualsLoaded) {
          this.loadingService.hide();
        }
        this.toastr.error('Error occurred while fetching individuals.', 'Error');
        console.error('Error occurred while fetching individuals:', error);
      },
    });
  }

  onCellClicked(event: any) {
    const { colDef, event: mouseEvent, data } = event;
    if (colDef.field === 'isSEF') {
      const target = mouseEvent.target as HTMLElement;
      if (target.closest('.btn-revoke')) {
        // Determine the message based on the isRegistered field
        const message = data.isRegistered
          ? `Are you sure you want to revoke access for ${data.individualName}?<br> <span style="color: red;">	Revoking access for an individual will de-activate the user's account from the system.</span>`
          : `${data.individualName} has not yet completed the user registration process. 
          <br> Clicking on <b>Yes</b> will <span style="color: red;">remove his/her access authorisation </span>.
          <br> Clicking on <b>No</b> will permit him/her to complete the registration process and access the system.`;

        // Display confirmation dialog
        Swal.fire({
          // title: 'Confirm Revoke Access',
          html: message,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#a51e36',
          cancelButtonColor: '#555555',
          confirmButtonText: 'Yes, revoke access',
          cancelButtonText: 'No, cancel',
        }).then((result) => {
          if (result.isConfirmed) {
            // Handle the revoke action here
            console.log(`Access revoked for ${data.individualName}`);
            // Optionally, show a success message
            Swal.fire(
              'Revoked!',
              `Access has been revoked for ${data.individualName}.`,
              'success'
            );
          }
        });
      } else if (target.closest('.btn-info')) {
        // Display information alert
        Swal.fire({
          // title: 'Access Information',
          title: 'Access cannot be revoked for an individual currently performing the Senior Executive Function.',
          icon: 'info',
          confirmButtonColor: '#a51e36',
          confirmButtonText: 'OK',
        });
      }
    }
  }
}

//TODO: Check applyAppSecurity in Administration.aspx.cs line 84