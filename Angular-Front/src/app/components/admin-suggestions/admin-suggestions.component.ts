import {Component, OnInit, TemplateRef} from '@angular/core';
import {AuthService} from "../../service/auth.service";
import {Router} from "@angular/router";
import {BookService} from "../../service/book.service";
import {BsModalRef, BsModalService} from "ngx-bootstrap";

@Component({
  selector: 'app-admin-suggestions',
  templateUrl: './admin-suggestions.component.html',
  styleUrls: ['./admin-suggestions.component.css']
})
export class AdminSuggestionsComponent implements OnInit {
  modalRef:BsModalRef;
  user:any;
  books:any;
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
    }

    this.onKey("true");
  }

  // when something is typed on the search bar
  onKey(event: any) {
    this.bookService.filterSuggestionDetails(this.searchText).subscribe(res=>{
      if(res.msg==""){
        this.message="No search results found";
      }
      else{
        this.message="";
      }
      this.books = res.msg;
    });
  }

  // when the dissmiss button is pressed
  onDismiss(template:TemplateRef<any>,book) {
    this.bookService.dismissSuggestion(book).subscribe(res => {
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
