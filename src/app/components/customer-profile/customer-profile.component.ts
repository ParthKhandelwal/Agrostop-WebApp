import { Component, OnInit, ViewChild } from '@angular/core';
import { Customer } from '../../model/Customer/customer';
import { ApiService } from '../../services/API/api.service';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { CustomerTableComponent } from '../AgroComponents/customer-table/customer-table.component';

@Component({
  selector: 'app-customer-profile',
  templateUrl: './customer-profile.component.html',
  styleUrls: ['./customer-profile.component.css']
})
export class CustomerProfileComponent implements OnInit {
  customers: Customer[]= [];
  loading:boolean

  @ViewChild("customerTable") customerTable: CustomerTableComponent;
  constructor(private apiService?: ApiService, private db?: NgxIndexedDBService) { }

  async ngOnInit(): Promise<void> {
    this.loading = true;
    this.customers = await this.db.getAll("customers");
    this.loading = false;
    setTimeout(() => {
      this.customerTable.setCustomers(this.customers);
    }, 300);
  }

}
