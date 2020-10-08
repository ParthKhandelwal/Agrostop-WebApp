import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { AgroVoucherService } from '../../../services/AgroVoucher/agro-voucher.service';
import { LEDGERENTRIESLIST } from '../../../model/Voucher/voucher';
import { AutoCompleteComponent } from '../../AgroComponents/auto-complete/auto-complete.component';
import { MatTable } from '@angular/material/table';
import { AuthenticationService } from '../../../services/Authentication/authentication.service';
import { VoucherParentType } from '../../../model/VoucherType/voucher-type';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AdminConfirmationComponent } from '../../AgroComponents/admin-confirmation/admin-confirmation.component';
import { UPILinkComponent } from '../../AgroComponents/upilink/upilink.component';

@Component({
  selector: 'collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.css']
})
export class CollectionComponent implements OnInit {
  ledger : LEDGERENTRIESLIST = new LEDGERENTRIESLIST();
  allowLedgerSelection: boolean = true;
  @Output("complete") complete = new EventEmitter();
  @ViewChild("ledgerAutoComp") auto: AutoCompleteComponent;
  @ViewChild("table") table: MatTable<LEDGERENTRIESLIST>;

  displayedColumns: string[] = ['pmtType', 'ledger', 'amount', 'action'];

  constructor(private dialog?: MatDialog,public service?:AgroVoucherService, public auth?: AuthenticationService) { }

  ngOnInit(): void {
    if(this.service.voucherParentType == VoucherParentType.Sales && !this.service.posInvoice){
      this.ledger.POSPAYMENTTYPE = "Gift"
    }
  }

  focus(){
    if(this.service.voucherParentType == VoucherParentType.Sales && !this.service.posInvoice){
      this.auto.ledgerRef.nativeElement.focus();
    }else{
      document.getElementById("pmtType").focus();
    }
  }

  async paymentTypeSelected(){
    this.ledger.LEDGERNAME = await this.getLedger();
    this.ledger.ISDEEMEDPOSITIVE = "Yes";
    if(this.ledger.LEDGERNAME){
      this.allowLedgerSelection = false;

      this.ledger.AMOUNT =  (-1)*this.service.voucher.getRemainingBalance();
      setTimeout(() => {
        document.getElementById("camount").focus();
      }, 300);
    }else{
      this.allowLedgerSelection = true;
      setTimeout(() => {

        this.auto.ledgerRef.nativeElement.focus();
      }, 300);
    }
  }

  async getLedger(): Promise<string>{
    let vClass = await this.service.getClass()
    switch (this.ledger.POSPAYMENTTYPE) {
      case "Cash":
        return vClass.posCashLedger
        break;

      case "Card":
        return vClass.posCardLedger
        break;


      case "Cheque":
        return vClass.posChequeLedger
        break;


      case "Gift":
        return vClass.posGiftLedger

        break;


      default:
        break;
    }


  }

  getLedgers(){
    switch (this.ledger.POSPAYMENTTYPE) {
      case "Cash":
        return this.auth.user.cashBankProfile.filter((v) => v.type == "Cash-in-hand").map((v) => v.ledger);
        break;

      case "Card":
        return this.auth.user.cashBankProfile.filter((v) => v.type == "Bank Accounts" || v.type == "Bank OD A/c").map((v) => v.ledger);
        break;


      case "Cheque":
        return this.auth.user.cashBankProfile.filter((v) => v.type == "Bank Accounts" || v.type == "Bank OD A/c").map((v) => v.ledger);
        break;


      case "Gift":
        return [];
        break;


      default:
        break;
    }

  }

  ledgerSelected(value){
    this.ledger.LEDGERNAME = value
    setTimeout(() => {
      this.ledger.AMOUNT = (-1)*this.service.voucher.getRemainingBalance();
      document.getElementById("camount").focus();
    },300)

  }

  getPosLedgers(){
    return this.service.voucher.LEDGERENTRIES_LIST.filter((l) => l.POSPAYMENTTYPE);
  }


  addLedger(){
    const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = true;
      dialogConfig.width = "50%";
    switch (this.ledger.POSPAYMENTTYPE) {
      case "Gift":
        const dialogRef = this.dialog.open(AdminConfirmationComponent);
        dialogRef.afterClosed().subscribe(
          res => {
            if(res){
              this.addLedgerHelper();
            }
          }
        )
        break;
      case "Card":
        const dialogRef2 = this.dialog.open(UPILinkComponent, {data: {"id": this.service.voucher._REMOTEID, "payeeName": this.service.customer.name, "amount": this.ledger.AMOUNT}});
        dialogRef2.afterClosed().subscribe(
          res => {
            if(res){
              this.addLedgerHelper();
            }
          }
        )
        break;
    
      default:
          this.addLedgerHelper();
        break;
    }
      
    
    
  }

  addLedgerHelper(){
    let l = this.getPosLedgers().filter((l) =>l.POSPAYMENTTYPE === this.ledger.POSPAYMENTTYPE)[0];
    if(l){
      l.LEDGERNAME = this.ledger.LEDGERNAME;
      l.AMOUNT = this.ledger.AMOUNT;
    }else{
      this.service.voucher.LEDGERENTRIES_LIST.push(this.ledger);
    }
    if(this.service.voucher.getRemainingBalance() == 0){
      this.complete.emit("complete");
    }else{
      this.focus();
    }

    this.ledger = new LEDGERENTRIESLIST();
    this.showCashRecieved = false;
  }

  showCashRecieved:boolean;
  cashRecievedFocus(){
    this.showCashRecieved = true
    setTimeout(() => {
      document.getElementById("cashRecieved").focus();
    }, 300);
  }
}
