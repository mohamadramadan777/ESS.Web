import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';

import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { ContactUsComponent } from './components/contact-us/contact-us.component';
import { SystemAccessComponent } from './components/system-access/system-access.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'Register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'Login', redirectTo: 'login' },
  // { path: 'home', component: HomeComponent , canActivate: [AuthGuard] },
  // { path: 'Home', component: HomeComponent , canActivate: [AuthGuard] },
  { path: 'home', component: HomeComponent },
  { path: 'Home', component: HomeComponent },
  { path: 'contactus', component: ContactUsComponent },
  { path: 'Contactus', component: ContactUsComponent },
  { path: 'system-access', component: SystemAccessComponent },
  { path: 'System-access', component: SystemAccessComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
