import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../service/auth.service";
import { BookService } from "../../service/book.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-student-books',
  templateUrl: './student-books.component.html',
  styleUrls: ['./student-books.component.css']
})
export class StudentBooksComponent implements OnInit {
  imageURL:String;
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

}
