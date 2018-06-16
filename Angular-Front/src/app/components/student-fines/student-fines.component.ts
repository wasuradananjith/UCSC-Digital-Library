import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {BookService} from "../../service/book.service";
import {AuthService} from "../../service/auth.service";

@Component({
  selector: 'app-student-fines',
  templateUrl: './student-fines.component.html',
  styleUrls: ['./student-fines.component.css']
})
export class StudentFinesComponent implements OnInit {
  user:any;
  books:any;
  fineCount=0;
  message:String;
  alertType:String;
  searchText = {
    enteredText:JSON.parse(localStorage.getItem("user")).email
  };
  constructor(private authService:AuthService,private bookService:BookService, private router:Router) { }

  ngOnInit() {
    if (!this.authService.isLoggedIn()){
      this.router.navigate(['']);
    }
    else{
      this.authService.getStudentHome().subscribe(res=>{
        this.user = res.user;
        //console.log(this.user);
        this.searchText.enteredText = this.user.email;
        if(this.user.type=="Admin"){
          this.router.navigate(['admin-home']);
        }
      });
    }

    this.onKey(); // to load all fines
  }

  // when something is typed on the search bar
  onKey() {
    this.bookService.filterBorrowDetails(this.searchText).subscribe(res=>{
      if(res.msg==""){
        this.message="No search results found";
      }
      else{
        this.message="";
      }
      this.books = res.msg;

      for (let fine of res.msg) {
        if(fine.fine!=null){
          this.fineCount++;
        }
      }
    });
  }
}
