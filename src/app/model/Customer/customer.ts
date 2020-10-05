import { Address } from "../Address/address";

export class Customer {
  id: string;
    customerId: string ;
    name: string;
    fatherName: string ;
    addressId: string;
    phoneNumber: string;
    landHolding: number;
  fullAddress?: Address;
  gSTREGISTRATIONTYPE: string;



  constructor() {
    this.customerId = "";
    this.name = "";
    this.fatherName = "";
    this.addressId = "";
    this.phoneNumber= "";
    this.landHolding = 0;
    this.gSTREGISTRATIONTYPE = "";
  }
}
