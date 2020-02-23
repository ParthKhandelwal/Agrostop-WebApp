import { Component, OnInit, Inject, ViewChild, Input } from '@angular/core';
import { VOUCHER, LEDGERENTRIESLIST, ALLINVENTORYENTRIESLIST, ALLLEDGERENTRIESLIST } from '../../Model/voucher';
import { ApiService } from '../../shared/api.service';
import { VoucherTableComponent } from '../../tables/voucher-table/voucher-table.component';
import { TallyVoucher } from '../../Model/tally-voucher';
import { VoucherService } from '../../shared/voucher.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import * as cloneDeep from 'lodash/cloneDeep';


@Component({
  selector: 'app-day-book',
  templateUrl: './day-book.component.html',
  styleUrls: ['./day-book.component.css']
})
export class DayBookComponent implements OnInit {
  editMode: boolean = false
  showDetails: boolean = false;
  voucher: VOUCHER = new VOUCHER();
  @ViewChild(VoucherTableComponent, { static: false }) table: VoucherTableComponent;
  constructor(private apiService?: ApiService, public voucherService?: VoucherService, private router?: Router) { }

  ngOnInit() {

  }



  getTotal(voucher: VOUCHER): number {
    var total = voucher.getSubTotal();
    for (let item of voucher.LEDGERENTRIES_LIST) {
      if (item.AMOUNT > 0) {
        total = total + item.AMOUNT;
      }
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
