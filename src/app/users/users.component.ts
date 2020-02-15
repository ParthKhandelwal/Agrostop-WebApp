import { Component, OnInit } from '@angular/core';
import { NavItem } from '../side-navigation-bar/side-navigation-bar.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  items: NavItem[] = [
    {title: "Users", link: 'userListView', icon: 'list'},
    {title: "Create User", link: 'create-user', icon: 'add'}

  ]

  constructor() { }

  ngOnInit() {
  }

}
