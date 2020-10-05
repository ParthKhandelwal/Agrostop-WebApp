import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Customer } from '../../../model/Customer/customer';
import { Address } from '../../../model/Address/address';
import { ApiService } from '../../../services/API/api.service';
import { AutoCompleteComponent } from '../../AgroComponents/auto-complete/auto-complete.component';
import { ObjectID } from 'bson';
import { SyncService } from '../../../services/Sync/sync.service';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { FormControl, Validators } from '@angular/forms';
import { NUMBER_TYPE } from '@angular/compiler/src/output/output_ast';


@Component({
  selector: 'customer-entry',
  templateUrl: './customer-entry.component.html',
  styleUrls: ['./customer-entry.component.css']
})
export class CustomerEntryComponent implements OnInit {

  customer: Customer;
  newCustomer: boolean;
  addressList: Address[];
  @ViewChild("addressAutoComp",{static: false}) addressAutoComplete: AutoCompleteComponent;
  constructor(public dialogRef: MatDialogRef<CustomerEntryComponent>,@Inject(MAT_DIALOG_DATA) public data?: any,
  private apiService?: ApiService, private syncService?: SyncService, private db?: NgxIndexedDBService) {
    console.log(data);

    if(!data){

      this.customer = new Customer();
      this.newCustomer = true;
    } else if(!data.id){
      this.customer = data;
      this.newCustomer = true;
    } else {
      this.customer = data;
      this.newCustomer = false;
    }
    this.customer.gSTREGISTRATIONTYPE = "Consumer"
   }

  ngOnInit(): void {
    setTimeout(() => {
      this.addressAutoComplete.addressControl.setValue(this.customer && this.customer.addressId? this.syncService.addresses$.getValue().filter((a:Address) => a._id === this.customer.addressId)[0]: "");
    }, 300);

  }

  saveCustomer(){
    if(this.newCustomer){

      this.apiService.addCustomer(this.customer).subscribe(
        async res => {
          await this.updateCustomerOffline(res)
          this.dialogRef.close(res);
        },
        async err => {
          console.log(err);
          await this.addCacheCustomer();
        }
      )
    } else {
      this.apiService.updateCustomer(this.customer).subscribe(
        async res => {
          console.log(res);
          await this.updateCustomerOffline(res)
          this.dialogRef.close(res);
        },
        async err => {
          console.log(err);
          alert("Cannot save customer right now");
        }
      )
    }

  }

  async addCacheCustomer(){
    const id = new ObjectID();
    console.log(id.toString());
    this.customer.id = id.toString();
    this.customer.addressId = this.customer.fullAddress ? this.customer.fullAddress._id: null;
    await this.db.update("cacheCustomers", this.customer);
    await this.updateCustomerOffline(this.customer);
  }

  async updateCustomerOffline(customer: Customer){
    if(this.syncService.customers$.getValue().findIndex((c) => c.id == customer.id) > -1){
      await this.db.update("customers", customer);
      this.syncService.customers$.getValue().push(customer);
    }
  }

  validPhoneNumber(){
    return this.customer.phoneNumber.match('/^[0-9]{10,10}$/');
  }

  phoneNumberEntered(){
    if(!this.customer.phoneNumber.match('/^[0-9]{10,10}$/')){
      this.addressAutoComplete.addressRef.nativeElement.focus();
    }
  }

}
