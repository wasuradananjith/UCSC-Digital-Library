import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  name:String;
  email:String;
  password:String;
  cpassword:String;
  lastLogIn:String;
  type:String;
  isDeleted:String;
  isLostPassword:String;

  constructor(private authService:AuthService,private flashMessage:FlashMessagesService) {
  }

  ngOnInit() {
  }

  // add register request data
  registerData(){
    // get current time stamp
    let today = new Date();
    let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    let dateTime = date+' '+time;

    // check whether all the fields are filled
    if (this.name==null && this.email == null && this.password == null && this.cpassword == null){
      this.flashMessage.show('Please fill all the fields', { cssClass: 'alert-danger', timeout: 3000 });
      return;
    }
    else if((this.password == null && this.cpassword == null)){
      this.flashMessage.show('Please fill all the fields', { cssClass: 'alert-danger', timeout: 3000 });
      return;
    }
    else if(this.cpassword!=this.password){
      this.flashMessage.show('Password does not match', { cssClass: 'alert-danger', timeout: 3000 });
      return;
    }

    const user = {
      name:this.name,
      email:this.email,
      password:this.password,
      type:"Student",
      lastLogin:dateTime,
      isDeleted:"0",
      isLostPassword:"0",
    };

    return this.authService.sendRegisterRequest(user).subscribe(res=>{
      if (res.state){
        this.flashMessage.show('Your register request has been sent successfully', { cssClass: 'alert-success', timeout: 5000 });
      }
      else{
        this.flashMessage.show('Your register request is NOT sent', { cssClass: 'alert-danger', timeout: 5000 });
      }

    });
  }

}
