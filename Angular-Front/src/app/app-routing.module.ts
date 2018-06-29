import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {LoginComponent} from "./components/login/login.component";
import {HomeComponent} from "./components/home/home.component";
import {AdminBooksComponent} from "./components/admin-books/admin-books.component";
import {StudentHomeComponent} from "./components/student-home/student-home.component";
import {AdminReservationComponent} from "./components/admin-reservation/admin-reservation.component";
import {AdminHomeComponent} from "./components/admin-home/admin-home.component";
import {StudentBooksComponent} from "./components/student-books/student-books.component";
import {StudentReservationComponent} from "./components/student-reservation/student-reservation.component";
import {AdminSuggestionsComponent} from "./components/admin-suggestions/admin-suggestions.component";
import {AdminBorrowedBooksComponent} from "./components/admin-borrowed-books/admin-borrowed-books.component";
import {AdminFinesComponent} from "./components/admin-fines/admin-fines.component";
import {AdminBorrowHistoryComponent} from "./components/admin-borrow-history/admin-borrow-history.component";
import {AdminReportsComponent} from "./components/admin-reports/admin-reports.component";
import {StudentBorrowedBooksComponent} from "./components/student-borrowed-books/student-borrowed-books.component";
import {StudentBorrowHistoryComponent} from "./components/student-borrow-history/student-borrow-history.component";
import {StudentFinesComponent} from "./components/student-fines/student-fines.component";
import {AdminDashboardComponent} from "./components/admin-dashboard/admin-dashboard.component";
import {AdminManageUserComponent} from "./components/admin-manage-user/admin-manage-user.component";

const routes: Routes = [
  {path:'',component:HomeComponent},
  {path:'login',component:LoginComponent},
  {path:'admin-home',component:AdminHomeComponent,
    children:[
      {path:'',component:AdminDashboardComponent},
      {path:'books',component:AdminBooksComponent},
      {path:'reservations',component:AdminReservationComponent},
      {path:'suggestions',component:AdminSuggestionsComponent},
      {path:'borrowed-books',component:AdminBorrowedBooksComponent},
      {path:'fines',component:AdminFinesComponent},
      {path:'borrow-history',component:AdminBorrowHistoryComponent},
      {path:'reports',component:AdminReportsComponent},
      {path:'manage-users',component:AdminManageUserComponent}
      ]
  },
  {path:'student-home', component:StudentHomeComponent,
    children:[
      {path:'',component:StudentBooksComponent},
      {path:'books',component:StudentBooksComponent},
      {path:'reservations',component:StudentReservationComponent},
      {path:'borrowed-books',component:StudentBorrowedBooksComponent},
      {path:'borrow-history',component:StudentBorrowHistoryComponent},
      {path:'fines',component:StudentFinesComponent}
    ]
  }
];


/*const routes: Routes = [
  {path:'',component:HomeComponent},
  {path:'login',component:LoginComponent},
  {path:'admin-home',component:AdminHomeComponent},
  {path:'student-home', component:StudentHomeComponent},
  {path:'admin-home/books',component:AdminBooksComponent},
  {path:'admin-home/reservations',component:AdminReservationComponent},
  {path:'admin-home/suggestions',component:AdminSuggestionsComponent},
  {path:'admin-home/borrowed-books',component:AdminBorrowedBooksComponent},
  {path:'admin-home/fines',component:AdminFinesComponent},
  {path:'admin-home/borrow-history',component:AdminBorrowHistoryComponent},
  {path:'admin-home/reports',component:AdminReportsComponent},
  {path:'student-home/books',component:StudentBooksComponent},
  {path:'student-home/reservations',component:StudentReservationComponent},
  {path:'student-home/borrowed-books',component:StudentBorrowedBooksComponent},
  {path:'student-home/borrow-history',component:StudentBorrowHistoryComponent},
  {path:'student-home/fines',component:StudentFinesComponent}
];*/


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
