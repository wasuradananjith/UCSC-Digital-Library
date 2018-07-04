import { Injectable } from '@angular/core';
import { Http,Headers} from '@angular/http';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseURL = "http://localhost:3000/";
  user:any;
  authtoken:any;

  constructor(private http:Http,public jwtHelper: JwtHelperService) {
  }

  // register a user
  registerUser(user){
    //console.log(user);
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post(this.baseURL+"user/register",user,{headers:headers}).pipe(map(res=>res.json()));
  }

  // log in a user
  loginUser(user){
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post(this.baseURL+"user/login",user,{headers:headers}).pipe(map(res=>res.json()));
  }

  // store data of user
  storeData(token,userdata){
    localStorage.setItem("tokenid",token);
    localStorage.setItem("user",JSON.stringify(userdata));

    this.authtoken = token;
    this.user = userdata;
  }

  // load admin home
  getAdminHome(){
    this.fetchToken();
    let headers = new Headers();
    headers.append('Authorization',this.authtoken);
    headers.append('Content-Type','application/json');
    return this.http.get(this.baseURL+"user/admin-home",{headers:headers}).pipe(map(res=>res.json()));
  }

  // load student home
  getStudentHome(){
    this.fetchToken();
    let headers = new Headers();
    headers.append('Authorization',this.authtoken);
    headers.append('Content-Type','application/json');
    return this.http.get(this.baseURL+"user/student-home",{headers:headers}).pipe(map(res=>res.json()));
  }

  // search user details
  filterUserDetails(searchText){
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post(this.baseURL+"user/search",searchText,{headers:headers}).pipe(map(res=>res.json()));
  }

  // get the stored token from local storage
  fetchToken(){
    const token = localStorage.getItem("tokenid");
    this.authtoken = token;
  }

  // logging out user
  logout(){
    this.authtoken = null;
    this.user = null;
    localStorage.clear();
  }

  // update the user password
  updatePassword(newPassword,email){
    let updatePasswordData = {password:newPassword,email:email};
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post(this.baseURL+"user/update-password",updatePasswordData,{headers:headers}).pipe(map(res=>res.json()));

  }

  // check whether the user is logged in
  isLoggedIn(){
    return !this.jwtHelper.isTokenExpired();
  }


}
