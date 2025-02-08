import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_BASE_URL } from './tokens';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class FileDownloadService {
  private baseUrl = API_BASE_URL + '/api/Attachments'; // Adjust API URL if needed

  constructor(private http: HttpClient,
    private toastr: ToastrService) {}

  downloadFile(pFileName: string, fileLocation: string): void {
    const url = `${this.baseUrl}/download-file?pFileName=${encodeURIComponent(pFileName)}&fileLocation=${encodeURIComponent(fileLocation)}`;

    const options = {
      headers: new HttpHeaders(),
      responseType: 'blob' as 'blob' // 🔹 FIX: Set responseType correctly
    };

    this.http.get(url, options).subscribe(
      (blob: Blob) => {
        this.saveFile(blob, pFileName);
      },
      (error) => {
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