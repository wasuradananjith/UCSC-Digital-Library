import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../service/auth.service";
import {Router} from "@angular/router";
import {BookService} from "../../service/book.service";

@Component({
  selector: 'app-admin-fines',
  templateUrl: './admin-fines.component.html',
  styleUrls: ['./admin-fines.component.css']
})
export class AdminFinesComponent implements OnInit {
  user:any;
  books:any;
  message:String;
  alertType:String;
  searchText = {
    enteredText:""
  };
  constructor(private authService:AuthService,private router:Router,private bookService:BookService) { }

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

      this.onKey("true"); // to load all reservations
    }
  }

  // when something is typed on the search bar
  onKey(event: any) {
    this.bookService.filterBorrowDetails(this.searchText).subscribe(res=>{
      if(res.msg==""){
        this.message="No search results found";
      }
      else{
        this.message="";
      }
      this.books = res.msg;
    });
  }

}
