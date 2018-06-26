import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../service/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  user:any;
  constructor(private  authService:AuthService, private router:Router) { }

  ngOnInit() {
  }

  // get current user's name
  getCurrentUserName(){
    this.user = JSON.parse(localStorage.getItem("user"));
    return this.user.name;
  }

  // get current user's name
  getCurrentUserType(){
    this.user = JSON.parse(localStorage.getItem("user"));
    return this.user.type;
  }

}
