import { Component, OnInit, Inject } from '@angular/core';
import {User} from '../Model/user';
import { ApiService } from '../shared/api.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { AuthenticationService } from '../shared/authentication.service';
import { PosService } from '../shared/pos.service';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.css']
})
export class NavigationBarComponent implements OnInit {
  url: string;

  currentUser: User;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private posService: PosService
  ) {
    this.authenticationService.currentUser.subscribe(x => {
      this.currentUser = x
    });
  }

  ngOnInit() {
    
  }

   isAdmin() {
    return this.currentUser && this.currentUser.role === "Admin";
  }

   isCompanyUser() {
    return this.currentUser && this.currentUser.role === "Company User";
  }

  logout() {
    this.authenticationService.logOut();
    this.router.navigate(['/login']);
  }

}
