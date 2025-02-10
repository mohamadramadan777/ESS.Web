import { AfterViewInit, Component, Inject, Input, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TermSubject, WObjects, GenSubMessage, SignOffMethodType, ObjectStatus } from '../../../../enums/app.enums';
import { AppConstants } from '../../../../constants/app.constants';
import { Client, AttachmentDto, ObjectSOTaskStatus, DocSignatories, GeneralSubmissionDto } from '../../../../services/api-client';
import { LoadingService } from '../../../../services/loader.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { MatTabGroup } from '@angular/material/tabs';
import Swal from 'sweetalert2';
import { FileUploaderComponent } from '../../../file-uploader/file-uploader.component';
import { MessagePropertyService } from '../../../../services/message-property.service';
import { SignOffGenericComponent } from '../../../sign-off-generic/sign-off-generic.component';

@Component({
  selector: 'app-gensub',
  templateUrl: './gensub.component.html',
  styleUrl: './gensub.component.scss'
})
export class GensubComponent implements AfterViewInit {
  @ViewChild(FileUploaderComponent) fileUploader!: FileUploaderComponent;

  ngAfterViewInit() {
    // Ensure ViewChild is initialized before accessing it
    if (this.fileUploader) {
      console.log('File Uploader Component Loaded');
    }
  }
  @ViewChild(MatTabGroup, { static: true }) tabGroup!: MatTabGroup;
  @Input() ReadOnly: boolean = false;
  unsavedChanges: boolean = false; // Track unsaved changes
  primaryFileAttached = false;
  AppConstants = AppConstants;
  XBRLDocType = "xbrlDocType";
  // Arrays for dropdown and controlled functions
  applicantNames: { id: number; name: string; aiNumber: string }[] = [];
  controlledFunctions: { name: string; approvedDate: string; isWithdrawn: boolean }[] = [];
  selectedApplicant: any = null;
  wTermID = Number(TermSubject.UserSignOffSubject);
  // Placeholder for the selected AI Number
  aiNumber: string = '';
  isXbrlType: boolean = false
  isSignOffRequired: boolean = false
  GENSUBDOCSIGNATORIES = "docSignatories";
  SubmitLabel = "Submit";
  DocSignText = "";
  GenSubObjectID = WObjects.GeneralSubmission;
  GenSubID = 0;
  Comments = "";
  showSignOffMessage = false;
  SignOffMessage = "Any one of the following individual(s) can sign on this application: Myrtice Waelchi or Jacynthe Prosacco or Alvena Hackett or Gwen Smitham"
  constructor(
    private client: Client,
    private loadingService: LoadingService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<GensubComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private messagePropertyService: MessagePropertyService
  ) { }

  ngOnInit(): void {
    this.getXbrlDoctypes();
    if (this.data.DocTypeId != 0 && this.data.DocTypeId != undefined) {
      this.signOffRequired();
    }
    this.loadApplicants(); // Load applicants via API
  }

  getXbrlDoctypes(): void {
    // TODO: Replace with API call to fetch applicants
    this.client.getXbrlDocTypes(0).subscribe({
      next: (response) => {
        if (response && response.isSuccess && response.response) {
          sessionStorage.setItem(this.XBRLDocType, JSON.stringify(response.response)); // Store in sessionStorage
          if (response.response != undefined) {
            if (this.data.WIndFromTypeID != 0 && this.data.WIndFromTypeID != undefined)
              this.isXbrlType = this.getDocType(response.response);
          }
        } else {
          this.toastr.error('Failed to load Xbrl Doctypes.', 'Error');
          console.error('Failed to load Xbrl Doctypes:', response?.errorMessage);
        }
      },
      error: (error) => {
        this.loadingService.hide();
        this.toastr.error('Error occurred while fetching Xbrl Doctypes.', 'Error');
        console.error('Error occurred while fetching Xbrl Doctypes:', error);
      },
    });
  }

