import { Injectable } from '@angular/core';
import { Client } from '../services/api-client';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MessagePropertyService {
  private messageCache: { [key: string]: string } = {};

  constructor(private client: Client, private toastr: ToastrService) {}
  getMessageProperty(key: string): Observable<string> {
    // Check if the message exists in the cache
    if (this.messageCache[key]) {
      return of(this.messageCache[key]); // Return cached value as an Observable
    }

    // If not in cache, fetch from API
    return this.client.getMessageProperty(key).pipe(
      map((response) => {
        if (response && response.isSuccess && response.response) {
          // Store the response in the cache
          this.messageCache[key] = response.response;
          return response.response;
        } else {
          console.error('Failed to fetch message:', response?.errorMessage);
          return 'Error: Failed to fetch message';
        }
      }),
      catchError((error) => {
        console.error('Error occurred while fetching message:', error);
        return of('Error: Unable to fetch message');
      })
    );
  }

}
