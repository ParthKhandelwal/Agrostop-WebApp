import { BilledStockItem } from './billed-stock-item';
export class TallyVoucher {
  _id: string;
  billedStockItems: BilledStockItem[];
  customVoucherDetails: CustomVoucherDetails;
  ledgerEntry: LedgerEntry;
  basicVoucherDetails: BasicVoucherDetails;

}


export class CustomVoucherDetails{
  date: Date;
  basicBuyerName: string;
  address: string;
  posCashRecieved:number;
  customerId: any;
  voucherNumber: string;
  createdBy: string;
}

export class LedgerEntry{
  cgst: number;
  sgst: number;
  roundOff: number;
  cash: number;
  subTotal: number;
  cashLedgerName: string;

}

export class BasicVoucherDetails{
  stateName: string;
  countryOfResidence: string;
  className:string;
  posCashLedgerName: string;
  basicBasePartyName: string;
  placeOfSupply: string;
  voucherTypeName: string;
}


export class Request{
   guid: string ;
   tallyType: string;
   name: string;
   filter: string;
   fetchList: string[];
   response: string;
   toDate: string;
   fromDate: string;
   parent: string;
   parentList: string[];
   request: any;

   constructor(type: string){
     this.guid = "";
      this.tallyType = type;
   }

}

