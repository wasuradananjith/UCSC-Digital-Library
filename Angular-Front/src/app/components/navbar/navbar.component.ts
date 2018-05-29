import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';



@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  user:any;
  constructor(private router:Router,private authService:AuthService,private flashMessage:FlashMessagesService) { }

  ngOnInit() {
    if (localStorage.getItem("user")!=null){
    }
  }

  // call a function to logout a user
  logoutUser(){
    this.authService.logout();
    this.flashMessage.show('You are successfully logged out', { cssClass: 'alert-success', timeout: 3000 });
    this.router.navigate(['']);
    return false;
  }

  // get current user's name
  getCurrentUserName(){
    this.user = JSON.parse(localStorage.getItem("user"));
    return this.user.name;
  }
}
