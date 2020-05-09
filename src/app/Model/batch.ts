export class Batch {
  NAME: string;
  BATHCID: string;
  productId: string;
  CLOSINGBALANCE: number;
  EXPIRYDATE: Date;

  constructor(name: string, expiryDate: Date){
  this.NAME = name;
  this.EXPIRYDATE = expiryDate;
  }
  
}
