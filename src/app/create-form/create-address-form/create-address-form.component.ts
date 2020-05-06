import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../shared/api.service';
import { MAT_DIALOG_DATA} from '@angular/material';
import { Address } from '../../Model/address';

@Component({
  selector: 'app-create-address-form',
  templateUrl: './create-address-form.component.html',
  styleUrls: ['./create-address-form.component.css']
})
export class CreateAddressFormComponent implements OnInit {

placeOfSupplies: string[]= [];
address: Address = new Address();

  constructor( @Inject(MAT_DIALOG_DATA) public data?: Address, private router? :Router, @Inject(ApiService) private apiService? : ApiService) {
    if(data != null){
    this.address = data
  }
  }

  ngOnInit() {
    this.apiService.getPlaceOfSupplies().subscribe(
      res =>{
        this.placeOfSupplies = res.list;

      },
      err =>{

        console.log(err);
      }
    );
  }

  submit(): void{

    this.apiService.addAddress(this.address).subscribe(
      res =>{
        console.log("Address Created");
      },
      err =>{
        alert("Could not complete request. Please try again later");
      }
    );
  }

  fillCustomer(address): void{
    this.address = address;
  }

}
