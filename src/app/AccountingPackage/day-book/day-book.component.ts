import { Component, OnInit, Inject, ViewChild, Input } from '@angular/core';
import { VOUCHER, LEDGERENTRIESLIST, ALLINVENTORYENTRIESLIST } from '../../Model/voucher';
import { ApiService } from '../../shared/api.service';
import { VoucherTableComponent } from '../../tables/voucher-table/voucher-table.component';
import { TallyVoucher } from '../../Model/tally-voucher';
import { VoucherService } from '../../shared/voucher.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';


@Component({
  selector: 'app-day-book',
  templateUrl: './day-book.component.html',
  styleUrls: ['./day-book.component.css']
})
export class DayBookComponent implements OnInit {
  showDetails: boolean = false;

  @ViewChild(VoucherTableComponent, { static: false }) table: VoucherTableComponent;
  constructor(private apiService?: ApiService, public voucherService?: VoucherService, private router?: Router) { }

  ngOnInit() {

  }



  getTotal(voucher: VOUCHER): number {
    var total = 0;
    for (let item of voucher.LEDGERENTRIES_LIST) {
      total = total + item.AMOUNT;
    }
    return total;
  }

  edit(voucher: VOUCHER) {
    var tempVoucher: VOUCHER = new VOUCHER();
    tempVoucher = Object.assign(tempVoucher, voucher);
    for (let item in voucher.ALLINVENTORYENTRIES_LIST) {
      var inventoryEntry: ALLINVENTORYENTRIESLIST = new ALLINVENTORYENTRIESLIST()
      tempVoucher.addInventoryEntry(Object.assign(tempVoucher, voucher))
    }
    this.voucherService.voucher = tempVoucher;
    this.router.navigate(["/sales/create-sales-voucher"]);
  }
}
