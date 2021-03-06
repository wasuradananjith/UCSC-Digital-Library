import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../service/auth.service";
import {Router} from "@angular/router";
import {BookService} from "../../service/book.service";

@Component({
  selector: 'app-admin-borrow-history',
  templateUrl: './admin-borrow-history.component.html',
  styleUrls: ['./admin-borrow-history.component.css']
})
export class AdminBorrowHistoryComponent implements OnInit {
  start:number;
  end:number;
  currentPage = 1;
  pagesNumber=0;
  page: number;
  user: any;
  books: any;
  booksInitial:any;
  message: String;
  alertType: String;
  searchText = {
    enteredText: ""
  };

  constructor(private authService:AuthService,private router:Router,private bookService:BookService) {
  }

  ngOnInit() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['']);
    }
    else {
      this.authService.getAdminHome().subscribe(res => {
        this.user = res.user;
        console.log(this.user)

        if (this.user.type == "Student") {
          this.router.navigate(['student-home']);
        }
      });

      this.onKey("true"); // to load all returned books
    }
  }


  // on pagination changed
  pageChanged(event: any): void {
    this.start = 10*(event.page-1);
    this.end = this.start + 10;
    this.books = this.booksInitial.slice(this.start,this.end);

  }

  // when something is typed on the search bar
  onKey(event: any) {
    this.bookService.filterReturnDetails(this.searchText).subscribe(res => {
      if (res.msg == "") {
        this.message = "No search results found";
      }
      else {
        this.message = "";
      }
      this.booksInitial = res.msg;
      this.books = this.booksInitial.slice(0,10);
      this.pagesNumber = this.booksInitial.length;
    });
  }
}
