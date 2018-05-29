import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css']
})
export class BooksComponent implements OnInit {
  user:any;
  constructor() { }

  ngOnInit() {
    if (localStorage.getItem("user")!=null){
      this.user = JSON.parse(localStorage.getItem("user"));
    }
  }

}
