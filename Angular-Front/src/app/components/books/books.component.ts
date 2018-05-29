import { Component, OnInit, TemplateRef } from '@angular/core';
import { AuthService} from "../../service/auth.service";
import { BookService} from "../../service/book.service";
import { Router } from "@angular/router";
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css']
})
export class BooksComponent implements OnInit {
  modalRef: BsModalRef;
  user:any;
  book={
    isbn:'',
    title:'',
    author:'',
    no_of_copies:''
  };
  addNewBookForm:FormGroup;
  constructor(private authService:AuthService,private router:Router,private modalService: BsModalService,
              private fb:FormBuilder, private flashMessage:FlashMessagesService,private bookService:BookService) {
    this.createForm();
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
    }

  }

  createForm(){
    this.addNewBookForm = this.fb.group({
      isbn: ['', Validators.required],
      title: ['', Validators.required],
      author: ['', Validators.required],
      no_of_copies: ['', Validators.required]
    });
  }

  // function to open a specific modal
  openModal(template: TemplateRef<any>) {
    this.book={
      isbn:'',
      title:'',
      author:'',
      no_of_copies:''
    };
    this.modalRef = this.modalService.show(template);
  }

  // register a new student
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
    if (this.book.no_of_copies==""){
      this.flashMessage.show('Please fill all the fields', { cssClass: 'alert-danger', timeout: 1500 });
      return;
    }
    else{
      return this.bookService.addNewBook(this.book).subscribe(res=>{
        if (res.state){
          this.flashMessage.show(res.msg, { cssClass: 'alert-success', timeout: 2000 });
          this.addNewBookForm.reset();
        }
        else{
          this.flashMessage.show(res.msg, { cssClass: 'alert-danger', timeout: 2000 });
        }

      });
    }

  }


}
