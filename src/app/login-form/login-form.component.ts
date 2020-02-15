import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ApiService } from '../shared/api.service';
import { AuthenticationService } from '../shared/authentication.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {
  user: UserLogin = {
    username: '',
    password: ''
  };
  constructor(private apiService?: ApiService, private router?:Router, private cookie?: CookieService,
    private authenticationService?: AuthenticationService) { }

  ngOnInit() {
  }

  validate(): void{
    alert("some");
    this.authenticationService.authenticate(this.user);
    if(this.authenticationService.isUserLoggedIn()){
      this.router.navigateByUrl('home');
    }
  }

}

export interface UserLogin{
  username: string;
  password: string;
}
export interface Response{
  token: string;
}
