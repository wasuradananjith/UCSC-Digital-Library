import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../service/auth.service";
import {Router} from "@angular/router";
import {BookService} from "../../service/book.service";

@Component({
  selector: 'app-student-borrow-history',
  templateUrl: './student-borrow-history.component.html',
  styleUrls: ['./student-borrow-history.component.css']
})
export class StudentBorrowHistoryComponent implements OnInit {
  user:any;
  books: any;
  message: String;
  alertType: String;
  searchText = {
    enteredText: ""
  };
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
    }
    this.onKey("true"); // to load all returned books
  }

  // when something is typed on the search bar
  onKey(event: any) {
    let details = {email:JSON.parse(localStorage.getItem("user")).email,enteredText:this.searchText.enteredText};
    this.bookService.filterReturnDetailsStudent(details).subscribe(res => {
      if (res.msg == "") {
        this.message = "No search results found";
      }
      else {
        this.message = "";
      }
      this.books = res.msg;
    });
  }

}
