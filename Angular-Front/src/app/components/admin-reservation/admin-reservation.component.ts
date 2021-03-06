import {Component, OnInit, TemplateRef} from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { BookService } from '../../service/book.service';
import { Router } from "@angular/router";
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';


@Component({
  selector: 'app-admin-reservation',
  templateUrl: './admin-reservation.component.html',
  styleUrls: ['./admin-reservation.component.css']
})
export class AdminReservationComponent implements OnInit {
  start:number;
  end:number;
  currentPage = 1;
  pagesNumber=0;
  page: number;
  modalRef:BsModalRef;
  user:any;
  books:any;
  booksInitial:any;
  message:String;
  alertType:String;
  searchText = {
    enteredText:""
  };
  constructor(private modalService:BsModalService,private authService:AuthService,private bookService:BookService, private router:Router) { }

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
    this.bookService.filterReservationDetails(this.searchText).subscribe(res=>{
      if(res.msg==""){
        this.message="No search results found";
      }
      else{
        this.message="";
      }
      this.booksInitial = res.msg;
      this.books = this.booksInitial.slice(0,10);
      this.pagesNumber = this.booksInitial.length;
    });
  }

  // when the cancel button is pressed
  onCancel(template:TemplateRef<any>,book) {
    this.bookService.cancelReservation(book).subscribe(res => {
      if (res.state) {
        this.alertType = "Success";
        this.message = res.msg;
      }
      else {
        this.alertType = "Error";
        this.message = res.msg;
      }
      this.modalRef = this.modalService.show(template);
      this.modalService.onHide.subscribe((reason: String) => {
        window.location.reload();
      });
      //this.router.navigate(['student-home']);
    });
  }

  // when the borrow button is pressed
  onBorrow(template:TemplateRef<any>,book) {
    let student = {email:book.email};

    this.bookService.getBorrowCount(student).subscribe(res=>{
      // if the borrowed count is 2 or greater
      if (res.msg>=2){
        this.alertType = "Error";
        this.message = book.student.name+" have already borrowed 2 books!";
        this.modalRef = this.modalService.show(template);
      }
      else{
        this.bookService.borrowReservation(book).subscribe(res => {
          if (res.state) {
            this.alertType = "Success";
            this.message = res.msg;
          }
          else {
            this.alertType = "Error";
            this.message = res.msg;
          }
          this.modalRef = this.modalService.show(template);
          this.modalService.onHide.subscribe((reason: String) => {
            window.location.reload();
          });
        });
      }
    });
  }
}
