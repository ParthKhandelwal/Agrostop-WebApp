import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild } from '@angular/core';
import {Subscription } from 'rxjs';

import { DayBookService } from '../../services/DayBook/day-book.service';
import { VoucherTableComponent } from '../AgroComponents/voucher-table/voucher-table.component';
import { AuthenticationService } from 'src/app/services/Authentication/authentication.service';
import { VoucherFilter } from 'src/app/model/HelperClass/HelperClass';

@Component({
  selector: 'app-day-book',
  templateUrl: './day-book.component.html',
  styleUrls: ['./day-book.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class DayBookComponent implements OnInit {
  @ViewChild("voucherTable") voucherTable: VoucherTableComponent
  voucherFilter = new VoucherFilter()

  constructor(public daybookService?:DayBookService, public auth?: AuthenticationService

     ) {
   }

   ngOnInit(){}
  ngAfterViewInit() {
    this.voucherTable.fetch();

  }





}
