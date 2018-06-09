import { Injectable } from '@angular/core';
import {Headers, Http} from "@angular/http";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  constructor(private http:Http) { }

  // send the request to get student details
  filterStudentDetails(student){
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post("http://localhost:3000/student/search",student,{headers:headers}).pipe(map(res=>res.json()));
  }
}
