import { Component, OnInit, Input, ViewChild, HostListener, ViewEncapsulation} from '@angular/core';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { VoucherSummaryComponent } from '../voucher-summary/voucher-summary.component';
import { Router } from '@angular/router';

import { startWith, map } from 'rxjs/operators';
import { MatSidenav } from '@angular/material/sidenav';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AgroVoucherService } from '../../../services/AgroVoucher/agro-voucher.service';
import { VoucherParentType } from '../../../model/VoucherType/voucher-type';
import { SyncService } from '../../../services/Sync/sync.service';
import { AuthenticationService } from '../../../services/Authentication/authentication.service';
import { ApiService } from 'src/app/services/API/api.service';
import { VoucherDisplay, VoucherFilter } from 'src/app/model/HelperClass/HelperClass';
import { VoucherFilterComponent } from '../voucher-filter/voucher-filter.component';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'voucher-table',
  templateUrl: './voucher-table.component.html',
  styleUrls: ['./voucher-table.component.css'],
  encapsulation: ViewEncapsulation.None

})
export class VoucherTableComponent implements OnInit {

  vouchers: VoucherDisplay[] = [];
  loading
  voucherLoading: boolean;
  invnetoryLoading: boolean;
  ledgerLoading: boolean;
  @Input("voucherFilter")voucherFilter: VoucherFilter;

  displayedColumns: string[] = ['date', 'voucherNumber', 'customer', 'address', 'amount'];

  @ViewChild("table", {static: false}) table: MatTable<LedgerItem>;
  @ViewChild(MatTable, {static: false}) voucherTable: MatTable<VoucherDisplay>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  voucherDataSource: MatTableDataSource<VoucherDisplay> = new MatTableDataSource(this.vouchers);
  colorsMap = new Map<string, string>();
  colors= ["purple", "cyan", "pink", "teal"];
  @Input("select") select: boolean;

  constructor(private dialog?: MatDialog,
    private apiService?: ApiService,

    ) {

    }

  ngOnInit(): void {
    
    if(this.select){
      this.displayedColumns.push('action')
    }
    
  }

  public fetch(){
    
    
      this.getVoucher().subscribe();
      this.getLedgerBreakdown().subscribe();
      this.getInventoryBreakdown().subscribe();
    
  }

  getVoucher(){
    this.voucherLoading = true;
    return this.apiService.getVouchersForDisplay(this.voucherFilter).pipe(
      map(
        res => {
          let index = 0;
          this.vouchers = res.map(
            (voucher: VoucherDisplay) => {
              if(!this.colorsMap.get(voucher.voucherparenttype)){
                this.colorsMap.set(voucher.voucherparenttype,  "badge "+ this.colors[index % 4]);
                index++;
              }
              
              voucher.classname = this.colorsMap.get(voucher.voucherparenttype);
              return voucher;
            }
          ).sort((a,b) => a.vouchertypename == b.vouchertypename?(a.vouchernumber> b.vouchernumber ? 1:-1):(a.vouchertypename> b.vouchertypename ? 1:-1));  
            this.voucherDataSource = new MatTableDataSource<VoucherDisplay>(this.vouchers);
            this.voucherDataSource.sort = this.sort;
            this.voucherDataSource.paginator = this.paginator;
            this.voucherLoading = false;
        }
        
      )
    )
  }

  getLedgerBreakdown(){
    this.ledgerLoading = true;
    return this.apiService.getLedgerBreakdown(this.voucherFilter).pipe(
      map(
        res => {
          console.log(res);
          this.ledgerBreakdown = res;
          this.ledgerLoading = false;
        }
      )
    )
  }

  getInventoryBreakdown(){
    this.invnetoryLoading = true;
    return this.apiService.getInventoryBreakdown(this.voucherFilter).pipe(
      map(
        res => {
          this.inventoryBreakdown = res;
          this.invnetoryLoading = false;
        }
      )
    )
  }


  viewInventory(v){
    const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = true;
      this.dialog.open(VoucherSummaryComponent, {data: v,
      backdropClass: 'backdropBackground-v'});

  }



  getTotal(): number{
    var total : number = 0;
    for(let v of this.vouchers ){
      total = total + v.total
    }
    return total;
  }



  filter(){
    this.dialog.open(VoucherFilterComponent, {data: this.voucherFilter}).afterClosed().subscribe(
      res => {
        this.voucherFilter = res;
        this.fetch();
      }
    )
  }

  reset(){
    this.voucherFilter = new VoucherFilter();
    this.getVoucher().subscribe();
  }



  displayedLedgerColumns = ['name', 'amount'];
  displayedInventoryColumns = ["_id", "inwardQty", "inwardValue", "outwardQty", "outwardValue"]
  ledgerBreakdown : LedgerItem[];

  inventoryBreakdown: InventoryItem[] = [];


  getLedgers(voucher){
    switch (voucher.VOUCHERPARENTTYPE) {
      case VoucherParentType.Contra:
        return voucher.ALLLEDGERENTRIES_LIST.filter((l) => l.ISDEEMEDPOSITIVE == 'Yes');
        break;

      case VoucherParentType.Payment:
        return voucher.ALLLEDGERENTRIES_LIST.filter((l) => l.ISDEEMEDPOSITIVE == 'No');
        break;

      case VoucherParentType.Receipt:
        return voucher.ALLLEDGERENTRIES_LIST.filter((l) => l.ISDEEMEDPOSITIVE == 'Yes');
        break;

      case VoucherParentType.Sales:

        return voucher.LEDGERENTRIES_LIST.filter((l) => l.ISDEEMEDPOSITIVE == 'Yes');

        break;

      case VoucherParentType.Purchase:

        return voucher.LEDGERENTRIES_LIST.filter((l) => l.ISDEEMEDPOSITIVE == 'No');

        break;

      case VoucherParentType.Journal:
        return voucher.ALLLEDGERENTRIES_LIST;
        break;

      case VoucherParentType.Material_Out:
        return voucher.LEDGERENTRIES_LIST.filter((l) => l.ISDEEMEDPOSITIVE == 'Yes');
        break;

      default:
        break;
    }

  }



}

class LedgerItem{
  _id: string;
  value: number;
}

class InventoryItem{

  _id: string;
  inwardQty: number;
  inwardValue: number;
  outwardValue: number;
  outwardQty: number;
}



