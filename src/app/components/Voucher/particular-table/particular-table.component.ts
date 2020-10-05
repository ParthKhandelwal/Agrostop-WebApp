import { Component, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';
import {  ALLLEDGERENTRIESLIST,  LEDGERENTRIESLIST } from '../../../model/Voucher/voucher';
import { AgroVoucherService } from '../../../services/AgroVoucher/agro-voucher.service';
import { VoucherParentType } from '../../../model/VoucherType/voucher-type';
import { MatTable } from '@angular/material/table';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { BankAllocationComponent } from '../bank-allocation/bank-allocation.component';
import { AutoCompleteComponent } from '../../AgroComponents/auto-complete/auto-complete.component';
import { BillAllocationComponent } from '../bill-allocation/bill-allocation.component';
import { StockItem } from '../../../model/StockItem/stock-item';
import { SyncService } from '../../../services/Sync/sync.service';
import { CouponEntryComponent } from '../coupon-entry/coupon-entry.component';

@Component({
  selector: 'particular-table',
  templateUrl: './particular-table.component.html',
  styleUrls: ['./particular-table.component.css']
})
export class ParticularTableComponent implements OnInit {
  displayedColumns: string[];
  contraColumns: string[] = ['particular', "amount", "action"]
  paymentColumns: string[] = ['particular', "amount", "action"]
  receiptColumns: string[] = ['particular', "amount", "action"]
  journalColumn: string[] = ['toBy','particular', 'debit', 'credit', 'action']

  @Output("complete") complete = new EventEmitter();

  ledger;
  @ViewChild("table") table: MatTable<ALLLEDGERENTRIESLIST>;
  @ViewChild("ledgerAutoComp") auto: AutoCompleteComponent;

  constructor(public service?: AgroVoucherService, private dialog?: MatDialog, public syncService?: SyncService) { }

  ngOnInit(): void {
    switch (this.service.voucherParentType) {
      case VoucherParentType.Contra:
        this.displayedColumns = this.contraColumns;
        this.ledger = new ALLLEDGERENTRIESLIST();
        break;

      case VoucherParentType.Payment:
        this.displayedColumns = this.paymentColumns;
        this.ledger = new ALLLEDGERENTRIESLIST();

        break;

      case VoucherParentType.Receipt:
        this.displayedColumns = this.receiptColumns;
        this.ledger = new ALLLEDGERENTRIESLIST();

        break;

      case VoucherParentType.Sales:
        this.displayedColumns = this.receiptColumns;
        this.ledger = new LEDGERENTRIESLIST();

        break;
      case VoucherParentType.Purchase:
        this.displayedColumns = this.receiptColumns;
        this.ledger = new LEDGERENTRIESLIST();

        break;

      case VoucherParentType.Journal:
          this.displayedColumns = this.receiptColumns;
          this.ledger = new ALLLEDGERENTRIESLIST();

          break;

      case VoucherParentType.Material_Out:
          this.displayedColumns = this.receiptColumns;
          this.ledger = new ALLLEDGERENTRIESLIST();

          break;

      default:
        break;
    }
  }





  ledgerSelected(value) {
    this.ledger.LEDGERNAME = value;
    switch (this.service.voucherParentType) {
      case VoucherParentType.Sales:
        this.ledger.AMOUNT = this.getLedgerAmount(this.ledger);
        break;
      case VoucherParentType.Purchase:
        this.ledger.AMOUNT = (-1)* this.getLedgerAmount(this.ledger);
        break;

      default:
        break;

    }
    setTimeout(() => {
      document.getElementById("amount").focus()
    }, 0)
  }

  addLedger() {
    const dialogConfig = new MatDialogConfig();
          dialogConfig.autoFocus = true;
          dialogConfig.width = "50%";
    let ledger = this.auto.ledgerControl.value;
    console.log(ledger);
    switch (this.service.voucherParentType) {
      case VoucherParentType.Contra:
        this.ledger.ISDEEMEDPOSITIVE = "No";
        if (ledger.PARENT == "Bank Accounts" || ledger.PARENT == "Bank OD A/c") {

          const dialogRef = this.dialog.open(BankAllocationComponent, {data: this.ledger});
          dialogRef.afterClosed().subscribe(
            (res: ALLLEDGERENTRIESLIST) => {
              this.ledger = res;
              this.add()
            }
          )
        } else {
          this.add()
        }

        break;

      case VoucherParentType.Payment:
        this.ledger.ISDEEMEDPOSITIVE = "Yes";
        this.ledger.AMOUNT = (-1) * this.ledger.AMOUNT;
        if (this.auto.ledgerControl.value.PARENT == "Bank Accounts" ||this.auto.ledgerControl.value.PARENT == "Bank OD A/c" ) {

          const dialogRef = this.dialog.open(BankAllocationComponent, {data: this.ledger});
          dialogRef.afterClosed().subscribe(
            (res: ALLLEDGERENTRIESLIST) => {
              this.ledger = res;
              this.add()
            }
          )
        } else if(ledger.ISBILLWISEON == "Yes"){
          this.showBillWiseDetails();
        }
        else {
          this.add()
        }



        break;


      case VoucherParentType.Receipt:
        this.ledger.ISDEEMEDPOSITIVE = "No";
        if (this.auto.ledgerControl.value.PARENT == "Bank Accounts" ||this.auto.ledgerControl.value.PARENT == "Bank OD A/c") {
          const dialogConfig = new MatDialogConfig();
          dialogConfig.autoFocus = true;
          dialogConfig.width = "50%";
          const dialogRef = this.dialog.open(BankAllocationComponent, {data: this.ledger});
          dialogRef.afterClosed().subscribe(
            (res: ALLLEDGERENTRIESLIST) => {
              this.ledger = res;
              this.add()
            }
          )
        }  else if(ledger.ISBILLWISEON == "Yes"){
          this.showBillWiseDetails();
        } else {
         this.add()
        }
        break;
      case VoucherParentType.Sales:
        this.ledger.ISDEEMEDPOSITIVE = "No";
        this.service.voucher.LEDGERENTRIES_LIST.push(this.ledger);
        this.table.renderRows();
        this.ledger = new LEDGERENTRIESLIST();
        this.auto.ledgerControl.setValue('');
        this.auto.ledgerRef.nativeElement.focus();
        this.refreshLedgers();
        break;
      case VoucherParentType.Purchase:
        this.ledger.ISDEEMEDPOSITIVE = "Yes";
        this.service.voucher.LEDGERENTRIES_LIST.push(this.ledger);
        this.table.renderRows();
        this.ledger = new LEDGERENTRIESLIST();
        this.auto.ledgerControl.setValue('');
        this.auto.ledgerRef.nativeElement.focus();
        break;

      case VoucherParentType.Journal:

          if(this.service.voucher.ALLLEDGERENTRIES_LIST.length == 0){
            this.ledger.ISDEEMEDPOSITIVE = "Yes";
            this.ledger.AMOUNT = (-1) * this.ledger.AMOUNT
          }else{
            this.ledger.ISDEEMEDPOSITIVE = "No";
          }
          if (this.auto.ledgerControl.value.PARENT == "Bank Accounts" ||this.auto.ledgerControl.value.PARENT == "Bank OD A/c") {
            const dialogConfig = new MatDialogConfig();
            dialogConfig.autoFocus = true;
            dialogConfig.width = "50%";
            const dialogRef = this.dialog.open(BankAllocationComponent, {data: this.ledger});
            dialogRef.afterClosed().subscribe(
              (res: ALLLEDGERENTRIESLIST) => {
                this.ledger = res;
                this.add()
              }
            )
          }  else if(ledger.ISBILLWISEON == "Yes"){
            this.showBillWiseDetails();
          } else {
           this.add()
          }
          break;

      default:
        break;
    }


  }

  deleteLedger(i){
    switch (this.service.voucherParentType) {
      case VoucherParentType.Sales:
        this.service.voucher.LEDGERENTRIES_LIST.forEach( (item, index) => {
          if(item.LEDGERNAME === i) this.service.voucher.LEDGERENTRIES_LIST.splice(index,1);
        });
        this.ledger = new LEDGERENTRIESLIST();
        break;

      case VoucherParentType.Purchase:
        this.service.voucher.LEDGERENTRIES_LIST.forEach( (item, index) => {
          if(item.LEDGERNAME === i) this.service.voucher.LEDGERENTRIES_LIST.splice(index,1);
        });
        this.ledger = new LEDGERENTRIESLIST();
        break;
      default:
        this.service.voucher.ALLLEDGERENTRIES_LIST.forEach( (item, index) => {
          if(item.LEDGERNAME === i) this.service.voucher.ALLLEDGERENTRIES_LIST.splice(index,1);
        });
        this.ledger = new ALLLEDGERENTRIESLIST();
        break;
    }
    this.table.renderRows();
    this.refreshLedgers();

    this.auto.ledgerControl.setValue('');
    this.auto.ledgerRef.nativeElement.focus();
  }

  add(){
    this.service.voucher.ALLLEDGERENTRIES_LIST.push(this.ledger)
    this.refreshLedgers()
    this.table.renderRows();
    this.ledger = new ALLLEDGERENTRIESLIST();
    if(this.service.voucher.getRemainingBalance() == 0){
      this.complete.emit('complete');
    }
    this.auto.ledgerControl.setValue('');
    this.auto.ledgerRef.nativeElement.focus();
  }

  proceed(){
    if(this.service.coupons == null){
      if(!confirm("We are still waiting for coupons for this customer. Do you wish to continue waiting?")){
        this.complete.emit("complete");
      }
    }else if(this.service.coupons.length == 0){
      this.complete.emit("complete");
    }else{
      this.showCoupons();
    }
  }


  showCoupons(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = "50%";
      const dialogRef1 = this.dialog.open(CouponEntryComponent, {data: this.service.coupons});
          dialogRef1.afterClosed().subscribe(
            (res: LEDGERENTRIESLIST) => {
              if(res){
              this.ledger = res;
              this.addLedger()
              }
              this.complete.emit("complete");
            }
          )
  }


  showBillWiseDetails(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = "50%";
      const dialogRef1 = this.dialog.open(BillAllocationComponent, {data: this.ledger});
          dialogRef1.afterClosed().subscribe(
            (res: ALLLEDGERENTRIESLIST) => {
              this.ledger = res;
              this.add()
            }
          )


  }

  focus(){
    this.auto.sync();
    this.auto.ledgerRef.nativeElement.focus();

  }

  getParticulars(){
    switch (this.service.voucherParentType) {
      case VoucherParentType.Contra:
        return this.service.voucher.ALLLEDGERENTRIES_LIST.filter((l) => l.ISDEEMEDPOSITIVE == 'No');
        break;

      case VoucherParentType.Payment:
        return this.service.voucher.ALLLEDGERENTRIES_LIST.filter((l) => l.ISDEEMEDPOSITIVE == 'Yes');
        break;

      case VoucherParentType.Receipt:
        return this.service.voucher.ALLLEDGERENTRIES_LIST.filter((l) => l.ISDEEMEDPOSITIVE == 'No');
        break;

      case VoucherParentType.Sales:

        return this.service.voucher.LEDGERENTRIES_LIST.filter((l) => l.ISDEEMEDPOSITIVE == 'No');

        break;

      case VoucherParentType.Purchase:

        return this.service.voucher.LEDGERENTRIES_LIST.filter((l) => l.ISDEEMEDPOSITIVE == 'Yes');

        break;

      case VoucherParentType.Journal:
        return this.service.voucher.ALLLEDGERENTRIES_LIST;
        break;

      default:
        break;
    }
  }

  refreshLedgers(){

    let particulars = this.getParticulars();
    if(particulars){
      for(let item of particulars){
        if(item instanceof LEDGERENTRIESLIST){
          item.AMOUNT = this.getLedgerAmount(item);
        }
      }
    }

  }

  getLedgerAmount(l: LEDGERENTRIESLIST): number {
    let ledger = this.syncService.ledgers$.getValue().filter((v) => v.NAME === l.LEDGERNAME)[0];
    let amount = 0
    switch(l.METHODTYPE? l.METHODTYPE:ledger.TAXTYPE){
      case "GST" :
        let invTotal = 0;
        let taxTotal = 0;
        for (let product of this.service.voucher.ALLINVENTORYENTRIES_LIST){
          var item: StockItem = Object.assign(new StockItem(),this.syncService.products$.getValue().filter((i) => i.NAME === product.STOCKITEMNAME)[0]);

          if(item){
            let invTax = item.getTax(product.BILLEDQTY,product.RATE,"",ledger.GSTDUTYHEAD);
            invTotal = invTotal + (product.BILLEDQTY*product.RATE)
            taxTotal = taxTotal + invTax;
            amount = amount + invTax;
          }else{
            throw new Error("Please re-select the product");

          }

        }
        for(let led of this.service.voucher.LEDGERENTRIES_LIST){
          let temp = this.syncService.ledgers$.getValue().filter((v) => v.NAME === led.LEDGERNAME)[0];
          if(temp.APPROPRIATEFOR == "GST"){
            amount = amount + (led.AMOUNT * (taxTotal / invTotal));
          }
        }
        amount =  parseFloat((Math.round(amount * 100) / 100).toFixed(2));
        return amount;
        break;

      case "As Total Amount Rounding":
          var total: number =0
          for (let item of this.service.voucher.LEDGERENTRIES_LIST){
            if (item.AMOUNT != null && item.METHODTYPE !="As Total Amount Rounding"
            && (item.POSPAYMENTTYPE == null || item.POSPAYMENTTYPE == "")){
              total = total + item.AMOUNT;
            }
          }

          for (let item of this.service.voucher.ALLINVENTORYENTRIES_LIST){
            if (item.AMOUNT != null){
              total = total + item.AMOUNT;
            }
          }
          return Math.round((Math.round(total) - total)*100) *0.01;
          break;
      case "As User Defined Value":
          break;
      default:

        return l.AMOUNT? l.AMOUNT: 0;
    }
  }

}
