import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Customer } from '../../Model/customer';
import { Address } from '../../Model/address';
import { ApiService } from '../../shared/api.service';
import { MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { DatabaseService } from 'src/app/shared/database.service';
import { AppComponent } from 'src/app/app.component';


@Component({
  selector: 'app-create-customer-form',
  templateUrl: './create-customer-form.component.html',
  styleUrls: ['./create-customer-form.component.css']
})
export class CreateCustomerFormComponent implements OnInit {
  disableSaveButton: boolean;
  addresses: Address[] = [];
  customer: Customer = new Customer();
  filteredOptions: Observable<any[]>;
  addressControl = new FormControl();
  address: any;
  databaseService: DatabaseService;
  updateMode: boolean = false;
  @ViewChild('fatherNameRef', { static: false }) fatherName: ElementRef;
  @ViewChild('landHolding', { static: false }) landHolding: ElementRef;
  @ViewChild('phoneNumber', { static: false }) phoneNumber: ElementRef;  
  @ViewChild("addressRef", { static: false }) addressRef: ElementRef;  



  constructor( @Inject(MAT_DIALOG_DATA) public data?: any, private dialogRef?: MatDialogRef<CreateCustomerFormComponent>,
  private router? :Router, @Inject(ApiService) private apiService? : ApiService) {
    if (data != null){
      this.customer.id = data.id;
      this.customer.name= data.name;
      this.customer.fatherName= data.fatherName;
      this.customer.phoneNumber= data.phoneNumber;
      this.customer.addressId = data.addressId;
      this.customer.landHolding = data.landHolding;
      this.customer.gSTREGISTRATIONTYPE = data.gSTREGISTRATIONTYPE;
      this.updateMode = true;
    }else{
      this.customer.gSTREGISTRATIONTYPE = "Consumer";
    }
    this.databaseService= AppComponent.databaseService;
  }

  ngOnInit() {
    console.log(this.customer);
    this.databaseService.getAddresses().then(
      res => {
        this.addresses = res;
        this.address = this.addresses.filter((a) => a._id == this.customer.addressId)[0];
        this.filteredOptions = this.addressControl.valueChanges.pipe(
          startWith(''),
          map(value => this.address_filter(value))
        );
      },
      err=>{
        console.log("Cannot fetch customer at this moment");
      }
    )
  }


  displayFnProduct(user?: any): string | undefined {
    return user && user._id ? user.name : '';
  }
  private address_filter(value: string): any[] {
    const filterValue = value.toString().toLowerCase();
    return this.addresses.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
  }

  submit(): void{
    this.disableSaveButton = true;
    this.customer.addressId = this.address._id
    if(this.updateMode){
      this.apiService.updateCustomer(this.customer).subscribe(
        res =>{
          this.dialogRef.close(res);
          this.disableSaveButton = false;
        },
        err =>{
          console.log(err);
          if(err.status == 200){
            this.dialogRef.close(err);
          }else{
            this.dialogRef.close(err);
        }
        }
      );
    }else {
      this.apiService.addCustomer(this.customer).subscribe(
        res =>{
          this.dialogRef.close(res);
          this.disableSaveButton = false;
        },
        err =>{
          console.log(err);
          if(err.status == 200){
            this.dialogRef.close(err);
          }else{
            this.dialogRef.close(err);
        }
        }
      );
    }
   
  }

  fillCustomer(customer): void{
    this.customer = customer;
  }

  displayFn(user?: Customer): string | undefined {
      return user ? user.name : undefined;
  }
}
