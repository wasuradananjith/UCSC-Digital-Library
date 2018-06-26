import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { HttpModule} from "@angular/http";
import { ModalModule,BsDropdownModule,CarouselModule,TabsModule,BsDatepickerModule} from 'ngx-bootstrap';
import { FlashMessagesModule,FlashMessagesService } from 'angular2-flash-messages';
import { AngularFontAwesomeModule } from 'angular-font-awesome';

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
import { StudentSidebarComponent } from './components/student-sidebar/student-sidebar.component';
import { StudentBooksComponent } from './components/student-books/student-books.component';
import { StudentReservationComponent } from './components/student-reservation/student-reservation.component';
import { AdminReservationComponent } from './components/admin-reservation/admin-reservation.component';
import { AdminBooksComponent } from './components/admin-books/admin-books.component';
import { AppRoutingModule } from './app-routing.module';
import { AdminSuggestionsComponent } from './components/admin-suggestions/admin-suggestions.component';
import { AdminBorrowedBooksComponent } from './components/admin-borrowed-books/admin-borrowed-books.component';
import { AdminFinesComponent } from './components/admin-fines/admin-fines.component';
import { AdminBorrowHistoryComponent } from './components/admin-borrow-history/admin-borrow-history.component';
import { AdminReportsComponent } from './components/admin-reports/admin-reports.component';
import { StudentBorrowedBooksComponent } from './components/student-borrowed-books/student-borrowed-books.component';
import { StudentBorrowHistoryComponent } from './components/student-borrow-history/student-borrow-history.component';
import { StudentFinesComponent } from './components/student-fines/student-fines.component';
import { LatestBooksSliderComponent } from './components/latest-books-slider/latest-books-slider.component';
import { FooterComponent } from './components/footer/footer.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import {BookService} from "./service/book.service";
import {StudentService} from "./service/student.service";

/*
const applicationRoutes:Routes=[
  {path:'',component:HomeComponent},
  {path:'login',component:LoginComponent},
  {path:'admin-home',component:AdminHomeComponent},
  {path:'student-home',component:StudentHomeComponent},
  {path:'admin-home/books',component:AdminBooksComponent},
  {path:'student-home/books',component:StudentBooksComponent},
  {path:'student-home/reservations',component:StudentReservationComponent},
  {path:'admin-home/reservations',component:AdminReservationComponent}
];
*/

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
    StudentSidebarComponent,
    StudentBooksComponent,
    StudentReservationComponent,
    AdminReservationComponent,
    AdminBooksComponent,
    AdminSuggestionsComponent,
    AdminBorrowedBooksComponent,
    AdminFinesComponent,
    AdminBorrowHistoryComponent,
    AdminReportsComponent,
    StudentBorrowedBooksComponent,
    StudentBorrowHistoryComponent,
    StudentFinesComponent,
    LatestBooksSliderComponent,
    FooterComponent,
    AdminDashboardComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    HttpModule,
    FlashMessagesModule,
    AngularFontAwesomeModule,
    BsDropdownModule.forRoot(),
    CarouselModule.forRoot(),
    ModalModule.forRoot(),
    BsDatepickerModule.forRoot(),
    TabsModule.forRoot(),
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: ['localhost:4200'],
        blacklistedRoutes: ['localhost:4200/auth/']
      }
    }),
    AppRoutingModule
  ],
  providers: [AuthService,AuthGuard,FlashMessagesService,BookService,StudentService],
  bootstrap: [AppComponent]
})
export class AppModule { }
