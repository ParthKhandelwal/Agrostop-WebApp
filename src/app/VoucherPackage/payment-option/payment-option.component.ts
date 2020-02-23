import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { VOUCHER } from '../../Model/voucher';
import { ApiService } from '../../shared/api.service';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { MatSelect, MatAutocomplete, MatInput } from '@angular/material';

@Component({
  selector: 'payment-option',
  templateUrl: './payment-option.component.html',
  styleUrls: ['./payment-option.component.css']
})
export class PaymentOptionComponent implements OnInit {
  totalAmount: number = 0;
  paymentReserved: number = 0;
  toBePayedInCash: number = 0;
  toBePayedOnline: number = 0;
  toBePayedByGift: number = 0;
  toBePayedByBank: number = 0
  
  ledger: any;
  bankLedger: any;

  cashPayment: boolean = true;
  onAccount: boolean = false;
  

  bankLedgerControl = new FormControl();
  bankFilteredOptions: Observable<any[]>;
  ledgerControl = new FormControl();
  filteredOptions: Observable<any[]>;
  ledgers: any[] = [];
  @Output() valueChanged = new EventEmitter();
  @Input('voucher') voucher: VOUCHER;
  @Input('productList') productList: any[]

  @ViewChild('cashRecievedRef', { static: false }) cashRecievedRef: ElementRef;
  @ViewChild('onAccountAmount', { static: false }) onAccountAmountRef: ElementRef;
  @ViewChild('ledgerSelection', { static: false }) ledgerSelectionRef: MatInput;



    onlinePayment: boolean = false;
    bankTransfer: boolean = false;
  constructor(private apiService?: ApiService) { };

  ngOnInit() {
    
    this.calculateTax()
    
  }

  calculateTax() {
    this.apiService.getLedger("CGST").subscribe(
      res1 => {
        this.apiService.getLedger("SGST").subscribe(
          res2 => {
            this.voucher.addLedgerEntry(res2, "GST", this.calculateSGST());
            this.voucher.addLedgerEntry(res1, "GST", this.calculateCGST());
            this.totalAmount = this.voucher.getSubTotal() + this.calculateCGST() + this.calculateSGST();
            this.toBePayedInCash = this.totalAmount - this.paymentReserved;
          },
          err2 => { console.log(err2) }
        );
      },
      err1 => {
        console.log(err1);
      }
    );
  }

  total(): number {
    return this.calculateCGST() + this.calculateSGST() + this.voucher.getSubTotal();
  }

  public calculateCGST(): number {
    var total: number = 0;
    for (var i = 0; i < this.voucher.ALLINVENTORYENTRIES_LIST.length; i++) {
      total = total + this.voucher.ALLINVENTORYENTRIES_LIST[i].calculateCGST(
        this.productList.filter(x => x._id == this.voucher.ALLINVENTORYENTRIES_LIST[i].STOCKITEMNAME)[0])
    }
    return total;
  }

  public calculateSGST(): number {
    var total: number = 0;
    for (var i = 0; i < this.voucher.ALLINVENTORYENTRIES_LIST.length; i++) {
      total = total + this.voucher.ALLINVENTORYENTRIES_LIST[i].calculateSGST(
        this.productList.filter(x => x._id == this.voucher.ALLINVENTORYENTRIES_LIST[i].STOCKITEMNAME)[0]);
    }
    return total;
  }

  ngAfterViewInit() {

    this.setCashPayment();

  }

  payOnAccount() {
    this.setToFalse();
    console.log("payment: " + this.toBePayedInCash);
    this.update();
    this.onAccount = true;
    this.apiService.getLedgerByGroup("Sundry Debtors").subscribe(
      res => {
        this.ledgers = res;
       
        setTimeout(() => {
          this.onAccountAmountRef.nativeElement.focus();
        }, 1000);
        
        this.filteredOptions = this.ledgerControl.valueChanges.pipe(
          startWith(''),
          map(value => this.ledger_filter(value))
        );
        this.bankFilteredOptions = this.bankLedgerControl.valueChanges.pipe(
          startWith(''),
          map(value => this.ledger_filter(value))
        );
      },
      err => {
        console.log(err);
      }
    );
  }

  displayFnLedger(user?: any): string | undefined {
    return user && user._NAME ? user._NAME : '';
  }

  update() {
    
    this.paymentReserved = this.voucher.POSCASHRECEIVED + this.toBePayedByBank + this.toBePayedByGift + this.toBePayedOnline;
  }

  private ledger_filter(value: string): any[] {
    const filterValue = value.toString().toLowerCase();
    return this.ledgers.filter(option => option._NAME.toLowerCase().indexOf(filterValue) === 0);
  }

  validate() {
    if (this.voucher.POSCASHRECEIVED != 0) {
      this.apiService.getLedger(this.voucher.PARTYLEDGERNAME).subscribe(
        res => {
          this.voucher.addLedgerEntry(res, "Cash-in-hand", -this.toBePayedInCash);
          this.valueChanged.emit("voucher completed");
        },
        err => { console.log(err) }
      );
    }
    
  }

  validateOnAccountSelection(event) {
    this.ledger = event.option.value;
    if (this.toBePayedByGift != 0) {
   
      this.onAccount = false;
      this.update();
      if (this.paymentReserved != this.totalAmount) {
        this.setCashPayment();
      }
    }

  }

  validateCashSelection(event) {
    this.update();
    if (this.paymentReserved = this.totalAmount) {
      this.validate();
    }

  }

  setToFalse() {
    this.cashPayment = false;
    this.onAccount = false;
    this.onlinePayment = false;
    this.bankTransfer = false;
  }

  setCashPayment() {
    console.log("payment: " + this.toBePayedInCash);
    this.setToFalse();
    this.cashPayment = true;
    this.toBePayedInCash = this.totalAmount - this.paymentReserved;
    setTimeout(() => {
      this.cashRecievedRef.nativeElement.focus();
    }, 1000);
    
  }
}
