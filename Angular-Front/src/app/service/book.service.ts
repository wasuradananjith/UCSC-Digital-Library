import { Injectable } from '@angular/core';
import {Headers, Http} from "@angular/http";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class BookService {
  baseURL = "http://localhost:3000/";
  constructor(private http:Http) { }

  // send the request to backend to add a new book
  addNewBook(book){
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post(this.baseURL+"book/add",book,{headers:headers}).pipe(map(res=>res.json()));
  }

  // get all the book details
  fetchAllBookDetails(){
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post(this.baseURL+"book/get-all",{headers:headers}).pipe(map(res=>res.json()));
  }

  // search book details
  filterBookDetails(searchText){
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post(this.baseURL+"book/search",searchText,{headers:headers}).pipe(map(res=>res.json()));
  }

  // search reservation details
  filterReservationDetails(searchText){
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post(this.baseURL+"reservation/search",searchText,{headers:headers}).pipe(map(res=>res.json()));
  }

  // search borrow details
  filterBorrowDetails(searchText){
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post(this.baseURL+"book/borrow-search",searchText,{headers:headers}).pipe(map(res=>res.json()));
  }


  // search suggestion details
  filterSuggestionDetails(searchText){
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post(this.baseURL+"book/suggestion-search",searchText,{headers:headers}).pipe(map(res=>res.json()));
  }

  // search return details
  filterReturnDetails(searchText){
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post(this.baseURL+"book/return-search",searchText,{headers:headers}).pipe(map(res=>res.json()));
  }

  // search return details for a particular student
  filterReturnDetailsStudent(details){
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post(this.baseURL+"book/return-search-student",details,{headers:headers}).pipe(map(res=>res.json()));
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
    return this.http.post(this.baseURL+"reservation/add",reservation,{headers:headers}).pipe(map(res=>res.json()));
  }

  // get the reservation count for a particular user
  getReservationCount(){
    let student = JSON.parse(localStorage.getItem("user"));
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post(this.baseURL+"reservation/user-count",student,{headers:headers}).pipe(map(res=>res.json()));
  }

  // get the borrow count for a particular user
  getBorrowCount(student){
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post(this.baseURL+"book/borrow-count",student,{headers:headers}).pipe(map(res=>res.json()));
  }

  // get the reservations for a particular user
  fetchAllReservations(){
    let student = JSON.parse(localStorage.getItem("user"));
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post(this.baseURL+"reservation/student",student,{headers:headers}).pipe(map(res=>res.json()));
  }

  // cancel a reservation
  cancelReservation(book){
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post(this.baseURL+"reservation/cancel",book,{headers:headers}).pipe(map(res=>res.json()));
  }

  // get the reservation total count
  getTotalReservations(){
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post(this.baseURL+"reservation/total",{headers:headers}).pipe(map(res=>res.json()));
  }

  // send the reques to backend to add a new book
  addNewBookSuggestion(book){
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post(this.baseURL+"book/suggestion-add",book,{headers:headers}).pipe(map(res=>res.json()));
  }

  // get total suggestion count
  getTotalSuggestions(){
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post(this.baseURL+"book/suggestion-total",{headers:headers}).pipe(map(res=>res.json()));
  }

  // load all reservations for admin
  fetchAllReservationsAdmin(){
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post(this.baseURL+"reservation/admin",{headers:headers}).pipe(map(res=>res.json()));
  }

  // borrow a reserved book
  borrowReservation(book){
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post(this.baseURL+"reservation/borrow",book,{headers:headers}).pipe(map(res=>res.json()));
  }

  // borrow a reserved book
  borrowBook(book,student){
    let borrow = {book:book, student:student};
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post(this.baseURL+"book/borrow",borrow,{headers:headers}).pipe(map(res=>res.json()));
  }

  // dismiss a reservation
  dismissSuggestion(book){
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post(this.baseURL+"book/suggestion-dismiss",book,{headers:headers}).pipe(map(res=>res.json()));
  }

  // get borrowed book details
  getAllBorrows(){
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post(this.baseURL+"book/get-borrows",{headers:headers}).pipe(map(res=>res.json()));
  }

  // update borrow fine
  updateBorrowFine(borrow){
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post(this.baseURL+"book/borrow-fine",borrow,{headers:headers}).pipe(map(res=>res.json()));
  }

  // return a borrowed book
  returnBook(book){
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post(this.baseURL+"book/return",book,{headers:headers}).pipe(map(res=>res.json()));
  }

  // edit number of copies
  editBookDetails(book,oldNumberOfCopies){
    let editBook = {book:book, oldNumberOfCopies:oldNumberOfCopies};
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post(this.baseURL+"book/edit",editBook,{headers:headers}).pipe(map(res=>res.json()));
  }

  // delete a book
  deleteBook(book){
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post(this.baseURL+"book/delete",book,{headers:headers}).pipe(map(res=>res.json()));
  }

  // search old overdue details
  fetchOldOverdue(){
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post(this.baseURL+"book/old-overdue",{headers:headers}).pipe(map(res=>res.json()));
  }
}

