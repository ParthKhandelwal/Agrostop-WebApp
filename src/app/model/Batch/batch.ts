export class Batch {
    name: string;
    BATHCID: string;
    productId: string;
    closingBalance: number;
    expiryDate: Date;
  
    constructor(name: string, expiryDate: Date){
    this.name = name;
    this.expiryDate = expiryDate;
    }
    
  }
  