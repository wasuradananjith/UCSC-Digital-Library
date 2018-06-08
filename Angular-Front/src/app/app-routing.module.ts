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

const routes: Routes = [
  {path:'',component:HomeComponent},
  {path:'login',component:LoginComponent},
  {path:'admin-home',component:AdminHomeComponent},
  {path:'student-home',component:StudentHomeComponent},
  {path:'admin-home/books',component:AdminBooksComponent},
  {path:'student-home/books',component:StudentBooksComponent},
  {path:'student-home/reservations',component:StudentReservationComponent},
  {path:'admin-home/reservations',component:AdminReservationComponent}
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
