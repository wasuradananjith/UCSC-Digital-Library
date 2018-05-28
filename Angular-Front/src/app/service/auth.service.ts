import { Injectable } from '@angular/core';
import { Http,Headers} from '@angular/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user:any;
  authtoken:any;

  constructor(private http:Http) { }

  // register a user
  registerUser(user){
    //console.log(user);
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post("http://localhost:3000/user/register",user,{headers:headers}).pipe(map(res=>res.json()));
  }

  // log in a user
  loginUser(user){
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post("http://localhost:3000/user/login",user,{headers:headers}).pipe(map(res=>res.json()));
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
    return this.http.get("http://localhost:3000/user/admin-home",{headers:headers}).pipe(map(res=>res.json()));
  }

  // get the stored token from local storage
  fetchToken(){
    const token = localStorage.getItem("tokenid");
    this.authtoken = token;
  }
}
