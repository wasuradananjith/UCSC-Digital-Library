import { Component, OnInit, TemplateRef } from '@angular/core';
import { AuthService} from "../../service/auth.service";
import { BookService} from "../../service/book.service";
import { StudentService} from "../../service/student.service";
import { Router } from "@angular/router";
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { FlashMessagesService } from 'angular2-flash-messages';


@Component({
  selector: 'app-admin-books',
  templateUrl: './admin-books.component.html',
  styleUrls: ['./admin-books.component.css']
})
export class AdminBooksComponent implements OnInit {
  modalRef: BsModalRef;
  message:String;
  modalMessage:String;
  user:any;
  books:any;
  students:any;
  book:any;
  student:any;
  oldNumberOfCopies:any;
  alertType:String;
  searchText = {
    enteredText:"",
    enteredTextStudent:""
  };
  constructor(private authService:AuthService,private studentService:StudentService,private router:Router,private modalService: BsModalService,
              private flashMessage:FlashMessagesService,private bookService:BookService) {
  }

  ngOnInit() {
    if (!this.authService.isLoggedIn()){
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
      this.onKeyBookSearch("true"); // load all the books
    }

  }

  // function to open a specific modal
  openModal(template: TemplateRef<any>) {
    this.book={ isbn:'', title:'', author:'', subject:'', no_of_copies:''};
    this.modalRef = this.modalService.show(template);
  }

  // add a new book
  addBookData(){
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
    if (this.book.no_of_copies==""){
      this.flashMessage.show('Please fill all the fields', { cssClass: 'alert-danger', timeout: 1500 });
      return;
    }
    if (this.book.no_of_copies<=0){
      this.flashMessage.show('Invalid Details Provided!, Please Check Number of Copies', { cssClass: 'alert-danger', timeout: 1500 });
      return;
    }
    else{
      return this.bookService.addNewBook(this.book).subscribe(res=>{
        if (res.state){
          this.flashMessage.show(res.msg, { cssClass: 'alert-success', timeout: 2000 });
          this.book={ isbn:'', title:'', author:'', subject:'', no_of_copies:''};
          this.modalService.onHide.subscribe((reason: String) => {
            window.location.reload();
          });
        }
        else{
          this.flashMessage.show(res.msg, { cssClass: 'alert-danger', timeout: 2000 });
        }

      });
    }
  }

  // when something is typed on the search bar
  onKeyBookSearch(event: any) {
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

  // when borrow button is pressed
  onBorrow(template:TemplateRef<any>,book){
    this.book = book;
    this.modalRef = this.modalService.show(template,{class:'modal-lg'});
    this.onKeyStudentSearch("true"); // load the student details
  }

  // when edit button is pressed
  openEditModal(template:TemplateRef<any>,book){
    this.book = book;
    this.oldNumberOfCopies = book.no_of_copies;
    this.modalRef = this.modalService.show(template);
  }

  // when edit button is pressed
  openDeleteModal(template:TemplateRef<any>,book){
    this.book = book;
    this.modalRef = this.modalService.show(template);
  }

  // edit number of copies
  editBookData(){
    let newNumberOfCopies = this.book.no_of_copies;
    if (this.oldNumberOfCopies == newNumberOfCopies){
      this.flashMessage.show("No change has been done", { cssClass: 'alert-info', timeout: 2000 });
    }
    else{
      if (this.oldNumberOfCopies > newNumberOfCopies){
        if (this.book.no_of_available_copies<(this.oldNumberOfCopies-newNumberOfCopies)){
          this.flashMessage.show("Not enough number of available copies to delete", { cssClass: 'alert-info', timeout: 2000 });
        }
        else{
          this.bookService.editBookDetails(this.book,this.oldNumberOfCopies).subscribe(res=>{
            if(res.state==false){
              this.flashMessage.show(res.msg, { cssClass: 'alert-danger', timeout: 2000 });
            }
            else{
              this.flashMessage.show(res.msg, { cssClass: 'alert-success', timeout: 2000 });
            }
          });
        }
      }
      else{
        this.bookService.editBookDetails(this.book,this.oldNumberOfCopies).subscribe(res=>{
          if(res.state==false){
            this.flashMessage.show(res.msg, { cssClass: 'alert-danger', timeout: 2000 });
          }
          else{
            this.flashMessage.show(res.msg, { cssClass: 'alert-success', timeout: 2000 });
          }
        });
      }
    }
    this.modalService.onHide.subscribe((reason: String) => {
      window.location.reload();
    });

  }

  // delete a particular book
  deleteBook(template:TemplateRef<any>,book){
    this.book = book;
    // cannot delete book if someone already have it

    if (this.book.no_of_copies.toString()!=this.book.no_of_available_copies.toString()){
      this.alertType = "Error";
      this.modalMessage = "This book have already been reserved/borrowed, Cannot Delete!";
    }
    else{
      this.bookService.deleteBook(this.book).subscribe(res => {
        if (res.state) {
          this.alertType = "Success";
          this.modalMessage = res.msg;
        }
        else {
          this.alertType = "Error";
          this.modalMessage = res.msg;
        }
      });
    }
    this.modalRef = this.modalService.show(template);
    this.modalService.onHide.subscribe((reason: String) => {
      window.location.reload();
    });
  }


  // when something is typed on the search bar
  onKeyStudentSearch(event: any) {
    this.studentService.filterStudentDetails(this.searchText).subscribe(response=>{
      if(response.msg==""){
        this.message="No search results found";
      }
      else{
        this.message="";
      }
      this.students = response.msg;
    });
  }

  // after selecting the student proceed to borrow
  onStudentSelect(template:TemplateRef<any>,student){
    this.bookService.getBorrowCount(student).subscribe(res=>{
      // if the borrowed count is 2 or greater
      if (res.msg>=2){
        this.alertType = "Error";
        this.modalMessage = student.name+" have already borrowed 2 books!";
        this.modalRef = this.modalService.show(template);
      }
      else{
        this.bookService.borrowBook(this.book,student).subscribe(res => {
          if (res.state) {
            this.alertType = "Success";
            this.modalMessage = res.msg;
          }
          else {
            this.alertType = "Error";
            this.modalMessage = res.msg;
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
