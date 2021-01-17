import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogConfig, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { VOUCHER } from '../../../model/Voucher/voucher';
import { InvoicePrintViewComponent } from '../../invoice-print-view/invoice-print-view.component';
import { VoucherParentType } from '../../../model/VoucherType/voucher-type';
import { AuthenticationService } from '../../../services/Authentication/authentication.service';
import { AgroVoucherService } from '../../../services/AgroVoucher/agro-voucher.service';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/API/api.service';
import { VoucherDisplay } from 'src/app/model/HelperClass/HelperClass';
import { NgxIndexedDBService } from 'ngx-indexed-db';

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
  constructor(@Inject(MAT_DIALOG_DATA) public data?: VoucherDisplay,public dialogRef?: MatDialogRef<VoucherSummaryComponent>,private dialog?: MatDialog,
  public auth?: AuthenticationService,
  private db?: NgxIndexedDBService,
   private service?: AgroVoucherService, private router?: Router, private apiService?: ApiService) {
    this.voucherParentType = data.voucherparenttype;
   }

  ngOnInit(): void {
    this.apiService.getVoucher(this.data.id).subscribe(
      res => {
        this.voucher = Object.assign(new VOUCHER(),res);
      },err => {
        this.dialogRef.close();
        alert("Error ocurred");
      }
    )
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


  showSMSForm: boolean;
  phoneNumber: string;
  vehicleNumber: string;
  arrivalTime: string;
  contactNumber: string;
  smsTemplate: string;

  showSMS(){
    this.db.getByKey("customers", this.voucher.BASICBUYERNAME).then(
      res => {
        this.phoneNumber = res.phoneNumber;
      },
    ).finally(() =>this.showSMSForm = true)
  }

  sendSMS(){
    this.apiService.sendSMS(this.phoneNumber, this.voucher._REMOTEID, 
      this.vehicleNumber, this.arrivalTime, this.contactNumber, this.smsTemplate).subscribe(
      res => {
        alert("Message sent successfully");
        this.dialogRef.close();
      },
      err => {
        alert("Message could not be sent")
      }
    )
  }

  valid(){
    if(!this.phoneNumber || this.phoneNumber.length != 10){
      return false;
    }
    if(!this.smsTemplate ){
      return false;
    }else {
      if(this.smsTemplate == "ORDER_DISPATCHED"){
        if(!this.contactNumber || this.contactNumber.length!= 10){
          return false;
        }
        if(!this.vehicleNumber){
          return false;
        }
        if(this.arrivalTime){
          return false;
        }
      }
    }
    return true;
  }
}
