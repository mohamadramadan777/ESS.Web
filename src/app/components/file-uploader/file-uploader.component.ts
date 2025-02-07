import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Client} from '../../services/api-client';
import { AppConstants } from '../../constants/app.constants';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { WObjects, ValidationTypes } from '../../enums/app.enums';


@Component({
  selector: 'app-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.scss'],
})
export class FileUploaderComponent {
  primaryFile: { name: string } | null = null;
  @Input() ShowHeaderPanel: boolean = false;
  @Input() ShowHeaderFormName: boolean = false;
  @Input() ObjectID: number | undefined;
  @Input() ObjectInstanceID: number | undefined;
  @Input() ObjectInstanceRevNum: number | undefined;
  @Input() DocTypeID: number | undefined;
  @Input() FormTypeID: number | undefined;
  @Input() ShowPrimaryDoc: boolean = false;
  @Input() DocSignText: string = "";

  @Output() fileUploaded = new EventEmitter<number[]>();

  regexStrings: { [key: number]: string } = {};
  uploadedFiles: { name: string }[] = [];
  isDragOverSingle = false;
  isDragOverMultiple = false;
  DocType = false;
  allowedExtensionCacheKey = "allowedExtensions";
  allowedExtensions : string [] = [];
  @Input() ReadOnly: boolean = false;

  constructor(
    private client: Client,
    private toastr: ToastrService) {}


  ngOnInit(): void {
    this.loadRegexStrings();
    this.loadAllowedExtensions();
    this.getDocType(this.DocTypeID ?? 0);
  }

  getDocType(DocTypeID: number): boolean {
    const storedData = sessionStorage.getItem("XBRLDocType");

    if (storedData) {
        const lstXbrlDocTypes: number[] = JSON.parse(storedData);
        return lstXbrlDocTypes.some(docType => docType === DocTypeID);
    }

    return false;
}

  loadAllowedExtensions(): void{
    const allowedExtensionsCache = sessionStorage.getItem(this.allowedExtensionCacheKey); // Check session storage
    if(allowedExtensionsCache){
     this.allowedExtensions = allowedExtensionsCache.split(',');
    }
    else{
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

  onDragOver(event: DragEvent, uploaderType: 'single' | 'multiple'): void {
    event.preventDefault();
    if (uploaderType === 'single') {
      this.isDragOverSingle = true;
    } else {
      this.isDragOverMultiple = true;
    }
  }

  onDragLeave(event: DragEvent, uploaderType: 'single' | 'multiple'): void {
    if (uploaderType === 'single') {
      this.isDragOverSingle = false;
    } else {
      this.isDragOverMultiple = false;
    }
  }

  onDrop(event: DragEvent, uploaderType: 'single' | 'multiple'): void {
    event.preventDefault();
    if (uploaderType === 'single') {
      this.isDragOverSingle = false;
    } else {
      this.isDragOverMultiple = false;
    }
    const files = event.dataTransfer?.files;
    if (files) {
      this.uploadFiles(files, uploaderType);
    }
  }

  onFilesSelected(event: Event, uploaderType: 'single' | 'multiple'): void {
    const target = event.target as HTMLInputElement;
    if (target.files) {
      this.uploadFiles(target.files, uploaderType);
    }
  }

private uploadFiles(files: FileList, uploaderType: 'single' | 'multiple'): void {
  //TODO: Implement code when DocType == true
  const maxFileNameLength = 100; // Convert.ToInt32(BALMessageSettings.GetMessageProperty((int)ReportSchedule.FileSize));
  const maxFileSize = 1048576; // Convert.ToInt32(BALMessageSettings.GetMessageProperty((int)ReportSchedule.FileSizeConfigured));
  Array.from(files).forEach((file) => {
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
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

    const validationType = ValidationTypes.TextDataValidation;
    if (!this.isValid(validationType, file.name)) {
      this.toastr.error(`punctuation marks other than comma(,),Space, hyphen(-), colon(:),semi colon(;), hash(#), ampersand(&), slash(\,/) and apostrophe(') not allowed`, 'Validation Error');//BALMessageSettings.GetMessageProperty((int)CareerHistoryMessage.SpecialCharacterNotAllowed)
      return;
    }

    if (uploaderType === 'single') {
      this.primaryFile = { name: file.name };
      this.toastr.success(`Primary file ${file.name} uploaded successfully!`, 'Upload Success');
    } else {
      this.uploadedFiles.push({ name: file.name });
      this.toastr.success(`File ${file.name} uploaded successfully!`, 'Upload Success');
    }
  });
}

  removePrimaryFile(): void {
    this.primaryFile = null;
    this.toastr.info('Primary file removed.', 'Removed');
  }

  confirmFileRemoval(index: number): void {
    const fileName = this.uploadedFiles[index]?.name;
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
        this.uploadedFiles.splice(index, 1);
        this.toastr.success('The file has been removed.', 'Removed!');
      }
    });
  }

  onDownload(file: { name: string }): void {
    // Simulate download logic
    this.toastr.info(`Downloading file: ${file.name}`, 'Download Started');
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
}
