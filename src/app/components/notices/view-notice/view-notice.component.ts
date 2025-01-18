import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { WObjects } from '../../../enums/app.enums';
import { AppConstants } from '../../../constants/app.constants';
import { Client, AttachmentDto, WNoticeQuestionnaireItemDto, ObjectSOTaskStatus } from '../../../services/api-client';
import { LoadingService } from '../../../services/loader.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { HtmlViewerComponent } from '../../html-viewer/html-viewer.component';

@Component({
  selector: 'app-view-notice',
  templateUrl: './view-notice.component.html',
  styleUrls: ['./view-notice.component.scss']
})
export class ViewNoticeComponent {
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
    this.client.getObjAttachments(undefined, Number(WObjects.FirmNotice), this.wNoticeID, 1).subscribe({
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
  
}
