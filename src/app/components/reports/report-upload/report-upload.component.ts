import { Component, ElementRef, EventEmitter, Inject, Input, Output, QueryList, ViewChildren } from '@angular/core';
import { Client, FileParameter, AttachmentDto, ReportSchDetailsDto } from '../../../services/api-client';
import { AppConstants } from '../../../constants/app.constants';
import { ToastrService } from 'ngx-toastr';
import { LoadingService } from '../../../services/loader.service';
import Swal from 'sweetalert2';
import { Attachments, ReportSchedule, ValidationTypes, WObjects, FirmsObject, FormType, AttachmentStatus, GenSubMessage } from '../../../enums/app.enums';
import { MessagePropertyService } from '../../../services/message-property.service';
import { FileDownloadService } from '../../../services/file-download.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-report-upload',
  templateUrl: './report-upload.component.html',
  styleUrls: ['./report-upload.component.scss'],
})
export class ReportUploadComponent {
  primaryFile: AttachmentDto | undefined = undefined;
  @Input() ShowHeaderPanel: boolean = false;
  @Input() ShowHeaderFormName: boolean = false;
  @Input() ObjectID: number | undefined;
  @Input() ObjectInstanceID: number | undefined;
  @Input() ObjectInstanceRevNum: number | undefined;
  @Input() DocTypeID: number | undefined;
  @Input() FormTypeID: number | undefined;
  @Input() ShowPrimaryDoc: boolean = false;
  @Input() DocSignText: string = "";
  @Input() ReportFormName: string = "";

  @Output() fileUploaded = new EventEmitter<number[]>();
  @Output() ObjectInstanceIDChange = new EventEmitter<number>(); // Notify parent when changed

  regexStrings: { [key: number]: string } = {};
  uploadedFiles: AttachmentDto[][] = [];
  isDragOverSingle = false;
  isDragOverMultiple = false;
  DocType = false;
  allowedExtensionCacheKey = "allowedExtensions";
  allowedExtensions: string[] = [];
  fileUploadPath = "";
  fileUploadedURI = "";
  specialCharacters = "";
  fileLocation = "";
  lstAttachmentsSvc: AttachmentDto[] = [];
  EffectiveFromDate = "";
  EffectiveToDate = "";

  @Input() ReadOnly: boolean = false;
  @ViewChildren('fileInputs') fileInputs!: QueryList<ElementRef>;
  constructor(
    public dialogRef: MatDialogRef<ReportUploadComponent>,
    private client: Client,
    private toastr: ToastrService,
    private loadingService: LoadingService,
    private messagePropertyService: MessagePropertyService,
    private fileDownloadService: FileDownloadService,
    @Inject(MAT_DIALOG_DATA) public data: any) { }


  ngOnInit(): void {
    // this.getDocType(this.DocTypeID ?? 0);
    // this.getAttachmentsFromViewState();
    this.loadMessageProperties();
    //  this.getFileLocation();
    this.loadRegexStrings();
    this.loadAllowedExtensions();
  }

