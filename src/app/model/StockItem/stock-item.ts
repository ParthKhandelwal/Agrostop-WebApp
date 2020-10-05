import { Batch } from "../Batch/batch";
import { ACCOUNTINGALLOCATIONSLIST, EXPIRYPERIOD, BATCHALLOCATIONSLIST, ALLINVENTORYENTRIESLIST } from "../Voucher/voucher";


export class TallyClass{
  public static getNumbers(temp: string): number{
    var returnNumber;
    temp = temp + "";
    returnNumber = temp.replace(/\//g, "");
    returnNumber = returnNumber.replace(/[^\d.-]/g, "");
    return returnNumber;
  }
}

export class StockItem {
  NAME: string;
  parent: string;
  category: string;
  baseUnits: string;
  gstDetailsList: GSTDETAILS[];
  fullPriceList: FULLPRICELIST[];
  salesList: SALESLIST[];
  BATCHES: any[];

  public convertFromJSON(json: any){
    if (json){
      this.NAME = json.NAME;
      this.parent = json.PARENT ? json.PARENT.content : "";
      this.category = json.CATEGORY ? json.CATEGORY.content : "";
      this.baseUnits = json.BASEUNITS ? json.BASEUNITS.content : "";
      this.gstDetailsList = [];
      this.fullPriceList = [];
      this.salesList = [];
      if (json['GSTDETAILS.LIST'] instanceof Array) {
        for (let t1 of json['GSTDETAILS.LIST']) {
          var a: GSTDETAILS = new GSTDETAILS();
          a.convertFromJSON(t1);
          this.gstDetailsList.push(a);
        }
      } else {
          var a: GSTDETAILS = new GSTDETAILS();
          a.convertFromJSON(json['GSTDETAILS.LIST']);
          this.gstDetailsList.push(a);
      }

      if (json['SALESLIST.LIST'] instanceof Array) {
        for (let t1 of json['SALESLIST.LIST']) {
          var b: SALESLIST = new SALESLIST();
          b.convertFromJSON(t1);
          this.salesList.push(b);
        }
      } else {
          var b: SALESLIST = new SALESLIST();
          b.convertFromJSON(json['SALESLIST.LIST']);
          this.salesList.push(b);
      }

      if (json['FULLPRICELIST.LIST'] instanceof Array) {
        for (let t1 of json['FULLPRICELIST.LIST']) {
          var c: FULLPRICELIST = new FULLPRICELIST();
          c.convertFromJSON(t1);
          this.fullPriceList.push(c);
        }
      } else {
          var c: FULLPRICELIST = new FULLPRICELIST();
          c.convertFromJSON(json['FULLPRICELIST.LIST']);
          this.fullPriceList.push(c);
      }

    }
  }


  public getRate(priceLevel: string): number{
    var priceLevelsList: PRICELEVELLIST[] = [];
    this.fullPriceList
    .filter((p) => (p.pricelevel == priceLevel)).forEach((pl) => {
      priceLevelsList.push(...pl.pricelevellist);
    });

    if(priceLevelsList.length > 0){
      var sortedOrder = priceLevelsList
      .filter((p) => new Date(p.date) <= new Date())
      .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      var rate: number = sortedOrder[0].rate
      return parseFloat((Math.round(rate * 100) / 100).toFixed(2));
    }else {
      return 0;
    }

  }

  public getTaxRate(state: string, taxType: string): number{
    var gstDetail: GSTDETAILS = this.gstDetailsList
    .filter((p) => new Date(p.APPLICABLEFROM) <= new Date())
    .sort((a,b) => new Date(b.APPLICABLEFROM).getTime() - new Date(a.APPLICABLEFROM).getTime())[0];
    if (gstDetail){
      var statewiseDetails: STATEWISEDETAILS[] = gstDetail.STATEWISEDETAILSLIST
      var rateDetailsList: RATEDETAILSLIST[] = state
      ? statewiseDetails.filter((stateDet) => stateDet.STATENAME == state)[0].RATEDETAILS_LIST
      : statewiseDetails.filter((stateDet) => stateDet.STATENAME.trim() == "Any")[0].RATEDETAILS_LIST;
      return rateDetailsList.filter((rateDet) => rateDet.gSTRATEDUTYHEAD == taxType)[0].gSTRATE;
    }else {
      return 0;
    }

  }

  public getTax(qty: number, rate: number,state: string, taxType: string): number{
    var tax: number = this.getTaxRate(state, taxType) * rate * qty;
    const value: number = parseFloat((Math.round(tax) / 100).toFixed(2));

    return value;
  }