  getDocType(lstXbrlDocTypes: number[]): boolean {
    return lstXbrlDocTypes.some(docType => docType?.toString() === this.data.DocTypeId?.toString());
  }

  signOffRequired(): void {
    const objDocSignatoriesJson = sessionStorage.getItem(this.GENSUBDOCSIGNATORIES); // Check session storage
    if (objDocSignatoriesJson && false) {
      // const objDocSignatories = JSON.parse(objDocSignatoriesJson) as DocSignatories;
      // this.DocSignText = objDocSignatories.docSignText ?? "";
      // if(objDocSignatories != undefined && objDocSignatories?.numOfSigs == 0){
      //   this.isSignOffRequired = false;
      //   this.SubmitLabel = "Submit";
      // }
      // else{
      //   this.isSignOffRequired = true;
      // }
    }
    else {
      this.client.getDocSignatories(this.data.DocTypeId, "", Number(WObjects.GeneralSubmission)).subscribe({
        next: (response) => {
          if (response && response.isSuccess && response.response) {
            const objDocSignatories = response.response;
            this.DocSignText = objDocSignatories.docSignText ?? "";
            sessionStorage.setItem(this.GENSUBDOCSIGNATORIES, JSON.stringify(objDocSignatories)); // Store in sessionStorage
            if (objDocSignatories != undefined && objDocSignatories?.numOfSigs == 0) {
              this.isSignOffRequired = false;
              this.SubmitLabel = "Submit";
            }
            else {
              this.isSignOffRequired = true;
            }
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

  // Save functionality
  onSave(withClose: boolean = false): void {
    if (this.fileUploader.primaryFile) {
      const objGenSub: GeneralSubmissionDto = new GeneralSubmissionDto();
      if (this.GenSubID != 0) {
        objGenSub.genSubmissionID = this.GenSubID;
      }
      objGenSub.qfcNumber = localStorage.getItem(this.AppConstants.Session.SESSION_QFC_NO) ?? "";
      if (this.data.DocTypeId != 0 && this.data.DocTypeId != undefined) {
        objGenSub.docTypeID = this.data.DocTypeId;
        objGenSub.rptSOMethodTypeID = SignOffMethodType.ElectronicSigned;
      }
      objGenSub.comments = this.Comments;
      objGenSub.objectStatusTypeID = ObjectStatus.Pending;
      objGenSub.userCreated = Number(localStorage.getItem(this.AppConstants.Session.SESSION_W_USERID));
      this.loadingService.show();
      this.client.saveGenSubDetails(objGenSub).subscribe({
        next: (response) => {
          this.loadingService.hide();
          if (response && response.isSuccess && response.response) {
            this.GenSubID = response.response.genSubmissionID ?? 0;
            this.toastr.success('Changes saved successfully!', 'Success');
            if (withClose) {
              this.dialogRef.close();
            }
          } else {
            this.toastr.error('Failed to save general submission.', 'Error');
            console.error('Failed to save general submission:', response?.errorMessage);
          }
        },
        error: (error) => {
          this.loadingService.hide();
          this.toastr.error('Error occurred while saving general submission.', 'Error');
          console.error('Error occurred while saving general submission:', error);
        },
      });
    }
    else {
      this.messagePropertyService.getMessageProperty(GenSubMessage.PleaseAttachFormTypeDescForAdditionalDoc.toString()).subscribe((message) => {
        Swal.fire(
          'Warning!',
          message.replace(AppConstants.Keywords.EMAIL_FORM_TYPE_DESC, this.data.Form),
          'warning'
        );
      });
    }
  }

  // Save and close functionality
  onSaveAndClose(): void {
    this.onSave(true);
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
    if (this.fileUploader.primaryFile) {
      const objGenSub: GeneralSubmissionDto = new GeneralSubmissionDto();
      if (this.GenSubID != 0) {
        objGenSub.genSubmissionID = this.GenSubID;
      }
      objGenSub.qfcNumber = localStorage.getItem(this.AppConstants.Session.SESSION_QFC_NO) ?? "";
      if (this.data.DocTypeId != 0 && this.data.DocTypeId != undefined) {
        objGenSub.docTypeID = this.data.DocTypeId;
        objGenSub.rptSOMethodTypeID = SignOffMethodType.ElectronicSigned;
      }
      objGenSub.comments = this.Comments;
      objGenSub.objectStatusTypeID = ObjectStatus.Pending;
      objGenSub.userCreated = Number(localStorage.getItem(this.AppConstants.Session.SESSION_W_USERID));
      this.loadingService.show();
      this.client.saveGenSubDetails(objGenSub).subscribe({
        next: (response) => {
          this.loadingService.hide();
          if (response && response.isSuccess && response.response) {
            this.GenSubID = response.response.genSubmissionID ?? 0;
            this.toastr.success('Changes saved successfully!', 'Success');
            this.loadingService.show();
            setTimeout(() => {
              this.loadingService.hide();
              if(Number(localStorage.getItem(this.AppConstants.Session.SESSION_W_USERID)) == 2101){
                this.openSignOffDialog();
              }
              else{
                this.showSignOffMessage = true;
                this.navigateToTab(2);
              }
            }, 3000);
            //TODO:         bool isValidEffectiveDate = BasePage.checkDocTypeValidity(Convert.ToInt32(hdnDocTypeID.Value), effectiveFromDate, effectiveToDate, objectID, null, rptEndDate);
            // if (!isValidEffectiveDate)
            //   {
            //       BasePage basePage = new BasePage();
            //       basePage.ShowAlertMessageBox_Ajax(BALMessageSettings.GetMessageProperty((int)ReportSchedule.INVALID_EFFECTIVE_DATE), (int)ErrorType.Error);
                  
            //       mpeFileUpload.Hide();
            //       return;
            //   }
            if(this.XBRLDocType){
              //TODO: Implement
            }
            else{
              if(!this.signOffRequired){
                //success= submitGenSubDetailsSignOffNotRequired();
              }
            }
          } else {
            this.toastr.error('Failed to save general submission.', 'Error');
            console.error('Failed to save general submission:', response?.errorMessage);
          }
        },
        error: (error) => {
          this.loadingService.hide();
          this.toastr.error('Error occurred while saving general submission.', 'Error');
          console.error('Error occurred while saving general submission:', error);
        },
      });
    }
    else {
      this.messagePropertyService.getMessageProperty(GenSubMessage.PleaseAttachFormTypeDescForAdditionalDoc.toString()).subscribe((message) => {
        Swal.fire(
          'Warning!',
          message.replace(AppConstants.Keywords.EMAIL_FORM_TYPE_DESC, this.data.Form),
          'warning'
        );
      });
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
      })

      if (result.isConfirmed) {
        this.toastr.success('Changes saved successfully!', 'Success');
        this.dialogRef.close();
      }
    } else {
      this.dialogRef.close();
    }
  }
  onWithdrawChange(index: number): void {
    this.controlledFunctions[index].isWithdrawn = !this.controlledFunctions[index].isWithdrawn;
  }
  onNotesChange(): void {
    this.unsavedChanges = true;
  }
  // Update GenSubID when ObjectInstanceID changes
  onObjectInstanceIDChange(newID: number): void {
    this.GenSubID = newID;
    console.log('GenSubID updated:', this.GenSubID);
  }


openSignOffDialog(): void {
  const dialogRef = this.dialog.open(SignOffGenericComponent, {
    width: 'auto',
    height: 'auto',
    data: {
      TermID: this.wTermID, // Pass the TermID dynamically
      ShowAcceptTermsCheckBox: false, // Pass the ShowAcceptTermsCheckBox dynamically
    },
  });

  dialogRef.afterClosed().subscribe((result) => {
    console.log('Dialog closed with result:', result);
    // Handle any logic after dialog closes
  });
}
}
