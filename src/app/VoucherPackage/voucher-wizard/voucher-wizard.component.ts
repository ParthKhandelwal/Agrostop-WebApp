import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { VOUCHER } from '../../Model/voucher';
import { VoucherService } from '../../shared/voucher.service';
import { User } from '../../Model/user';
import { Customer } from '../../Model/customer';
import { ApiService } from '../../shared/api.service';
import { PosService } from 'src/app/shared/pos.service';
import { merge, fromEvent, Observable, Observer } from 'rxjs';
import { map } from 'rxjs/operators';


@Component({
  selector: 'voucher-wizard',
  templateUrl: './voucher-wizard.component.html',
  styleUrls: ['./voucher-wizard.component.css']
})
export class VoucherWizardComponent implements OnInit {
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
  constructor(public posService?: PosService, private apiService?: ApiService) { }

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
    console.log("Saving Voucher...")
    this.apiService.saveTallyVoucher(this.voucher).subscribe(
      res => {
        if (res.RESPONSE.CREATED == 0 && res.RESPONSE.UPDATED == 0){
     
          this.posService.addCacheVoucher(this.voucher).then(
            () => {
              this.valueChanged.emit("voucherCompleted");
              
            }
          )
  
        } else {
          this.voucher = new VOUCHER();
          this.switchVoucherSettings();
        }
      },
      err => {
       
          this.posService.addCacheVoucher(this.voucher).then(
            () => {
              this.valueChanged.emit("voucherCompleted");
              this.voucher = new VOUCHER();
              this.switchVoucherSettings();
            }
          )
        
        
      }
    );;
    
  }

  downSync(){

      this.posService.enablePOSMode();
    
    
  }

  upSync(){
    this.posService.syncAllCacheVouchers();
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
