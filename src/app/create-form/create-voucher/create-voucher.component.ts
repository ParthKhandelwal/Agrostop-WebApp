import { Component, AfterViewInit, OnInit, ViewChild, ElementRef, ViewChildren, Inject } from '@angular/core';
import { Customer } from '../../Model/customer';
import { Address } from '../../Model/address';
import { StockItem } from '../../Model/stock-item';
import { Batch } from '../../Model/batch';
import { TallyVoucher } from '../../Model/tally-voucher';
import { ApiService } from '../../shared/api.service';
import { FormControl } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material';
import { Observable, Observer, fromEvent, merge  } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material';
import { MatTable } from '@angular/material/table';
import { MatTableDataSource } from '@angular/material';
import { MatDialog, MatDialogConfig, MAT_DIALOG_DATA } from '@angular/material';
import { CreateCustomerFormComponent } from '../../create-form/create-customer-form/create-customer-form.component';
import { CookieService } from 'ngx-cookie-service';
import * as uniqid from 'uniqid';
import { NgForm } from '@angular/forms';
import { CashTenderedComponent } from '../../VoucherPackage/cash-tendered/cash-tendered.component';
import { InvoicePrintViewComponent } from '../../PrintPackage/invoice-print-view/invoice-print-view.component';
import { VoucherService } from '../../shared/voucher.service';
import { PosService } from '../../shared/pos.service';
import { AccountingVoucher, ALLINVENTORYENTRIESLIST } from '../../Model/voucher';
import { VOUCHER } from '../../Model/voucher';
import { NgxIndexedDB } from 'ngx-indexed-db';

@Component({
  selector: 'app-create-voucher',
  templateUrl: './create-voucher.component.html',
  styleUrls: ['./create-voucher.component.css']
})
export class CreateVoucherComponent implements OnInit {
  voucher: VOUCHER


  constructor(private voucherService?: VoucherService,
    private apiService?: ApiService, private dialog?: MatDialog,
    private dialogConfig?: MatDialogConfig,
    private cookie?: CookieService,
  private posService?: PosService) {

  }

  ngOnInit() {
    this.apiService.getPOSUser().subscribe(
      res => {
        if (this.voucherService.voucher != null) {
          this.voucher = this.voucherService.voucher
          this.voucher.setUser(res);
          if (this.voucher.CUSTOMER == null) {
            this.voucher.setCustomer(new Customer);
          }
          
          
        } else {
          this.voucher = new VOUCHER()
          this.voucher.setCustomer(new Customer());
          this.voucher.setUser(res);
          this.voucher.setDate(new Date());
          this.voucher.setAction("Create")
        }
      },
      err => { }
    );
  }


  ngAfterViewInit() {

    //this.customerRef.nativeElement.focus();

  }

  createOnline$() {
      return merge<boolean>(
        fromEvent(window, 'offline').pipe(map(() => false)),
        fromEvent(window, 'online').pipe(map(() => true)),
        new Observable((sub: Observer<boolean>) => {
          sub.next(navigator.onLine);
          sub.complete();
        }));
    }

 

}


