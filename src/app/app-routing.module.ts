import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { ContactUsComponent } from './components/contact-us/contact-us.component';
import { SystemAccessComponent } from './components/system-access/system-access.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { ChangeEmailComponent } from './components/change-email/change-email.component';
import { ChangeSecurityquestionsComponent } from './components/change-securityquestions/change-securityquestions.component';
import { NoticesComponent } from './components/notices/notices.component';
import { ReportsComponent } from './components/reports/reports.component';
import { SubmissionRecordsComponent } from './components/submission-records/submission-records.component';
import { UserManagementComponent } from './components/user-management/user-management.component';
 import { AdministrationComponent } from './components/administration/administration.component';
import { AiApplicationsComponent } from './components/ai-applications/ai-applications.component';
import { CreateNewUserComponent } from './components/user-management/create-new-user/create-new-user.component';
import { UserComponent } from './components/user-management/user/user.component';
 import { CreateNewWorkflowComponent } from './components/workflows/create-new-workflow/create-new-workflow.component';
import { WorkflowsComponent } from './components/workflows/workflows.component';
import { CreateNewNotificationComponent } from './components/notifications/create-new-notification/create-new-notification.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { ManageFirmsComponent } from './components/administration/manage-firms/manage-firms.component';
import { ManageConfigurationComponent } from './components/administration/manage-configuration/manage-configuration.component';
import { AdminReportsComponent } from './components/administration/admin-reports/admin-reports.component';
import { CreateNewAiApplicationComponent } from './components/ai-applications/create-new-ai-application/create-new-ai-application.component';


const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
   { path: 'login', component: LoginComponent },
  { path: 'Login', redirectTo: 'login' },
  { path: 'home', component: HomeComponent },
   { path: 'Reports', component: ReportsComponent },
  { path: 'reports', component: ReportsComponent },
  { path: 'Notices', component: NoticesComponent },
  { path: 'notices', component: NoticesComponent },
  { path: 'resetpassword', component: ResetPasswordComponent },
  { path: 'Resetpassword', component: ResetPasswordComponent },
  { path: 'changeemail', component: ChangeEmailComponent },
  { path: 'Changeemail', component: ChangeEmailComponent },
  { path: 'changequestion', component: ChangeSecurityquestionsComponent },
  { path: 'Changequestion', component: ChangeSecurityquestionsComponent },
  { path: 'contactus', component: ContactUsComponent },
  { path: 'Contactus', component: ContactUsComponent },
  { path: 'user-management', component: UserManagementComponent },
  { path: 'administration', component: AdministrationComponent },
  { path: 'workflows', component: WorkflowsComponent },
  { path: 'notifications', component: NotificationsComponent },
  
  { path: 'create-new-ai-application', component: CreateNewAiApplicationComponent },


  { path: 'ai-applications', component: AiApplicationsComponent },
  { path: 'System-access', component: SystemAccessComponent },
  { path: 'submission-records', component: SubmissionRecordsComponent },
  { path: 'Submission-records', component: SubmissionRecordsComponent },
  { path: 'create-new-user', component: CreateNewUserComponent },
  { path: 'user', component: UserComponent },
 
  { path: 'create-new-workflow', component: CreateNewWorkflowComponent },
  { path: 'workflows', component: WorkflowsComponent },
  { path: 'create-new-notification', component: CreateNewNotificationComponent },
  { path: 'notifications', component: NotificationsComponent },
  { path: 'manage-firms', component: ManageFirmsComponent },
  { path: 'manage-configuration', component: ManageConfigurationComponent },
  { path: 'admin-reports', component: AdminReportsComponent },
   { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
