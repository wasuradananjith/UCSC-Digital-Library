import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../service/auth.service";
import {Router} from "@angular/router";
import {BookService} from "../../service/book.service";
import * as jsPDF from 'jspdf';

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
        console.log(this.user);

        if(this.user.type=="Student"){
          this.router.navigate(['student-home']);
        }
      });

      this.onKey("true"); // to load all reservations

    }
  }

  // when something is typed on the search bar
  onKey(event: any) {
    const doc = new jsPDF();

    doc.setFontSize(22);
    doc.text(20, 20, 'This is a title');
    doc.setFontSize(16);
    doc.text(20, 30, 'This is some normal sized text underneath.');

    let string = doc.output('datauristring');
    let iframe = "<iframe width='100%' height='100%' src='" + string + "'></iframe>"
    let x = window.open();
    x.document.open();
    x.document.write(iframe);
    x.document.close();

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
