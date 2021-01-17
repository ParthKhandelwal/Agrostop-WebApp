import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { VOUCHER } from '../../../model/Voucher/voucher';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject, Subscription } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ApiService } from '../../../services/API/api.service';
import { ProductProfile } from '../../../model/ProductProfile/product-profile';
import { TimePeriod, VoucherFilter } from 'src/app/model/HelperClass/HelperClass';

@Component({
  selector: 'inventory-breakdown',
  templateUrl: './inventory-breakdown.component.html',
  styleUrls: ['./inventory-breakdown.component.css']
})
export class InventoryBreakdownComponent implements OnInit {

  @Input('voucherFilter') voucherFilter: VoucherFilter;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  datasource: MatTableDataSource<InventoryBreakDown> = new MatTableDataSource<InventoryBreakDown>([]);

  constructor(private apiService?: ApiService) { }

  ngOnInit(): void {
    this
    this.datasource.paginator = this.paginator;
    this.datasource.sort = this.sort;
    //this.getStockItemBreakdown(this.vouchers);
  }


  showingGroup: boolean = false;
  



  @ViewChild('table', {static: false}) table: MatTable<InventoryBreakDown>;

}


export class  InventoryBreakDown {
  itemName: string;
  qty: number;
  value:number;
  valuePercentage: number;

  constructor() {

  }
}

