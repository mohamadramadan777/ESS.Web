import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-html-viewer',
  templateUrl: './html-viewer.component.html',
  styleUrls: ['./html-viewer.component.scss']
})
export class HtmlViewerComponent {
  htmlContent: SafeHtml;
  title: string ="";

  constructor(
    public dialogRef: MatDialogRef<HtmlViewerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { htmlContent: string, title: string },
    private sanitizer: DomSanitizer
  ) {
    // Trust the provided HTML content
    this.htmlContent = this.sanitizer.bypassSecurityTrustHtml(data.htmlContent);
    this.title = data.title;
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
