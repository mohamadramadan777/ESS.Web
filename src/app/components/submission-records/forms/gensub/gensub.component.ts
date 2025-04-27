import { AfterViewInit, Component, Inject, Input, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TermSubject, WObjects, GenSubMessage, SignOffMethodType, ObjectStatus } from '../../../../enums/app.enums';
import { AppConstants } from '../../../../constants/app.constants';
import { Client, AttachmentDto, ObjectSOTaskStatus, DocSignatories, GeneralSubmissionDto } from '../../../../services/api-client';
import { LoadingService } from '../../../../services/loader.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { MatTabGroup } from '@angular/material/tabs';
import Swal, { SweetAlertIcon } from 'sweetalert2';
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
  SubmitVisible = true;
  DocSignText = "";
  GenSubObjectID = WObjects.GeneralSubmission;
  GenSubID = 0;
  Comments = "";
  showSignOffMessage = false;
  SignOffMessage = "";
  txtSignatoryName = "";
  txtDateSigned = "";
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
    this.GenSubID = this.data.applicationID ?? 0;
    if (this.GenSubID != 0) {
      this.GetAndBindGenSubDetails();
      this.GetAndBindFormSignatories();
    }
  }

  GetAndBindGenSubDetails(): void {
    this.client.getGenSubDetails(this.GenSubID).subscribe({
      next: (response) => {
        if (response && response.isSuccess && response.response) {
          const comments = response.response.comments ?? "";
          const qfcNum = response.response.qfcNumber ?? "";
          if (qfcNum != "" && comments != "")
            this.Comments = comments;
        } else {
          this.toastr.error('Failed to load General Submission.', 'Error');
          console.error('Failed to load General Submission:', response?.errorMessage);
        }
      },
      error: (error) => {
        this.loadingService.hide();
        this.toastr.error('Error occurred while fetching General Submission.', 'Error');
        console.error('Error occurred while fetching General Submission:', error);
      },
    });
  }

  GetAndBindFormSignatories(): void {
    this.client.getAndBindFormSignatories(this.GenSubID, this.txtDateSigned).subscribe({
      next: (response) => {
        if (response && response.isSuccess && response.response) {
          this.txtSignatoryName = response.response.txtSignatoryName ?? "";
          this.txtDateSigned = response.response.txtDateSigned ?? "";
          this.ReadOnly = response.response.isReadOnly ?? this.ReadOnly;
          if(response.response.btnSignOffVisible == true){
            this.SubmitLabel = "Sign Off"
          }
          this.SubmitVisible = ((response.response.btnSignOffVisible ?? false) || (response.response.btnSubmitVisible ?? false));
          this.showSignOffMessage = response.response.rwSignatureInfoVisible ?? false;
          this.SignOffMessage = (response.response.rwSignatureInfoVisible ?? false) ? response.response.lblSignatureInfoText + ": " + response.response.lblUsers : "";
        } else {
          this.toastr.error('Failed to load Signatories.', 'Error');
          console.error('Failed to load Signatories:', response?.errorMessage);
        }
      },
      error: (error) => {
        this.loadingService.hide();
        this.toastr.error('Error occurred while fetching Signatories.', 'Error');
        console.error('Error occurred while fetching Signatories:', error);
      },
    });
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
      // TODO: Sign off label

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
  onSubmitOld(): void {
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
              if (Number(localStorage.getItem(this.AppConstants.Session.SESSION_W_USERID)) == 2101) {
                this.openSignOffDialog();
              }
              else {
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
            if (this.XBRLDocType) {
              //TODO: Implement
            }
            else {
              if (!this.signOffRequired) {
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
      //TODO: rptEnddate in xbrl
      this.client.submitGenSub(this.GenSubID, this.data.DocTypeId, this.isXbrlType, this.fileUploader.EffectiveFromDate,
        this.fileUploader.EffectiveToDate, "", this.isSignOffRequired, ""
      ).subscribe({
        next: (response) => {
          this.loadingService.hide();
          if (response && response.isSuccess && response.response) {
            if (response.response.messageType == "error") {
              Swal.fire(
                'Warning!',
                response.response.message,
                'error'
              );
            }
            else if (response.response.btnSignOffVisible) {
              this.openSignOffDialog();
              this.GetAndBindFormSignatories();
            }
            else if (response.response.messageType == "success") {
              this.toastr.success(response.response.message, 'Success');
              this.dialogRef.close();
            }
          } else {
            this.toastr.error('Failed to submit general submission.', 'Error');
            console.error('Failed to submit general submission:', response?.errorMessage);
          }
        },
        error: (error) => {
          this.loadingService.hide();
          this.toastr.error('Error occurred while submitting general submission.', 'Error');
          console.error('Error occurred while submitting general submission:', error);
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
        signOffMethod: () => this.signOff(),
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('Dialog closed with result:', result);
      // Handle any logic after dialog closes
    });
  }
  
  signOff() {
    this.loadingService.show();
    this.client.signOffGenSub(this.GenSubID, this.data.DocTypeId, this.isSignOffRequired).subscribe({
      next: (response) => {
        this.loadingService.hide();
        if (response && response.isSuccess) {
          Swal.fire(
            'Sign Off',
            response.response?.message,
            response.response?.type as SweetAlertIcon ?? "warning"
          );
          this.GetAndBindFormSignatories();
        } else {
          this.toastr.error('Failed to sign off submission.', 'Error');
          console.error('Failed to sign off submission:', response?.errorMessage);
        }
      },
      error: (error) => {
        this.loadingService.hide();
        this.toastr.error('Error occurred while signing submission.', 'Error');
        console.error('Error occurred while signing submission:', error);
      },
    });
  }

  beforeFileUploaded() {
    try {
      this.fileUploader.proceedToUploadAfterSave();
    } catch (error) {
      console.error('Error while submitting application data', error);
    }
  }
}
