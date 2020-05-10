import { Component, OnInit, Inject, ViewChild, Input } from '@angular/core';
import { VOUCHER, LEDGERENTRIESLIST, ALLINVENTORYENTRIESLIST, ALLLEDGERENTRIESLIST } from '../../Model/voucher';
import { ApiService } from '../../shared/api.service';
import { VoucherTableComponent } from '../../tables/voucher-table/voucher-table.component';
import { TallyVoucher } from '../../Model/tally-voucher';
import { VoucherService } from '../../shared/voucher.service';
import { Observable, from } from 'rxjs';
import { Router } from '@angular/router';
import * as cloneDeep from 'lodash/cloneDeep';
import { FormControl } from '@angular/forms';
import { map, filter } from 'rxjs/operators';
import { PosService } from 'src/app/shared/pos.service';
import { VoucherTypeClass } from 'src/app/Model/user';



@Component({
  selector: 'app-day-book',
  templateUrl: './day-book.component.html',
  styleUrls: ['./day-book.component.css']
})
export class DayBookComponent implements OnInit {
  loading: boolean = false
  editMode: boolean = false
  showDetails: boolean = false;
  voucher: VOUCHER = new VOUCHER();
  fromDate = new FormControl();
  toDate = new FormControl();
  vouchers:any[] = []
  @ViewChild(VoucherTableComponent, { static: false }) table: VoucherTableComponent;
  stream$ : Observable<any[]>
  filterFieldFC = new FormControl();
  filterOperationFC = new FormControl();
  filterValueFC = new FormControl();
  filteredArray : any[] =[]
  masterIds: any[] = [];
  voucherPercent: number = 100;
  cacheVouchers: any[] = [];

  filterField: any[] = [
    "Voucher Type",
    "Tally Username",
    "Customer"
  ]
  filterOperation: any[] = [
    "Equal"
  ]

  filterValue$: any[];

  constructor(private apiService?: ApiService, private router?: Router, private posService?: PosService) { }

  ngOnInit() {
    this.toDate.setValue(new Date());
    this.fromDate.setValue(new Date());
    this.getVouchers();
  }


  getVouchers(){
    this.voucherPercent = 0;
    this.loading = true;
    const user = this.posService.getUser();

    this.apiService.getVouchers(this.fromDate.value, this.toDate.value).subscribe(
        (res: any) =>{
          
          if (res != null){
            this.vouchers = res.VOUCHER;
            
           
            this.filter();
            console.log(this.filteredArray);
            this.loading = false;
            this.voucherPercent = 100;
          } else {
            this.loading = false;
            this.voucherPercent = 100;
          }
          
        },
        err => {
          console.log(err);
        }
      )
    
      this.posService.openDatabase().then(
        res =>{
          this.posService.getAllCacheVouchers().then(
            (res) => {
              this.cacheVouchers = res;
              console.log(res);
            }
          );
         
        }
      );
     
    
  }

  getVoucherTotal(list){
  
    if (list instanceof Array){
      var total: number = 0;
      for (let item of list){
        total = total + (item.ISDEEMEDPOSITIVE == "Yes" ? (item.AMOUNT) : 0);
      }
      return total*(-1);
    } else {
      return list.ISDEEMEDPOSITIVE == "Yes" ? (list.AMOUNT) : 0;
    }
    
  }


  getTotal(voucher: VOUCHER): number {
    var total = this.getSubTotal(voucher);
    var array:LEDGERENTRIESLIST[] = [];
    if (voucher["LEDGERENTRIES_LIST"] instanceof Array){
      array = voucher["LEDGERENTRIES_LIST"];
    } else {
      array.push(voucher["LEDGERENTRIES_LIST"]);
    }
    for (let item of array) {
      if (item.AMOUNT > 0) {
        total = total + item.AMOUNT;
      }
    }
    return total;
  }

  getSubTotal(voucher:VOUCHER){
    var total = 0;
    var array:ALLINVENTORYENTRIESLIST[] = [];
    if (voucher["ALLINVENTORYENTRIES_LIST"] instanceof Array){
      array = voucher["ALLINVENTORYENTRIES_LIST"];
    } else {
      array.push(voucher["ALLINVENTORYENTRIES_LIST"]);
    }
    for (let item of array) {
      total = total + item.AMOUNT;
    }
    return total;
  }

  edit(m:any) {
    this.loading = true;
    this.apiService.getTallyFullVoucher(m.MASTERID).subscribe(
      res => {
        this.voucher = res.VOUCHER;
        this.voucher._REMOTEID = m.REMOTEID;
        this.voucher._ACTION = "Update"
        console.log(this.voucher);
        this.loading = false;
        this.editMode = true;
      },
      err => console.log(err)
    )
    
  }

  updateEditMode() {
    this.editMode = !this.editMode;
  }

  filter(){
    
    this.filteredArray = this.vouchers.filter((voucher: any) => {
        
        if (voucher.VOUCHER){
          if (this.filterFieldFC.value == "Voucher Type"){
            console.log(voucher);
            return voucher.VOUCHER.VOUCHERTYPENAME == this.filterValueFC.value;
            
          } else if (this.filterFieldFC.value == "Tally Username"){
            alert("Not Supported");
            return true;
          } else if (this.filterFieldFC.value == "Customer"){
            alert("Not Supported")
            return true;
          }
          
        }else {
          return true;
        }
        
      }
    )
  }

  getFilterValue(value){
    console.log(value);
    if (value == "Voucher Type"){
      this.filterValue$ = this.posService.getUser().voucherTypes.map((voucherType:VoucherTypeClass) => voucherType.voucherTypeName);
    } else if (value == "Tally Username"){

    }
  }

  array(object: any): boolean{
    return object instanceof Array;
  }


  
}
