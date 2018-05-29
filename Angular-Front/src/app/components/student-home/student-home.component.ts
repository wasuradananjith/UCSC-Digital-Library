import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../service/auth.service";

@Component({
  selector: 'app-student-home',
  templateUrl: './student-home.component.html',
  styleUrls: ['./student-home.component.css']
})
export class StudentHomeComponent implements OnInit {

  user:any;
  constructor(private authService:AuthService){}

  ngOnInit() {
    this.authService.getStudentHome().subscribe(res=>{
      this.user = res.user;
      console.log(this.user);
    });
  }

}
