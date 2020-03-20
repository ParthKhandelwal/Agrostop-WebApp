import { Component, OnInit, Inject, ViewChild, Input } from '@angular/core';
import { VOUCHER, LEDGERENTRIESLIST, ALLINVENTORYENTRIESLIST, ALLLEDGERENTRIESLIST } from '../../Model/voucher';
import { ApiService } from '../../shared/api.service';
import { VoucherTableComponent } from '../../tables/voucher-table/voucher-table.component';
import { TallyVoucher } from '../../Model/tally-voucher';
import { VoucherService } from '../../shared/voucher.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import * as cloneDeep from 'lodash/cloneDeep';
import { FormControl } from '@angular/forms';
import { map, filter } from 'rxjs/operators';
import { PosService } from 'src/app/shared/pos.service';



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

  filterField: any[] = [
    "Godown",
    "Tally Username",
    "Customer"
  ]
  filterOperation: any[] = [
    "Equal"
  ]

  filterValue$: Observable<any[]>;

  constructor(private apiService?: ApiService, private router?: Router, private posService?: PosService) { }

  ngOnInit() {
    this.toDate.setValue(new Date());
    this.fromDate.setValue(new Date());
    this.getVouchers();
  }


  getVouchers(){
    this.loading = true;
    const user = this.posService.getUser();
    if (user.role != "Admin"){
    this.apiService.getVouchers(this.fromDate.value, this.toDate.value).pipe(
        map((vouchers) => vouchers.filter((voucher: any) => {
          console.log(voucher.VOUCHER);
          if (voucher.VOUCHER){
            return voucher.VOUCHER.BASICBUYERNAME == "Parth Khandelwal"
          }else {
            return false;
          }
          
        }))
      ).subscribe(
        res =>{
          this.vouchers = res;
          this.filteredArray = res;
          this.loading = false;
        },
        err => {
          console.log(err);
        }
      )
    }
     
    
  }


  getTotal(voucher: VOUCHER): number {
    var total = this.getSubTotal(voucher);
    var array:LEDGERENTRIESLIST[] = [];
    if (voucher["LEDGERENTRIES.LIST"] instanceof Array){
      array = voucher["LEDGERENTRIES.LIST"];
    } else {
      array.push(voucher["LEDGERENTRIES.LIST"]);
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
    if (voucher["ALLINVENTORYENTRIES.LIST"] instanceof Array){
      array = voucher["ALLINVENTORYENTRIES.LIST"];
    } else {
      array.push(voucher["ALLINVENTORYENTRIES.LIST"]);
    }
    for (let item of array) {
      total = total + item.AMOUNT;
    }
    return total;
  }

  edit(voucher: VOUCHER) {
    this.voucher = voucher;
    this.editMode = true;
  }

  updateEditMode() {
    this.editMode = !this.editMode;
  }

  filter(){
    
    this.filteredArray = this.vouchers.filter((voucher: any) => {
        
        if (voucher.VOUCHER){
          if (this.filterFieldFC.value == "Godown"){
            console.log(voucher);
            if (voucher.VOUCHER["ALLINVENTORYENTRIES.LIST"] instanceof Array){
              return voucher.VOUCHER["ALLINVENTORYENTRIES.LIST"][0]["BATCHALLOCATIONS.LIST"].GODOWNNAME == this.filterValueFC.value;
            }else {
              return voucher.VOUCHER["ALLINVENTORYENTRIES.LIST"]["BATCHALLOCATIONS.LIST"].GODOWNNAME == this.filterValueFC.value;
            }
          } else if (this.filterFieldFC.value == "Tally Username"){
            alert("Not Supported");
            return true;
          } else if (this.filterFieldFC.value == "Customer"){
            alert("Not Supported")
            return true;
          }
          
        }else {
          return false;
        }
        
      }
    )
  }

  getFilterValue(value){
    console.log(value);
    if (value == "Godown"){
      this.filterValue$ = this.apiService.getGodownNames();
    } else if (value == "Tally Username"){

    }
  }
  
}
