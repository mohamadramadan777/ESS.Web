import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_BASE_URL } from './tokens';
import { ToastrService } from 'ngx-toastr';
import { LoadingService } from './loader.service';

@Injectable({
  providedIn: 'root'
})
export class FileDownloadService {
  private baseUrl = API_BASE_URL + '/api/Attachments'; // Adjust API URL if needed
  private baseUrlReports = "http://localhost:5039" + '/api/ReportSchedule'; // Adjust API URL if needed

  constructor(private http: HttpClient,
    private toastr: ToastrService, private loadingService : LoadingService) {}

  downloadFile(pFileName: string, fileLocation: string): void {
    const url = `${this.baseUrl}/download-file?pFileName=${encodeURIComponent(pFileName)}&fileLocation=${encodeURIComponent(fileLocation)}`;

    const options = {
      headers: new HttpHeaders(),
      responseType: 'blob' as 'blob' // 🔹 FIX: Set responseType correctly
    };
    this.loadingService.show();
    this.http.get(url, options).subscribe(
      (blob: Blob) => {
        this.saveFile(blob, pFileName);
        this.loadingService.hide();
      },
      (error) => {
        this.loadingService.hide();
        console.error("Download failed:", error);
      }
    );
  }

  downloadExcel(strFileID: string, xbrlPageType: string, xfilename: string): void {
    const url = `${this.baseUrlReports}/download-file?strFileID=${encodeURIComponent(strFileID)}&xbrlPageType=${encodeURIComponent(xbrlPageType)}&xfilename=${encodeURIComponent(xfilename)}`;

    const options = {
      headers: new HttpHeaders(),
      responseType: 'blob' as 'blob' // 🔹 FIX: Set responseType correctly
    };
    this.loadingService.show();
    this.http.get(url, options).subscribe(
      (blob: Blob) => {
        if (xbrlPageType == "1")
          {
              xfilename = xfilename.replace(".xml", "_ValidationErrorResults.xls");
          }
          else
          {
              xfilename = xfilename.replace(".xml", "_ValidationWarningsResults.xls");
          }
        this.saveFile(blob, xfilename);
        this.loadingService.hide();
      },
      (error) => {
        this.loadingService.hide();
        console.error("Download failed:", error);
      }
    );
  }

  private saveFile(blob: Blob, fileName: string): void {
    const blobURL = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobURL;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(blobURL);
    this.toastr.success('Downloaded successfully!', 'Success');
  }
}