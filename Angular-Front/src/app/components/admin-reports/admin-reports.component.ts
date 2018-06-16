import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../service/auth.service";
import {Router} from "@angular/router";
import * as jsPDF from 'jspdf';

@Component({
  selector: 'app-admin-reports',
  templateUrl: './admin-reports.component.html',
  styleUrls: ['./admin-reports.component.css']
})
export class AdminReportsComponent implements OnInit {
  user:any;
  constructor(private authService:AuthService,private router:Router) { }

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

  }

  generateAllFines(){
    let doc = new jsPDF();
    doc.setFontSize(20);
    doc.text(20, 20, 'University of Colombo School of Computing (UCSC)');
    doc.setFontSize(14);

    doc.text(20, 30, 'This is some normal sized text underneath.');

    let string = doc.output('datauristring');
    let iframe = "<iframe width='100%' height='100%' src='" + string + "'></iframe>"
    let x = window.open();
    x.document.open();
    x.document.write(iframe);
    x.document.close();
  }

}
