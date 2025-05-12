import { Component, Inject, Input, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { WObjects, SignOffStatusType, FormType, TermSubject } from '../../../enums/app.enums';
import { AppConstants } from '../../../constants/app.constants';
import { Client, AttachmentDto, WNoticeQuestionnaireItemDto, ObjectSOTaskStatus, FirmNoticeDataDto, WFirmNoticesDto } from '../../../services/api-client';
import { LoadingService } from '../../../services/loader.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { HtmlViewerComponent } from '../../html-viewer/html-viewer.component';
import { MatTabGroup } from '@angular/material/tabs';
import Swal from 'sweetalert2';
import { FileUploaderComponent } from '../../file-uploader/file-uploader.component';
import { SignOffGenericComponent } from '../../sign-off-generic/sign-off-generic.component';

@Component({
  selector: 'app-view-notice',
  templateUrl: './view-notice.component.html',
  styleUrls: ['./view-notice.component.scss']
})
export class ViewNoticeComponent {
  @ViewChild(MatTabGroup, { static: true }) tabGroup!: MatTabGroup;
  @ViewChild(FileUploaderComponent) fileUploader!: FileUploaderComponent;
  @Input() ReadOnly: boolean = false;
  unsavedChanges: boolean = false; // Track unsaved changes
  constructor(
    private client: Client,
    private loadingService: LoadingService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<ViewNoticeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
  ) { }

  AppConstants = AppConstants;
  responseRequired: boolean = false;
  additionalAttachmentsLoaded: boolean = false;
  noticeCompleted: boolean = false;
  noticeQuestionsLoaded: boolean = false;
  notificationSentDate: string = "";
  wEmailNotificationText: string = "";
  signatoryName: string = "";
  dateSigned: string = "";
  wRespondentsControlledFunctionTypeIDs: string = "";
  wRespondentsDNFBPFunctionTypeIDs: string = "";
  wFirmNoticeID: number = 0;
  wNoticeID: number = 0;
  wRespondentTypeID: number = 0;
  additionalAttachments: AttachmentDto[] = [];
  noticeQuestions: WNoticeQuestionnaireItemDto[] = [];
  FirmNoticeResponseObjectID = WObjects.FirmNoticeResponse;
  NoticeResponseFormTypeID = FormType.NoticeResponse;
  hdnUserIDs = "";
  lblUsers = "";
  lblSignatureInfo = "";
  rwUsersVisible: boolean = false;
  rwSignatureInfoVisible: boolean = false;
  btnSignOffVisible: boolean = false;
  btnSubmitVisible: boolean = true;
  wTermID = TermSubject.UserSignOffSubject;
  onClose(): void {
    this.dialogRef.close();
  }
  ngOnInit(): void {
    this.dialogRef.backdropClick().subscribe(() => this.checkUnsavedChanges());
    this.dialogRef.beforeClosed().subscribe((result) => {
      if (this.unsavedChanges) {
        this.checkUnsavedChanges();
      }
    });
    this.ReadOnly = !this.data?.wResponseRequired || this.data?.wsosStatusTypeID == SignOffStatusType.Submitted;
    this.responseRequired = this.data.wResponseRequired;
    this.notificationSentDate = this.data.wNotificationSentDate;
    this.wFirmNoticeID = this.data.wFirmNoticeID;
    this.wNoticeID = this.data.wNoticeID;
    this.wEmailNotificationText = this.data.wEmailNotificationContent;
    this.wRespondentTypeID = this.data.wRespondentTypeID ?? 0;
    this.wRespondentsControlledFunctionTypeIDs = this.data.wRespondentsControlledFunctionTypeIDs;
    this.wRespondentsDNFBPFunctionTypeIDs = this.data.wRespondentsDNFBPFunctionTypeIDs;
    this.fillAdditionalAttachments();
    this.loadNoticeQuestions();
    this.getAndBindNoticeSignatories();
  }
  showLinkToNotice(): boolean {
    return this.data.wLinkToNotice != null && this.data.wLinkToNotice != "";
  }

  fillAdditionalAttachments(): void {
    this.client.getObjAttachments(undefined, Number(WObjects.FirmNotice), this.wNoticeID, 1, undefined).subscribe({
      next: (response) => {
        this.loadingService.hide();
        this.additionalAttachmentsLoaded = true;
        if (response && response.isSuccess && response.response) {
          this.additionalAttachments = response.response;
        } else {
          this.toastr.error('Failed to load additinal attachments.', 'Error');
          console.error('Failed to load additinal attachments:', response?.errorMessage);
        }
      },
      error: (error) => {
        this.loadingService.hide();
        this.additionalAttachmentsLoaded = true;
        this.toastr.error('Error occurred while fetching additinal attachments.', 'Error');
        console.error('Error occurred while fetching additinal attachments:', error);
      },
    });
  }

  loadNoticeQuestions(): void {
    this.client.getNoticeQuestionnaireItems(this.wNoticeID, this.wFirmNoticeID).subscribe({
      next: (response) => {
        this.noticeQuestionsLoaded = true;
        if (response && response.isSuccess && response.response) {
          this.noticeQuestions = response.response;
        } else {
          this.toastr.error('Failed to load additinal notice questions.', 'Error');
          console.error('Failed to load additinal notice questions:', response?.errorMessage);
        }
      },
      error: (error) => {
        this.loadingService.hide();
        this.noticeQuestionsLoaded = true;
        this.toastr.error('Error occurred while fetching additinal notice questions.', 'Error');
        console.error('Error occurred while fetching additinal notice questions:', error);
      },
    });
  }

  getAndBindNoticeSignatoriesOld(): void {
    if (this.wFirmNoticeID != 0) {
      this.client.getObjectSoTaskStatus(WObjects.FirmNoticeResponse, this.wFirmNoticeID, undefined).subscribe({
        next: (response) => {
          if (response && response.isSuccess && response.response) {
            if (response.response?.length > 0) {
              const bSingUserInfo: ObjectSOTaskStatus | undefined = response.response?.filter(c => c.soTaskCompletionDate && c.soTaskCompletionDate.trim() !== '').shift();
              if (bSingUserInfo && bSingUserInfo.soTaskAssignedTo != 0) {
                this.noticeCompleted = true;
                this.signatoryName = bSingUserInfo.individualName ?? '';
                this.dateSigned = bSingUserInfo.soTaskCompletionDate ?? '';
                this.rwSignatureInfoVisible = false;
                this.rwUsersVisible = false;
                this.btnSignOffVisible = false;
                this.ReadOnly = true;
                this.noticeCompleted = true;
              }
              else if (this.dateSigned != "") {
                const TEXT_SPACE_OR = " or ";
                const COMMA = ",";
                const _userID = Number(localStorage.getItem(this.AppConstants.Session.SESSION_W_USERID));

                const activeUsers = response.response?.filter(c => c.userActive)
                  .map(c => ({
                    SOTaskAssignedTo: c.soTaskAssignedTo as number,
                    IndividualName: c.individualName as string
                  }));

                const uniqueUsers = Array.from(
                  new Map(activeUsers?.map(u => [u.SOTaskAssignedTo + '|' + u.IndividualName?.trim(), u])).values()
                );

                this.lblUsers = uniqueUsers
                  .filter(u => u.IndividualName && u.IndividualName.trim() !== '')
                  .map(u => u.IndividualName.trim())
                  .join(TEXT_SPACE_OR);

                this.hdnUserIDs = COMMA + uniqueUsers.map(u => u.SOTaskAssignedTo).join(COMMA) + COMMA;
                const bCanLoggedInUserSign = response.response?.find(c => c.soTaskAssignedTo === _userID);
                this.btnSignOffVisible = false;


                this.noticeCompleted = false;
              }
            }

          } else {
            this.toastr.error('Failed to load signatories.', 'Error');
            console.error('Failed to load signatories:', response?.errorMessage);
          }
        },
        error: (error) => {
          this.loadingService.hide();
          this.noticeQuestionsLoaded = true;
          this.toastr.error('Error occurred while fetching signatories.', 'Error');
          console.error('Error occurred while signatories:', error);
        },
      });
    }
  }

  getAndBindNoticeSignatories(): void {
    if (this.wFirmNoticeID != 0) {
      this.client.getAndBindNoticeSignatories(this.wFirmNoticeID, this.dateSigned).subscribe({
        next: (response) => {
          if (response && response.isSuccess && response.response) {
            if (!response.response?.doNothing) {
              this.noticeCompleted = response.response?.noticeCompleted ?? false;
              this.lblSignatureInfo = response.response?.lblSignatureInfo ?? "";
              this.signatoryName = response.response?.txtSignatoryName ?? '';
              this.dateSigned = response.response?.txtDateSigned ?? '';
              this.rwSignatureInfoVisible = response.response?.rwSignatureInfoVisible ?? false;
              this.rwUsersVisible = response.response?.rwUsersVisible ?? false;
              this.btnSignOffVisible = response.response?.btnSignOffVisible ?? false;
              this.btnSubmitVisible = response.response?.btnSubmitVisible ?? false;
              this.ReadOnly = response.response?.readOnly ?? false;
              this.lblUsers = response.response?.lblUsers ?? "";
              this.hdnUserIDs = response.response?.hdnUserIDs ?? "";
            }

          } else {
            this.toastr.error('Failed to load signatories.', 'Error');
            console.error('Failed to load signatories:', response?.errorMessage);
          }
        },
        error: (error) => {
          this.loadingService.hide();
          this.noticeQuestionsLoaded = true;
          this.toastr.error('Error occurred while fetching signatories.', 'Error');
          console.error('Error occurred while signatories:', error);
        },
      });
    }
  }


  openHtmlViewer(): void {
    if (this.data.wEmailNotificationContent) {
      this.dialog.open(HtmlViewerComponent, {
        width: '60%',
        height: '60%',
        data: { htmlContent: this.data.wEmailNotificationContent, title: 'Email Notification' },
      });
    } else {
      console.error('wEmailNotificationContent is empty or undefined');
    }
  }

  onTabChange(index: number): void {
    setTimeout(() => {
      const temp = [...this.noticeQuestions]; // Create a new reference
      this.noticeQuestions = []; // Create a new reference
      this.noticeQuestions = temp; // Create a new reference
    }, 400);
  }

  // Navigate to a specific tab by index
  navigateToTab(index: number): void {
    this.tabGroup.selectedIndex = index;
  }

  // Save functionality
  onSave(withClose: boolean = false): void {
    const userId = localStorage.getItem(this.AppConstants.Session.SESSION_W_USERID);
    const firmNoticeData: FirmNoticeDataDto = new FirmNoticeDataDto();
    firmNoticeData.lstQuestionResponse = this.noticeQuestions;
    firmNoticeData.objWFirmNotice = new WFirmNoticesDto();
    firmNoticeData.objWFirmNotice.wFirmNoticeID = this.wFirmNoticeID;
    firmNoticeData.objWFirmNotice.wNoticeID = this.wNoticeID;
    firmNoticeData.objWFirmNotice.wNotes = this.data.wNotes;
    firmNoticeData.objWFirmNotice.wObjectSOStatusID = this.data?.wObjectSOStatusID;
    firmNoticeData.objWFirmNotice.createdBy = Number(userId);
    //TODO: Save DDL value --> method getListofEvalutionsFromUI in web forms
    this.loadingService.show();
    this.client.saveNoticeResponse(firmNoticeData).subscribe({
      next: (response) => {
        this.loadingService.hide();
        if (response && response.isSuccess && response.response == 1) {
          this.unsavedChanges = false;
          this.toastr.success('Changes saved successfully!', 'Success');
          if (withClose) {
            this.dialogRef.close(false);
          }
        } else {
          this.toastr.error('Failed to save response.', 'Error');
          console.error('Failed to save response:', response?.errorMessage);
        }
      },
      error: (error) => {
        this.loadingService.hide();
        this.noticeQuestionsLoaded = true;
        this.toastr.error('Error occurred while saving response.', 'Error');
        console.error('Error occurred while saving response:', error);
      },
    });
  }

  // Save and close functionality
  onSaveAndClose(): void {
    this.onSave(true);
  }

  // Submit functionality
  onSubmit(): void {
    const userId = localStorage.getItem(this.AppConstants.Session.SESSION_W_USERID);
    const firmNoticeData: FirmNoticeDataDto = new FirmNoticeDataDto();
    firmNoticeData.lstQuestionResponse = this.noticeQuestions;
    firmNoticeData.objWFirmNotice = new WFirmNoticesDto();
    firmNoticeData.objWFirmNotice.wFirmNoticeID = this.wFirmNoticeID;
    firmNoticeData.objWFirmNotice.wNoticeID = this.wNoticeID;
    firmNoticeData.objWFirmNotice.wNotes = this.data.wNotes;
    firmNoticeData.objWFirmNotice.wObjectSOStatusID = this.data?.wObjectSOStatusID;
    firmNoticeData.objWFirmNotice.createdBy = Number(userId);
    //TODO: Save DDL value --> method getListofEvalutionsFromUI in web forms
    this.loadingService.show();
    this.client.saveNoticeResponse(firmNoticeData).subscribe({
      next: (response) => {
        this.loadingService.hide();
        if (response && response.isSuccess && response.response == 1) {
          this.unsavedChanges = false;
          //TODO: Validate mandatory fields (answers) for questions
          if (!this.signOffRequired()) {
            this.client.submitNoticeResponseSignOffNotRequired(this.wFirmNoticeID, this.data.wReferenceNumber, this.data.wNoticeName, this.data.wSubject, this.data.wNotificationSentDate, this.data.wResponseDueDate).subscribe({
              next: (response) => {
                this.loadingService.hide();
                if (response && response.isSuccess && response.response) {
                  this.unsavedChanges = false;
                  this.toastr.success('Response submitted successfully!', 'Success');
                  this.dialogRef.close(true);
                } else {
                  this.toastr.error('Failed to submit response.', 'Error');
                  console.error('Failed to submit response:', response?.errorMessage);
                }
              },
              error: (error) => {
                this.loadingService.hide();
                this.noticeQuestionsLoaded = true;
                this.toastr.error('Error occurred while saving response.', 'Error');
                console.error('Error occurred while saving response:', error);
              },
            });
          }
          else {
            this.client.submitNoticeResponseWithSignOff(this.wFirmNoticeID, this.data.wReferenceNumber, this.data.wNoticeName, this.data.wSubject, this.data.wNotificationSentDate,
              this.data.wResponseDueDate, this.data.wRespondentsControlledFunctionTypeIDs, this.data.wRespondentsDNFBPFunctionTypeIDs, this.dateSigned
            ).subscribe({
              next: (response) => {
                this.loadingService.hide();
                if (response && response.isSuccess && response.response) {
                  this.unsavedChanges = false;
                  this.btnSubmitVisible = response.response.btnSubmitVisible ?? false;
                  this.btnSignOffVisible = response.response.btnSignOffVisible ?? false;
                  this.rwSignatureInfoVisible = response.response.rwSignatureInfoVisible ?? false;
                  this.rwUsersVisible = response.response.rwUsersVisible ?? false;
                  this.lblSignatureInfo = response.response.lblSignatureInfo ?? "";
                  this.lblUsers = response.response.lblUsers ?? "";
                  this.hdnUserIDs = response.response.hdnUserIDs ?? "";
                  this.toastr.success('Changes saved successfully!', 'Success');
                  this.openSignOffDialog();
                } else {
                  this.toastr.error('Failed to submit response.', 'Error');
                  console.error('Failed to submit response:', response?.errorMessage);
                }
              },
              error: (error) => {
                this.loadingService.hide();
                this.noticeQuestionsLoaded = true;
                this.toastr.error('Error occurred while saving response.', 'Error');
                console.error('Error occurred while saving response:', error);
              },
            });
          }

        } else {
          this.toastr.error('Failed to save response.', 'Error');
          console.error('Failed to save response:', response?.errorMessage);
        }
      },
      error: (error) => {
        this.loadingService.hide();
        this.noticeQuestionsLoaded = true;
        this.toastr.error('Error occurred while saving response.', 'Error');
        console.error('Error occurred while saving response:', error);
      },
    });
  }

  onNotesChange(): void {
    this.unsavedChanges = true;
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

  onNoticeQuestionsChange(): void {
    this.unsavedChanges = true;
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

  onSignOff(): void {
    this.openSignOffDialog();
  }

  signOff(): void {
    this.loadingService.show();
    this.client.signOffClickNotice(this.wFirmNoticeID, this.data.wReferenceNumber, this.data.wNoticeName, this.data.wSubject, this.data.wNotificationSentDate, this.data.wResponseDueDate).subscribe({
      next: (response) => {
        this.loadingService.hide();
        if (response && response.isSuccess) {
          this.toastr.success('Response submitted successfully!', 'Success');
          this.dialogRef.close(true);
        } else {
          this.toastr.error('Failed to sign off notice.', 'Error');
          console.error('Failed to sign off notice:', response?.errorMessage);
        }
      },
      error: (error) => {
        this.loadingService.hide();
        this.toastr.error('Error occurred while signing notice.', 'Error');
        console.error('Error occurred while signing notice:', error);
      },
    });
  }

  signOffRequired(): boolean {
    return this.wRespondentTypeID == 1;
  }

  onFileUploaded(uploadIds: number[]): void {
    console.log('Uploaded File IDs:', uploadIds);
  }

  beforeFileUploaded() {
    try {
      this.fileUploader.proceedToUploadAfterSave();
    } catch (error) {
      console.error('Error while submitting application data', error);
    }
  }

}
