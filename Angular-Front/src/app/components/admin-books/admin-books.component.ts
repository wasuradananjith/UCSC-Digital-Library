import { Component, OnInit, TemplateRef } from '@angular/core';
import { AuthService} from "../../service/auth.service";
import { BookService} from "../../service/book.service";
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
  user:any;
  books:any;
  book:any;
  searchText = {
    enteredText:""
  };
  constructor(private authService:AuthService,private router:Router,private modalService: BsModalService,
              private flashMessage:FlashMessagesService,private bookService:BookService) {
  }

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
      this.loadAllBooks();
    }

  }

  // function to open a specific modal
  openModal(template: TemplateRef<any>) {
    this.book={ isbn:'', title:'', author:'', subject:'', no_of_copies:''};
    this.modalRef = this.modalService.show(template);
  }

  // load all the books
  loadAllBooks(){
    this.bookService.fetchAllBookDetails().subscribe(res=>{
      this.books = res.msg;
    });
  }

  // add a new book
  addBookData(){
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
    if (this.book.no_of_copies==""){
      this.flashMessage.show('Please fill all the fields', { cssClass: 'alert-danger', timeout: 1500 });
      return;
    }
    else{
      return this.bookService.addNewBook(this.book).subscribe(res=>{
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
