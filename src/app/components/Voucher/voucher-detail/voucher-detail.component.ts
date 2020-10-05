import { Component, OnInit, Output, ViewChild } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { AgroVoucherService } from '../../../services/AgroVoucher/agro-voucher.service';
import { ApiService } from '../../../services/API/api.service';
import { AuthenticationService } from '../../../services/Authentication/authentication.service';
import { SyncService } from '../../../services/Sync/sync.service';
import { Customer } from '../../../model/Customer/customer';
import { ADDRESSLIST, LEDGERENTRIESLIST } from '../../../model/Voucher/voucher';
import { VoucherParentType } from '../../../model/VoucherType/voucher-type';
import { AutoCompleteComponent } from '../../AgroComponents/auto-complete/auto-complete.component';
import { CustomerEntryComponent } from '../../AgroEntryComponents/customer-entry-components/customer-entry.component';
import { LedgerMovementAnalysisComponent } from '../../MovementAnalysis/ledger-movement-analysis/ledger-movement-analysis.component';

@Component({
  selector: 'voucher-detail',
  templateUrl: './voucher-detail.component.html',
  styleUrls: ['./voucher-detail.component.css']
})
export class VoucherDetailComponent implements OnInit {
  voucherParent = VoucherParentType;
  @ViewChild("ledgerSummary") ledgerSummary: LedgerMovementAnalysisComponent;
  @ViewChild("ledgerAutoComp") ledgerAutoComp: AutoCompleteComponent;
  @Output("complete") complete = new EventEmitter();

  fromDate: Date;
  toDate: Date;

  constructor(public service?: AgroVoucherService,
    private dialog?: MatDialog,
    public db?: NgxIndexedDBService,
    public syncService?: SyncService,
    public apiService?: ApiService,
    public auth?: AuthenticationService) { }

  ngOnInit(): void {

  }

  async ledgerSelected(value){
    this.ledgerSummary.apply(value);
    let ledger: any = await this.db.getByID("Ledgers", value);
    this.service.voucher.ADDRESS_LIST = ledger.ADDRESS_LIST;
    this.service.voucher.STATENAME = ledger.LEDSTATENAME;
    this.service.voucher.COUNTRYOFRESIDENCE = ledger.COUNTRYOFRESIDENCE;
    this.service.voucher.PARTYLEDGERNAME = value;
    this.service.voucher.BASICBASEPARTYNAME = value;
    this.service.voucher.PARTYNAME = value;
    this.service.voucher.PARTYGSTIN = ledger.PARTYGSTIN;
    let ledgerEntry = this.service.voucher.LEDGERENTRIES_LIST.filter((v) => v.ISDEEMEDPOSITIVE === "No")[0];
    if(ledgerEntry){
      ledgerEntry.ISDEEMEDPOSITIVE = "No";
      ledgerEntry.LEDGERNAME = value;
    }else{
      ledgerEntry = new LEDGERENTRIESLIST();
      ledgerEntry.ISDEEMEDPOSITIVE = "No";
      ledgerEntry.LEDGERNAME = value;
      this.service.voucher.LEDGERENTRIES_LIST.push(ledgerEntry);
    }

    setTimeout(() => {
      document.getElementById("reference").focus();
    }, 300);
  }

  focus(){
    switch (this.service.voucherParentType) {
      case VoucherParentType.Contra:
        this.ledgerAutoComp.ledgerControl.setValue('');
        this.ledgerAutoComp.ledgerRef.nativeElement.focus();
        break;

      case VoucherParentType.Payment:
        this.ledgerAutoComp.ledgerControl.setValue('');
        this.ledgerAutoComp.ledgerRef.nativeElement.focus();
        break;

      case VoucherParentType.Receipt:
        this.ledgerAutoComp.ledgerControl.setValue('');
        this.ledgerAutoComp.ledgerRef.nativeElement.focus();
        break;
      case VoucherParentType.Sales:
        this.ledgerAutoComp.customerControl.setValue('');
        this.ledgerAutoComp.customerRef.nativeElement.focus();
        break;

      case VoucherParentType.Purchase:
        setTimeout(() => {
          this.ledgerAutoComp.ledgerRef.nativeElement.focus();
        }, 200);
        break;
      case VoucherParentType.Journal:
        this.complete.emit('complete');
        break;

      case VoucherParentType.Material_Out:
        this.ledgerAutoComp.ledgerControl.setValue('');
        this.ledgerAutoComp.ledgerRef.nativeElement.focus();
        break;

      default:
        break;
      }
  }

  selectCustomer(value){
    console.log(this.ledgerAutoComp.customerControl.value);
    let res = value.option.value;
    this.service.customer = res;

    if(res.id){
      this.service.voucher.BASICBUYERNAME = res.id;
      this.service.voucher.ADDRESS_LIST = new ADDRESSLIST(res.name, res.fatherName, res.fullAddress ? res.fullAddress.name: "", res.phoneNumber);
      this.complete.emit('complete');
    }else{
      const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = true;
      dialogConfig.width = "50%";
      let customer = new Customer();
      let regex = /^\d{10}$/g
      if(regex.test(res)){
        customer.phoneNumber = res;
      }else{
        customer.name = res;
      }
      const dialogRef = this.dialog.open(CustomerEntryComponent, {data: customer, maxHeight: '90vh'});
      dialogRef.afterClosed().subscribe(
        (res: Customer) => {
          if(res && res.id){
            this.service.voucher.BASICBUYERNAME = res.id;
            this.service.voucher.ADDRESS_LIST = new ADDRESSLIST(res.name, res.fatherName, res.fullAddress.name, res.phoneNumber);
            this.complete.emit("complete");
          }

        }
      )
    }
    this.apiService.getCustomerCoupon(this.service.voucher.BASICBUYERNAME).subscribe(
      res => {
        this.service.coupons = res;
      },
      err => {
        this.service.coupons = [];
      }
    )

  }

}
