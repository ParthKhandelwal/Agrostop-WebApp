import { Component, OnInit, Inject, Input } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { Customer } from '../../Model/customer';
import { Address } from '../../Model/address';
import { ApiService } from '../../shared/api.service';
import { MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';


@Component({
  selector: 'app-create-customer-form',
  templateUrl: './create-customer-form.component.html',
  styleUrls: ['./create-customer-form.component.css']
})
export class CreateCustomerFormComponent implements OnInit {

  addresses: Address[] = [];
  customer: Customer = new Customer();
  constructor( @Inject(MAT_DIALOG_DATA) public data?: any, private dialogRef?: MatDialogRef<CreateCustomerFormComponent>,
  private router? :Router, @Inject(ApiService) private apiService? : ApiService) {
    if (data != null){
      this.customer.customerId = data._id;
      this.customer.name= data.name;
      this.customer.fatherName= data.fatherName;
      this.customer.phoneNumber= data.phoneNumber;
      this.customer.addressId = data.addressId;
      this.customer.landHolding = data.landHolding;
    }
   }

  ngOnInit() {
    this.apiService.getAddresses().subscribe(
      res => {
        this.addresses = res;
      },
      err=>{
        console.log("Cannot fetch customer at this moment");
      }
    )
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
