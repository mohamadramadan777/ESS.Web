import { Component, ElementRef, EventEmitter, Input, Output, QueryList, ViewChildren } from '@angular/core';
import { Client, FileParameter, AttachmentDto } from '../../services/api-client';
import { AppConstants } from '../../constants/app.constants';
import { ToastrService } from 'ngx-toastr';
import { LoadingService } from '../../services/loader.service';
import Swal from 'sweetalert2';
import { Attachments, ReportSchedule, ValidationTypes, WObjects, FirmsObject, FormType, AttachmentStatus, GenSubMessage } from '../../enums/app.enums';
import { MessagePropertyService } from '../../services/message-property.service';
import { FileDownloadService } from '../../services/file-download.service';


@Component({
  selector: 'app-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.scss'],
})
export class FileUploaderComponent {
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
    private client: Client,
    private toastr: ToastrService,
    private loadingService: LoadingService,
    private messagePropertyService: MessagePropertyService,
    private fileDownloadService: FileDownloadService) { }


  ngOnInit(): void {
    this.getDocType(this.DocTypeID ?? 0);
    this.getAttachmentsFromViewState();
    this.loadMessageProperties();
    this.getFileLocation();
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
      this.uploadFiles(files, uploaderType, 0);
    }
  }

  onFilesSelected(event: Event, uploaderType: 'primary' | 'additional', index: any): void {
    const target = event.target as HTMLInputElement;
    if (target.files) {
      this.uploadFiles(target.files, uploaderType, index);
    }
  }

  private uploadFiles(files: FileList, uploaderType: 'primary' | 'additional', index: any): void {
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

      const { originalFileName, modifiedFileNameWithDateTime } = this.getModifiedFileName(strFileNameWithOutExtn);
      const fileName = originalFileName + '.' + fileExtension;
      const modifiedFileName = modifiedFileNameWithDateTime + '.' + fileExtension;
      const finalPath = this.fileLocation + modifiedFileName.trim();
      const finalURI = this.fileUploadedURI + modifiedFileName.trim();
      if (!this.DocType) {
        const fileParam: FileParameter = {
          data: file, // The actual File object
          fileName: file.name // Required by NSwag
        };

        this.loadingService.show();
        this.client.uploadToFolder(fileParam, this.fileUploadPath + this.fileLocation, modifiedFileName).subscribe({
          next: (response) => {
            if (response && response.isSuccess && response.response) {
              if (uploaderType === 'primary') {
                this.client.savePrimaryDocument(this.FormTypeID, this.DocTypeID, this.DocType, this.primaryFile?.statusTypeID,
                  finalPath, fileName, finalURI, this.ObjectInstanceID, this.ObjectID, this.primaryFile?.wObjAttachementID, this.ObjectInstanceRevNum).subscribe({
                    next: (response) => {
                      this.loadingService.hide();
                      if (response && response.isSuccess && response.response) {
                        this.ObjectInstanceID = response.response?.wObjectInstanceID;
                        this.ObjectInstanceIDChange.emit(this.ObjectInstanceID); // Emit updated ID to parent
                        this.ObjectInstanceRevNum = response.response?.wObjectInstanceRevNum;
                        this.bindAttachments();
                        this.toastr.success(`Primary file ${file.name} uploaded successfully!`, 'Upload Success');
                      } else {
                        this.loadingService.hide();
                        console.error('Failed to load save primary doc', response?.errorMessage);
                      }
                    },
                    error: (error) => {
                      this.loadingService.hide();
                      this.toastr.error('Error occurred while saving primary doc.', 'Error');
                      console.error('Error occurred while saving primary doc', error);
                    },
                  });
              } else {
                const attachments: AttachmentDto[] = [];
                const attachment: AttachmentDto = new AttachmentDto();
                const attachmentDoc: AttachmentDto = this.lstAttachmentsSvc[index];
                attachment.wObjAttachementID = attachmentDoc.wObjAttachementID;
                attachment.wObjectID = this.ObjectID;
                attachment.wObjectInstanceID = this.ObjectInstanceID;
                attachment.wObjectInstanceRevNum = this.ObjectInstanceRevNum;
                attachment.docTypeId = this.DocTypeID;
                attachment.docSubTypeId = attachmentDoc.docSubTypeId;
                attachment.docSubTypeDesc = attachmentDoc.docSubTypeDesc;
                attachment.otherDocDesc = attachmentDoc.otherDocDesc;
                attachment.isChecked = true;
                attachment.isDocSupplied = true;
                attachment.isPrimaryDoc = false;
                if (this.ObjectInstanceID != undefined && this.ObjectInstanceID != 0 && this.ObjectInstanceID != null && attachmentDoc.statusTypeID != 0 && attachmentDoc.statusTypeID != undefined && attachmentDoc.statusTypeID != null) {
                  attachment.statusTypeID = attachmentDoc.statusTypeID;
                } else {
                  attachment.statusTypeID = AttachmentStatus.Pending;
                }
                attachment.isValidAttachment = true;
                attachment.filePath = finalPath;
                attachment.fileName = fileName;
                attachment.fileURI = finalURI;
                attachment.userId = Number(localStorage.getItem(AppConstants.Session.SESSION_W_USERID));
                attachments.push(attachment);

                this.client.saveObjAttachments(attachments).subscribe({
                  next: (response) => {
                    this.loadingService.hide();
                    if (response && response.isSuccess && response.response) {
                      if (!attachmentDoc.isAllowMultiple && this.uploadedFiles[attachmentDoc.docSubTypeId ?? 0].length > 0) {
                        this.client.deleteAttachment(this.uploadedFiles[attachmentDoc.docSubTypeId ?? 0][0]?.wObjAttachementID, this.uploadedFiles[attachmentDoc.docSubTypeId ?? 0][0]?.fileName, this.uploadedFiles[attachmentDoc.docSubTypeId ?? 0][0]?.filePath, this.DocType).subscribe({
                          next: (response) => {
                            if (response && response.isSuccess && response.response) {
                              this.bindAttachments();
                              this.toastr.success(`File ${file.name} uploaded successfully!`, 'Upload Success');
                            } else {
                              this.toastr.error('Failed to remove attachment file.', 'Error');
                              console.error('Failed to remove attachment file:', response?.errorMessage);
                            }
                          },
                          error: (error) => {
                            this.toastr.error('Error occurred while removing attachment file.', 'Error');
                            console.error('Error occurred while removing attachment file:', error);
                          },
                        });
                      }
                      else {
                        this.bindAttachments();
                        this.toastr.success(`File ${file.name} uploaded successfully!`, 'Upload Success');
                      }
                    } else {
                      this.loadingService.hide();
                      console.error('Failed to load save primary doc', response?.errorMessage);
                    }
                  },
                  error: (error) => {
                    this.loadingService.hide();
                    this.toastr.error('Error occurred while saving primary doc.', 'Error');
                    console.error('Error occurred while saving primary doc', error);
                  },
                });
              }
            } else {
              this.messagePropertyService.getMessageProperty(ReportSchedule.VirusFound.toString()).subscribe((message) => {
                this.toastr.error(message, 'Error');
                console.error('Failed to upload', response?.errorMessage);
              });
            }
          },
          error: (error) => {
            this.toastr.error('Error occurred while uploading.', 'Error');
            console.error('Error occurred while uploading', error);
          },
        });
      }
      else {

      }
    });
  }

  bindAttachments(): void {
    this.loadingService.show();
    this.client.getObjAttachments(undefined, this.ObjectID, this.ObjectInstanceID, 1, false).subscribe({
      next: (response) => {
        if (response && response.isSuccess && response.response) {
          this.loadingService.hide();
          this.primaryFile = response.response.find(a => a.isPrimaryDoc === true);
          this.lstAttachmentsSvc.forEach(element => {
            if (element.docSubTypeId) {
              this.uploadedFiles[element.docSubTypeId ?? 0] = response?.response?.filter(a => !a.isPrimaryDoc && a.docSubTypeId == element.docSubTypeId) ?? [];
            }
          });
        } else {
          this.loadingService.hide();
          this.messagePropertyService.getMessageProperty(ReportSchedule.VirusFound.toString()).subscribe((message) => {
            console.error('Failed to load Attachments', response?.errorMessage);
          });
        }
      },
      error: (error) => {
        this.loadingService.hide();
        this.toastr.error('Error occurred while uploading.', 'Error');
        console.error('Error occurred while uploading', error);
      },
    });
  }


  removePrimaryFile(): void {
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to remove the file "${this.primaryFile?.fileName}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, remove it!',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#a51e36',
      cancelButtonColor: '#555555',
    }).then((result) => {
      if (result.isConfirmed) {
        this.client.deleteAttachment(this.primaryFile?.wObjAttachementID, "", this.primaryFile?.filePath, this.DocType).subscribe({
          next: (response) => {
            if (response && response.isSuccess && response.response) {
              this.toastr.success('The file has been removed.', 'Removed!');
              this.bindAttachments();
            } else {
              this.toastr.error('Failed to remove primary file.', 'Error');
              console.error('Failed to remove primary file:', response?.errorMessage);
            }
          },
          error: (error) => {
            this.toastr.error('Error occurred while removing primary file.', 'Error');
            console.error('Error occurred while removing primary file:', error);
          },
        });
      }
    });
  }

  confirmFileRemoval(docSubTypeID: any, index: number): void {
    const fileName = this.uploadedFiles[docSubTypeID][index]?.fileName;
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to remove the file "${fileName}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, remove it!',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#a51e36',
      cancelButtonColor: '#555555',
    }).then((result) => {
      if (result.isConfirmed) {
        this.client.deleteAttachment(this.uploadedFiles[docSubTypeID][index]?.wObjAttachementID, this.uploadedFiles[docSubTypeID][index]?.fileName, this.uploadedFiles[docSubTypeID][index]?.filePath, this.DocType).subscribe({
          next: (response) => {
            if (response && response.isSuccess && response.response) {
              this.toastr.success('The file has been removed.', 'Removed!');
              this.bindAttachments();
            } else {
              this.toastr.error('Failed to remove attachment file.', 'Error');
              console.error('Failed to remove attachment file:', response?.errorMessage);
            }
          },
          error: (error) => {
            this.toastr.error('Error occurred while removing attachment file.', 'Error');
            console.error('Error occurred while removing attachment file:', error);
          },
        });
      }
    });
  }

  onDownload(file: AttachmentDto): void {
    this.fileDownloadService.downloadFile(file.fileName ?? "", file.filePath ?? "");
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

  private saveFile(data: Blob, fileName: string): void {
    const blob = new Blob([data], { type: 'application/octet-stream' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }
}