  public getHSNCODE(): string{
    var gstDetail :GSTDETAILS = this.gstDetailsList
                                .filter((p) => new Date(p.APPLICABLEFROM) <= new Date())
                                .sort((a,b) => new Date(a.APPLICABLEFROM).getTime() - new Date(b.APPLICABLEFROM).getTime())[0]
    if(gstDetail){
      return gstDetail.HSNCODE;
    }else {
      return "NA";
    }
  }

  public getRateInclusiveOfTax(rate: number, state:string): number{
    const value: number = rate + this.getTax(1,rate, state, "Central Tax") + this.getTax(1,rate, state, "State Tax");
    return  parseFloat((Math.round(value*100) / 100).toFixed(2));
  }


  public getVoucherEntry(rate: number, qty: number, batch:Batch, godown:string): ALLINVENTORYENTRIESLIST{
    var inventoryEntry: ALLINVENTORYENTRIESLIST = new ALLINVENTORYENTRIESLIST();
    inventoryEntry.STOCKITEMNAME = this.NAME;
    inventoryEntry.BILLEDQTY = qty;
    inventoryEntry.ACTUALQTY = qty;
    inventoryEntry.ISDEEMEDPOSITIVE = "No";
    inventoryEntry.RATE = rate;
    inventoryEntry.BATCHALLOCATIONS_LIST = new BATCHALLOCATIONSLIST();
    inventoryEntry.BATCHALLOCATIONS_LIST.BATCHNAME = batch.name;
    inventoryEntry.BATCHALLOCATIONS_LIST.GODOWNNAME = godown;
    inventoryEntry.BATCHALLOCATIONS_LIST.BILLEDQTY = qty;
    inventoryEntry.BATCHALLOCATIONS_LIST.ACTUALQTY = qty;
    inventoryEntry.BATCHALLOCATIONS_LIST.AMOUNT = Math.round(inventoryEntry.RATE * inventoryEntry.BILLEDQTY*100)/100;
    inventoryEntry.BATCHALLOCATIONS_LIST.EXPIRYPERIOD = new EXPIRYPERIOD(batch.expiryDate
      ? new Date(batch.expiryDate)
      : null);
    inventoryEntry.AMOUNT =  Math.round(inventoryEntry.RATE * inventoryEntry.BILLEDQTY*100)/100;
    inventoryEntry.ACCOUNTINGALLOCATIONS_LIST = new ACCOUNTINGALLOCATIONSLIST();
    inventoryEntry.ACCOUNTINGALLOCATIONS_LIST.LEDGERNAME = this.salesList[0].NAME;
    inventoryEntry.ACCOUNTINGALLOCATIONS_LIST.CLASSRATE = this.salesList[0].CLASSRATE;
    inventoryEntry.ACCOUNTINGALLOCATIONS_LIST.LEDGERFROMITEM = this.salesList[0].LEDGERFROMITEM;
    inventoryEntry.ACCOUNTINGALLOCATIONS_LIST.GSTOVRDNNATURE = this.salesList[0].GSTCLASSIFICATIONATURE;
    inventoryEntry.ACCOUNTINGALLOCATIONS_LIST.REMOVEZEROENTRIES = this.salesList[0].REMOVEZEROENTRIES;
    inventoryEntry.ACCOUNTINGALLOCATIONS_LIST.AMOUNT = inventoryEntry.AMOUNT;
    inventoryEntry.ACCOUNTINGALLOCATIONS_LIST.LEDGERFROMITEM = "Yes"
    inventoryEntry.ACCOUNTINGALLOCATIONS_LIST.ISDEEMEDPOSITIVE = "No"
    return inventoryEntry;

  }


}

export class SALESLIST{
  CLASSRATE: string;
  GSTCLASSIFICATIONATURE: string;
  LEDGERFROMITEM: string;
  NAME: string;
  REMOVEZEROENTRIES: string;

  convertFromJSON(json: any){
    if (json){
      this.CLASSRATE = json.CLASSRATE ? json.CLASSRATE.content : "";
      this.GSTCLASSIFICATIONATURE = json.GSTCLASSIFICATIONNATURE ? json.GSTCLASSIFICATIONNATURE.content : "";
      this.LEDGERFROMITEM = json.LEDGERFROMITEM ? json.LEDGERFROMITEM.content : "";
      this.NAME = json.NAME ? json.NAME.content : "";
      this.REMOVEZEROENTRIES = json.REMOVEZEROENTRIES ? json.REMOVEZEROENTRIES.content : "";

    }
  }
}

export class GSTDETAILS{
  HSNCODE: string;
  APPLICABLEFROM: Date;
  STATEWISEDETAILSLIST: STATEWISEDETAILS[];

