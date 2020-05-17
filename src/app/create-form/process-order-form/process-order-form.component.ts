import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { Order } from 'src/app/Model/order';
import { ApiService } from 'src/app/shared/api.service';
import { User } from 'src/app/Model/user';
import { AuthenticationService } from 'src/app/shared/authentication.service';
import { Observable } from 'rxjs';
import { OrderService } from 'src/app/shared/order.service';
import { VOUCHER } from 'src/app/Model/voucher';

@Component({
  selector: 'app-process-order-form',
  templateUrl: './process-order-form.component.html',
  styleUrls: ['./process-order-form.component.css']
})
export class ProcessOrderFormComponent implements OnInit {

  order : any = null;
  voucher: VOUCHER;
  dataOrder : Order;
  user: User;
  completeOrder: boolean = false;

  constructor( @Inject(MAT_DIALOG_DATA) public data?: any, private dialogRef?: MatDialogRef<ProcessOrderFormComponent>,
  private router? :Router,auth?: AuthenticationService , @Inject(ApiService) private apiService? : ApiService, 
  private orderService?: OrderService) {
    if (data != null){
      this.order = data;
    }
  }

  ngOnInit() {
    this.voucher = new VOUCHER();
  }

  createVoucher(){
    this.orderService.convertOrder(this.dataOrder, new VOUCHER()).then(res => {
      this.dialogRef.close(res);
    });
  }



}
