import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PrintConfiguration, LicenseNumbers } from '../../../model/PrintConfiguration/print-configuration';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { MatChipInputEvent } from '@angular/material/chips';
import { ApiService } from '../../../services/API/api.service';
import { Coupon, VoucherTypeConfig } from '../../../model/VoucherType/voucher-type-config';
import { ObjectID } from 'bson';
import { MatTable } from '@angular/material/table';

@Component({
  selector: 'app-print-configuration-entry',
  templateUrl: './print-configuration-entry.component.html',
  styleUrls: ['./print-configuration-entry.component.css']
})
export class PrintConfigurationEntryComponent implements OnInit {

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER];

  voucherTypes: any[];
  tempVoucherTypes: any[];
  parents: string[] = ['Sales', 'Material Out']

  coupon: Coupon = new Coupon();
  displayedColumns = ['title', 'date', 'till', 'onAmount', 'amountOffered', 'action'];
  constructor(public dialogRef?: MatDialogRef<PrintConfigurationEntryComponent>,
    @Inject(MAT_DIALOG_DATA) public voucherTypeConfig?: VoucherTypeConfig, private db?: NgxIndexedDBService, private apiService?: ApiService) { }

  async ngOnInit(): Promise<void> {
    let objectId = new ObjectID();
    this.coupon.id = objectId.toString();
    this.voucherTypes = (await this.db.getAll("Voucher Types"))
    .map((v: any) => {
      return {"NAME": v.NAME, "PARENT": v.PARENT}
    })
    if(this.voucherTypeConfig.voucherCategory){
      this.tempVoucherTypes = this.voucherTypes.filter((v) => v.PARENT === this.voucherTypeConfig.voucherCategory).map((v) => v.NAME);
    }
  }

  selectCategory(value){
    this.tempVoucherTypes = this.voucherTypes.filter((v) => v.PARENT === value.value).map((v) => v.NAME);
  }

  addAddress(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.voucherTypeConfig.printConfiguration.address.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  removeAddress(fruit): void {
    const index = this.voucherTypeConfig.printConfiguration.address.indexOf(fruit);

    if (index >= 0) {
      this.voucherTypeConfig.printConfiguration.address.splice(index, 1);
    }
  }


  addTC(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.voucherTypeConfig.printConfiguration.termsAndConditions.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  removeTC(fruit): void {
    const index = this.voucherTypeConfig.printConfiguration.termsAndConditions.indexOf(fruit);

    if (index >= 0) {
      this.voucherTypeConfig.printConfiguration.termsAndConditions.splice(index, 1);
    }
  }

  addLicenseNumber(lname, lnumber){
    let l = new LicenseNumbers();
    l.licenseName = lname;
    l.licenseNumber = lnumber
    this.voucherTypeConfig.printConfiguration.licenseNumbers.push(l)
  }

  save(){
    this.apiService.saveVoucherTypeConfig(this.voucherTypeConfig).subscribe(
      res => {
        this.dialogRef.close();
      },
      err => {
        console.log(err);
      }
    )
  }

  delete(){
    this.apiService.deleteVoucherTypeConfig(this.voucherTypeConfig.voucherType).subscribe(
      res => {
        this.dialogRef.close();
      },
      err => {
        console.log(err);
      }
    )
  }

  addCoupon(){
    this.voucherTypeConfig.coupons.push(this.coupon);
    this.coupon = new Coupon();
    let objectId = new ObjectID();
    this.coupon.id = objectId.toString();
    this.ctable.renderRows();
  }

  @ViewChild("cTable") ctable : MatTable<any>;
  deleteCoupon(i){
    this.voucherTypeConfig.coupons.splice(i,1);
    this.ctable.renderRows();
  }

}
