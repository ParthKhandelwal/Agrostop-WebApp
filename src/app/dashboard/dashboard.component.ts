import { Component, OnInit } from '@angular/core';
import { VOUCHER } from '../Model/voucher';
import { ApiService } from '../shared/api.service';
import { Customer } from '../Model/customer';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  voucher: VOUCHER
  constructor(private apiService?: ApiService) { }

  ngOnInit() {
    this.apiService.getPOSUser().subscribe(
      res => {
        this.voucher = new VOUCHER()
        this.voucher.setCustomer(new Customer());
        this.voucher.setUser(res);
        this.voucher.setDate(new Date());
      },
      err => { }
    );
    
  }

}