  getAttachmentsFromViewState(): void {
    this.loadingService.show();
    if (this.ObjectID == WObjects.IndividualApplications) {
      this.client.getDocSubTypes(this.FormTypeID, FirmsObject.AIDOCS.toString()).subscribe({
        next: (response) => {
          if (response && response.isSuccess && response.response) {
            this.lstAttachmentsSvc = response.response;
            this.loadingService.hide();
            this.loadEffectiveDates();
          } else {
            console.error('Failed to load getDocSubTypes:', response?.errorMessage);
          }
        },
        error: (error) => {
          console.error('Error occurred while fetching getDocSubTypes:', error);
        },
      });
    }
    else if (this.ObjectID == WObjects.GeneralSubmission) {
      if (!this.DocType) {
        this.client.getDocSubTypes(this.FormTypeID, FirmsObject.GeneralSubmission.toString()).subscribe({
          next: (response) => {
            if (response && response.isSuccess && response.response) {
              this.lstAttachmentsSvc = response.response;
              this.loadingService.hide();
              this.loadEffectiveDates();
            } else {
              console.error('Failed to load getDocSubTypes:', response?.errorMessage);
            }
          },
          error: (error) => {
            console.error('Error occurred while fetching getDocSubTypes:', error);
          },
        });
      }
      else {
        // TODO: lstAttachmentsSvc = _balDataService.getDocSubTypesXbrl(hdnFormTypeID.Value, Convert.ToString((int)FirmsObject.GeneralSubmission));
      }
    }
    else if (this.ObjectID == WObjects.FirmNoticeResponse) {
      this.client.getDocSubTypes(FormType.NoticeResponse, FirmsObject.NoticeResponse.toString()).subscribe({
        next: (response) => {
          if (response && response.isSuccess && response.response) {
            this.lstAttachmentsSvc = response.response;
            this.loadingService.hide();
            this.loadEffectiveDates();
          } else {
            console.error('Failed to load getDocSubTypes:', response?.errorMessage);
          }
        },
        error: (error) => {
          console.error('Error occurred while fetching getDocSubTypes:', error);
        },
      });
    }
  }


  loadEffectiveDates(): void {
    const objDocType: AttachmentDto | undefined = this.lstAttachmentsSvc.find(s => s.docTypeId === this.DocTypeID);
    this.EffectiveFromDate = objDocType?.docTypeIdEffectivefromdate ?? "";
    this.EffectiveToDate = objDocType?.docTypeIdEffectivetodate ?? "";
  }

  loadMessageProperties(): void {
    this.messagePropertyService.getMessageProperty(Attachments.fileUploadPath.toString()).subscribe((message) => {
      this.fileUploadPath = message;
    });

    this.messagePropertyService.getMessageProperty(ReportSchedule.FileUploadedURI.toString()).subscribe((message) => {
      this.fileUploadedURI = message;
    });

    this.messagePropertyService.getMessageProperty(ReportSchedule.Special_Char_NotAllowed_InMOSS.toString()).subscribe((message) => {
      this.specialCharacters = message;
    });
  }

  getFileLocation() {
    this.client.getFileLocation(this.ObjectID, this.ObjectInstanceID, this.DocTypeID).subscribe({
      next: (response) => {
        if (response && response.isSuccess && response.response) {
          this.fileLocation = response.response;
        } else {
          this.loadingService.hide();
          console.error('Failed to load File Location:', response?.errorMessage);
        }
      },
      error: (error) => {
        this.loadingService.hide();
        console.error('Error occurred while fetching File Location:', error);
      },
    });
  }
  getDocType(DocTypeID: number): boolean {
    const storedData = sessionStorage.getItem("XBRLDocType");

    if (storedData) {
      const lstXbrlDocTypes: number[] = JSON.parse(storedData);
      return lstXbrlDocTypes.some(docType => docType === DocTypeID);
    }

    return false;
  }

  loadAllowedExtensions(): void {
    const allowedExtensionsCache = sessionStorage.getItem(this.allowedExtensionCacheKey); // Check session storage
    if (allowedExtensionsCache) {
      this.allowedExtensions = allowedExtensionsCache.split(',');
    }
    else {
      this.client.getAllowedExtensions().subscribe({
        next: (response) => {
          if (response && response.isSuccess && response.response) {
            this.allowedExtensions = response.response.split(',');
            sessionStorage.setItem(this.allowedExtensionCacheKey, response.response); // Store in sessionStorage
          } else {
            this.toastr.error('Failed to load Allowed Extensions.', 'Error');
            console.error('Failed to load Allowed Extensions:', response?.errorMessage);
          }
        },
        error: (error) => {
          this.toastr.error('Error occurred while fetching Allowed Extensions.', 'Error');
          console.error('Error occurred while fetching Allowed Extensions:', error);
        },
      });
    }
  }

