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

  // search book details
  filterBookDetails(searchText){
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post("http://localhost:3000/book/search",searchText,{headers:headers}).pipe(map(res=>res.json()));
  }

  // search book details
  filterReservationDetails(searchText){
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post("http://localhost:3000/book/reservation-search",searchText,{headers:headers}).pipe(map(res=>res.json()));
  }

  // search book details
  reserveCopy(book){
    let student = JSON.parse(localStorage.getItem("user"));
    let reservation = {
      email: student.email,
      isbn:book.isbn,
      title:book.title,
      author:book.author,
      subject:book.subject,
      copies:book.copies
    };

    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post("http://localhost:3000/book/reserve",reservation,{headers:headers}).pipe(map(res=>res.json()));
  }

  // get the reservation count for a particular user
  getReservationCount(){
    let student = JSON.parse(localStorage.getItem("user"));
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post("http://localhost:3000/book/reservation-count",student,{headers:headers}).pipe(map(res=>res.json()));
  }

  // get the reservations for a particular user
  fetchAllReservations(){
    let student = JSON.parse(localStorage.getItem("user"));
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post("http://localhost:3000/book/reservations-student",student,{headers:headers}).pipe(map(res=>res.json()));
  }

  // cancel a reservation
  cancelReservation(book){
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post("http://localhost:3000/book/reserve-cancel",book,{headers:headers}).pipe(map(res=>res.json()));
  }

  // get the reservation total count
  getTotalReservations(){
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post("http://localhost:3000/book/reservation-total",{headers:headers}).pipe(map(res=>res.json()));
  }

  // send the reques to backend to add a new book
  addNewBookSuggestion(book){
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post("http://localhost:3000/book/suggestion-add",book,{headers:headers}).pipe(map(res=>res.json()));
  }

  // get total suggestion count
  getTotalSuggestions(){
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post("http://localhost:3000/book/suggestion-total",{headers:headers}).pipe(map(res=>res.json()));
  }

  // load all reservations for admin
  fetchAllReservationsAdmin(){
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post("http://localhost:3000/book/reservations-admin",{headers:headers}).pipe(map(res=>res.json()));
  }

  // cancel a reservation
  borrowReservation(book){
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post("http://localhost:3000/book/reserve-cancel",book,{headers:headers}).pipe(map(res=>res.json()));
  }
}

