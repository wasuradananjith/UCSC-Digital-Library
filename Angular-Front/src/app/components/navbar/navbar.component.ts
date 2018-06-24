import {Component, OnInit, TemplateRef} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  user:any;
  modalRef: BsModalRef;
  myMessage:String;
  myAlertType:String;
  constructor(private router:Router,private authService:AuthService,private flashMessage:FlashMessagesService,private modalService: BsModalService) { }

  ngOnInit() {

  }

  // call a function to logout a user
  logoutUser(template:TemplateRef<any>){
    this.authService.logout();
    this.myMessage='You have successfully logged out';
    this.myAlertType="Success";
    this.modalRef = this.modalService.show(template);
    //this.flashMessage.show('You are successfully logged out', { cssClass: 'alert-success', timeout: 3000 });
    this.router.navigate(['login']);
    return false;
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
