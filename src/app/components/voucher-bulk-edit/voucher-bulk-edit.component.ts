import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { VOUCHER } from 'src/app/model/Voucher/voucher';
import { ApiService } from 'src/app/services/API/api.service';
import { AuthenticationService } from 'src/app/services/Authentication/authentication.service';
import { DayBookService } from 'src/app/services/DayBook/day-book.service';
import { VoucherTableComponent } from '../AgroComponents/voucher-table/voucher-table.component';

@Component({
  selector: 'app-voucher-bulk-edit',
  templateUrl: './voucher-bulk-edit.component.html',
  styleUrls: ['./voucher-bulk-edit.component.scss']
})
export class VoucherBulkEditComponent implements OnInit {

  toChange: string;
  toChangeValue: string;
  vouchers: VOUCHER[];
  subscription: Subscription;
  @ViewChild("voucherTable", {static: false}) voucherTable: VoucherTableComponent
  vPrefix:string;
  vSuffix: number;
  toDate: Date;

  constructor(public daybookService: DayBookService, public auth?: AuthenticationService, public apiService?: ApiService) { }

  ngOnInit(): void {
    

  }

  processChange(){
    for(let voucher of this.daybookService.vouchers$.getValue()){
      if(voucher.select){
        switch (this.toChange) {
          case "Voucher Type":
            voucher.VOUCHERTYPENAME = this.toChangeValue;
            voucher._VCHTYPE = this.toChangeValue;
            break;

          case "Voucher Number":
            voucher.VOUCHERNUMBER = this.vPrefix + this.vSuffix;
            this.vSuffix = (this.vSuffix*1)+1;
            break;
          case "Date":
            voucher.DATE = this.toDate;
            voucher.EFFECTIVEDATE = this.toDate;
            break;
          default:
            break;
        }

        this.apiService.saveTallyVoucher(voucher).subscribe();
      }
    }
  }

}
