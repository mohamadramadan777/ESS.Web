import { Component, Inject, Input, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { WObjects, SignOffStatusType } from '../../../enums/app.enums';
import { AppConstants } from '../../../constants/app.constants';
import { Client, AttachmentDto, WNoticeQuestionnaireItemDto, ObjectSOTaskStatus } from '../../../services/api-client';
import { LoadingService } from '../../../services/loader.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { HtmlViewerComponent } from '../../html-viewer/html-viewer.component';
import { MatTabGroup } from '@angular/material/tabs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-view-notice',
  templateUrl: './view-notice.component.html',
  styleUrls: ['./view-notice.component.scss']
})
export class ViewNoticeComponent {
  @ViewChild(MatTabGroup, { static: true }) tabGroup!: MatTabGroup;
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

  getAndBindNoticeSignatories(): void {
    if (this.wFirmNoticeID != 0) {
      this.client.getObjectSoTaskStatus(WObjects.FirmNoticeResponse, this.wFirmNoticeID, undefined).subscribe({
        next: (response) => {
          if (response && response.isSuccess && response.response) {
            const bSingUserInfo: ObjectSOTaskStatus | undefined = response.response?.filter(c => c.soTaskCompletionDate && c.soTaskCompletionDate.trim() !== '').shift();
            if (bSingUserInfo && bSingUserInfo.soTaskAssignedTo != 0) {
              this.noticeCompleted = true;
              this.signatoryName = bSingUserInfo.individualName ?? '';
              this.dateSigned = bSingUserInfo.soTaskCompletionDate ?? '';
              // TODO: Show Hide
            }
            else if (bSingUserInfo?.soTaskCompletionDate != null && bSingUserInfo?.soTaskCompletionDate != "") {
              this.noticeCompleted = false;
              // TODO: Bind the signatory name
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
  onSave(): void {
    this.toastr.success('Changes saved successfully!', 'Success');
  }

  // Save and close functionality
  onSaveAndClose(): void {
    this.toastr.success('Changes saved successfully!', 'Success');
    this.dialogRef.close();

  }

  // Submit functionality
  onSubmit(): void {
    console.log('Submit clicked');
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
  
  onFileUploaded(uploadIds: number[]): void {
    console.log('Uploaded File IDs:', uploadIds);
  }

}
