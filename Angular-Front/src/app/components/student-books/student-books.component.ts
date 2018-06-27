import {Component, OnInit, TemplateRef} from '@angular/core';
import { AuthService } from "../../service/auth.service";
import { BookService } from "../../service/book.service";
import { Router } from "@angular/router";
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { FlashMessagesService } from 'angular2-flash-messages';

import * as $ from 'jquery';

@Component({
  selector: 'app-student-books',
  templateUrl: './student-books.component.html',
  styleUrls: ['./student-books.component.css']
})
export class StudentBooksComponent implements OnInit {
  modalRef:BsModalRef;
  message:String;
  modalMessage:String;
  alertType:String;
  reservationCount:any;
  searchText = {
    enteredText:""
  };
  user:any;
  books:any;
  book:any;
  constructor(private flashMessage:FlashMessagesService,private authService:AuthService,private bookService:BookService,private router:Router,private modalService: BsModalService) { }

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

    this.bookService.getReservationCount().subscribe(res=>{
      this.reservationCount = res.msg;
      console.log(this.reservationCount);
    });
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
    // you can only reserve upto 5 books
    if (this.reservationCount!=[] && this.reservationCount<5){
      this.bookService.reserveCopy(book).subscribe(res=>{
        if(res.state){
          this.alertType="Success";
          this.modalMessage=res.msg;
        }
        else{
          this.alertType="Error";
          this.modalMessage=res.msg;
        }
        this.modalRef = this.modalService.show(template);
        this.modalService.onHide.subscribe((reason :String)=>{
          window.location.reload();
        });
        //this.router.navigate(['student-home']);
      });
    }
    else{
      this.alertType="Error";
      this.modalMessage="You cannot reserve more than 5 books";
      this.modalRef = this.modalService.show(template);
    }

  }

// function to open a specific modal
  openSuggestionModal(template: TemplateRef<any>) {
    this.book={ isbn:'', title:'', author:'', subject:''};
    this.modalRef = this.modalService.show(template);
  }

  // add a new suggestion
  addSuggestionData(){
    console.log(this.book);
    // check whether all the fields are filled
    if (this.book.isbn==""){
      this.flashMessage.show('Please fill all the fields', { cssClass: 'alert-danger', timeout: 1500 });
      return;
    }
    if (this.book.title==""){
      this.flashMessage.show('Please fill all the fields', { cssClass: 'alert-danger', timeout: 1500 });
      return;
    }
    if (this.book.author==""){
      this.flashMessage.show('Please fill all the fields', { cssClass: 'alert-danger', timeout: 1500 });
      return;
    }
    if (this.book.subject==""){
      this.flashMessage.show('Please fill all the fields', { cssClass: 'alert-danger', timeout: 1500 });
      return;
    }
    else{
      this.book.email=JSON.parse(localStorage.getItem("user")).email;
      return this.bookService.addNewBookSuggestion(this.book).subscribe(res=>{
        if (res.state){
          this.flashMessage.show(res.msg, { cssClass: 'alert-success', timeout: 2000 });
          this.book={ isbn:'', title:'', author:'', subject:'', no_of_copies:''};
        }
        else{
          this.flashMessage.show(res.msg, { cssClass: 'alert-danger', timeout: 2000 });
        }

      });
    }

  }

}
