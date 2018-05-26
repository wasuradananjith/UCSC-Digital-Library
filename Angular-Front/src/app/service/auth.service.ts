import { Injectable } from '@angular/core';
import { Http,Headers} from '@angular/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user:any;
  constructor(private http:Http) { }

  sendRegisterRequest(user){
    //console.log(user);
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post("http://localhost:3000/user/register",user,{headers:headers}).pipe(map(res=>res.json()));
  }
}
