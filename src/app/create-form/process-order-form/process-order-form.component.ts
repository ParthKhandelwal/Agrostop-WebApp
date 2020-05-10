import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { Order } from 'src/app/Model/order';
import { ApiService } from 'src/app/shared/api.service';
import { User } from 'src/app/Model/user';
import { AuthenticationService } from 'src/app/shared/authentication.service';

@Component({
  selector: 'app-process-order-form',
  templateUrl: './process-order-form.component.html',
  styleUrls: ['./process-order-form.component.css']
})
export class ProcessOrderFormComponent implements OnInit {

  order : Order;
  user: User;
  constructor( @Inject(MAT_DIALOG_DATA) public data?: any, private dialogRef?: MatDialogRef<ProcessOrderFormComponent>,
  private router? :Router,auth?: AuthenticationService , @Inject(ApiService) private apiService? : ApiService) {
    if (data != null){
      this.order = data;
    }
  }

  ngOnInit() {
    
  }



}
