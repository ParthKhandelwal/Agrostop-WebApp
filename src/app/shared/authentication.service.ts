import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { UserLogin, Response } from '../login-form/login-form.component';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../Model/user';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private apiService?: ApiService) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(sessionStorage.getItem("currentUser")).user);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  authenticate(userTemp: UserLogin) {
    return this.apiService.authenticate(userTemp)
      .pipe(map(user => {
        // login successful if there's a jwt token in the response
        if (user && user.token) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          sessionStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user.user);
        }

        return user.user;
      }));
      /*subscribe(
         userData => {
          sessionStorage.setItem('username',user.username);
          let tokenStr= 'Bearer '+userData.token;
          sessionStorage.setItem('token', tokenStr);
          return userData;
         }

      );*/
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }


  isUserLoggedIn() {
  let user = sessionStorage.getItem('currentUser')
  //console.log(!(user === null))
  return !(user === null)
  }

  logOut() {
    sessionStorage.removeItem('currentUser')
    this.currentUserSubject.next(null);
  }
}
