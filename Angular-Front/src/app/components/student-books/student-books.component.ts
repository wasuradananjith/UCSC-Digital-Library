import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../service/auth.service";
import { BookService } from "../../service/book.service";
import { Router } from "@angular/router";

import * as $ from 'jquery';

@Component({
  selector: 'app-student-books',
  templateUrl: './student-books.component.html',
  styleUrls: ['./student-books.component.css']
})
export class StudentBooksComponent implements OnInit {
  imageURL:any;
  searchText = {
    enteredText:""
  };
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
      this.imageURL="https://www.freeiconspng.com/uploads/no-image-icon-6.png";
      this.loadAllBooks();


    }
  }

  // load all the books
  loadAllBooks(){
    this.bookService.fetchAllBookDetails().subscribe(res=>{
      this.books = res.msg;
    });
  }


  // when something is typed on the search bar
  onKey(event: any) {
    this.bookService.filterBookDetails(this.searchText).subscribe(res=>{
      this.books = res.msg;
    });
  }

}
