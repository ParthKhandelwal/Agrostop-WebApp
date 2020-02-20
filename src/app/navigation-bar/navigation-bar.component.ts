import { Component, OnInit, Inject } from '@angular/core';
import {User} from '../Model/user';
import { ApiService } from '../shared/api.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.css']
})
export class NavigationBarComponent implements OnInit {
  user: string;
  url: string;
  constructor(@Inject(ApiService) private apiService?: ApiService, private cookie?: CookieService, private router?: Router) { }

  ngOnInit() {
    this.getCurrentUser();
    this.url = this.router.url.split("/")[1];
    console.log(this.url);
  }

  logout(): void{
    this.cookie.delete("token");
  }

  getCurrentUser(): void{
    this.apiService.getCurrentUser().subscribe(
      res =>{
        this.user= res.username;
      },
      err =>{
        console.log(err);
      }
    );

  }

}
