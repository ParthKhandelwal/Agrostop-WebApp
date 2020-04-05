import { Component, OnInit, Input, EventEmitter, Output, ViewChild, AfterViewInit } from '@angular/core';
import { VOUCHER, LEDGERENTRIESLIST, OLDAUDITENTRYIDSLIST } from '../../Model/voucher';
import { VoucherService } from '../../shared/voucher.service';
import { User } from '../../Model/user';
import { Customer } from '../../Model/customer';
import { ApiService } from '../../shared/api.service';
import { PosService } from 'src/app/shared/pos.service';
import { merge, fromEvent, Observable, Observer } from 'rxjs';
import { map } from 'rxjs/operators';
import { ThemePalette, MatDialog, MatDialogConfig } from '@angular/material';
import uniqid from 'uniqid'
import { InvoicePrintViewComponent } from 'src/app/PrintPackage/invoice-print-view/invoice-print-view.component';
import { UniqueSelectionDispatcher } from '@angular/cdk/collections';



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
  @Input('date') date: Date;
  printView: boolean = false;

  
  constructor(public posService?: PosService, private apiService?: ApiService, private dialog?: MatDialog,) { }
  ngAfterViewInit(): void {

    if (this.editMode){
      this.switchInventory();
      
    } else if (this.voucher.ORDERNUMBER){
      this.switchInventory();
    } else{
     
      this.setNewVoucher()
      this.switchCustomer();
    }
  }

  ngOnInit() {
       
        
        
  }

  setNewVoucher(){
    
    this.voucher = new VOUCHER();
    this.voucher.DATE = new Date();
    this.voucher._REMOTEID = uniqid();
    const voucherType = this.posService.getVoucherType();
    const posClass = this.posService.getPOSClass();
    this.voucher.VOUCHERTYPENAME = voucherType.NAME;
    this.voucher._VCHTYPE = voucherType.NAME;
    this.voucher._OBJVIEW = "Invoice Voucher View";
    this.voucher._ACTION = "Create";
    this.voucher.CLASSNAME = posClass.CLASSNAME.content;
    this.voucher.PERSISTEDVIEW = "Invoice Voucher View";
    this.voucher.VOUCHERNUMBER = "TT-" + this.voucher._REMOTEID;
    this.voucher.LEDGERENTRIES_LIST = [];
    this.voucher.PRICELEVEL = this.posService.getPriceList();

    this.ledgerList = [];
    var tempArray: any[] = [];
    if (posClass["LEDGERENTRIESLIST.LIST"] instanceof Array){
      tempArray = posClass["LEDGERENTRIESLIST.LIST"]
    } else{
      tempArray.push(posClass["LEDGERENTRIESLIST.LIST"])
    }
    for (let ledger of tempArray){
      if (ledger.NAME){

      this.posService.getLedger(ledger.NAME.content).then(
        res1 =>{
          var res: any;
          if (res1 == null){
             res = this.posService.saveLedger(ledger.NAME);
          } else {
           res = res1
          }
          
          var ledgerEntry: LEDGERENTRIESLIST = new LEDGERENTRIESLIST();
          var oldaudit: OLDAUDITENTRYIDSLIST = new OLDAUDITENTRYIDSLIST();
          oldaudit.OLDAUDITENTRYIDS = "-1";
          ledgerEntry.OLDAUDITENTRYIDS_LIST = oldaudit;
          ledgerEntry.LEDGERNAME = res.NAME;
          ledgerEntry.METHODTYPE = ledger.METHODTYPE.content
          ledgerEntry.ISDEEMEDPOSITIVE = res.ISDEEMEDPOSITIVE.content;
          ledgerEntry.LEDGERFROMITEM = ledger.LEDGERFROMITEM.content;
          ledgerEntry.ROUNDLIMIT = ledger.ROUNDLIMIT.content;
          ledgerEntry.ROUNDTYPE = ledger.ROUNDTYPE.content;
          ledgerEntry.REMOVEZEROENTRIES = ledger.REMOVEZEROENTRIES.content;
          ledgerEntry.ISPARTYLEDGER = "No";
          ledgerEntry.tallyObject = res;
          this.voucher.LEDGERENTRIES_LIST.push(ledgerEntry);
        },
        err=>{
          console.log(err);
        }
      );
      }
    }

    if (posClass.POSENABLECARDLEDGER){
      var ledgerEntry: LEDGERENTRIESLIST = new LEDGERENTRIESLIST();
      ledgerEntry.LEDGERNAME = posClass.POSCARDLEDGER.content
      ledgerEntry.POSPAYMENTTYPE = "Card";
      this.voucher.LEDGERENTRIES_LIST.push(ledgerEntry)
    }

    if (posClass.POSENABLECASHLEDGER){
      var ledgerEntry: LEDGERENTRIESLIST = new LEDGERENTRIESLIST();
      ledgerEntry.LEDGERNAME = posClass.POSCASHLEDGER.content
      ledgerEntry.POSPAYMENTTYPE = "Cash";
      this.voucher.LEDGERENTRIES_LIST.push(ledgerEntry);
    }

    if (posClass.POSENABLECHEQUELEDGER){
      var ledgerEntry: LEDGERENTRIESLIST = new LEDGERENTRIESLIST();
      ledgerEntry.LEDGERNAME = posClass.POSCHEQUELEDGER.content
      ledgerEntry.POSPAYMENTTYPE = "Cheque";
      this.voucher.LEDGERENTRIES_LIST.push(ledgerEntry)
    }

    if (posClass.POSENABLEGIFTLEDGER){
      var ledgerEntry: LEDGERENTRIESLIST = new LEDGERENTRIESLIST();
      ledgerEntry.LEDGERNAME = posClass.POSGIFTLEDGER.content
      ledgerEntry.POSPAYMENTTYPE = "Gift";
      this.voucher.LEDGERENTRIES_LIST.push(ledgerEntry);
    }

  }


  switchInventory() {

    this.inventorySelection = true;
    this.customerSelection = false;
    this.payment = false;
    this.voucherSettings = false;
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
              this.printVoucher();
              this.restore();
            }
          )
  
        } else {
          alert("Voucher Saved to Tally Successfully")
          this.valueChanged.emit("voucherCompleted");
          this.loading = false;
          this.printVoucher();
          this.restore();
        }
      },
      err => {
       
          this.posService.addCacheVoucher(this.voucher).then(
            () => {
              
              this.valueChanged.emit("voucherCompleted");
              this.loading = false;
              this.printVoucher();
              this.restore();
              
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

  printVoucher(){
  const dialogConfig = new MatDialogConfig();
   dialogConfig.autoFocus = true;
   dialogConfig.width = "50%";
   const dialogRef = this.dialog.open(InvoicePrintViewComponent, {data: this.voucher, maxHeight: '90vh'});
    dialogRef.afterClosed().subscribe(
      res => {
        this.setNewVoucher();
        this.switchCustomer();
      }
    )
  }

  restore(){
    this.voucher = new VOUCHER();
    this.setFalse();
    
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