  convertFromJSON(json: any){
    if (json) {
      this.STATEWISEDETAILSLIST = [];
      var dateString  = (json.APPLICABLEFROM.content + "");
      if (dateString){
        var year        =  + dateString.substring(0,4);
        var month       = + dateString.substring(4,6);
        var day         =  + dateString.substring(6,8);
        this.APPLICABLEFROM =  new Date(year, month -1, day);
      }
      this.HSNCODE = json.HSNCODE? json.HSNCODE.content : "";
      if (json['STATEWISEDETAILS.LIST'] instanceof Array){
        for (let temp of json['STATEWISEDETAILS.LIST']){
          var t: STATEWISEDETAILS = new STATEWISEDETAILS();
          t.convertFromJSON(temp);
          this.STATEWISEDETAILSLIST.push(t)
        }
      }else {
          var t: STATEWISEDETAILS = new STATEWISEDETAILS();
          t.convertFromJSON(json['STATEWISEDETAILS.LIST']);
          this.STATEWISEDETAILSLIST.push(t)
      }
    }
  }
}

export class STATEWISEDETAILS{
  STATENAME: string;
  RATEDETAILS_LIST: RATEDETAILSLIST[];

  convertFromJSON(json: any){
    if (json){
      this.RATEDETAILS_LIST = [];
      this.STATENAME = json.STATENAME ? json.STATENAME.content : "";
      if (json['RATEDETAILS.LIST'] instanceof Array){
        for (let temp of json['RATEDETAILS.LIST']){
          var t: RATEDETAILSLIST = new RATEDETAILSLIST();
          t.convertFromJSON(temp);
          this.RATEDETAILS_LIST.push(t);
        }
      }else {
        var t: RATEDETAILSLIST = new RATEDETAILSLIST();
          t.convertFromJSON(json['RATEDETAILS.LIST']);
          this.RATEDETAILS_LIST.push(t);
      }
    }
  }
}

export class RATEDETAILSLIST{
  gSTRATE: number;
  gSTRATEDUTYHEAD: string;

  convertFromJSON(json: any){
    if (json){
      this.gSTRATE = json.GSTRATE ? TallyClass.getNumbers(json.GSTRATE.content) : 0;
      this.gSTRATEDUTYHEAD = json.GSTRATEDUTYHEAD ? json.GSTRATEDUTYHEAD.content : "";
    }
  }
}

export class FULLPRICELIST{
  pricelevel: string;
  pricelevellist:PRICELEVELLIST[];

  convertFromJSON(json: any){
    this.pricelevellist = [];
    if (json){
      this.pricelevel = json.PRICELEVEL ? json.PRICELEVEL.content: "";

      if (json['PRICELEVELLIST.LIST'] instanceof Array){
        for (let temp of json['PRICELEVELLIST.LIST']){
          var pll: PRICELEVELLIST = new PRICELEVELLIST();
          pll.convertFromJSON(temp);
          this.pricelevellist.push(pll);
        }
      } else {
          var pll: PRICELEVELLIST = new PRICELEVELLIST();
          pll.convertFromJSON(json['PRICELEVELLIST.LIST']);
          this.pricelevellist.push(pll);
      }

    }


  }
}

export class PRICELEVELLIST{
  date: Date;
  rate: number;

  convertFromJSON(json: any){
    if(json){
      var dateString  = (json.DATE.content + "");
      if (dateString){
        var year        =  + dateString.substring(0,4);
        var month       = + dateString.substring(4,6);
        var day         =  + dateString.substring(6,8);
        this.date =  new Date(year, month -1, day);
      }

      this.rate = json.RATE ? TallyClass.getNumbers(json.RATE.content): 0;
    }
  }
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
  rate: number;
  balanceAmount: number;

  constructor(){

  }
}

export class ProductGroup{
  name: string;
  description: string;
  packaging: Package[];
  image: string | ArrayBuffer;
  companyName: string;
  categoryName: string;
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


export class ProductGroupFields{
  image: string | ArrayBuffer;
  id:string;
  priorityLevel:number;
  fieldType: string;
  active: boolean


}


export class ShoppingCartItem{
    uniqueId: string;
    productGroup: string;
    item: string;
    qty: number;
    rate: number;
    amount: number;
    packaging: string;
    dateOfAddition: Date;
    savedForLater: boolean;
}

