import {Component, OnInit, TemplateRef} from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';
import {Router} from "@angular/router";
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  modalRef: BsModalRef;
  registerForm: FormGroup;
  loginForm: FormGroup;
  lastLogIn:String;
  type:String;
  isDeleted:String ;
  isLostPassword:String;
  loginEmail:String;
  loginPassword:String;
  loginMessage:String;
  loginAlertType:String;
  constructor(private authService:AuthService,private flashMessage:FlashMessagesService,
              private fb: FormBuilder,private router:Router,private modalService: BsModalService) {
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

    this.loginForm = this.fb.group({
      login_email: ['', [Validators.required, Validators.email]],
      login_password: ['', [Validators.required]]
    });
  }

  // register a new student
  registerData(template:TemplateRef<any>){

    // get current time stamp
    let today = new Date();
    let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    let dateTime = date+' '+time;

    // check whether all the fields are filled
    if (this.registerForm.controls['name'].value == ""){
      this.loginMessage='Please fill all the fields';
      this.loginAlertType="Error";
      this.modalRef = this.modalService.show(template);
      //this.flashMessage.show('Please fill all the fields', { cssClass: 'alert-danger', timeout: 3000 });
      return;
    }
    if (this.registerForm.controls['email'].value == ""){
      this.loginMessage='Please fill all the fields';
      this.loginAlertType="Error";
      this.modalRef = this.modalService.show(template);
      //this.flashMessage.show('Please fill all the fields', { cssClass: 'alert-danger', timeout: 3000 });
      return;
    }
    if (this.registerForm.controls['password'].value == ""){
      this.loginMessage='Please fill all the fields';
      this.loginAlertType="Error";
      this.modalRef = this.modalService.show(template);
      //this.flashMessage.show('Please fill all the fields', { cssClass: 'alert-danger', timeout: 3000 });
      return;
    }
    if (this.registerForm.controls['cpassword'].value == ""){
      this.loginMessage='Please fill all the fields';
      this.loginAlertType="Error";
      this.modalRef = this.modalService.show(template);
      //this.flashMessage.show('Please fill all the fields', { cssClass: 'alert-danger', timeout: 3000 });
      return;
    }

    if(this.registerForm.controls['cpassword'].value!== this.registerForm.controls['password'].value){
      this.loginMessage='Password does not match';
      this.loginAlertType="Error";
      this.modalRef = this.modalService.show(template);
      //this.flashMessage.show('Password does not match', { cssClass: 'alert-danger', timeout: 3000 });
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

      return this.authService.registerUser(user).subscribe(res=>{
        if (res.state){
          this.loginMessage=res.msg;
          this.loginAlertType="Success";
          this.modalRef = this.modalService.show(template);
          //this.flashMessage.show(res.msg, { cssClass: 'alert-success', timeout: 5000 });
          this.registerForm.reset();
        }
        else{
          this.loginMessage=res.msg;
          this.loginAlertType="Error";
          this.modalRef = this.modalService.show(template);
          //this.flashMessage.show(res.msg, { cssClass: 'alert-danger', timeout: 5000 });
        }

      });
    }
  }

  // login user
  loginUser(template:TemplateRef<any>){

    const user = {
      email:this.loginForm.controls['login_email'].value,
      password:this.loginForm.controls['login_password'].value
    };

    this.authService.loginUser(user).subscribe(res=>{
      if (res.state){
        this.authService.storeData(res.token,res.user);
        this.loginMessage="Welcome, "+res.user.name+"!";
        this.loginAlertType="Success";
        this.modalRef = this.modalService.show(template);
        //this.flashMessage.show(res.msg, { cssClass: 'alert-success', timeout: 5000 });
        if (res.user.type=="Admin"){
          this.router.navigate(['admin-home']);
        }else if (res.user.type=="Student"){
          this.router.navigate(['student-home']);
        }
      }
      else{
        this.loginMessage=res.msg;
        this.loginAlertType="Error";
        this.modalRef = this.modalService.show(template);
        //this.flashMessage.show(res.msg, { cssClass: 'alert-danger', timeout: 5000 });
      }
    });
  }


}
