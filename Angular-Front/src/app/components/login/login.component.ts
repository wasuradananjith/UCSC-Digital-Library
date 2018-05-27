import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  registerForm: FormGroup;
  lastLogIn:String;
  type:String;
  isDeleted:String ;
  isLostPassword:String;

  constructor(private authService:AuthService,private flashMessage:FlashMessagesService,private fb: FormBuilder) {
    this.createForm();
  }

  ngOnInit() {
  }

  createForm() {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(3)]],
      cpassword: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  // add register request data
  registerData(){


    // get current time stamp
    let today = new Date();
    let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    let dateTime = date+' '+time;

    // check whether all the fields are filled
    if (this.registerForm.controls['name'].value == ""){
      this.flashMessage.show('Please fill all the fields', { cssClass: 'alert-danger', timeout: 3000 });
      return;
    }
    if (this.registerForm.controls['email'].value == ""){
      this.flashMessage.show('Please fill all the fields', { cssClass: 'alert-danger', timeout: 3000 });
      return;
    }
    if (this.registerForm.controls['password'].value == ""){
      this.flashMessage.show('Please fill all the fields', { cssClass: 'alert-danger', timeout: 3000 });
      return;
    }
    if (this.registerForm.controls['cpassword'].value == ""){
      this.flashMessage.show('Please fill all the fields', { cssClass: 'alert-danger', timeout: 3000 });
      return;
    }

    if(this.registerForm.controls['cpassword'].value!== this.registerForm.controls['password'].value){
      this.flashMessage.show('Password does not match', { cssClass: 'alert-danger', timeout: 3000 });
      return;
    }
    else{
      const user = {
        name:this.registerForm.controls['name'].value,
        email:this.registerForm.controls['email'].value,
        password:this.registerForm.controls['password'].value,
        type:"Student",
        lastLogin:dateTime,
        isDeleted:"0",
        isLostPassword:"0",
      };

      return this.authService.sendRegisterRequest(user).subscribe(res=>{
        if (res.state){
          this.flashMessage.show(res.msg, { cssClass: 'alert-success', timeout: 5000 });
          this.registerForm.reset();
        }
        else{
          this.flashMessage.show(res.msg, { cssClass: 'alert-danger', timeout: 5000 });
        }

      });
    }
  }


}
