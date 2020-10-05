import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { User, UserLogin } from '../../model/User/user';
import { ApiService } from '../API/api.service';
import { Router } from '@angular/router';
import { AWSServiceService } from '../AWSService/awsservice.service';
import { SyncService } from '../Sync/sync.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  public currentUserSubject: BehaviorSubject<User> = new BehaviorSubject(new User());
  private tokenSubject: BehaviorSubject<string> = new BehaviorSubject("");
  public user: User;
  public token: string;
  constructor(private apiService?: ApiService, private router?:Router, private aws?: AWSServiceService, private syncService?: SyncService) {
      let user = JSON.parse(sessionStorage.getItem("currentUser"));
      if(user){
        this.currentUserSubject = new BehaviorSubject(user);
      }else{
        this.currentUserSubject = new BehaviorSubject(new User());
      }
      let token = sessionStorage.getItem('token');
      if(token){
        this.tokenSubject = new BehaviorSubject(token);
      }else{
        this.tokenSubject = new BehaviorSubject("");
      }
    this.currentUserSubject.subscribe((res)=> this.user = res);
    this.tokenSubject.subscribe((res) => this.token = res);

  }

  authenticate(userTemp: UserLogin) {
    return this.apiService.authenticate(userTemp)
      .pipe(map(user => {
        // login successful if there's a jwt token in the response
        if (user && user.token) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          sessionStorage.setItem('currentUser', JSON.stringify(user.user));
          sessionStorage.setItem('token', user.token);
          this.currentUserSubject.next(user.user);
          this.tokenSubject.next(user.token);
          let lastUpdate = JSON.parse(localStorage.getItem("lastUpdate"));
          if(!lastUpdate){
            this.syncService.sync();
          }
          this.router.navigateByUrl("/dashboard")
          this.aws.initiate(user.user.userName);
        }

        return user.user;
      }));

  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }


  isUserLoggedIn() {
  let user = sessionStorage.getItem('currentUser')
  //console.log(!(user === null))
  return !(user === null)
  }

  isAdmin(){
    return this.user.role == "Admin";
  }

  logOut() {
    sessionStorage.removeItem('currentUser')
    this.currentUserSubject.next(new User());
    this.router.navigateByUrl("/")

  }

}