  private isValid(type: number, expression: string): boolean {
    const regexPattern = this.regexStrings[type];
    if (!regexPattern) {
      console.error(`No regex found for type ${type}`);
      return false;
    }
    const regex = new RegExp(regexPattern);
    return regex.test(expression);
  }

  onDragOver(event: DragEvent, uploaderType: 'primary' | 'additional'): void {
    event.preventDefault();
    if (uploaderType === 'primary') {
      this.isDragOverSingle = true;
    } else {
      this.isDragOverMultiple = true;
    }
  }

  onDragLeave(event: DragEvent, uploaderType: 'primary' | 'additional'): void {
    if (uploaderType === 'primary') {
      this.isDragOverSingle = false;
    } else {
      this.isDragOverMultiple = false;
    }
  }

  onDrop(event: DragEvent, uploaderType: 'primary' | 'additional'): void {
    event.preventDefault();
    if (uploaderType === 'primary') {
      this.isDragOverSingle = false;
    } else {
      this.isDragOverMultiple = false;
    }
    const files = event.dataTransfer?.files;
    if (files) {
      this.uploadFiles(files, this.data.report);
    }
  }

  onFilesSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files) {
      this.uploadFiles(target.files, this.data.report);
    }
  }

  private uploadFiles(files: FileList, report: ReportSchDetailsDto): void {
    //TODO: Implement code when DocType == true
    const maxFileNameLength = 100; // Convert.ToInt32(BALMessageSettings.GetMessageProperty((int)ReportSchedule.FileSize));
    const maxFileSize = 1048576; // Convert.ToInt32(BALMessageSettings.GetMessageProperty((int)ReportSchedule.FileSizeConfigured));
    Array.from(files).forEach((file) => {
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      const strFileNameWithOutExtn = file.name.split('.')[0].trim();
      const fileNameLength = file.name.length;
      const fileSize = file.size;

      // Check if the file extension is allowed
      if (!fileExtension || !this.allowedExtensions.includes(fileExtension)) {
        this.toastr.error(`File ${file.name} has an invalid extension. Allowed: ${this.allowedExtensions.join(', ')}`, 'Upload Error');// BALMessageSettings.GetMessageProperty((int)ReportSchedule.Select_Valid_File);
        return;
      }

      if (fileNameLength >= maxFileNameLength) {
        this.toastr.error(`File ${file.name} exceeds the maximum name length of ${maxFileNameLength} characters.`, 'Upload Error'); //BALMessageSettings.GetMessageProperty((int)ReportSchedule.FileSizeMessage);
        return;
      }

      if (fileSize > maxFileSize) {
        this.toastr.error(`File ${file.name} exceeds the maximum size of ${maxFileSize / 1024 / 1024} MB.`, 'Upload Error'); //BALMessageSettings.GetMessageProperty((int)ReportSchedule.FileSizeErrorMessage);
        return;
      }

      //TODO: Check line 1388
      // const validationType = ValidationTypes.TextDataValidation;
      // if (!this.isValid(validationType, file.name)) {
      //   this.toastr.error(`punctuation marks other than comma(,),Space, hyphen(-), colon(:),semi colon(;), hash(#), ampersand(&), slash(\,/) and apostrophe(') not allowed`, 'Validation Error');//BALMessageSettings.GetMessageProperty((int)CareerHistoryMessage.SpecialCharacterNotAllowed)
      //   return;
      // }

      const isValidEffectiveDate = true; //BasePage.checkDocTypeValidity(Convert.ToInt32(hdnDocTypeID.Value), hdnEffectiveFromDate.Value, hdnEffectiveToDate.Value, Convert.ToInt32(hdnWObjectID.Value), null, rptEndDate); // need to change 0 value
      if (!isValidEffectiveDate) {
        // basePage.ShowAlertMessageBox_Ajax(BALMessageSettings.GetMessageProperty((int)ReportSchedule.INVALID_EFFECTIVE_DATE), (int)ErrorType.Error);

      }
      const fileParam: FileParameter = {
        data: file, // The actual File object
        fileName: file.name // Required by NSwag
      };

      this.loadingService.show();
      this.client.uploadReport(fileParam, report.rptSchFinYearFromDate, report.rptSchFinYearToDate, report.rptPeriodTypeDesc, report.docTypeID, report.rptName,
        report.rptDueDate, report.rptSubmissionTypeID, report.rptPeriodFromDate, report.rptPeriodToDate, report.rptFreqTypeDesc, report.firmsRptSchID ?? 0, report.rptSchItemID ?? 0,
        report.rptSchItemAttachmentID ?? 0, report.attachmentFilePath ?? "", report.attachmentStatusTypeID ?? 0, report.allowReSubmit ?? false, report.isMultipleAttachments ?? false, file.name).subscribe({
          next: (response) => {
            if (response && response.isSuccess && response.response) {
              this.toastr.success(`File ${file.name} uploaded successfully!`, 'Upload Success');
                this.data.parent.onScheduleChange();
                this.dialogRef.close();
            } else {
              this.messagePropertyService.getMessageProperty(ReportSchedule.VirusFound.toString()).subscribe((message) => {
                this.toastr.error(message, 'Error');
                this.loadingService.hide();
                console.error('Failed to upload', response?.errorMessage);
              });
            }
          },
          error: (error) => {
            this.loadingService.hide();
            this.toastr.error('Error occurred while uploading.', 'Error');
            console.error('Error occurred while uploading', error);
          },
        });

    });
  }

  loadRegexStrings(): void {
    this.regexStrings = {
      // Validation for QFC Number
      [ValidationTypes.QFCNum]: "^([A-Za-z0-9]\\s?)+([,]\\s?([A-Za-z0-9]\\s?)+)*$",

      // Validation for Breach Number in Breach List Search Option
      [ValidationTypes.BreachNum]: "([Bb][0-9]*[/]\\d{2})",

      // Positive Decimal
      [ValidationTypes.PositiveDecimal]: "^[0-9][0-9]*(\\.[0-9]*)?$",

      // Positive Non Decimal
      [ValidationTypes.PositiveNonDecimal]: "^[0-9][0-9]*$",

      // Number
      [ValidationTypes.Decimal]: "^(\\+|-)?[0-9][0-9]*(\\.[0-9]*)?$",

      // Non Decimal
      [ValidationTypes.NonDecimal]: "^(\\+|-)?[0-9][0-9]*(\\.[0-9]*)?$",

      // Currency
      [ValidationTypes.Currency]: "^-?\\d+(\\.\\d{2})?$",

      // Dates (DD/MM/YYYY)
      [ValidationTypes.DatesDDMMYYYY]:
        "((0[1-9]|[12][0-9]|3[01]))[/|-](0[1-9]|1[0-2])[/|-]((?:\\d{4}|\\d{2}))",

      // Dates (DD/MM/YY)
      [ValidationTypes.DatesDDMMYY]:
        "((0[1-9]|[12][0-9]|3[01]))[/|-](0[1-9]|1[0-2])[/|-]((?:\\d{2}))",

      // Dates (DD MMM YYYY)
      [ValidationTypes.DatesDD_MMM_YYYY]:
        "(^(3[0-1]|2[0-9]|1[0-9]|0[1-9])[\\s{1}|\\/|-](Jan|JAN|jan|Feb|FEB|feb|Mar|MAR|mar|Apr|APR|apr|May|MAY|may|Jun|JUN|jun|Jul|JUL|jul|Aug|AUG|aug|Sep|SEP|sep|Oct|OCT|oct|Nov|NOV|nov|Dec|DEC|dec)[\\s{1}|\\/|-]((19)|([2]([0]{1})))([0-9]{2})$)",

      // Email
      [ValidationTypes.Email]: "^([a-zA-Z0-9_\\-\\.]+)@([a-zA-Z0-9_\\-\\.]+)\\.([a-zA-Z]{2,5})$",

      // IP Address
      [ValidationTypes.IPAddress]:
        "(?<First>2[0-4]\\d|25[0-5]|[01]?\\d\\d?)\\.(?<Second>2[0-4]\\d|25[0-5]|[01]?\\d\\d?)\\.(?<Third>2[0-4]\\d|25[0-5]|[01]?\\d\\d?)\\.(?<Fourth>2[0-4]\\d|25[0-5]|[01]?\\d\\d?)",

      // URL
      [ValidationTypes.URL]: "(?<http>(http:[/]\\/|www.)([a-zA-Z0-9._-]+))",

      // Percentage
      [ValidationTypes.Percentage]: "^\\d{1,3}($|\\.\\d{1,2}$)",

      // Password
      [ValidationTypes.Password]: "^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9\\S]{8,14}$",

      // Passport
      [ValidationTypes.Passport]: "^\\s*[a-zA-Z0-9\\s-]+\\s*$",

      // National ID Number
      [ValidationTypes.NationalIdNumber]: "^\\s*[a-zA-Z0-9\\s-]+\\s*$",

      // Text Data Validation
      [ValidationTypes.IndividualDtlsTxtValidation]:
        "^\\s*[a-zA-Z0-9.,\\s-':;#\\\\/]+\\s*$",

      // Phone Data Validation
      [ValidationTypes.PhoneDataValidation]: "^\\s*[0-9+\\s-]+\\s*$",

      // Name Fields Validation
      [ValidationTypes.NameFeildsValidation]: "^\\s*[a-zA-Z,\\s-':;#\\\\/]+\\s*$",

      // QFC Number
      [ValidationTypes.QFCNumber]: "^\\d{5}$",
    };
  }

  getModifiedFileName(filename: string): { originalFileName: string; modifiedFileNameWithDateTime: string } {
    let dateTimeStamp = new Date().toISOString()
      .replace(/[\s:\/]/g, AppConstants.Keywords.CHAR_UNDERSCORE) // Replace spaces, slashes, and colons with underscores
      .replace(AppConstants.Keywords.SLASH_FORWORD, AppConstants.Keywords.NOSPACE)
      .replace(AppConstants.Keywords.CHAR_COLON, AppConstants.Keywords.NOSPACE);

    let arrSpecialChar: string[] = this.specialCharacters ? this.specialCharacters.split(AppConstants.Keywords.CHAR_COMMA) : [];

    if (arrSpecialChar.length > 0) {
      arrSpecialChar.forEach(item => {
        filename = filename.replace(item, AppConstants.Keywords.BLANKSPACE);
      });
    }

    filename = filename.replace(AppConstants.Keywords.SINGLE_QUOTE, AppConstants.Keywords.NOSPACE);
    filename = filename.replace(AppConstants.Keywords.COMMA, AppConstants.Keywords.CHAR_UNDERSCORE);

    const modifiedFileNameWithDateTime = `${filename}${AppConstants.Keywords.CHAR_UNDERSCORE}${dateTimeStamp}`;

    return {
      originalFileName: filename,
      modifiedFileNameWithDateTime
    };
  }

  onFileBrowseClick(index: number, uploaderType: 'primary' | 'additional'): void {
    if (uploaderType == 'additional' && this.ObjectID == WObjects.GeneralSubmission && (this.ObjectInstanceID == 0 || this.ObjectInstanceID == null || this.ObjectInstanceID == undefined)) {
      this.messagePropertyService.getMessageProperty(GenSubMessage.PleaseAttachFormTypeDescForAdditionalDoc.toString()).subscribe((message) => {
        Swal.fire(
          'Warning!',
          message.replace(AppConstants.Keywords.EMAIL_FORM_TYPE_DESC, this.ReportFormName),
          'warning'
        );
      });
    }
    else {
      const inputElement = this.fileInputs?.toArray()[index]?.nativeElement;
      if (inputElement) {
        inputElement.click();
      }
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
