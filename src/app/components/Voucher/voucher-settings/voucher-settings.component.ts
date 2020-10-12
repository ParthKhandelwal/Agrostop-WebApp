import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AgroVoucherService } from '../../../services/AgroVoucher/agro-voucher.service';
import { VOUCHERCLASSLISTLIST, VoucherParentType, VOUCHERTYPE } from '../../../model/VoucherType/voucher-type';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { AuthenticationService } from '../../../services/Authentication/authentication.service';
import { NavigationEnd, Router } from '@angular/router';
import { MatStepper } from '@angular/material/stepper';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { ApiService } from '../../../services/API/api.service';

@Component({
  selector: 'app-voucher-settings',
  templateUrl: './voucher-settings.component.html',
  styleUrls: ['./voucher-settings.component.css']
})
export class VoucherSettingsComponent implements OnInit {

  @ViewChild(MatStepper) stepper: MatStepper;


  constructor(public auth?: AuthenticationService,
    public dialogRef?: MatBottomSheetRef<VoucherSettingsComponent>,
    public service?: AgroVoucherService, private db?: NgxIndexedDBService,
    public apiService?: ApiService,
    public router?: Router, private cd?: ChangeDetectorRef) {
    this.dialogRef.disableClose = false;
    router.events.subscribe(
      res => {
        if(res instanceof NavigationEnd){
          if(res.url != '/agro-voucher'){
            this.dialogRef.dismiss();
          }
        }
      }
    )
    this.service.voucher.DATE = new Date();
  }
  voucherTypes: any[] = []
  classes: string[] = [];
  async ngOnInit(): Promise<void> {

    this.voucherTypes = (await this.db.getAll("Voucher Types")).filter((v: any) => this.auth.user.voucherTypes.filter((l) => l.voucherTypeName == v.NAME).length>0);
    setTimeout(() => {
      document.getElementById("voucherparenttype").focus();
    }, 200);
  }


  voucherParents(): Array<string>{
    let v = VoucherParentType
    return Object.values(v);
  }

  public getClass(): any[]{
    let value: VOUCHERTYPE = this.voucherTypes.filter((v) => v.NAME === this.service.voucher.VOUCHERTYPENAME)[0];
    let classes = [];
    if(value && value.VOUCHERCLASSLIST_LIST){

      let temp = value.VOUCHERCLASSLIST_LIST;
      if(temp instanceof Array){
        for(let item of temp){
          classes.push(item.className);
        }
      }
    }

    return classes;
  }

  voucherParentTypeSelectionChange(){

    setTimeout(() => {
      this.stepper.next();
      setTimeout(() => {
        document.getElementById("voucherTypeSelect").focus();
      }, 100);
    }, 300)
  }

  classSelection(){
    if(this.service.voucher.CLASSNAME){
      this.service.setVoucherForClass();
    }

    setTimeout(() => {
      this.stepper.next();
      setTimeout(() => {
        document.getElementById("date").focus();
      }, 100);
    }, 300)
  }

  focus(){

    setTimeout(() => {
      this.stepper.next();
      setTimeout(() => {
        document.getElementById("class")? document.getElementById("class").focus(): document.getElementById("date").focus();
      }, 100);

    }, 300)
  }

  save(){
    this.dialogRef.dismiss();
  }

  showPriceListAndGodown(){
    return this.service.voucherParentType == VoucherParentType.Sales;
  }

  showVoucherSourceAndDestination(){
    return this.service.voucherParentType == VoucherParentType.Material_Out;
  }

  validDate(){
    return this.service.voucher.DATE instanceof Date;
  }

  dateSelected(){
    if(this.showPriceListAndGodown()){
      setTimeout(() => {
        this.stepper.next()
        setTimeout(() => {
          document.getElementById("priceLevel").focus();
        }, 100);
      }, 300)

    }else if (this.showVoucherSourceAndDestination()) {
      setTimeout(() => {
        this.stepper.next()
        setTimeout(() => {
          document.getElementById("source").focus();
        }, 100);
      }, 300)
    }else{
      this.save()
    }
  }

  priceLevelSelected(){

    setTimeout(() => {
      this.stepper.next()
      setTimeout(() => {
        document.getElementById("godown").focus();
      }, 100);

    }, 300)
  }

  destinationGodowns: string[] = []

  getDestinationGodown(){
    this.apiService.getGodownNames().subscribe(
      res => {
        this.destinationGodowns = res.map((v) => v._NAME);
      },
      err => {
        alert("Please check your internet connectivity and try again");
      }
    )
  }


  sourceGodownSelected(){
    this.getDestinationGodown();
    this.stepper.next();

    setTimeout(() => {

      document.getElementById("destination").focus();

    }, 300)
  }

  proceed(){

  }
}
