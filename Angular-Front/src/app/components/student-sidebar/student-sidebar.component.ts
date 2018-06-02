import { Component, OnInit } from '@angular/core';
import { BookService } from '../../service/book.service';

@Component({
  selector: 'app-student-sidebar',
  templateUrl: './student-sidebar.component.html',
  styleUrls: ['./student-sidebar.component.css']
})
export class StudentSidebarComponent implements OnInit {
  reservationCount="";
  user:any;
  constructor(private bookService:BookService) {}

  ngOnInit() {
    this.bookService.getReservationCount().subscribe(res=>{
      this.reservationCount = res.msg;
    });
  }

}
