import { Component, OnInit } from '@angular/core';
import {BookService} from "../../service/book.service";


@Component({
  selector: 'app-admin-sidebar',
  templateUrl: './admin-sidebar.component.html',
  styleUrls: ['./admin-sidebar.component.css']
})
export class AdminSidebarComponent implements OnInit {
  reservationCount:any;
  bookSuggestionCount:any;
  fineCount=0;
  borrowedCount=0;
  constructor(private bookService:BookService) {

  }

  ngOnInit() {
    this.countTotalReservations();
    this.countTotalBorrows();
    this.countTotalSuggestions();
    setInterval(this.countTotalReservations.bind(this),5000);
    setInterval(this.countTotalSuggestions.bind(this),5000);
  }

  countTotalReservations(){
    this.bookService.getTotalReservations().subscribe(res=>{
      this.reservationCount = res.msg;
    });
  }

  countTotalSuggestions(){
    this.bookService.getTotalSuggestions().subscribe(res=>{
      this.bookSuggestionCount = res.msg;
    });
  }

  countTotalBorrows(){
    this.bookService.getAllBorrows().subscribe(res=>{
      for (let fine of res.msg) {
        this.borrowedCount++;
        if(fine.fine!=null){
          this.fineCount++;
        }
      }
    });

  }

}
