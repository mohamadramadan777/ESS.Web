import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { ReportsComponent } from './components/reports/reports.component';
import { NoticesComponent } from './components/notices/notices.component';
import { RegisterComponent } from './components/register/register.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { HeaderComponent } from './components/home/shared/header/header.component';
import { NavbarComponent } from './components/home/shared/navbar/navbar.component';
import { SignoffSectionComponent } from './components/home/shared/signoff-section/signoff-section.component';
import { PendingSubmissionsComponent } from './components/home/shared/pending-submissions/pending-submissions.component';
import { GeneralCommunicationsComponent } from './components/home/shared/general-communications/general-communications.component';
import { FormsSubmissionComponent } from './components/home/shared/forms-submission/forms-submission.component';
import { SignOffComponent } from './components/home/sign-off/sign-off.component';
import { ToastrModule } from 'ngx-toastr';
import { ContactUsComponent } from './components/contact-us/contact-us.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './services/auth.interceptor';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SystemAccessComponent } from './components/system-access/system-access.component';
import { AgGridModule } from 'ag-grid-angular';
import { AccessModalComponent } from './components/system-access/access-modal/access-modal.component';
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule
import { Client } from './services/api-client'; // Import the Client service
import { API_BASE_URL } from './services/tokens';
import { environment } from '../environments/environment';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { ChangeEmailComponent } from './components/change-email/change-email.component';
import { ChangeSecurityquestionsComponent } from './components/change-securityquestions/change-securityquestions.component';
import { LoaderComponent } from './components/loader/loader.component';
import { LoadingService } from './services/loader.service';
import { ViewNoticeComponent } from './components/notices/view-notice/view-notice.component';
import { MatDialogModule } from '@angular/material/dialog';
import { NoticeQuestionsComponent } from './components/notices/notice-questions/notice-questions.component';
import { HtmlViewerComponent } from './components/html-viewer/html-viewer.component';
import { SubmissionRecordsComponent } from './components/submission-records/submission-records.component';
import { FileUploaderComponent } from './components/file-uploader/file-uploader.component';
import { WithdrawalComponent } from './components/submission-records/forms/withdrawal/withdrawal.component';
import { ApprovalComponent } from './components/submission-records/forms/approval/approval.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { GensubComponent } from './components/submission-records/forms/gensub/gensub.component';
import { SignOffGenericComponent } from './components/sign-off-generic/sign-off-generic.component';
import { HistoryComponent } from './components/reports/history/history.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    ReportsComponent,
    NoticesComponent,
    RegisterComponent,
    HeaderComponent,
    NavbarComponent,
    SignoffSectionComponent,
    PendingSubmissionsComponent,
    GeneralCommunicationsComponent,
    FormsSubmissionComponent,
    SignOffComponent,
    ContactUsComponent,
    SystemAccessComponent,
    AccessModalComponent,
    ResetPasswordComponent,
    ChangeEmailComponent,
    ChangeSecurityquestionsComponent,
    LoaderComponent,
    ViewNoticeComponent,
    NoticeQuestionsComponent,
    HtmlViewerComponent,
    SubmissionRecordsComponent,
    FileUploaderComponent,
    WithdrawalComponent,
    ApprovalComponent,
    GensubComponent,
    SignOffGenericComponent,
    HistoryComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatRadioModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatDividerModule,
    MatTooltipModule,
    MatBadgeModule,
    MatSelectModule,
    AgGridModule, // Ensure this is configured 
    HttpClientModule,
    MatTabsModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ToastrModule.forRoot({
      timeOut: 3000, // Duration in milliseconds (3 seconds)
      positionClass: 'toast-top-center', // Position on the page
      preventDuplicates: true, // Prevent duplicate toasts
      progressBar: true,
    }),
  ],
  providers: [provideAnimationsAsync(),DatePipe, { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }, Client, { provide: API_BASE_URL, useValue: environment.apiBaseUrl }, LoadingService, MatDatepickerModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent],
})
export class AppModule { }
