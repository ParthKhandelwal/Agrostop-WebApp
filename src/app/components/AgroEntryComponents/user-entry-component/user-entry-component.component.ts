import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User, VoucherTypeClass, CashBankProfile } from '../../../model/User/user';
import { ApiService } from '../../../services/API/api.service';
import { MatChipInputEvent } from '@angular/material/chips';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { map } from 'rxjs/operators';
import { MatTable } from '@angular/material/table';

@Component({
  selector: 'app-user-entry-component',
  templateUrl: './user-entry-component.component.html',
  styleUrls: ['./user-entry-component.component.css']
})
export class UserEntryComponentComponent implements OnInit {

  voucherTypes: any[];
  editMode: boolean = false;
  ledgers: any[] = []
  constructor(public dialogRef?: MatDialogRef<UserEntryComponentComponent>,@Inject(MAT_DIALOG_DATA) public user?: User,
   private apiService?: ApiService, private db?: NgxIndexedDBService) {
    if(!user){
      user = new User();
      this.editMode = false;
    }else{
      this.editMode = true;
    }
  }

  async ngOnInit(): Promise<void> {
    this.voucherTypeLoading = true;
    this.voucherTypes = (await this.db.getAll("Voucher Types"));
    this.voucherTypeLoading = false;
    this.ledgers = (await this.db.getAll("Ledgers")).map((v: any) => {
      return {"NAME": v.NAME, "PARENT": v.PARENT.content}
    })
    console.log(this.ledgers);
  }

  save(){
    if(this.editMode){
      this.apiService.updateUser(this.user).subscribe(
        res => {
          this.dialogRef.close(this.user);
        },
        err => {
          console.log(err)
          alert("Could not save the following user");
        }
      )
    }else {

      this.apiService.saveUser(this.user).subscribe(
        res => {
          this.dialogRef.close(this.user);
        },
        err => {
          console.log(err)
          alert("Could not save the following user");
        }
      )
    }

  }

  delete(){
      this.apiService.deleteUser(this.user).subscribe(
        res => {
          this.dialogRef.close();
        },
        err => {
          console.log(err);
        }
      )


  }

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];


  addGodown(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.user.godownList.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  removeGodown(godown: string): void {
    const index = this.user.godownList.indexOf(godown);
    if (index >= 0) {
      this.user.salesVoucherSettings.priceLists.splice(index, 1);
    }
  }


  addPriceList(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.user.salesVoucherSettings.priceLists.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  removePriceList(godown: string): void {
    const index = this.user.salesVoucherSettings.priceLists.indexOf(godown);
    if (index >= 0) {
      this.user.salesVoucherSettings.priceLists.splice(index, 1);
    }
  }


  voucherTypeClass: VoucherTypeClass = new VoucherTypeClass();
  voucherTypesTemp: any[];
  posClassTemp: any[] =[];
  voucherTypeLoading: boolean;
  async selectVoucherCategory(value){
    this.voucherTypeLoading = true;
    this.voucherTypesTemp = this.voucherTypes
                        .filter((l:any) => l.PARENT === value.value)
                        .map((l: any) => {
                            return { "NAME": l.NAME};
                          });
    this.voucherTypeLoading = false;

  }


  selectVoucherType(value){
    this.posClassTemp = []
    let voucherType = this.voucherTypes.filter((v) => v.NAME === this.voucherTypeClass.voucherTypeName)[0];
    if(voucherType.VOUCHERCLASSLIST_LIST){
        this.posClassTemp = voucherType.VOUCHERCLASSLIST_LIST.map((v) => v.CLASSNAME);

    }else{
      this.user.voucherTypes.push(this.voucherTypeClass);
      this.voucherTypeTable.renderRows();
      this.voucherTypeClass = new VoucherTypeClass();
    }
  }

  selectVoucherClass(value){
    if(!this.user.voucherTypes){
      this.user.voucherTypes = [];
    }
    this.user.voucherTypes.push(this.voucherTypeClass);
    this.voucherTypeTable.renderRows();
    this.voucherTypeClass = new VoucherTypeClass();

  }
  displayedColumns: string[] = ['category', 'type', 'class', 'action'];
  cashDisplayedColumns: string[] = [ 'type', 'ledger', 'action'];
  cashBankProfile: CashBankProfile = new CashBankProfile();
  @ViewChild("voucherTypeTable", {static: false}) voucherTypeTable: MatTable<VoucherTypeClass>;
  @ViewChild("cashTable", {static: false}) cashTable: MatTable<CashBankProfile>;

  ledgerTemp: any[]=[]
  selectCashType(value){

    this.ledgerTemp = this.ledgers.filter((v) => v.PARENT === value.value);
  }

  selectCashLedger(value){
    if(!this.user.cashBankProfile){
      this.user.cashBankProfile = []
    }
    this.user.cashBankProfile.push(this.cashBankProfile);
    this.cashTable.renderRows();
    this.cashBankProfile = new CashBankProfile();
  }


  deleteCash(index){
    this.user.cashBankProfile.splice(index, 1);
    this.cashTable.renderRows();
  }

  deleteVoucherType(index){
    console.log(index);
    this.user.voucherTypes.splice(index,1);
    this.voucherTypeTable.renderRows();
  }
}
