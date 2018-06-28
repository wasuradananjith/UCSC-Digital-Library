import {Component, OnInit, TemplateRef} from '@angular/core';
import {AuthService} from "../../service/auth.service";
import {Router} from "@angular/router";
import {BookService} from "../../service/book.service";
import {BsModalRef} from "ngx-bootstrap/modal/bs-modal-ref.service";
import {BsModalService} from "ngx-bootstrap";

@Component({
  selector: 'app-admin-borrowed-books',
  templateUrl: './admin-borrowed-books.component.html',
  styleUrls: ['./admin-borrowed-books.component.css']
})
export class AdminBorrowedBooksComponent implements OnInit {
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
  constructor(private authService:AuthService,private router:Router,private bookService:BookService,private modalService:BsModalService) { }

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

      this.onKey("true"); // to load all borrowed books
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
      this.booksInitial = res.msg;
      this.books = this.booksInitial.slice(0,10);
      this.pagesNumber = this.booksInitial.length;
    });
  }

// when the return button is pressed
  onReturn(template:TemplateRef<any>,book) {
    this.bookService.returnBook(book).subscribe(res => {
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
}
