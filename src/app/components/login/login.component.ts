import { Component, OnInit, OnDestroy } from '@angular/core';
import { DatabaseService } from '../../services/Database/database.service';
import { UserLogin } from '../../model/User/user';
import { ApiService } from '../../services/API/api.service';
import { AuthenticationService } from '../../services/Authentication/authentication.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { takeUntil } from 'rxjs/operators';
import { Subject, Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-login-form',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  user: UserLogin = {
    username: '',
    password: ''
  };
  invalidPassword: boolean =false;

  loading = false;
  submitted = false;
  syncAndProceed:boolean = false;
  authentication$: Subscription;

  constructor(private apiService?: ApiService, private router?:Router, private auth?: AuthenticationService) {

  }

  ngOnInit() {
  }



  validate(): void{
    this.submitted = true;



    this.loading = true;
    this.authentication$ =  this.auth.authenticate(this.user).subscribe();
  }

  ngOnDestroy(){
    this.authentication$.unsubscribe();
  }



}

