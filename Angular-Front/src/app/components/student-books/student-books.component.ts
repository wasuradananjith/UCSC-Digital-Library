import {Component, OnInit, TemplateRef} from '@angular/core';
import { AuthService } from "../../service/auth.service";
import { BookService } from "../../service/book.service";
import { Router } from "@angular/router";
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import * as $ from 'jquery';

@Component({
  selector: 'app-student-books',
  templateUrl: './student-books.component.html',
  styleUrls: ['./student-books.component.css']
})
export class StudentBooksComponent implements OnInit {
  modalRef:BsModalRef;
  message:String;
  alertType:String;
  searchText = {
    enteredText:""
  };
  user:any;
  books:any;
  constructor(private authService:AuthService,private bookService:BookService,private router:Router,private modalService: BsModalService) { }

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
      if(res.msg==""){
        this.message="No search results found";
      }
      else{
        this.message="";
      }
      this.books = res.msg;
    });
  }

  // when the reserve button is pressed
  onReserve(template:TemplateRef<any>,book){
    this.bookService.reserveCopy(book).subscribe(res=>{
        if(res.state){
          this.alertType="Success";
          this.message=res.msg;
        }
        else{
          this.alertType="Error";
          this.message=res.msg;
        }
      this.modalRef = this.modalService.show(template);
        this.modalService.onHide.subscribe((reason :String)=>{
          window.location.reload();
        });
      //this.router.navigate(['student-home']);
    });
  }



}
