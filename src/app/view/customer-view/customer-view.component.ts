import { Component, OnInit, Inject } from '@angular/core';
import { Customer } from '../../Model/customer';
import { MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import { ApiService } from '../../shared/api.service';
import { VOUCHER } from '../../Model/voucher';

@Component({
  selector: 'app-customer-view',
  templateUrl: './customer-view.component.html',
  styleUrls: ['./customer-view.component.css']
})
export class CustomerViewComponent implements OnInit {
  customer: Customer = new Customer();
  previousHistory: any[];
  customerOrder: any[];
  showOrderView: boolean = false;

  constructor(@Inject(MAT_DIALOG_DATA) public customerInjected: Customer, private apiService?: ApiService,
    public dialogRef?: MatDialogRef<CustomerViewComponent>) {
    console.log(customerInjected);
    this.customer = customerInjected;
   }

  ngOnInit() {
    this.apiService.getCustomerHistory(this.customer.customerId).subscribe(
      res => {
        this.previousHistory = res;
      },
      err => {
        console.log(err);
      }
    )


  }

  showOrders() {
    this.apiService.getCustomerOrder(this.customer.customerId).subscribe(
      res => {
        this.customerOrder = res;
        this.showOrderView = true;
      },
      err => {
        console.log(err);
      }
    )
  }

  createVoucher(order: VOUCHER) {
    
    this.dialogRef.close(order);
  }

}
