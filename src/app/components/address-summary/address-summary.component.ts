import { Component, OnInit, ViewChild } from '@angular/core';
import { VOUCHER } from '../../model/Voucher/voucher';
import { ApiService } from '../../services/API/api.service';
import { VoucherStatsComponent } from '../AgroComponents/voucher-stats/voucher-stats.component';
import { Customer } from '../../model/Customer/customer';
import { VoucherTableComponent } from '../AgroComponents/voucher-table/voucher-table.component';
import { CustomerTableComponent } from '../AgroComponents/customer-table/customer-table.component';
import { VoucherFilter } from 'src/app/model/HelperClass/HelperClass';

@Component({
  selector: 'app-address-summary',
  templateUrl: './address-summary.component.html',
  styleUrls: ['./address-summary.component.css']
})
export class AddressSummaryComponent implements OnInit {

  voucherFilter: VoucherFilter = new VoucherFilter();
  customers: Customer[];

  @ViewChild("voucherStats", {static: false}) voucherStats: VoucherStatsComponent;
  @ViewChild("voucherTable", {static: false}) voucherTable: VoucherTableComponent;

  @ViewChild("customerTable", {static: false}) customerTable: CustomerTableComponent;


  constructor(private apiService?: ApiService) { }

  ngOnInit(): void {
  }

  customerCount: number = 0;
  landHoldingCount: number = 0;

  addressSelected(value){
    this.voucherFilter.addressId = value._id;
    this.voucherTable.fetch();
    this.apiService.getAddressVoucher(value._id).subscribe(
      res => {
        this.customerTable.setCustomers(res);
        
        this.customerCount = 0;
        this.landHoldingCount = 0;
        this.customers= res;
        for(let cus of res){
          this.customerCount++;
          this.landHoldingCount = this.landHoldingCount + cus.landHolding;
        }
        
      }
    )
  }

}
