import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule,Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule} from "@angular/http";
import { ModalModule } from 'ngx-bootstrap/modal';
import { FlashMessagesModule,FlashMessagesService } from 'angular2-flash-messages';

import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';

import { AuthService } from './service/auth.service';
import { AuthGuard } from './service/auth.guard';
import { AdminHomeComponent } from './components/admin-home/admin-home.component';
import { StudentHomeComponent } from './components/student-home/student-home.component'
import { JwtModule } from '@auth0/angular-jwt';
import { HomeComponent } from './components/home/home.component';
import { AdminSidebarComponent } from './components/admin-sidebar/admin-sidebar.component';
import { AdminTopbarComponent } from './components/admin-topbar/admin-topbar.component';
import { BooksComponent } from './components/books/books.component';

const applicationRoutes:Routes=[
  {path:'',component:HomeComponent},
  {path:'login',component:LoginComponent},
  {path:'admin-home',component:AdminHomeComponent},
  {path:'student-home',component:StudentHomeComponent},
  {path:'admin-home/books',component:BooksComponent}
];

export function tokenGetter() {
  return localStorage.getItem('tokenid');
}

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    RegisterComponent,
    AdminHomeComponent,
    StudentHomeComponent,
    HomeComponent,
    AdminSidebarComponent,
    AdminTopbarComponent,
    BooksComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpModule,
    FlashMessagesModule,
    RouterModule.forRoot(applicationRoutes),
    ModalModule.forRoot(),
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: ['localhost:4200'],
        blacklistedRoutes: ['localhost:4200/auth/']
      }
    })
  ],
  providers: [AuthService,AuthGuard,FlashMessagesService],
  bootstrap: [AppComponent]
})
export class AppModule { }
