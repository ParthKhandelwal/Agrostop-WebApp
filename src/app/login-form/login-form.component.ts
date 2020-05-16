import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ApiService } from '../shared/api.service';
import { AuthenticationService } from '../shared/authentication.service';
import { first } from 'rxjs/operators';
import { DatabaseService } from '../shared/database.service';
import { AppComponent } from '../app.component';

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
  invalidPassword: boolean =false;

  loading = false;
  submitted = false;
  returnUrl: string;
  databaseService: DatabaseService;

  constructor(private apiService?: ApiService, private router?:Router, private cookie?: CookieService,
    private authenticationService?: AuthenticationService, private route?: ActivatedRoute,) {
    if (this.authenticationService.currentUser) {
      this.router.navigate(['/home']);
    }
    this.databaseService = AppComponent.databaseService;
  }

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';
  }

  validate(): void{
    this.submitted = true;



    this.loading = true;
    this.authenticationService.authenticate(this.user)
      .subscribe(
        async data => {
          console.log(data);
          this.invalidPassword = false;
          this.databaseService.enablePOSMode().then(
            res => this.router.navigateByUrl("/home")
          );
          
        },
        error => {
          if (error.status == 401){
            this.invalidPassword = true;
         
          }
          console.log(error); 
          this.loading = false;
        });
  }
  

}

export interface UserLogin{
  username: string;
  password: string;
}
export interface Response{
  token: string;
}
