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
  constructor(private bookService:BookService) { }

  ngOnInit() {
    this.bookService.getTotalReservations().subscribe(res=>{
      console.log(res);
      this.reservationCount = res.msg;
    });

    this.bookService.getTotalSuggestions().subscribe(res=>{
      console.log(res);
      this.bookSuggestionCount = res.msg;
    });
  }

}
