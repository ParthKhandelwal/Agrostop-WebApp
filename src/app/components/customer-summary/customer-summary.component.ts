import { Component, OnInit, OnChanges, SimpleChanges, ViewChild, ElementRef, Input } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { Customer } from '../../model/Customer/customer';
import { ApiService } from '../../services/API/api.service';
import { VOUCHER, ALLINVENTORYENTRIESLIST } from '../../model/Voucher/voucher';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label, Color } from 'ng2-charts';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { CustomerEntryComponent } from '../AgroEntryComponents/customer-entry-components/customer-entry.component';
import { Address } from '../../model/Address/address';
import { VoucherStatsComponent } from '../AgroComponents/voucher-stats/voucher-stats.component';
import { InventoryBreakdownComponent } from '../AgroComponents/inventory-breakdown/inventory-breakdown.component';
import { VoucherTableComponent } from '../AgroComponents/voucher-table/voucher-table.component';
import { CropProfileTableComponent } from '../AgroComponents/crop-profile-table/crop-profile-table.component';
import { VoucherFilter } from 'src/app/model/HelperClass/HelperClass';



@Component({
  selector: 'app-customer-summary',
  templateUrl: './customer-summary.component.html',
  styleUrls: ['./customer-summary.component.css']
})
export class CustomerSummaryComponent implements OnInit {
  loading: boolean = false
  addresses: Address[] = [];

  @Input("customer")  customer: Customer;
  @Input("canChange")  canChange: boolean = true;
  @ViewChild("voucherTable") voucherTable: VoucherTableComponent;
  @ViewChild("cropProfileTable") cropProfileTable: CropProfileTableComponent;

  displayedColumns: string[] = ['date', 'voucherNumber', 'customer', 'address', 'amount', 'action'];

  voucherFilter: VoucherFilter = new VoucherFilter();



  @ViewChild("voucherStats", {static: false}) voucherStats: VoucherStatsComponent;


  constructor(private database:NgxIndexedDBService, private apiService? : ApiService, private dialog?: MatDialog) {

  }


  async ngOnInit(): Promise<void> {
    if(this.customer){
      this.customerSelected(this.customer);
      console.log(this.customer);
    }
  }



  customerSelected(value){
    this.customer = value;
    this.voucherFilter.customerId = this.customer.id;
    this.voucherTable.fetch();
    this.apiService.getCropPatternsByCustomer(this.customer.id).subscribe(
      res => {
        res = res.map((r) => {
          r.dateEntered = new Date(r.dateEntered);
          return r;
        })
        this.cropProfileTable.setPatterns(res);
        this.cropProfileTable.customer = this.customer;
      }
    )
  }



  editCustomer(){
    const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = true;
      dialogConfig.width = "50%";
      const dialogRef = this.dialog.open(CustomerEntryComponent, {data: this.customer, maxHeight: '90vh'});

  }

}





