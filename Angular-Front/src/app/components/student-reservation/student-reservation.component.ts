import {Component, OnInit, TemplateRef} from '@angular/core';
import { AuthService } from "../../service/auth.service";
import { BookService } from "../../service/book.service";
import { Router } from "@angular/router";
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';


@Component({
  selector: 'app-student-reservation',
  templateUrl: './student-reservation.component.html',
  styleUrls: ['./student-reservation.component.css']
})
export class StudentReservationComponent implements OnInit {
  modalRef:BsModalRef;
  user:any;
  alertType:any;
  message="";
  books:any;
  constructor(private modalService:BsModalService,private authService:AuthService,private bookService:BookService,private router:Router) { }

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
      this.loadAllReservations();
    }

  }

  // get all reservation of the particular user
  loadAllReservations(){
    this.bookService.fetchAllReservations().subscribe(res=>{
      this.books = res.msg;

      console.log(this.books);
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
}
