import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { VOUCHER} from '../../model/Voucher/voucher';
import { FormControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { DatabaseService } from '../../services/Database/database.service';
import { DayBookService } from '../../services/DayBook/day-book.service';
import { VoucherTableComponent } from '../AgroComponents/voucher-table/voucher-table.component';

@Component({
  selector: 'app-day-book',
  templateUrl: './day-book.component.html',
  styleUrls: ['./day-book.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class DayBookComponent implements OnInit {
  subscription: Subscription;
  anotherSub : Subscription;
  @ViewChild("voucherTable", {static: false}) voucherTable: VoucherTableComponent
  @ViewChild("offlineVoucherTable", {static: false}) offlineVoucherTable: VoucherTableComponent


  constructor(public daybookService?:DayBookService,

     ) {
   }

  ngOnInit() {
    this.subscription = this.daybookService.vouchers$.subscribe(
      res =>{
          setTimeout(() => {
            this.voucherTable.setVouchers(res);
          }, 300);

        //
      }
    )

    this.anotherSub = this.daybookService.cachVouchers$.subscribe(
      res =>{
        if(this.offlineVoucherTable){
          this.offlineVoucherTable.setVouchers(res);
        }
        //
      }
    )

  }


  ngOnDestroy(){
    this.subscription.unsubscribe();
    this.anotherSub.unsubscribe();
  }



}
