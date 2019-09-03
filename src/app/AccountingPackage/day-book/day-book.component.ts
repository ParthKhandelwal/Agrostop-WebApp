import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { Voucher } from '../../Model/voucher';
import { ApiService } from '../../shared/api.service';
import { VoucherTableComponent } from '../../tables/voucher-table/voucher-table.component';
import { TallyVoucher } from '../../Model/tally-voucher';
import { VoucherService } from '../../shared/voucher.service';


@Component({
  selector: 'app-day-book',
  templateUrl: './day-book.component.html',
  styleUrls: ['./day-book.component.css']
})
export class DayBookComponent implements OnInit {
  vouchers: TallyVoucher[] = [];
    @ViewChild(VoucherTableComponent, {static: false}) table: VoucherTableComponent;
    constructor(private apiService?: ApiService, public voucherService?: VoucherService) { }

    ngOnInit() {
      this.getCurrentVoucher();
    }

    public getCurrentVoucher(): void{
      this.apiService.getVouchers(new Date(), new Date()).subscribe(
        res =>{
        this.voucherService.vouchers = res;
        this.table.renderRows(this.voucherService.vouchers);
        console.log("got all vouchers");
      },
      err =>{
        alert("An error has ocurred while sending your request");
      }
      );
    }


}
