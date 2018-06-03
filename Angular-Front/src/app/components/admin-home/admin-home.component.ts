import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { BookService } from '../../service/book.service';
import { Router } from "@angular/router";

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css']
})
export class AdminHomeComponent implements OnInit {
  user:any;
  reservationCount:any;
  bookSuggestionCount:any;
  constructor(private bookService:BookService,private authService:AuthService,private router:Router) { }

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
    }

    this.bookService.getTotalReservations().subscribe(res=>{
      console.log(res);
      this.reservationCount = res.msg;
    });

    this.bookService.getTotalSuggestions().subscribe(res=>{
      console.log(res);
      this.bookSuggestionCount = res.msg;
    });
  }
}
