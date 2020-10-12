import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogConfig, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { VOUCHER } from '../../../model/Voucher/voucher';
import { InvoicePrintViewComponent } from '../../invoice-print-view/invoice-print-view.component';
import { VoucherParentType } from '../../../model/VoucherType/voucher-type';
import { AuthenticationService } from '../../../services/Authentication/authentication.service';
import { AgroVoucherService } from '../../../services/AgroVoucher/agro-voucher.service';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/API/api.service';

@Component({
  selector: 'app-voucher-summary',
  templateUrl: './voucher-summary.component.html',
  styleUrls: ['./voucher-summary.component.css']
})
export class VoucherSummaryComponent implements OnInit {
  voucher: VOUCHER;
  inventoryColumns = ["name", "qty", "rate"]
  ledgerColumns = ["name", "amount"]
  voucherParentType;
  constructor(@Inject(MAT_DIALOG_DATA) public data?: VOUCHER,public dialogRef?: MatDialogRef<VoucherSummaryComponent>,private dialog?: MatDialog,
  public auth?: AuthenticationService,
   private service?: AgroVoucherService, private router?: Router, private apiService?: ApiService) {
    this.voucher = Object.assign(new VOUCHER(),data);
    this.voucherParentType = VoucherParentType[this.auth.user.voucherTypes.filter((v) => v.voucherTypeName === this.voucher.VOUCHERTYPENAME)[0].voucherCategory.replace(" ", "_")];
   }

  ngOnInit(): void {
  }


  print(){
    const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = true;
      dialogConfig.width = "50%";
      this.dialog.open(InvoicePrintViewComponent, {data: this.voucher, maxHeight: '90vh'});

  }
  edit(){
    let voucher: VOUCHER = Object.assign(new VOUCHER, this.voucher);
    voucher.DATE = new Date(voucher.DATE);
    this.service.voucher = voucher;

    let voucherType = this.auth.user.voucherTypes.filter((v) => v.voucherTypeName === voucher.VOUCHERTYPENAME)[0];
    if(voucherType){
      this.service.voucherParentType = this.voucherParentType;

      this.service.setForEditing();
      if(voucher.CLASSNAME){
        console.log("POS Class Recieved")
        this.service.setVoucherForClass();
      }

      this.router.navigateByUrl("/agro-voucher")
      this.dialogRef.close();
    }else{
      alert("You do not have permission to edit the vouchers of this voucher type. Please contact your administrator.")
    }

  }

  getInventory(){
    switch (this.voucherParentType) {
      case VoucherParentType.Sales:
        return this.voucher.ALLINVENTORYENTRIES_LIST;
      case VoucherParentType.Purchase:
          return this.voucher.ALLINVENTORYENTRIES_LIST;
      case VoucherParentType.Material_Out:
        return this.voucher.INVENTORYENTRIESOUT_LIST;

      default:
        break;
    }
  }

  getLedgers(){
    switch (this.voucherParentType) {
      case VoucherParentType.Sales:
        return this.voucher.LEDGERENTRIES_LIST;
      case VoucherParentType.Purchase:
          return this.voucher.LEDGERENTRIES_LIST;
      case VoucherParentType.Material_Out:
        return this.voucher.LEDGERENTRIES_LIST;

      default:
        return this.voucher.ALLLEDGERENTRIES_LIST;
        break;
    }
  }

  deleteVoucher(){
    if(confirm("Do you wish to delete this voucher from Tally?")){
      this.voucher._ACTION = "Delete";
      this.voucher.savedToTally = false
      this.apiService.saveTallyVoucher(this.voucher).subscribe(
        res => {
          this.dialogRef.close();

        }
      )
    }

  }

  deleteFromCloud(){
    if(confirm("Do you wish to delete this voucher from Cloud?"))
    this.apiService.deleteVoucher(this.voucher._REMOTEID).subscribe(
      res => {
        console.log(res);
        this.dialogRef.close();
      },
      err => {
        alert("Could not delete this voucher right now");
      }
    );
  }

  resetVoucher(){
    this.apiService.resetVoucher(this.voucher._REMOTEID).subscribe(
      res => {
        this.dialogRef.close();
      },
      err => {
        alert("Voucher reset failed! Try again later");
      }
    )
  }

}
