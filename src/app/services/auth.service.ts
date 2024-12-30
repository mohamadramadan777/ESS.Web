import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthenticateRequest } from '../services/api-client'; // Import from your generated api-client.ts
import { Client } from './api-client'; 
import { environment } from '../../environments/environment'; 
import { catchError, map, Observable, of } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'token'; // TODO: Dictionary
  private readonly SESSION_W_USERID = 'w_userid';
  private readonly SESSION_W_ACCESS_REQUEST_ID = 'w_access_request_id';
  private readonly SESSION_INDIVIDUAL_NAME = 'individual_name';
  private readonly SESSION_QFC_NO  = 'qfc_no';
  private readonly SESSION_W_USER_LOGIN_ID  = 'w_user_login_id';
  private readonly SESSION_B_IS_REGISTERED  = 'b_is_registered';
  private readonly SESSION_LOGINUSER_ROLEID   = 'loginuser_roleid';
  private readonly SESSION_EMAIL_ID   = 'email_id';
  private readonly SESSION_REG_PASS   = 'reg_pass';
  private readonly SESSION_FIRM_TYPE   = 'firm_type';
  private readonly SESSION_FIRM_NAME   = 'firm_name';
  constructor(private router: Router,
     private httpClient: HttpClient,
    private client: Client ) {}

  /**
   * Logs the user in by calling the authenticate endpoint and storing the token.
   */
  login(credentials: AuthenticateRequest): Observable<string> {
    return this.client.authenticate(credentials).pipe(
      map(response => {
        if (
          response.response?.message === "AccountLocked" ||
          response.response?.message === "LoggedInOtherSystem" ||
          response.response?.message === "Deactivated" ||
          response.response?.message === "InvalidUserCredentials"
        ) {
          return response.response?.message;
        } else if (response.response?.bIsPasswordReset) {
          localStorage.setItem(this.SESSION_W_ACCESS_REQUEST_ID, response.response.userInfo?.wAccessRequestID?.toString() ?? ""); 
          localStorage.setItem('cf', response.response.resetPasswordFlag?.toString() ?? ""); 
          this.router.navigate(['/resetpassword']);
          console.log('Password Expired');
          return "resetpassword";
        } else if (response.response?.token) {
          localStorage.setItem(this.TOKEN_KEY, response.response.token); 
          localStorage.setItem(this.SESSION_W_USERID, response.response.userInfo?.wUserID?.toString() ?? ""); 
          localStorage.setItem(this.SESSION_W_ACCESS_REQUEST_ID, response.response.userInfo?.wAccessRequestID?.toString() ?? ""); 
          localStorage.setItem(this.SESSION_INDIVIDUAL_NAME, response.response.userInfo?.individualName?.toString() ?? ""); 
          localStorage.setItem(this.SESSION_QFC_NO, response.response.userInfo?.firmQFCNo?.toString() ?? ""); 
          localStorage.setItem(this.SESSION_W_USER_LOGIN_ID, response.response.userInfo?.wUserLoginID?.toString() ?? ""); 
          localStorage.setItem(this.SESSION_B_IS_REGISTERED, response.response.bIsRegistered?.toString() ?? ""); 
          localStorage.setItem(this.SESSION_LOGINUSER_ROLEID, response.response.userRolesString?.toString() ?? ""); 
          localStorage.setItem(this.SESSION_FIRM_TYPE, response.response.userInfo?.firmTypeID?.toString() ?? ""); 
          localStorage.setItem(this.SESSION_FIRM_NAME, response.response.userInfo?.firmName?.toString() ?? ""); 
          localStorage.setItem(this.SESSION_EMAIL_ID, response.response.userInfo?.individualEmailAddress?.toString() ?? ""); 
  
          if (!response.response?.bIsRegistered) {
            localStorage.setItem(this.SESSION_REG_PASS, response.response.userInfo?.registrationPassword?.toString() ?? ""); 
            console.log('Not Registered');
            this.router.navigate(['/register']);
            return "success";
          } else if (response.response?.bIsAuthenticated) {
            console.log('Login Successful');
            this.router.navigate(['/home']);
            return "success";
          }
          return "Unauthorized";
        } else {
          console.error('Authentication failed: No token received');
          return "NoToken";
        }
      }),
      catchError(error => {
        console.error('Authentication failed:', error);
        return of("Error"); // Use `of` to emit a default fallback value
      })
    );
  }
  

  /**
   * Logs the user out by removing the token and user details from local storage.
   */
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.SESSION_W_USERID);
    localStorage.removeItem(this.SESSION_W_ACCESS_REQUEST_ID);
    localStorage.removeItem(this.SESSION_INDIVIDUAL_NAME);
    localStorage.removeItem(this.SESSION_QFC_NO);
    localStorage.removeItem(this.SESSION_W_USER_LOGIN_ID);
    localStorage.removeItem(this.SESSION_B_IS_REGISTERED);
    localStorage.removeItem(this.SESSION_LOGINUSER_ROLEID);
    localStorage.removeItem(this.SESSION_EMAIL_ID);
    localStorage.removeItem(this.SESSION_REG_PASS);
    localStorage.removeItem(this.SESSION_FIRM_TYPE);
    localStorage.removeItem(this.SESSION_FIRM_NAME);
    this.router.navigate(['/login']);
  }

  /**
   * Retrieves the token from local storage.
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Retrieves the user details from local storage.
   */
  getUser(): any {
    const user = localStorage.getItem(this.SESSION_W_USERID);
    return user ? JSON.parse(user) : null;
  }

  /**
   * Checks if the user is authenticated by validating the token.
   */
  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token; // Add token expiration validation if needed
  }
}
