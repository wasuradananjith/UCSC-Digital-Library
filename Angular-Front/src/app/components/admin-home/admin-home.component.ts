import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../service/auth.service'

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css']
})
export class AdminHomeComponent implements OnInit {
  user:any;
  constructor(private authService:AuthService) { }

  ngOnInit() {
    this.authService.getAdminHome().subscribe(res=>{
      this.user = res.user;
      console.log(this.user);
    });
  }


}
