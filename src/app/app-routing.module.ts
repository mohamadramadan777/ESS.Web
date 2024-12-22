import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';

import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { ContactUsComponent } from './components/contact-us/contact-us.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'Register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'Login', redirectTo: 'login' },
  { path: 'home', component: HomeComponent , canActivate: [AuthGuard] },
  { path: 'Home', component: HomeComponent , canActivate: [AuthGuard] },
  { path: 'contactus', component: ContactUsComponent },
  { path: 'Contactus', component: ContactUsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
