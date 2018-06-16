import { Component, OnInit } from '@angular/core';
import { BookService } from '../../service/book.service';

@Component({
  selector: 'app-student-sidebar',
  templateUrl: './student-sidebar.component.html',
  styleUrls: ['./student-sidebar.component.css']
})
export class StudentSidebarComponent implements OnInit {
  reservationCount="";
  borrowCount="";
  fineCount=0;
  user:any;
  searchText = {
    enteredText:JSON.parse(localStorage.getItem("user")).email
  };
  constructor(private bookService:BookService) {}

  ngOnInit() {
    this.bookService.getReservationCount().subscribe(res=>{
      this.reservationCount = res.msg;
    });

    this.bookService.getBorrowCount(JSON.parse(localStorage.getItem("user"))).subscribe(res=>{
      this.borrowCount = res.msg;
    });

    this.bookService.filterBorrowDetails(this.searchText).subscribe(res=>{
      for (let fine of res.msg) {
        if(fine.fine!=null){
          this.fineCount++;
        }
      }
    });
  }

}
