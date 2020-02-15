import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { UserLogin, Response } from '../login-form/login-form.component';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private apiService?: ApiService) { }

  authenticate(user: UserLogin) {
    alert('someother');
      return this.apiService.authenticate(user).subscribe(

         userData => {
          sessionStorage.setItem('username',user.username);
          let tokenStr= 'Bearer '+userData.token;
          sessionStorage.setItem('token', tokenStr);
          return userData;
         }

      );
    }

  isUserLoggedIn() {
  let user = sessionStorage.getItem('username')
  //console.log(!(user === null))
  return !(user === null)
  }

  logOut() {
    sessionStorage.removeItem('username')
  }
}
