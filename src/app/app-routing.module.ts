import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';

import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { ContactUsComponent } from './components/contact-us/contact-us.component';
import { SystemAccessComponent } from './components/system-access/system-access.component';
import { AuthGuard } from './guards/auth.guard';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { ChangeEmailComponent } from './components/change-email/change-email.component';
import { ChangeSecurityquestionsComponent } from './components/change-securityquestions/change-securityquestions.component';
import { NoticesComponent } from './components/notices/notices.component';
import { ReportsComponent } from './components/reports/reports.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'Register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'Login', redirectTo: 'login' },
  { path: 'home', component: HomeComponent , canActivate: [AuthGuard] },
  { path: 'Home', component: HomeComponent , canActivate: [AuthGuard] },
  { path: 'Reports', component: ReportsComponent , canActivate: [AuthGuard] },
  { path: 'reports', component: ReportsComponent , canActivate: [AuthGuard] },
  { path: 'Notices', component: NoticesComponent , canActivate: [AuthGuard] },
  { path: 'notices', component: NoticesComponent , canActivate: [AuthGuard] },
  { path: 'resetpassword', component: ResetPasswordComponent , canActivate: [AuthGuard] },
  { path: 'Resetpassword', component: ResetPasswordComponent , canActivate: [AuthGuard] },
  { path: 'changeemail', component: ChangeEmailComponent , canActivate: [AuthGuard] },
  { path: 'Changeemail', component: ChangeEmailComponent , canActivate: [AuthGuard] },
  { path: 'changequestion', component: ChangeSecurityquestionsComponent , canActivate: [AuthGuard] },
  { path: 'Changequestion', component: ChangeSecurityquestionsComponent , canActivate: [AuthGuard] },  
  // { path: 'home', component: HomeComponent },
  // { path: 'Home', component: HomeComponent },
  { path: 'contactus', component: ContactUsComponent },
  { path: 'Contactus', component: ContactUsComponent },
  { path: 'system-access', component: SystemAccessComponent, canActivate: [AuthGuard] },
  { path: 'System-access', component: SystemAccessComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
