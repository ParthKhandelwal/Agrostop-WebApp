import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, ComponentFactoryResolver } from '@angular/core';
import { VOUCHER, LEDGERENTRIESLIST } from '../../Model/voucher';
import { ApiService } from '../../shared/api.service';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { MatSelect, MatAutocomplete, MatInput, MatDialogConfig, MatDialog } from '@angular/material';
import { getRtlScrollAxisType } from '@angular/cdk/platform';
import { PosService } from 'src/app/shared/pos.service';
import { CashTenderedComponent } from '../cash-tendered/cash-tendered.component';

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
  @ViewChild('giftAmountRef', { static: false }) giftAmountRef: ElementRef;
  @ViewChild('ledgerSelection', { static: false }) ledgerSelectionRef: MatAutocomplete;
  @ViewChild('cashLedgerSelection', {static: false}) cashLedgerSelection: ElementRef;



    onlinePayment: boolean = false;
    bankTransfer: boolean = false;
  constructor(private apiService?: ApiService, private posService?: PosService,private dialog?: MatDialog) { };

  async ngOnInit() {
    
    await this.calculateTAX();
    console.log(this.voucher);
    this.cashLedgerEntry = this.voucher.LEDGERENTRIES_LIST.filter((o: any) => {
    if(o.POSPAYMENTTYPE == "Cash"){
        o.AMOUNT = this.total();
        if( o.LEDGERNAME != null){
          this.cashLedgers.push({"_NAME" : o.LEDGERNAME});
        } else {
          this.posService.getLedgers().then(
            res => {
              this.cashLedgers = res;
              console.log(res);
              this.cashFilteredOptions = this.cashLedgerControl.valueChanges.pipe(
                startWith(''),
                map(value => this.cashLedger_filter(value))
              );
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
          this.posService.openDatabase().then(
            res =>{
              this.posService.getLedgers().then(
                res => {this.ledgers = res
                  console.log(this.ledgers);
                  this.filteredOptions = this.ledgerControl.valueChanges.pipe(
                    startWith(''),
                    map(value => this.ledger_filter(value))
                  );
                }
              );
            }
          )
         }
         return true;
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
    return this.ledgers.filter(option => option.NAME.toLowerCase().indexOf(filterValue) === 0);
  }

  private cashLedger_filter(value: string): any[] {
    const filterValue = value.toString().toLowerCase();
    return this.cashLedgers.filter(option => option.NAME.toLowerCase().indexOf(filterValue) === 0);
  }

  validate() {
    console.log(this.remainingBalance());
    if (this.remainingBalance() != 0){
      alert ("Please pay for all the services");
      return;
    }
    
    for (let item of this.voucher.LEDGERENTRIES_LIST){
      if (item.POSPAYMENTTYPE != null && item.POSPAYMENTTYPE != ""){
        item.AMOUNT = - Math.abs(item.AMOUNT);
        if (item.POSPAYMENTTYPE == "Cash" && item.AMOUNT < 0){
          this.voucher.POSCASHLEDGER = item.LEDGERNAME;
        }
      }
    }

  const dialogConfig = new MatDialogConfig();
   dialogConfig.autoFocus = true;
   dialogConfig.width = "50%";
  const dialogRef =   this.dialog.open(CashTenderedComponent, {
    data: {CASHAMOUNT: this.cashLedgerEntry.AMOUNT, POSCASHRECIEVED: this.voucher.POSCASHRECEIVED}, 
    maxHeight: '90vh'
  });

  dialogRef.afterClosed().subscribe(
    res => {
      if (res.success){
        this.voucher.POSCASHRECEIVED =  (-1) * res.amountRecieved;
        this.valueChanged.emit("Voucher completed Successfully");
      }
    }
  )
    
    
  }

  remainingBalance(): number{
    var temp: number = 0;
    for (let i of this.voucher.LEDGERENTRIES_LIST){
      if ((i.POSPAYMENTTYPE != null && i.POSPAYMENTTYPE != "") && i.AMOUNT != null){
        temp = temp + i.AMOUNT;
      }
    }
    return (Math.round((this.total() - temp)*100))/100;
  }

  total(): number{
    var total: number =0 
    for (let item of this.voucher.LEDGERENTRIES_LIST){
      if (item.AMOUNT != null && (item.POSPAYMENTTYPE == null || item.POSPAYMENTTYPE == "")){
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
    //this.cashLedgerSelection.nativeElement.focus();
    
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


  async calculateTAX(){
   
    for(let ledger of this.voucher.LEDGERENTRIES_LIST){
      if(ledger.ISDEEMEDPOSITIVE != null && ledger.ISDEEMEDPOSITIVE == "No"){
        ledger.AMOUNT = 0;
      }
      for (let item of this.voucher.ALLINVENTORYENTRIES_LIST){
     
        if(ledger.ISDEEMEDPOSITIVE != null && ledger.ISDEEMEDPOSITIVE == "No"){
          await this.posService.getStockItem(item.STOCKITEMNAME).then(
            async res => {
              await this.posService.getLedger(ledger.LEDGERNAME).then(
                led => {
                  ledger.AMOUNT = ledger.AMOUNT + Math.round((item.AMOUNT * this.getTaxRate(res, this.getGSTDutyHead(led)))) / 100; 
                  ledger.AMOUNT = Math.round(ledger.AMOUNT*100) / 100;
                },
                err2 => {
                  alert("Cannot find ledger " + ledger.LEDGERNAME + "in local database. Please sync!!!")
                  console.log(err2);
                }
              );
            },
            err => {
              alert("Cannot find product " + item.STOCKITEMNAME + "in local database. Please sync!!!")
              console.log(err);
            }
          );
        }
      }
    }
  }

  getGSTDutyHead(ledger: any): string{
    return ledger["GSTDUTYHEAD"].content;
  }

  getTaxRate(pro: any, str: string): number{
    if (pro && pro["GSTDETAILS.LIST"]
       && pro["GSTDETAILS.LIST"]["STATEWISEDETAILS.LIST"] 
      && pro["GSTDETAILS.LIST"]["STATEWISEDETAILS.LIST"]["RATEDETAILS.LIST"])
    for (let item of pro["GSTDETAILS.LIST"]["STATEWISEDETAILS.LIST"]["RATEDETAILS.LIST"]){
      if(str == item["GSTRATEDUTYHEAD"].content){
        return item["GSTRATE"].content;
      }
    }
    return 0;    
  }

  
}
