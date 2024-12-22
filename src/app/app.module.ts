import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
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
    ToastrModule.forRoot({
      timeOut: 3000, // Duration in milliseconds (3 seconds)
      positionClass: 'toast-top-center', // Position on the page
      preventDuplicates: true, // Prevent duplicate toasts
      progressBar: true,
    }),
  ],
  providers: [provideAnimationsAsync(), { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent],
})
export class AppModule {}
