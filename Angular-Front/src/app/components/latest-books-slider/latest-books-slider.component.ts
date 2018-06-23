import { Component, OnInit } from '@angular/core';
import {BookService} from "../../service/book.service";

@Component({
  selector: 'app-latest-books-slider',
  templateUrl: './latest-books-slider.component.html',
  styleUrls: ['./latest-books-slider.component.css']
})
export class LatestBooksSliderComponent implements OnInit {
  booklist=[];
  constructor(private bookService:BookService) {

  }

  ngOnInit() {
    this.bookService.fetchAllBookDetails().subscribe(res=>{
      let i;
      for (i = 0; i < 9; i++) {
        this.booklist.push(res.msg[i]);
      }
    });
  }

}
