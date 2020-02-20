import { Address } from './address';
export class Customer {

    id: string ;
    name: string;
    fatherName: string ;
    addressId: string;
    phoneNumber: string;
    landHolding: number;
  fullAddress?: Address;
  gSTREGISTRATIONTYPE: string;


  constructor() {
    this.id = "";
    this.name = "";
    this.fatherName = "";
    this.addressId = "";
    this.phoneNumber= "";
    this.landHolding = 0;
    this.gSTREGISTRATIONTYPE = "";
  }
}
