import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../service/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-student-home',
  templateUrl: './student-home.component.html',
  styleUrls: ['./student-home.component.css']
})
export class StudentHomeComponent implements OnInit {

  user:any;
  constructor(private authService:AuthService,private router:Router){}

  ngOnInit() {
    if (!this.authService.isLoggedIn()){
      this.router.navigate(['']);
    }
    else{
      this.authService.getAdminHome().subscribe(res=>{
        this.user = res.user;
        console.log(this.user)

        if(this.user.type=="Admin"){
          this.router.navigate(['admin-home']);
        }
      });
    }
  }

}
