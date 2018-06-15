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

    this.bookService.getAllBorrows().subscribe(res=>{
      for (let borrow of res.msg) {
        let returnDate = new Date(borrow.return_date);
        console.log(returnDate);
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
