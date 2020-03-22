import { Component, OnInit, Inject, Input, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../shared/api.service';
import { MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import { User, VoucherTypeClass } from '../../Model/user';
import { MatTableDataSource } from '@angular/material';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-create-user-form',
  templateUrl: './create-user-form.component.html',
  styleUrls: ['./create-user-form.component.css']
})
export class CreateUserFormComponent implements OnInit {
  hide = true;
  updateMode = false;
  user: User;


  displayedColumns: string[] = ["name", "update"];
  godownDataSource: MatTableDataSource<String>;
  voucherTypeDataSource: MatTableDataSource<VoucherTypeClass>;
  cashLedgerDataSource: MatTableDataSource<String>
  posClassDataSource: MatTableDataSource<String>
  priceListDataSource: MatTableDataSource<String>

  @ViewChild('posClass', { static: false }) posClass:ElementRef;

  priceList: any[] = [];
  posClassList: any[] = [];
  voucherTypeNames: any[] = [];
  godownNames: any[] = [];
  godownFormControl = new FormControl();
  posFormControl = new FormControl();
  voucherTypeFormControl = new FormControl();
  priceLevelFormControl = new FormControl();
  voucherType: VoucherTypeClass = new VoucherTypeClass()
  godownName: string = "";
  priceLevel: string = "";
  voucherTypes$ : Observable<any[]>;

  

 

  constructor(@Inject(MAT_DIALOG_DATA) public data?: any,
  private dialogRef?: MatDialogRef<CreateUserFormComponent>,private router? :Router,
  @Inject(ApiService) private apiService? : ApiService) {
    if (data != null){
      this.user = data;
      this.updateMode = true;
    } else{
      this.updateMode = false;
      this.user = new User();
      this.user.role = "Company User";
    }
  }

  ngOnInit() {
    
    
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
    
  }

  getVoucherType(value){
    this.voucherTypes$ = this.apiService.getVoucherTypeNames(value);

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
  this.godownName = "";
}

deleteGodown(godown: string){
  for (var i = 0; i < this.user.godownList.length; i++) {
    if (this.user.godownList[i] === godown) {
      this.user.godownList.splice(i, 1);
    }
  }
}

addVoucherType(voucherType: VoucherTypeClass){
  var voucherExists: boolean = false;
  for (var i = 0; i < this.user.voucherTypes.length; i++) {
    if (this.user.voucherTypes[i].voucherTypeName == voucherType.voucherTypeName) {
      voucherExists = true;
    }
  }
  if(!voucherExists){
    
    this.user.voucherTypes.push(voucherType)

  }
  this.voucherType = new VoucherTypeClass();
  this.posClassList = [];

}

deleteVoucherType(voucherType: string){
  for (var i = 0; i < this.user.salesVoucherSettings.voucherTypeList.length; i++) {
    if (this.user.salesVoucherSettings.voucherTypeList[i].voucherTypeName === voucherType) {
      this.user.salesVoucherSettings.voucherTypeList.splice(i, 1);
    }
  }
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

getPOSClass(voucherTypeName: string){
  this.posClassList = [];
  this.apiService.getVoucherType(voucherTypeName).subscribe(
    res => {
      const voucherType = res.ENVELOPE.BODY.DATA.TALLYMESSAGE.VOUCHERTYPE;
      this.posClassList = [];
    if (voucherType["VOUCHERCLASSLIST.LIST"] instanceof Array){
      this.posClassList = voucherType["VOUCHERCLASSLIST.LIST"];
    } else {
      this.posClassList.push(voucherType["VOUCHERCLASSLIST.LIST"]);
    }

    },
    err => {
      console.log(err);
    }
  )
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
  this.priceLevel = "";
}

deletePriceList(price: string){
  for (var i = 0; i < this.user.salesVoucherSettings.priceLists.length; i++) {
    if (this.user.salesVoucherSettings.priceLists[i] === price) {
      this.user.salesVoucherSettings.priceLists.splice(i, 1);
    }
  }

}


}
