import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { BookService } from '../../service/book.service';
import { Router } from "@angular/router";


@Component({
  selector: 'app-admin-reservation',
  templateUrl: './admin-reservation.component.html',
  styleUrls: ['./admin-reservation.component.css']
})
export class AdminReservationComponent implements OnInit {
  user:any;
  books:any;
  searchText = {
    enteredText:""
  };
  constructor(private authService:AuthService,private bookService:BookService, private router:Router) { }

  ngOnInit() {
    if (!this.authService.isLoggedIn()){
      this.router.navigate(['']);
    }
    else{
      this.authService.getAdminHome().subscribe(res=>{
        this.user = res.user;
        console.log(this.user)

        if(this.user.type=="Student"){
          this.router.navigate(['student-home']);
        }
      });

      this.loadAllReservations();
    }
  }

  // get all reservation
  loadAllReservations(){
    this.bookService.fetchAllReservationsAdmin().subscribe(res=>{
      this.books = res.msg;

      console.log(this.books);
    });
  }


}
