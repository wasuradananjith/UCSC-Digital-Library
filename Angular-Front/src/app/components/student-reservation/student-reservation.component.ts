import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../service/auth.service";
import { BookService } from "../../service/book.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-student-reservation',
  templateUrl: './student-reservation.component.html',
  styleUrls: ['./student-reservation.component.css']
})
export class StudentReservationComponent implements OnInit {
  user:any;
  books:any;
  constructor(private authService:AuthService,private bookService:BookService,private router:Router) { }

  ngOnInit() {
    if (!this.authService.isLoggedIn()){
      this.router.navigate(['']);
    }
    else{
      this.authService.getStudentHome().subscribe(res=>{
        this.user = res.user;
        console.log(this.user)
        if(this.user.type=="Admin"){
          this.router.navigate(['admin-home']);
        }

      });
      this.loadAllReservations();
    }

  }

  // get all reservation of the particular user
  loadAllReservations(){
    this.bookService.fetchAllReservations().subscribe(res=>{
      this.books = res.msg;

      console.log(this.books);
    });
  }
}
