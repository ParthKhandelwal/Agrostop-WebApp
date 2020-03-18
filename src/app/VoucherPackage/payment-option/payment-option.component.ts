import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, ComponentFactoryResolver } from '@angular/core';
import { VOUCHER, LEDGERENTRIESLIST } from '../../Model/voucher';
import { ApiService } from '../../shared/api.service';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { MatSelect, MatAutocomplete, MatInput } from '@angular/material';
import { getRtlScrollAxisType } from '@angular/cdk/platform';

@Component({
  selector: 'payment-option',
  templateUrl: './payment-option.component.html',
  styleUrls: ['./payment-option.component.css']
})
export class PaymentOptionComponent implements OnInit {
 

  cashLedgerEntry: LEDGERENTRIESLIST = new LEDGERENTRIESLIST();
  giftLedgerEntry: LEDGERENTRIESLIST = new LEDGERENTRIESLIST();





  cashPayment: boolean = true;
  onAccount: boolean = false;

  bankFilteredOptions: Observable<any[]>;
  ledgerControl = new FormControl();
  cashLedgerControl = new FormControl();
  filteredOptions: Observable<any[]>;
  cashFilteredOptions: Observable<any[]>;
  ledgers: any[] = [];
  cashLedgers: any[] = [];
  @Output() valueChanged = new EventEmitter();
  @Input('voucher') voucher: VOUCHER;
  @Input('productList') productList: any[]
  @Input('isOrder') isOrder: boolean;

  @ViewChild('cashRecievedRef', { static: false }) cashRecievedRef: ElementRef;
  @ViewChild('ledgerSelection', { static: false }) ledgerSelectionRef: MatAutocomplete;
  @ViewChild('cashLedgerSelection', {static: false}) cashLedgerSelection: ElementRef;



    onlinePayment: boolean = false;
    bankTransfer: boolean = false;
  constructor(private apiService?: ApiService) { };

  ngOnInit() {
    
    
   
    this.calculateTAX();
    this.cashFilteredOptions = this.cashLedgerControl.valueChanges.pipe(
      startWith(''),
      map(value => this.cashLedger_filter(value))
    );
    this.filteredOptions = this.ledgerControl.valueChanges.pipe(
      startWith(''),
      map(value => this.ledger_filter(value))
    );

    this.cashLedgerEntry = this.voucher.LEDGERENTRIES_LIST.filter((o: any) => {
    if(o.POSPAYMENTTYPE == "Cash"){
        o.AMOUNT = this.total();
        if( o.LEDGERNAME != null){
          this.cashLedgers.push({"_NAME" : o.LEDGERNAME});
        } else {
          this.apiService.getCashLedgers().subscribe(
            res => {
              this.cashLedgers = res;
            },
            err => {
              console.log(err);
            }
          );
        }
        return true;
    }
    })[0];
    this.giftLedgerEntry = this.voucher.LEDGERENTRIES_LIST.filter((o: any) => {
      if (o.POSPAYMENTTYPE == "Gift"){
        if( this.giftLedgerEntry.LEDGERNAME != null){
  
          this.ledgers.push({"_NAME" : this.giftLedgerEntry.LEDGERNAME});
         }else {
           this.apiService.getLedgerByGroup("Sundry Creditors").subscribe(
             res => {
               this.ledgers = res;
               
             },
             err => {
               console.log(err);
             }
           );
         }
      }
    })[0];

  

      
      


        

        
  }
    
    
  

  ngAfterViewInit() {
    this.getCashPayment();
  }

  
  displayFnLedger(user?: any): string | undefined {
    return user && user ? user : '';
  }

  displayFnCashLedger(user?: any): string | undefined {
    return user && user ? user : '';
  }



  private ledger_filter(value: string): any[] {
    const filterValue = value.toString().toLowerCase();
    return this.ledgers.filter(option => option._NAME.toLowerCase().indexOf(filterValue) === 0);
  }

  private cashLedger_filter(value: string): any[] {
    const filterValue = value.toString().toLowerCase();
    return this.cashLedgers.filter(option => option._NAME.toLowerCase().indexOf(filterValue) === 0);
  }

  validate() {
    console.log(this.remainingBalance());
    if (this.remainingBalance() != 0){
      alert ("Please pay for all the services");
      return;
    }
    if (this.voucher.POSCASHRECEIVED < this.cashLedgerEntry.AMOUNT){
      alert ("The payment is not done in full. Please pay the full amount")
      return
    }
    for (let item of this.voucher.LEDGERENTRIES_LIST){
      if (item.POSPAYMENTTYPE != null){
        item.AMOUNT = - item.AMOUNT;
        if (item.POSPAYMENTTYPE == "Cash" && item.AMOUNT < 0){
          this.voucher.POSCASHLEDGER = item.LEDGERNAME;
        }
      }
    }
    this.voucher.POSCASHRECEIVED = - this.voucher.POSCASHRECEIVED;
    this.voucher
    
    this.valueChanged.emit("Voucher completed Successfully");
  }

  remainingBalance(): number{
    var temp: number = 0;
    for (let i of this.voucher.LEDGERENTRIES_LIST){
      if (i.POSPAYMENTTYPE != null && i.AMOUNT != null){
        temp = temp + i.AMOUNT;
      }
    }
    return this.total() - temp;
  }

  total(): number{
    var total: number =0 
    for (let item of this.voucher.LEDGERENTRIES_LIST){
      if (item.AMOUNT != null && item.POSPAYMENTTYPE == null){
        total = total + item.AMOUNT;
      }
    }
    for (let item of this.voucher.ALLINVENTORYENTRIES_LIST){
      if (item.AMOUNT != null){
        total = total + item.AMOUNT;
      }
    }
    return total;
  }

  
  getCashPayment() {
    this.setToFalse();
    this.cashPayment = true;
    this.cashLedgerSelection.nativeElement.focus();
    
  }

  setLedger(){
    this.cashRecievedRef.nativeElement.focus();
  }
  

  setToFalse() {
    this.cashPayment = false;
    this.onAccount = false;
    this.onlinePayment = false;
    this.bankTransfer = false;
  }


  calculateTAX(){
    console.log(this.voucher);
    for(let ledger of this.voucher.LEDGERENTRIES_LIST){
      if(ledger.ISDEEMEDPOSITIVE != null && ledger.ISDEEMEDPOSITIVE == "No"){
        ledger.AMOUNT = 0;
      }
      for (let item of this.voucher.ALLINVENTORYENTRIES_LIST){
     
        if(ledger.ISDEEMEDPOSITIVE != null && ledger.ISDEEMEDPOSITIVE == "No"){
          ledger.AMOUNT = ledger.AMOUNT + Math.round((item.AMOUNT * this.getTaxRate(item.tallyObject, this.getGSTDutyHead(ledger.tallyObject)))) / 100; 
        }
      }
    }
  }

  getGSTDutyHead(ledger: any): string{
    return ledger["GSTDUTYHEAD"].content;
  }

  getTaxRate(pro: any, str: string): number{
    for (let item of pro["GSTDETAILS.LIST"]["STATEWISEDETAILS.LIST"]["RATEDETAILS.LIST"]){
      if(str == item["GSTRATEDUTYHEAD"].content){
        return item["GSTRATE"].content;
      }
    }
    return 0;    
  }

  
}
