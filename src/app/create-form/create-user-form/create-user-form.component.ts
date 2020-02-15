import { Component, OnInit, Inject, Input, ElementRef, ViewChild } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
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
  isUserValid = true;
  hide = true;
  updateMode = false;
  user: User = {
    baseEntity:          "",
    lastLogin:           "",
    password:            "",
    emailId:             "",
    contactNumber:       "",
    id:                  "",
    name:                "",
    role:                "",
    userName:            "",
    tallyUserName:       "",
    godownList:          [],
    defaultGodown:       "",
    salesVocherSettings: {
      voucherTypeList:  [],
      defaultVoucherType: "",
      defaultClass: "",
      cashLedgerList: [],
      defaultCashLedger: "",
      placeOfSupply: "",
    }
  };


  displayedColumns: string[] = ["name", "update"];
  godownDataSource: MatTableDataSource<String>;
  voucherTypeDataSource: MatTableDataSource<VoucherTypeClass>;
  cashLedgerDataSource: MatTableDataSource<String>
  posClassDataSource: MatTableDataSource<String>

  @ViewChild('posClass', { static: false }) posClass:ElementRef;


  posCashLedgers: string[] = [];
  cashLedgers: string[]= [];
  basicBasePartyNames: string[]= [];
  placeOfSupplies: string[]= [];
  voucherTypeNames: VoucherTypeClass[] = [];
  godownNames: string[] = [];
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
          console.log(res)
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
      res =>{
        if (res != null){
          for (var i = 0; i < res.length; i++) {
              var c : VoucherTypeClass = {
                voucherTypeName: res[i]._id,
                classes:[]
              }

            this.voucherTypeNames.push(c);
          }

      }
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

    this.godownDataSource = new MatTableDataSource<string>(this.user.godownList);
    this.voucherTypeDataSource = new MatTableDataSource<VoucherTypeClass>(this.user.salesVocherSettings.voucherTypeList);
    this.cashLedgerDataSource = new MatTableDataSource<string>(this.user.salesVocherSettings.cashLedgerList);



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

addVoucherType(voucherType: VoucherTypeClass){
  var voucherExists: boolean = false;
  var num:number = this.user.salesVocherSettings.voucherTypeList.length;
  for (var i = 0; i < this.user.salesVocherSettings.voucherTypeList.length; i++) {
    if (this.user.salesVocherSettings.voucherTypeList[i] == voucherType) {
      voucherExists = true;
    }
  }
  if(!voucherExists){
    //const voucherTypeObject : VoucherTypeClass = {
    // voucherTypeName: voucherType,
      //classes:[]
    //}
    this.user.salesVocherSettings.voucherTypeList.push(voucherType)
  }
  this.posClassDataSource = new MatTableDataSource(this.user.salesVocherSettings.voucherTypeList[i].classes);

  this.voucherTypeDataSource._updateChangeSubscription();
}

deleteVoucherType(voucherType: VoucherTypeClass){
  for (var i = 0; i < this.user.salesVocherSettings.voucherTypeList.length; i++) {
    if (this.user.salesVocherSettings.voucherTypeList[i] === voucherType) {
      this.user.salesVocherSettings.voucherTypeList.splice(i, 1);
    }
  }
  this.voucherTypeDataSource._updateChangeSubscription();
}

addCashLedger(cashLedger: string){
  var voucherExists: boolean = false;
  for (var i = 0; i < this.user.salesVocherSettings.cashLedgerList.length; i++) {
    if (this.user.salesVocherSettings.cashLedgerList[i] == cashLedger) {
      voucherExists = true;
    }
  }
  if(!voucherExists){
    this.user.salesVocherSettings.cashLedgerList.push(cashLedger)
  }


  this.cashLedgerDataSource._updateChangeSubscription();
}

deleteCashLedger(cashLedger: string){
  for (var i = 0; i < this.user.salesVocherSettings.cashLedgerList.length; i++) {
    if (this.user.salesVocherSettings.cashLedgerList[i] === cashLedger) {
      this.user.salesVocherSettings.cashLedgerList.splice(i, 1);
    }
  }
  this.cashLedgerDataSource._updateChangeSubscription();
}

addPOSClass(voucherTypeName: string){
  console.log("addPOSClass called");
  for (var i = 0; i < this.user.salesVocherSettings.voucherTypeList.length; i++) {
    if (this.user.salesVocherSettings.voucherTypeList[i].voucherTypeName === voucherTypeName) {
      this.user.salesVocherSettings.voucherTypeList[i]
      .classes.push(this.posClass.nativeElement.value);
    }
  }
}

  /*validUserId() {
    this.apiService.validUserId(this.user.id).subscribe(
      res => {
        this.isUserValid = res;
      },
      err => {
        this.isUserValid = false;
        console.log(err);
      }
    );
  }*/

}
