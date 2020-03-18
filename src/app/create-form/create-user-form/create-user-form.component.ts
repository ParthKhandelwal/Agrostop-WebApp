import { Component, OnInit, Inject, Input, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../shared/api.service';
import { MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import { User, VoucherTypeClass } from '../../Model/user';
import { MatTableDataSource } from '@angular/material';


@Component({
  selector: 'app-create-user-form',
  templateUrl: './create-user-form.component.html',
  styleUrls: ['./create-user-form.component.css']
})
export class CreateUserFormComponent implements OnInit {
  hide = true;
  updateMode = false;
  user: User = {
    baseEntity:          "",
    lastLogin:           "",
    password:            "",
    emailId:             "",
    contactNumber:       "",
    name:                "",
    role:                "",
    userName:            "",
    tallyUserName:       "",
    godownList:          [],
    defaultGodown:       "",
    salesVoucherSettings: {
      voucherTypeList:  [],
      defaultVoucherType: "",
      defaultClass: "",
      cashLedgerList: [],
      defaultCashLedger: "",
      placeOfSupply: "",
      priceLists: []
    }
  };


  displayedColumns: string[] = ["name", "update"];
  godownDataSource: MatTableDataSource<String>;
  voucherTypeDataSource: MatTableDataSource<VoucherTypeClass>;
  cashLedgerDataSource: MatTableDataSource<String>
  posClassDataSource: MatTableDataSource<String>
  priceListDataSource: MatTableDataSource<String>

  @ViewChild('posClass', { static: false }) posClass:ElementRef;

  priceList: any[] = [];
  posCashLedgers: any[] = [];
  cashLedgers: any[]= [];
  basicBasePartyNames: any[]= [];
  placeOfSupplies: any[]= [];
  voucherTypeNames: any[] = [];
  godownNames: any[] = [];
  url = '';
  selectedFile = '';

  onFileChanged(event) {
     this.selectedFile = event.target.files[0]
     console.log(this.selectedFile);
   }

  constructor(@Inject(MAT_DIALOG_DATA) public data?: any,
  private dialogRef?: MatDialogRef<CreateUserFormComponent>,private router? :Router,
  @Inject(ApiService) private apiService? : ApiService) {
    if (data != null){
      this.user = data;
      this.updateMode = true;
    } else{
      this.updateMode = false;
    }
  }

  ngOnInit() {
    this.apiService.getCashLedgers().subscribe(
      res =>{
        if(res != null){
        this.posCashLedgers = res;
        this.cashLedgers = res;
        this.basicBasePartyNames = res;
      }
      },
      err =>{
        console.log(err);
      }
    );

    this.apiService.getSalesVoucherTypeName().subscribe(
      res => {
        this.voucherTypeNames = res;

      
      },
      err =>{
        console.log(err);
      }
    );


    this.apiService.getGodownNames().subscribe(
      res =>{
        if(res != null){
        this.godownNames = res;
      }

      },
      err =>{
        console.log(err);
      }
    );

    this.apiService.getPriceList().subscribe(
      res => {
        this.priceList = res;
      },
      err =>{
        console.log(err);
      }
    );
    
    this.godownDataSource = new MatTableDataSource<string>(this.user.godownList);
    this.voucherTypeDataSource = new MatTableDataSource<VoucherTypeClass>(this.user.salesVoucherSettings.voucherTypeList);
    this.cashLedgerDataSource = new MatTableDataSource<string>(this.user.salesVoucherSettings.cashLedgerList);
    this.priceListDataSource = new MatTableDataSource<String>(this.user.salesVoucherSettings.priceLists);
  }

  submit(){
    if (this.updateMode){
      this.apiService.updateUser(this.user).subscribe(
        res =>{
          console.log(res);
          this.dialogRef.close;
        },
        err =>{
          console.log(err);
        }
      )
    }
    else {
    this.apiService.saveUser(this.user).subscribe(
      res =>{
        console.log(res);
      },
      err =>{
        alert(err.error);
        console.log(err);
      }
    )
  }
}


addGodown(godown: string){
  var voucherExists: boolean = false;
  for (var i = 0; i < this.user.godownList.length; i++) {
    if (this.user.godownList[i] == godown) {
      voucherExists = true;
    }
  }
  if(!voucherExists){
    this.user.godownList.push(godown)
  }


  this.godownDataSource._updateChangeSubscription();
}

deleteGodown(godown: string){
  for (var i = 0; i < this.user.godownList.length; i++) {
    if (this.user.godownList[i] === godown) {
      this.user.godownList.splice(i, 1);
    }
  }
  this.godownDataSource._updateChangeSubscription();
}

addVoucherType(voucherType: string){
  var voucherExists: boolean = false;
  var num:number = this.user.salesVoucherSettings.voucherTypeList.length;
  for (var i = 0; i < this.user.salesVoucherSettings.voucherTypeList.length; i++) {
    if (this.user.salesVoucherSettings.voucherTypeList[i].voucherTypeName == voucherType) {
      voucherExists = true;
    }
  }
  if(!voucherExists){
    const voucherTypeObject : VoucherTypeClass = {
     voucherTypeName: voucherType,
    classes:[]
    }
    this.user.salesVoucherSettings.voucherTypeList.push(voucherTypeObject)
  }
  this.posClassDataSource = new MatTableDataSource(this.user.salesVoucherSettings.voucherTypeList[i].classes);

  this.voucherTypeDataSource._updateChangeSubscription();
}

deleteVoucherType(voucherType: string){
  for (var i = 0; i < this.user.salesVoucherSettings.voucherTypeList.length; i++) {
    if (this.user.salesVoucherSettings.voucherTypeList[i].voucherTypeName === voucherType) {
      this.user.salesVoucherSettings.voucherTypeList.splice(i, 1);
    }
  }
  this.voucherTypeDataSource._updateChangeSubscription();
}

addCashLedger(cashLedger: string){
  var voucherExists: boolean = false;
  for (var i = 0; i < this.user.salesVoucherSettings.cashLedgerList.length; i++) {
    if (this.user.salesVoucherSettings.cashLedgerList[i] == cashLedger) {
      voucherExists = true;
    }
  }
  if(!voucherExists){
    this.user.salesVoucherSettings.cashLedgerList.push(cashLedger)
  }


  this.cashLedgerDataSource._updateChangeSubscription();
}

deleteCashLedger(cashLedger: string){
  for (var i = 0; i < this.user.salesVoucherSettings.cashLedgerList.length; i++) {
    if (this.user.salesVoucherSettings.cashLedgerList[i] === cashLedger) {
      this.user.salesVoucherSettings.cashLedgerList.splice(i, 1);
    }
  }
  this.cashLedgerDataSource._updateChangeSubscription();
}

addPOSClass(voucherTypeName: string){
  console.log("addPOSClass called");
  for (var i = 0; i < this.user.salesVoucherSettings.voucherTypeList.length; i++) {
    if (this.user.salesVoucherSettings.voucherTypeList[i].voucherTypeName === voucherTypeName) {
      this.user.salesVoucherSettings.voucherTypeList[i]
      .classes.push(this.posClass.nativeElement.value);
    }
  }
}




addPriceList(price: string){
  var priceListExists: boolean = false;
  if (this.user.salesVoucherSettings.priceLists != null){
  for (var i = 0; i < this.user.salesVoucherSettings.voucherTypeList.length; i++) {
    if (this.user.salesVoucherSettings.priceLists[i] == price) {
      priceListExists = true;
    }
  }
} else {
  this.user.salesVoucherSettings.priceLists = [];
}
  if(!priceListExists){
    this.user.salesVoucherSettings.priceLists.push(price);
  }

  this.priceListDataSource._updateChangeSubscription();
}

deletePriceList(price: string){
  for (var i = 0; i < this.user.salesVoucherSettings.priceLists.length; i++) {
    if (this.user.salesVoucherSettings.priceLists[i] === price) {
      this.user.salesVoucherSettings.priceLists.splice(i, 1);
    }
  }
  this.priceListDataSource._updateChangeSubscription();
}


}
