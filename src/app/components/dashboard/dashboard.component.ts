import { Component, OnInit } from '@angular/core';
import { AWSServiceService } from '../../services/AWSService/awsservice.service';
import { User } from '../../model/User/user';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  user: User;
  constructor( private awsService?: AWSServiceService) {
  }

  ngOnInit(): void {

  }


}
