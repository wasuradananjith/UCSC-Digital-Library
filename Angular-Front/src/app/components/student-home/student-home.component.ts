import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../service/auth.service";
import { Router } from "@angular/router";
import {BookService} from "../../service/book.service";

@Component({
  selector: 'app-student-home',
  templateUrl: './student-home.component.html',
  styleUrls: ['./student-home.component.css']
})
export class StudentHomeComponent implements OnInit {

  user:any;
  constructor(private authService:AuthService,private router:Router,private bookService:BookService){}

  ngOnInit() {
    if (!this.authService.isLoggedIn()){
      this.router.navigate(['']);
    }
    else{
      this.authService.getAdminHome().subscribe(res=>{
        this.user = res.user;
        console.log(this.user)

        if(this.user.type=="Admin"){
          this.router.navigate(['admin-home']);
        }
      });
    }

    // get today date
    let todaySeconds = new Date().getTime();

    // update daily overdue fine
    this.bookService.getAllBorrows().subscribe(res=>{
      for (let borrow of res.msg) {
        let returnDate = new Date(borrow.return_date);
        console.log(returnDate);
        let timeDiff = todaySeconds - returnDate.getTime();
        let diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
        if (diffDays>1){
          borrow.fine=diffDays*5;
          this.bookService.updateBorrowFine(borrow).subscribe(res=>{
            console.log(res);
          });
        }
      }
    });
  }

}
