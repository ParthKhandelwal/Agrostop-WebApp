import { Component, AfterViewInit, OnInit, ViewChild, ElementRef, ViewChildren, Inject, Input } from '@angular/core';
import { Customer } from '../../Model/customer';
import { Address } from '../../Model/address';
import { StockItem } from '../../Model/stock-item';
import { Batch } from '../../Model/batch';
import { TallyVoucher } from '../../Model/tally-voucher';
import { ApiService } from '../../shared/api.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
import { PaymentServiceService } from 'src/app/shared/payment-service.service';
import { User } from 'src/app/Model/user';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { ReceiptService } from 'src/app/shared/receipt.service';

@Component({
  selector: 'app-create-voucher',
  templateUrl: './create-voucher.component.html',
  styleUrls: ['./create-voucher.component.css']
})
export class CreateVoucherComponent implements OnInit {
  voucher: VOUCHER = new VOUCHER();
  @Input("editMode") editMode: boolean = false;
  godownSelectFC = new FormControl("", [Validators.required])
  posVoucherView: boolean = false;
  paymentVoucherView: boolean = false;
  receiptVoucherView: boolean = false;
  orderView: boolean;
  user: User;
  upSyncing: boolean;
  downSyncing: boolean;
  constructor(private apiService: ApiService, private posService?: PosService, 
    private paymentService?: PaymentServiceService, private receiptService?: ReceiptService) {
    this.posService.openDatabase();
    this.user = this.posService.getUser();
  }

  ngOnInit() {
    
  }


  ngAfterViewInit() {


  }

  createSalesVoucher(){
    //Check whether all the required data is available
      this.posService;
  }


  getVoucherType(value){
    console.log(value)
    let service;
    if (value.voucherCategory == "Sales"){
       service = this.posService;
    }else if (value.voucherCategory == "Payment") {
      service = this.paymentService;
    }else if (value.voucherCategory == "Receipt") {
      console.log(value.voucherCategory);
      service = this.receiptService;
    }else{
      service = this.posService;
    }

    let voucherType: any;
    let posClass: any;
    this.apiService.getVoucherType(value.voucherTypeName).subscribe(
      res => {voucherType = res.ENVELOPE.BODY.DATA.TALLYMESSAGE.VOUCHERTYPE;
        console.log(service);
        service.saveVoucherType(voucherType);
      if (voucherType["VOUCHERCLASSLIST.LIST"] instanceof Array){
        var found : boolean = false;
        for (let item of voucherType["VOUCHERCLASSLIST.LIST"]){
          console.log(item.CLASSNAME.content);
          console.log()
          if (item.CLASSNAME.content == value.voucherClass){
            service.saveClass(item);
            found = true;
          }
        }
        if (!found){
          alert("The POS Class does not exists. Please ask administrator to update your profile.")
        }
      } else {
        if (voucherType["VOUCHERCLASSLIST.LIST"].CLASSNAME.content == value.voucherClass){
          service.saveClass(voucherType["VOUCHERCLASSLIST.LIST"]);
        }else {
          alert("The POS Class does not exists. Please ask administrator to update your profile.")
        }
      }

      },
      err => {
        console.log(err);
      }
    )
    
  }

  switchPOSVoucher(){
    this.setFalse(); 
    this.posVoucherView = true;
  }

  switchPaymentVoucher(){
    this.setFalse(); 
    this.paymentVoucherView = true;
  }

  switchReceiptVoucher(){
    
    this.receiptVoucherView = true;
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

 
  setFalse(){
    this.posVoucherView = false;
    this.paymentVoucherView = false;
  }

  upSyncPOSVouchers(){
    this.upSyncing = true;
    this.posService.syncAllCacheVouchers();
  }

  async downSyncPOSVouchers(){
    this.downSyncing = true;
    await this.posService.enablePOSMode();
  }

  upSyncPaymentVouchers(){
    this.paymentService.syncAllCacheVouchers();
  }

  downSyncPaymentVouchers(){
    this.paymentService.saveLedgers();
  }

  upSyncReceiptVouchers(){
    this.receiptService.syncAllCacheVouchers();
  }

  downSyncReceiptVouchers(){
    this.receiptService.saveLedgers();
  }


  upSyncOrderVouchers(){
    this.receiptService.syncAllCacheVouchers();
  }

  downSyncOrderVouchers(){
    this.receiptService.saveLedgers();
  }

  reload(){
    location.reload();
  }
}


