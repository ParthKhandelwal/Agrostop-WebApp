import {Batch} from 'batch';
export class StockItem {
  name: string;
  parent: string;
  category: string;
  description: string;
  baseUnits: string;
  closingBalance: number;
  lastSalePrice: number;
  thisYearBalance : number;
  prevYearBalance;
  hsnCode: string;
  gstovrdnnature: string;
  ledger: string;
  priceList: PriceListItem[];
  batchList: Batch[];

}

export interface PriceListItem{
  godownName: string;
  price: number;
}

export class RateDetail {
  gSTRATEDUTYHEAD: string;
  gSTRATEVALUATIONTYPE: string;
  taxPercentage: number;

  constructor() {
  }
}

export class UpdateStockItemData {
  priceList: PriceListItem[];
  taxDetail: RateDetail[];

  constructor(pricelist: PriceListItem[], tasDetails: RateDetail[]) {
    this.priceList = pricelist;
    this.taxDetail = tasDetails;

  }
}

export class StockCheck{
  id: string;
  godown: string;
  dateOfRequest: Date;
  deadline: Date;
  items: StockCheckItem[];
  title: String;
  completed: boolean;

  constructor(){
    this.items = [];
  }
}

export class StockCheckItem{
  itemName: string;
  username: string;
  expectedQty: number;
  actualQty: number;
  dateOfCheck: Date;

  constructor(){

  }
}

export class ProductGroup{
  name: string;
  description: string;
  packaging: Package[];
  image: string | ArrayBuffer;
  companyName: string;
  technicalSet: string[];
  priorityLevel: number;


  constructor(){
    this.technicalSet = [];
    this.packaging = [];
  }
}

export class Package{
  key: string;
  item: string;
  rateList: PackageRateItem[];
  constructor(key: string, item: string){
    this.key = key;
    this.item = item;
  }
}

export class PackageRateItem{
  godownName: string;
  rate: number;
  amount: number;

  constructor(godownName: string, rate: number, amount: number){
    this.godownName = godownName;
    this.rate = rate;
    this.amount = amount;
  }
}
