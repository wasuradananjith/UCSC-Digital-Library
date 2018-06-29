import {Component, OnInit, TemplateRef} from '@angular/core';
import {AuthService} from "../../service/auth.service";
import {Router} from "@angular/router";
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import {FlashMessagesService} from "angular2-flash-messages";

@Component({
  selector: 'app-admin-manage-user',
  templateUrl: './admin-manage-user.component.html',
  styleUrls: ['./admin-manage-user.component.css']
})
export class AdminManageUserComponent implements OnInit {
  newPassword="123";
  confirmPassword="123";
  modalRef:BsModalRef;
  user:any;
  selectedUser:any;
  users:any;
  searchText = {
    enteredText:"",
    enteredTextStudent:""
  };
  message="";
  constructor(private authService:AuthService, private router:Router, private modalService:BsModalService, private flashMessage:FlashMessagesService) { }

  ngOnInit() {
    if (!this.authService.isLoggedIn()){
      this.router.navigate(['']);
    }
    else{
      this.authService.getAdminHome().subscribe(res=>{
        this.user = res.user;
        console.log(this.user);

        if(this.user.type=="Student"){
          this.router.navigate(['student-home']);
        }
      });
    }
    this.onKeyUserSearch("true");
  }

  // when user details are typed on the search bar
  onKeyUserSearch(event: any){
    this.authService.filterUserDetails(this.searchText).subscribe(res=>{
      if(res.msg==""){
        this.message="No search results found";
      }
      else{
        this.message="";
      }
      this.users = res.msg;
    });
  }

  // when change password button is clicked
  onChangePassword(template:TemplateRef<any>,user){
    this.selectedUser = user;
    this.modalRef = this.modalService.show(template);
  }

  changePassword(email){
    if (this.newPassword != this.confirmPassword){
      this.flashMessage.show('Password does not match!', { cssClass: 'alert-danger', timeout: 1500 });
      return;
    }
    else if (this.newPassword.length<3 || this.confirmPassword.length<3){
      this.flashMessage.show('Password must consist more than 3 characters!', { cssClass: 'alert-danger', timeout: 1500 });
      return;
    }
    else{
      this.authService.updatePassword(this.newPassword,email).subscribe(res=>{
        if(res.state=false){
          this.message="Failed to update the password!";
          this.flashMessage.show(this.message, { cssClass: 'alert-danger', timeout: 1500 });
          return;
        }
        else{
          this.message="Password successfully updated";
          this.flashMessage.show(this.message, { cssClass: 'alert-success', timeout: 1500 });
          return;
        }
      });
    }
  }
}
