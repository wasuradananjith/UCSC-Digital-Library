import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule,Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule} from "@angular/http";
import { FlashMessagesModule,FlashMessagesService } from 'angular2-flash-messages';

import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';

import { AuthService } from './service/auth.service';
import { AdminHomeComponent } from './components/admin-home/admin-home.component';
import { StudentHomeComponent } from './components/student-home/student-home.component';

const applicationRoutes:Routes=[
  {path:'login',component:LoginComponent},
  {path:'admin-home',component:AdminHomeComponent},
  {path:'student-home',component:StudentHomeComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    RegisterComponent,
    AdminHomeComponent,
    StudentHomeComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpModule,
    FlashMessagesModule,
    RouterModule.forRoot(applicationRoutes)
  ],
  providers: [AuthService,FlashMessagesService],
  bootstrap: [AppComponent]
})
export class AppModule { }
