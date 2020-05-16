import { Component, OnInit, Inject, Input } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { Customer } from '../../Model/customer';
import { Address } from '../../Model/address';
import { ApiService } from '../../shared/api.service';
import { MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { FormControl } from '@angular/forms';


@Component({
  selector: 'app-create-customer-form',
  templateUrl: './create-customer-form.component.html',
  styleUrls: ['./create-customer-form.component.css']
})
export class CreateCustomerFormComponent implements OnInit {

  addresses: Address[] = [];
  customer: Customer = new Customer();
  filteredOptions: Observable<any[]>;
  addressControl = new FormControl();



  constructor( @Inject(MAT_DIALOG_DATA) public data?: any, private dialogRef?: MatDialogRef<CreateCustomerFormComponent>,
  private router? :Router, @Inject(ApiService) private apiService? : ApiService) {
    if (data != null){
      this.customer.id = data.id;
      this.customer.name= data.name;
      this.customer.fatherName= data.fatherName;
      this.customer.phoneNumber= data.phoneNumber;
      this.customer.addressId = data.addressId;
      this.customer.landHolding = data.landHolding;
    }
  }

  ngOnInit() {
    console.log(this.customer);
    this.apiService.getAddresses().subscribe(
      res => {
        this.addresses = res;
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
    return user && user._id ? user._id : '';
  }
  private address_filter(value: string): any[] {
    const filterValue = value.toString().toLowerCase();
    return this.addresses.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
  }

  submit(): void{
    this.apiService.addCustomer(this.customer).subscribe(
      res =>{
        this.dialogRef.close(res);
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

  fillCustomer(customer): void{
    this.customer = customer;
  }

  displayFn(user?: Customer): string | undefined {
      return user ? user.name : undefined;
  }
}
