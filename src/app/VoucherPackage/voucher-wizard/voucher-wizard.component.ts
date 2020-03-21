import { Component, OnInit, Input, EventEmitter, Output, ViewChild, AfterViewInit } from '@angular/core';
import { VOUCHER } from '../../Model/voucher';
import { VoucherService } from '../../shared/voucher.service';
import { User } from '../../Model/user';
import { Customer } from '../../Model/customer';
import { ApiService } from '../../shared/api.service';
import { PosService } from 'src/app/shared/pos.service';
import { merge, fromEvent, Observable, Observer } from 'rxjs';
import { map } from 'rxjs/operators';
import { ThemePalette } from '@angular/material';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { VoucherSettingComponent } from '../voucher-setting/voucher-setting.component';
import { InvoicePrintViewComponent } from 'src/app/PrintPackage/invoice-print-view/invoice-print-view.component';



@Component({
  selector: 'voucher-wizard',
  templateUrl: './voucher-wizard.component.html',
  styleUrls: ['./voucher-wizard.component.css']
})
export class VoucherWizardComponent implements OnInit, AfterViewInit {
  printReady: boolean = false;
  upSyncing: boolean = false;
  loading: boolean = false;
  syncing:boolean = false;
  lastUpSync: Date;
  lastDownSync: Date;
  customerSelection: boolean = false;
  inventorySelection: boolean = false;
  payment: boolean = false;
  voucherSettings: boolean = false;
  user: User;
  customerList: Customer[] = [];
  productList: any[] = [];
  ledgerList: any[] = [];
  syncSettings: boolean = false;
  @Input("isOrder") isOrder: boolean = false;
  @Output("valueChange") valueChanged = new EventEmitter
  @Input("editMode") editMode: boolean;
  @Input('voucher') voucher: VOUCHER;
  printView: boolean = false;

  
  constructor(public posService?: PosService, private apiService?: ApiService) { }
  ngAfterViewInit(): void {
  }

  ngOnInit() {
        this.voucher = new VOUCHER();
        
      
            this.posService.openDatabase().then(
              () => {
                this.posService.getAllStockItemsForBilling().then(
                  res1 => {
                    this.productList = res1;
                    
                  },
                  err1 => {
                    throw err1;
                  }
                );
              
                this.posService.getCustomers().then(
                  res2 => {
                    this.customerList = res2;
    
                    this.switchVoucherSettings();
                  },
                  err2 => {
                    console.log(err2);
                  });

              },
              (err) => {
                console.log(err);
              }
            );
          
        

     
    
    

  }



  switchSyncSettings() {

    this.inventorySelection = false;
    this.customerSelection = false;
    this.payment = false;
    this.voucherSettings = false;
    this.syncSettings = true;
  }

  switchInventory() {

    this.inventorySelection = true;
    this.customerSelection = false;
    this.payment = false;
    this.voucherSettings = false;
    this.syncSettings = false;
  }

  switchVoucherSettings(){

    this.inventorySelection = false;
    this.customerSelection = false;
    this.payment = false;
    this.voucherSettings = true;
    this.syncSettings = false;

  }

  switchCustomer() {

    this.inventorySelection = false;
    this.customerSelection = true;
    this.payment = false;
    this.voucherSettings = false;
    this.syncSettings = false;
  }

  switchPayment() {
    if (!this.isOrder) {

      this.payment = true;
      this.inventorySelection = false;
      this.customerSelection = false;
      this.voucherSettings = false;
      this.syncSettings = false;
    }
  }

  switchPrintView(){
   this.setFalse();
   this.printView = true;
  }

  setFalse(){
    this.printView = false;
    this.payment = false;
      this.inventorySelection = false;
      this.customerSelection = false;
      this.voucherSettings = false;
      this.syncSettings = false;
  }
  next() {
    if (this.voucherSettings){
      this.switchCustomer();
    }
    else if (this.customerSelection) {
      this.switchInventory();
      
    } else if (this.inventorySelection) {
      
        this.switchPayment();
        console.log("switching to Payment")
    }
    else if (this.inventorySelection) {
      
      this.switchPrintView();
      console.log("switching to Payment")
    }

  }

  previous() {
    if (this.payment) {
      this.switchInventory();
    } else if (this.inventorySelection) {
      this.switchCustomer();
    } else if (this.customerSelection){
      this.switchVoucherSettings();
    }


  }

  save() {

    this.loading = true;

    console.log("Saving Voucher...")
    this.apiService.saveTallyVoucher(this.voucher).subscribe(
      res => {
        if (res.RESPONSE.CREATED == 0 && res.RESPONSE.UPDATED == 0){
     
          this.posService.addCacheVoucher(this.voucher).then(
            () => {
              this.valueChanged.emit("voucherCompleted");
              this.loading = false;
              this.switchPrintView();
              
            }
          )
  
        } else {
          alert("Voucher Saved to Tally Successfully")
         
          this.valueChanged.emit("voucherCompleted");
          this.switchPrintView();
          this.loading = false;
        }
      },
      err => {
       
          this.posService.addCacheVoucher(this.voucher).then(
            () => {
              
              this.valueChanged.emit("voucherCompleted");
              this.switchPrintView();
              this.printReady = true;
              
            }
          )
        
        
      }
    );;
    
  }


  forceStop(){
    location.reload();
    this.posService.ledgerPercent = 100;
    this.posService.customerPercent = 100;
    this.posService.batchPercent = 100;
    this.posService.itemPercent = 100;
  }

  async downSync(){
      this.syncing = true;
      console.log("Started");
      await this.posService.enablePOSMode();
    
  }

  upSync(){
    this.upSyncing = true;
    console.log("Started");
    this.posService.syncAllCacheVouchers();
  }

  restore(){
    this.voucher = new VOUCHER();
    this.switchVoucherSettings();
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
