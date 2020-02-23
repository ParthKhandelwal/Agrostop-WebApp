import { Component, OnInit, Inject } from '@angular/core';
import { Customer } from '../../Model/customer';
import { MAT_DIALOG_DATA} from '@angular/material';
import { ApiService } from '../../shared/api.service';

@Component({
  selector: 'app-customer-view',
  templateUrl: './customer-view.component.html',
  styleUrls: ['./customer-view.component.css']
})
export class CustomerViewComponent implements OnInit {
  customer: Customer = new Customer();
  previousHistory: any[]

  constructor(@Inject(MAT_DIALOG_DATA) public customerInjected: Customer, private apiService?: ApiService) {
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

}
