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



@Component({
  selector: 'app-day-book',
  templateUrl: './day-book.component.html',
  styleUrls: ['./day-book.component.css']
})
export class DayBookComponent implements OnInit {
  editMode: boolean = false
  showDetails: boolean = false;
  voucher: VOUCHER = new VOUCHER();
  fromDate = new FormControl();
  toDate = new FormControl();
  vouchers$: Observable<any[]>;
  @ViewChild(VoucherTableComponent, { static: false }) table: VoucherTableComponent;
  constructor(private apiService?: ApiService, private router?: Router) { }

  ngOnInit() {
    this.toDate.setValue(new Date());
    this.fromDate.setValue(new Date());
    this.getVouchers();
  }


  getVouchers(){

    this.vouchers$ =  this.apiService.getVouchers(this.fromDate.value, this.toDate.value);
    
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
  
}
