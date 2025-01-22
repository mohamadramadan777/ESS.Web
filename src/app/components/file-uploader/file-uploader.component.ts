import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.scss'],
})
export class FileUploaderComponent {
  @Input() ShowHeaderPanel: boolean = false;
  @Input() ShowHeaderFormName: boolean = false;
  @Input() ObjectID: number | undefined;
  @Input() ObjectInstanceID: number | undefined;
  @Input() ObjectInstanceRevNum: number | undefined;
  @Input() DocTypeID: number | undefined;
  @Input() FormTypeID: number | undefined;
  @Input() ShowPrimaryDoc: boolean = false;

  @Output() fileUploaded = new EventEmitter<number[]>();

  uploadedFiles: { name: string; uploadId: number }[] = [];
  isDragOver: boolean = false;

  constructor(private toastr: ToastrService) {}

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
    const files = event.dataTransfer?.files;
    if (files) {
      this.uploadFiles(files);
    }
  }

  onFilesSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files) {
      this.uploadFiles(target.files);
    }
  }

  private uploadFiles(files: FileList): void {
    Array.from(files).forEach((file) => {
      const uploadId = this.simulateFileUpload(file);
      this.uploadedFiles.push({ name: file.name, uploadId });
    });
    this.fileUploaded.emit(this.uploadedFiles.map((file) => file.uploadId));
  }

  private simulateFileUpload(file: File): number {
    const uploadId = Math.floor(Math.random() * 10000);
    this.toastr.success(`File ${file.name} uploaded successfully!`, 'Upload Success');
    return uploadId;
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
        this.removeFile(index);
        this.toastr.success('The file has been removed.','Removed!');
      }
    });
  }

  private removeFile(index: number): void {
    this.uploadedFiles.splice(index, 1);
    this.fileUploaded.emit(this.uploadedFiles.map((file) => file.uploadId));
  }

  onDownload(file: { name: string; uploadId: number }): void {
    // Simulate download logic
    this.toastr.info(`Downloading file: ${file.name}`, 'Download Started');
  }
}
