import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {BookService} from "../../service/book.service";
import {AuthService} from "../../service/auth.service";

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  user:any;
  reservationCount:any;
  bookSuggestionCount:any;
  fineCount=0;
  borrowedCount=0;
  constructor(private bookService:BookService,private authService:AuthService,private router:Router) { }

  ngOnInit() {
    if (!this.authService.isLoggedIn()){
      this.router.navigate(['']);
    }
    else{
      this.authService.getAdminHome().subscribe(res=>{
        this.user = res.user;
        console.log(this.user);

        if(this.user.type=="Student"){
          this.router.navigate(['student-home']);
        }
      });
    }

    this.bookService.getTotalReservations().subscribe(res=>{
      this.reservationCount = res.msg;
    });

    this.bookService.getTotalSuggestions().subscribe(res=>{
      this.bookSuggestionCount = res.msg;
    });

    // get today date
    let todaySeconds = new Date().getTime();

    // update daily overdue fine
    this.bookService.getAllBorrows().subscribe(res=>{
      for (let borrow of res.msg) {
        let returnDate = new Date(borrow.return_date);
        let timeDiff = todaySeconds - returnDate.getTime();
        let diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24))-1;
        if (diffDays>1){
          borrow.fine=diffDays*5;
          this.fineCount++;
          this.bookService.updateBorrowFine(borrow).subscribe(res=>{
            console.log(res);
          });
        }
        this.borrowedCount++;
      }
    });
  }
}
