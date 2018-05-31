import { Injectable } from '@angular/core';
import {Headers, Http} from "@angular/http";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class BookService {

  constructor(private http:Http) { }

  // send the reques to backend to add a new book
  addNewBook(book){
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post("http://localhost:3000/book/add",book,{headers:headers}).pipe(map(res=>res.json()));
  }

  // get all the book details
  fetchAllBookDetails(){
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post("http://localhost:3000/book/get-all",{headers:headers}).pipe(map(res=>res.json()));
  }
}

