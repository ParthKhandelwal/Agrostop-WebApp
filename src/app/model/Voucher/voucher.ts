import { DatePipe } from '@angular/common';
import { Batch } from '../Batch/batch';
import { StockItem } from '../StockItem/stock-item';
import { ObjectID } from 'bson';
import { ɵgetLocaleCurrencyCode } from '@angular/core';




    export class HEADER {
      TALLYREQUEST: string;

    }

    export class STATICVARIABLES {
        SVCURRENTCOMPANY: string;
    }

    export class REQUESTDESC {
        REPORTNAME: string;
        STATICVARIABLES: STATICVARIABLES;
    }

export class ADDRESSLIST {
        ADDRESS: string[];
  _TYPE: string;


  constructor(addressName: string, addressTehsilName: string, addressDistrictName: string, addressStateName: string) {
    this.ADDRESS = [];
    this.ADDRESS.push(addressName);
    this.ADDRESS.push(addressTehsilName);
    this.ADDRESS.push(addressDistrictName);
    this.ADDRESS.push(addressStateName);
  }
    }



export class OLDAUDITENTRYIDSLIST {
        OLDAUDITENTRYIDS: string;
        _TYPE: string;
    }

export class LEDGERENTRIESLIST {
  OLDAUDITENTRYIDS_LIST: OLDAUDITENTRYIDSLIST;
  ROUNDTYPE: string;
  LEDGERNAME: string;
  METHODTYPE: string;
  GSTCLASS: string;
  ISDEEMEDPOSITIVE: string;
  LEDGERFROMITEM: string;
  REMOVEZEROENTRIES: string;
  ISPARTYLEDGER: string;
  ISLASTDEEMEDPOSITIVE: string;
  ISCAPVATTAXALTERED: string;
  ISCAPVATNOTCLAIMED: string;
  AMOUNT: number;
  VATEXPAMOUNT: number;
  SERVICETAXDETAILS_LIST: string;
  BANKALLOCATIONS_LIST: string;
  BILLALLOCATIONS_LIST: string;
  INTERESTCOLLECTION_LIST: string;
  OLDAUDITENTRIES_LIST: string;
  ACCOUNTAUDITENTRIES_LIST: string;
  AUDITENTRIES_LIST: string;
  INPUTCRALLOCS_LIST: string;
  DUTYHEADDETAILS_LIST: string;
  EXCISEDUTYHEADDETAILS_LIST: string;
  RATEDETAILS_LIST: string;
  SUMMARYALLOCS_LIST: string;
  STPYMTDETAILS_LIST: string;
  EXCISEPAYMENTALLOCATIONS_LIST: string;
  TAXBILLALLOCATIONS_LIST: string;
  TAXOBJECTALLOCATIONS_LIST: string;
  TDSEXPENSEALLOCATIONS_LIST: string;
  VATSTATUTORYDETAILS_LIST: string;
  COSTTRACKALLOCATIONS_LIST: string;
  REFVOUCHERDETAILS_LIST: string;
  INVOICEWISEDETAILS_LIST: string;
  VATITCDETAILS_LIST: string;
  ADVANCETAXDETAILS_LIST: string;
  ROUNDLIMIT: number;
  POSPAYMENTTYPE: string;
  tallyObject: any;

  constructor() {

  }




  public set(ledger:any) {
    var oldaudit: OLDAUDITENTRYIDSLIST = new OLDAUDITENTRYIDSLIST();
    oldaudit.OLDAUDITENTRYIDS = "-1";
    this.OLDAUDITENTRYIDS_LIST = oldaudit;
    this.LEDGERNAME = ledger.NAME.content;
    this.METHODTYPE = ledger.METHODTYPE.content
    this.ISDEEMEDPOSITIVE = "No";
    this.LEDGERFROMITEM = ledger.LEDGERFROMITEM.content;
    this.ROUNDLIMIT = ledger.ROUNDLIMIT.content;
    this.ROUNDTYPE = ledger.ROUNDTYPE.content;
    this.REMOVEZEROENTRIES = ledger.REMOVEZEROENTRIES.content;
    this.ISPARTYLEDGER = "No";
  }


}

export class EXPIRYPERIOD {
        _JD: string;
        _P: string;
      __text: string;
  DATE: string;

  constructor(date: Date) {
    this._P = new DatePipe('en-US').transform(date, "dd-MMM-yyyy");
    this.DATE = this._P;
  }
    }

    export class BATCHALLOCATIONSLIST {
        MFDON: string;
        GODOWNNAME: string;
        BATCHNAME: string;
        DESTINATIONGODOWNNAME: string;
        INDENTNO: string;
        ORDERNO: string;
        TRACKINGNUMBER: string;
        DYNAMICCSTISCLEARED: string;
        AMOUNT: number;
        ACTUALQTY: number;
        BILLEDQTY: number;
        EXPIRYPERIOD: EXPIRYPERIOD;
        ADDITIONALDETAILS_LIST: string;
      VOUCHERCOMPONENTLIST_LIST: string;

      constructor() {


      }

      public set(batchId: Batch, godown: string) {
        this.GODOWNNAME = godown;
        if (batchId) {
          this.BATCHNAME = batchId.name;
          this.EXPIRYPERIOD = new EXPIRYPERIOD(batchId.expiryDate);
        } else {
          this.BATCHNAME = "";
          this.EXPIRYPERIOD = null;
        }
      }

      public changeBatch(batch: Batch) {
        this.BATCHNAME = batch.name;
        this.EXPIRYPERIOD = new EXPIRYPERIOD(batch.expiryDate);
      }

      setexpiryDate(expiryDate: Date) {

      }

      setAmount(amount: number) {
        this.AMOUNT = amount;
      }

      setQty(qty: number) {
        this.ACTUALQTY = qty;
        this.BILLEDQTY = qty;
      }
    }



export class ACCOUNTINGALLOCATIONSLIST {
        OLDAUDITENTRYIDS_LIST: OLDAUDITENTRYIDSLIST;
        LEDGERNAME: string;
        CLASSRATE: string;
        GSTCLASS: string;
        GSTOVRDNNATURE: string;
        ISDEEMEDPOSITIVE: string;
        LEDGERFROMITEM: string;
        REMOVEZEROENTRIES: string;
        ISPARTYLEDGER: string;
        ISLASTDEEMEDPOSITIVE: string;
        ISCAPVATTAXALTERED: string;
        ISCAPVATNOTCLAIMED: string;
        AMOUNT: number;
        SERVICETAXDETAILS_LIST: string;
        BANKALLOCATIONS_LIST: string;
        BILLALLOCATIONS_LIST: string;
        INTERESTCOLLECTION_LIST: string;
        OLDAUDITENTRIES_LIST: string;
        ACCOUNTAUDITENTRIES_LIST: string;
        AUDITENTRIES_LIST: string;
        INPUTCRALLOCS_LIST: string;
        DUTYHEADDETAILS_LIST: string;
        EXCISEDUTYHEADDETAILS_LIST: string;
        RATEDETAILS_LIST: string;
        SUMMARYALLOCS_LIST: string;
        STPYMTDETAILS_LIST: string;
        EXCISEPAYMENTALLOCATIONS_LIST: string;
        TAXBILLALLOCATIONS_LIST: string;
        TAXOBJECTALLOCATIONS_LIST: string;
        TDSEXPENSEALLOCATIONS_LIST: string;
        VATSTATUTORYDETAILS_LIST: string;
        COSTTRACKALLOCATIONS_LIST: string;
        REFVOUCHERDETAILS_LIST: string;
        INVOICEWISEDETAILS_LIST: string;
        VATITCDETAILS_LIST: string;
  ADVANCETAXDETAILS_LIST: string;

  constructor() {

  }
}

    export class ALLINVENTORYENTRIESLIST {
      STOCKITEMNAME: string;
        ISDEEMEDPOSITIVE: string;
        ISLASTDEEMEDPOSITIVE: string;
        ISAUTONEGATE: string;
        ISCUSTOMSCLEARANCE: string;
        ISTRACKCOMPONENT: string;
        ISTRACKPRODUCTION: string;
        ISPRIMARYITEM: string;
        ISSCRAP: string;
        RATE: number;
        AMOUNT: number;
        ACTUALQTY: number;
        BILLEDQTY: number;
        BATCHALLOCATIONS_LIST: BATCHALLOCATIONSLIST;
        ACCOUNTINGALLOCATIONS_LIST: ACCOUNTINGALLOCATIONSLIST;
        DUTYHEADDETAILS_LIST: string;
        SUPPLEMENTARYDUTYHEADDETAILS_LIST: string;
        TAXOBJECTALLOCATIONS_LIST: string;
        REFVOUCHERDETAILS_LIST: string;
        EXCISEALLOCATIONS_LIST: string;
      EXPENSEALLOCATIONS_LIST: string;
      tallyObject: StockItem;


      constructor() {
      }

      public set(res: any, batchId: Batch, qty: number, godown: string) {
        this.STOCKITEMNAME = res._id;
        this.ISDEEMEDPOSITIVE = "No";
        this.ISLASTDEEMEDPOSITIVE = "No";
        this.ISAUTONEGATE = "No";
        this.ISCUSTOMSCLEARANCE = "No";
        this.ISSCRAP = "No";
        this.ISTRACKCOMPONENT = "No";
        this.ISTRACKPRODUCTION = "No"
        this.ISPRIMARYITEM = "No"
        this.BILLEDQTY = qty;
        this.ACTUALQTY = qty;
        for (let item of res.fULLPRICELISTLIST) {
          if (item.godownName == godown) {
            this.RATE = item.price;
            break;
          }
        }

        this.AMOUNT = this.RATE * qty;
        var batch: BATCHALLOCATIONSLIST = new BATCHALLOCATIONSLIST()
        batch.set(batchId, godown);
        this.BATCHALLOCATIONS_LIST = batch;
        this.ACCOUNTINGALLOCATIONS_LIST = new ACCOUNTINGALLOCATIONSLIST();
        this.ACCOUNTINGALLOCATIONS_LIST.LEDGERNAME = res.sALESLISTLIST.nAME;
        this.ACCOUNTINGALLOCATIONS_LIST.CLASSRATE = res.sALESLISTLIST.cLASSRATE;
        this.ACCOUNTINGALLOCATIONS_LIST.LEDGERFROMITEM = res.sALESLISTLIST.lEDGERFROMITEM;
        this.ACCOUNTINGALLOCATIONS_LIST.GSTOVRDNNATURE = res.sALESLISTLIST.sTCLASSIFICATIONNATURE;
        this.ACCOUNTINGALLOCATIONS_LIST.REMOVEZEROENTRIES = res.sALESLISTLIST.rEMOVEZEROENTRIES;
        this.ACCOUNTINGALLOCATIONS_LIST.AMOUNT = this.AMOUNT;
      }

      public getAmount(): number {
        return this.AMOUNT;
      }

      public calculateCGST(res: any): number {
        for (let item of res.gSTDETAILSLIST.sTATEWISEDETAILSLIST.rATEDETAILSLIST) {
          if (item.gSTRATEDUTYHEAD == "Central Tax") {
            return this.AMOUNT * item.taxPercentage / 100;
          }
        }
        return 0;
      }

      public calculateSGST(res:any): number {
        for (let item of res.gSTDETAILSLIST.sTATEWISEDETAILSLIST.rATEDETAILSLIST) {
          if (item.gSTRATEDUTYHEAD == "State Tax") {
            return this.AMOUNT * item.taxPercentage / 100;
          }
        }
        return 0;
      }

      public calculateIGST(res:any): number {
        for (let item of res.gSTDETAILSLIST.sTATEWISEDETAILSLIST.rATEDETAILSLIST) {
          if (item.gSTRATEDUTYHEAD == "Integrated Tax") {
            return this.AMOUNT * item.taxPercentage / 100;
          }
        }
        return null;
      }

      public calculateCess(res:any): number {
        for (let item of res.gSTDETAILSLIST.sTATEWISEDETAILSLIST.rATEDETAILSLIST) {
          if (item.gSTRATEDUTYHEAD == "Cess") {
            return this.AMOUNT * item.taxPercentage / 100;
          }
        }
        return null;
      }
    }


    export class INVENTORYENTRIESIN_LIST{
      agroId: string;
      date: Date;
      STOCKITEMNAME: string;
        ISDEEMEDPOSITIVE: string;

        RATE: number;
        AMOUNT: number;
        ACTUALQTY: number;
        BILLEDQTY: number;
        BATCHALLOCATIONS_LIST: BATCHALLOCATIONSLIST;
        enableTwoFactorVerfication: boolean;
        verified: boolean;
        verifiedBy: string;
        verifiedOn: Date;
        rejected:boolean

    }


    export class INVENTORYENTRIESOUT_LIST{

      STOCKITEMNAME: string;
        ISDEEMEDPOSITIVE: string;

        RATE: number;
        AMOUNT: number;
        ACTUALQTY: number;
        BILLEDQTY: number;
        BATCHALLOCATIONS_LIST: BATCHALLOCATIONSLIST;


    }

export class VOUCHER {

  CUSTOMERID: string;
  ADDRESS_LIST: ADDRESSLIST;
  OLDAUDITENTRYIDS_LIST: OLDAUDITENTRYIDSLIST;
  DATE: Date;
  GUID: string;
  NARRATION: string;
  PARTYGSTIN:string;
  BASICVOUCHERCHEQUENAME: string;
  STATENAME: string;
  GSTREGISTRATIONTYPE: string;
  PRICELEVEL: string;
  CLASSNAME: string;
  POSCASHLEDGER: string;
  VOUCHERTYPENAME: string;
  REFERENCEDATE:Date;
  REFERENCE: string;
  VOUCHERNUMBER: string;
  PARTYNAME: string;
  BASICBASEPARTYNAME: string;
  PARTYLEDGERNAME: string;
  CSTFORMISSUETYPE: string;
  CSTFORMRECVTYPE: string;
  FBTPAYMENTTYPE: string;
  PERSISTEDVIEW: string;
  PLACEOFSUPPLY: string;
  BASICBUYERNAME: string;
  VCHGSTCLASS: string;
  ENTEREDBY: string;
  DIFFACTUALQTY: string;
  ISMSTFROMSYNC: string;
  ASORIGINAL: string;
  AUDITED: string;
  FORJOBCOSTING: string;
  ISOPTIONAL: string;
  EFFECTIVEDATE: Date;
  USEFOREXCISE: string;
  ISFORJOBWORKIN: string;
  ALLOWCONSUMPTION: string;
  USEFORINTEREST: string;
  USEFORGAINLOSS: string;
  USEFORGODOWNTRANSFER: string;
  USEFORCOMPOUND: string;
  USEFORSERVICETAX: string;
  ISEXCISEVOUCHER: string;
  EXCISETAXOVERRIDE: string;
  USEFORTAXUNITTRANSFER: string;
  IGNOREPOSVALIDATION: string;
  EXCISEOPENING: string;
  USEFORFINALPRODUCTION: string;
  ISTDSOVERRIDDEN: string;
  ISTCSOVERRIDDEN: string;
  ISTDSTCSCASHVCH: string;
  INCLUDEADVPYMTVCH: string;
  ISSUBWORKSCONTRACT: string;
  ISVATOVERRIDDEN: string;
  IGNOREORIGVCHDATE: string;
  ISVATPAIDATCUSTOMS: string;
  ISDECLAREDTOCUSTOMS: string;
  ISSERVICETAXOVERRIDDEN: string;
  ISISDVOUCHER: string;
  ISEXCISEOVERRIDDEN: string;
  ISEXCISESUPPLYVCH: string;
  ISGSTOVERRIDDEN: string;
  GSTNOTEXPORTED: string;
  IGNOREGSTINVALIDATION: string;
  ISVATPRINCIPALACCOUNT: string;
  ISBOENOTAPPLICABLE: string;
  ISSHIPPINGWITHINSTATE: string;
  ISOVERSEASTOURISTTRANS: string;
  ISDESIGNATEDZONEPARTY: string;
  ISCANCELLED: string;
  HASCASHFLOW: string;
  ISPOSTDATED: string;
  USETRACKINGNUMBER: string;
  ISINVOICE: string;
  MFGJOURNAL: string;
  HASDISCOUNTS: string;
  ASPAYSLIP: string;
  ISCOSTCENTRE: string;
  ISSTXNONREALIZEDVCH: string;
  ISEXCISEMANUFACTURERON: string;
  ISBLANKCHEQUE: string;
  ISVOID: string;
  ISONHOLD: string;
  ORDERLINESTATUS: string;
  VATISAGNSTCANCSALES: string;
  VATISPURCEXEMPTED: string;
  ISVATRESTAXINVOICE: string;
  VATISASSESABLECALCVCH: string;
  ISVATDUTYPAID: string;
  ISDELIVERYSAMEASCONSIGNEE: string;
  ISDISPATCHSAMEASCONSIGNOR: string;
  ISDELETED: string;
  CHANGEVCHMODE: string;
  ALTERID: string;
  MASTERID: string;
  VOUCHERKEY: string;
  POSCASHRECEIVED: number;
  EXCLUDEDTAXATIONS_LIST: string;
  OLDAUDITENTRIES_LIST: string;
  ACCOUNTAUDITENTRIES_LIST: string;
  AUDITENTRIES_LIST: string;
  DUTYHEADDETAILS_LIST: string;
  SUPPLEMENTARYDUTYHEADDETAILS_LIST: string;
  EWAYBILLDETAILS_LIST: string;
  INVOICEDELNOTES_LIST: string;
  INVOICEORDERLIST_LIST: string;
  INVOICEINDENTLIST_LIST: string;
  ATTENDANCEENTRIES_LIST: string;
  ORIGINVOICEDETAILS_LIST: string;
  INVOICEEXPORTLIST_LIST: string;
  LEDGERENTRIES_LIST: LEDGERENTRIESLIST[];
  ALLINVENTORYENTRIES_LIST: ALLINVENTORYENTRIESLIST[];
  ALLLEDGERENTRIES_LIST: ALLLEDGERENTRIESLIST[];
  PAYROLLMODEOFPAYMENT_LIST: string;
  ATTDRECORDS_LIST: string;
  GSTEWAYCONSIGNORADDRESS_LIST: string;
  GSTEWAYCONSIGNEEADDRESS_LIST: string;
  TEMPGSTRATEDETAILS_LIST: string;
  _REMOTEID: string;
  _VCHKEY: string;
  _VCHTYPE: string;
  _ACTION: string;
  _OBJVIEW: string;
  order: boolean;
  userId: string;
  COUNTRYOFRESIDENCE: string;
  ORDERNUMBER: string;
  DESTINATIONGODOWN: string;
  VOUCHERDESTINATIONGODOWN; string;
  VOUCHERSOURCEGODOWN: string;
  INVENTORYENTRIESIN_LIST:INVENTORYENTRIESIN_LIST[];
  INVENTORYENTRIESOUT_LIST:INVENTORYENTRIESOUT_LIST[];






  constructor() {
    this.ALLINVENTORYENTRIES_LIST = [];
    this.ALLLEDGERENTRIES_LIST = [];
    this.LEDGERENTRIES_LIST = [];
    this.INVENTORYENTRIESIN_LIST = [];
    this.INVENTORYENTRIESOUT_LIST = [];

  }


  public setAction(action: string) {
    this._ACTION = action;
  }

  public setDate(date: Date) {
    this.DATE = date;
  }





  public setCustomer(customer: any) {
    this.CUSTOMERID = customer.customerId;
    this.BASICBUYERNAME = customer.name
    this.ADDRESS_LIST = new ADDRESSLIST(customer.name,customer.addressName, customer.addressTehsilName, customer.addressDistrictName);
    this.GSTREGISTRATIONTYPE = customer.gSTREGISTRATIONTYPE;
    this.STATENAME = customer.addressStateName;
  }


  public deleteInventoryEntry(index: number) {
    this.ALLINVENTORYENTRIES_LIST.splice(index,1);
    this.adjustLedgers();
  }






  public getRemainingBalance(): number{
    var total: number = 0;
    if(this.ALLINVENTORYENTRIES_LIST){
      for(let item of this.ALLINVENTORYENTRIES_LIST){
        total = total + item.AMOUNT;
      }
    }
    if(this.INVENTORYENTRIESOUT_LIST){
      for(let item of this.INVENTORYENTRIESOUT_LIST){
        total = total + item.AMOUNT;
      }
    }

    if(this.LEDGERENTRIES_LIST){
      for(let led of this.LEDGERENTRIES_LIST){
        total = total + (led.AMOUNT ? led.AMOUNT : 0);

      }
    }
    if(this.ALLLEDGERENTRIES_LIST){
      for(let led of this.ALLLEDGERENTRIES_LIST){
        total = total + (led.AMOUNT ? led.AMOUNT : 0);
      }
    }


    return parseFloat((Math.round(total * 100) / 100).toFixed(2));
  }


  public getSubTotal(): number{
    let total = 0;
    if(this.ALLINVENTORYENTRIES_LIST){
      for (let item of this.ALLINVENTORYENTRIES_LIST) {
        total = total + item.AMOUNT;
      }
    }

    return total;
  }

  public cashLedger(): LEDGERENTRIESLIST{
    var array: LEDGERENTRIESLIST[] = this.LEDGERENTRIES_LIST.filter(v => v.POSPAYMENTTYPE ==='Cash');
    return array.length == 0 ? null :array[0];
  }

  adjustLedgers(){
    this.LEDGERENTRIES_LIST.filter((ledger) => !ledger.POSPAYMENTTYPE && ledger.METHODTYPE == "GST")
    .forEach((ledger) => this.calculate(ledger));
    this.LEDGERENTRIES_LIST.filter((ledger) => !ledger.POSPAYMENTTYPE && ledger.METHODTYPE == "As Total Amount Rounding")
    .forEach((ledger) => this.calculate(ledger));
  }

  adjustRounding(){
    this.LEDGERENTRIES_LIST.filter((ledger) => !ledger.POSPAYMENTTYPE && ledger.METHODTYPE == "As Total Amount Rounding")
    .forEach((ledger) => this.calculate(ledger));
  }

  calculate(ledger: LEDGERENTRIESLIST) {
    ledger.AMOUNT = 0
    switch(ledger.METHODTYPE){
      case "GST" :
        var gstDutyHead: any;
        var res = ledger.tallyObject;
        gstDutyHead = res.GSTDUTYHEAD.content;
        let invTotal = 0;
        let taxTotal = 0;
        for (let product of this.ALLINVENTORYENTRIES_LIST){
          var productItem = product.tallyObject;
          var item = Object.assign(new StockItem(), productItem);
          let invTax = item.getTax(product.BILLEDQTY,product.RATE,"",gstDutyHead);
          invTotal = invTotal + (product.BILLEDQTY*product.RATE)
          taxTotal = taxTotal + invTax;
          ledger.AMOUNT = ledger.AMOUNT + invTax;
          ledger.AMOUNT =  parseFloat((Math.round(ledger.AMOUNT * 100) / 100).toFixed(2));
        }
        for(let led of this.LEDGERENTRIES_LIST){
          if(led.tallyObject.APPROPRIATEFOR == "GST"){
            ledger.AMOUNT = ledger.AMOUNT + (led.AMOUNT * (taxTotal / invTotal));
          }
        }
        break;

      case "As Total Amount Rounding":
          var total: number =0
          for (let item of this.LEDGERENTRIES_LIST){
            if (item.AMOUNT != null && item.METHODTYPE !="As Total Amount Rounding"
            && (item.POSPAYMENTTYPE == null || item.POSPAYMENTTYPE == "")){
              total = total + item.AMOUNT;
            }
          }

          for (let item of this.ALLINVENTORYENTRIES_LIST){
            if (item.AMOUNT != null){
              total = total + item.AMOUNT;
            }
          }
          ledger.AMOUNT =  Math.round((Math.round(total) - total)*100) *0.01;
          break;
      case "As User Defined Value":
          break;

    }
  }



  public getTotal(): number{
    let total: number = this.getSubTotal();
    for (let item of this.LEDGERENTRIES_LIST){
      if (item.AMOUNT != null && (item.POSPAYMENTTYPE == null || item.POSPAYMENTTYPE == "")){
        total = total + item.AMOUNT;
      }
    }
    return parseFloat((Math.round(total * 100) / 100).toFixed(2));

  }


  public addInventory(rate: number, qty: number, batch:Batch, godown:string, stockItem: StockItem){
    var inventoryEntry: ALLINVENTORYENTRIESLIST = new ALLINVENTORYENTRIESLIST();
    inventoryEntry.STOCKITEMNAME = stockItem.NAME;
    inventoryEntry.tallyObject = stockItem;
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
    inventoryEntry.BATCHALLOCATIONS_LIST.EXPIRYPERIOD = new EXPIRYPERIOD(batch.closingBalance
      ? new Date(batch.expiryDate)
      : null);
    inventoryEntry.AMOUNT =  Math.round(inventoryEntry.RATE * inventoryEntry.BILLEDQTY*100)/100;
    console.log(stockItem);
    inventoryEntry.ACCOUNTINGALLOCATIONS_LIST = new ACCOUNTINGALLOCATIONSLIST();
    console.log(stockItem.salesList[0].NAME)
    inventoryEntry.ACCOUNTINGALLOCATIONS_LIST.LEDGERNAME = stockItem.salesList[0].NAME;
    inventoryEntry.ACCOUNTINGALLOCATIONS_LIST.CLASSRATE = stockItem.salesList[0].CLASSRATE;
    inventoryEntry.ACCOUNTINGALLOCATIONS_LIST.LEDGERFROMITEM = stockItem.salesList[0].LEDGERFROMITEM;
    inventoryEntry.ACCOUNTINGALLOCATIONS_LIST.GSTOVRDNNATURE = stockItem.salesList[0].GSTCLASSIFICATIONATURE;
    inventoryEntry.ACCOUNTINGALLOCATIONS_LIST.REMOVEZEROENTRIES = stockItem.salesList[0].REMOVEZEROENTRIES;
    inventoryEntry.ACCOUNTINGALLOCATIONS_LIST.AMOUNT = inventoryEntry.AMOUNT;
    inventoryEntry.ACCOUNTINGALLOCATIONS_LIST.LEDGERFROMITEM = "Yes"
    inventoryEntry.ACCOUNTINGALLOCATIONS_LIST.ISDEEMEDPOSITIVE = "No"
    this.ALLINVENTORYENTRIES_LIST.push(inventoryEntry);
    //this.adjustLedgers();
  }


  addInventoryEntriesIN(item: string,rate: number, qty: number, batch:Batch, godown:string,destinationGodown: string){
    var inventoryEntry: INVENTORYENTRIESIN_LIST = new INVENTORYENTRIESIN_LIST();
    const id = new ObjectID();
    inventoryEntry.agroId = id.toString();
    inventoryEntry.ISDEEMEDPOSITIVE = "Yes";
    inventoryEntry.STOCKITEMNAME = item;
    inventoryEntry.RATE = rate;
    inventoryEntry.ACTUALQTY = qty;
    inventoryEntry.BILLEDQTY = qty;
    inventoryEntry.AMOUNT =  Math.abs(Math.round(inventoryEntry.RATE * inventoryEntry.BILLEDQTY*100)/100) *(-1);

    inventoryEntry.BATCHALLOCATIONS_LIST = new BATCHALLOCATIONSLIST();
    inventoryEntry.BATCHALLOCATIONS_LIST.BATCHNAME = batch.name;
    inventoryEntry.BATCHALLOCATIONS_LIST.DESTINATIONGODOWNNAME = godown;
    inventoryEntry.BATCHALLOCATIONS_LIST.GODOWNNAME = destinationGodown;
    inventoryEntry.BATCHALLOCATIONS_LIST.BILLEDQTY = qty;
    inventoryEntry.BATCHALLOCATIONS_LIST.ACTUALQTY = qty;
    inventoryEntry.BATCHALLOCATIONS_LIST.AMOUNT = Math.abs(Math.round(inventoryEntry.RATE * inventoryEntry.BILLEDQTY*100)/100) *(-1);
    inventoryEntry.BATCHALLOCATIONS_LIST.EXPIRYPERIOD = new EXPIRYPERIOD(batch.expiryDate
      ? new Date(batch.expiryDate)
      : null);
    this.INVENTORYENTRIESIN_LIST.push(inventoryEntry);
  }
  addInventoryEntriesOUT(inventoryEntryIN: INVENTORYENTRIESIN_LIST){
    var inventoryEntry: INVENTORYENTRIESOUT_LIST = new INVENTORYENTRIESOUT_LIST();
    inventoryEntry.ISDEEMEDPOSITIVE = "No";
    inventoryEntry.STOCKITEMNAME = inventoryEntryIN.STOCKITEMNAME;
    inventoryEntry.RATE = inventoryEntryIN.RATE;
    inventoryEntry.ACTUALQTY = inventoryEntryIN.ACTUALQTY;
    inventoryEntry.BILLEDQTY = inventoryEntryIN.BILLEDQTY;
    inventoryEntry.AMOUNT =  Math.abs(Math.round(inventoryEntry.RATE * inventoryEntry.BILLEDQTY*100)/100);

    inventoryEntry.BATCHALLOCATIONS_LIST = new BATCHALLOCATIONSLIST();
    inventoryEntry.BATCHALLOCATIONS_LIST.BATCHNAME = inventoryEntryIN.BATCHALLOCATIONS_LIST.BATCHNAME;
    inventoryEntry.BATCHALLOCATIONS_LIST.DESTINATIONGODOWNNAME = inventoryEntryIN.BATCHALLOCATIONS_LIST.DESTINATIONGODOWNNAME;
    inventoryEntry.BATCHALLOCATIONS_LIST.GODOWNNAME = inventoryEntryIN.BATCHALLOCATIONS_LIST.DESTINATIONGODOWNNAME;
    inventoryEntry.BATCHALLOCATIONS_LIST.BILLEDQTY = inventoryEntryIN.BATCHALLOCATIONS_LIST.BILLEDQTY;
    inventoryEntry.BATCHALLOCATIONS_LIST.ACTUALQTY = inventoryEntryIN.BATCHALLOCATIONS_LIST.ACTUALQTY;
    inventoryEntry.BATCHALLOCATIONS_LIST.AMOUNT = Math.round(inventoryEntry.RATE * inventoryEntry.BILLEDQTY*100)/100;
    inventoryEntry.BATCHALLOCATIONS_LIST.EXPIRYPERIOD = inventoryEntryIN.BATCHALLOCATIONS_LIST.EXPIRYPERIOD
    this.INVENTORYENTRIESOUT_LIST.push(inventoryEntry);

  }


}

    export class REMOTECMPINFOLIST {
        NAME: string;
        REMOTECMPNAME: string;
        REMOTECMPSTATE: string;
        _MERGE: string;
    }

    export class COMPANY {
        REMOTECMPINFO_LIST: REMOTECMPINFOLIST;
    }

    export class TALLYMESSAGE {
        VOUCHER: VOUCHER;
        COMPANY: COMPANY;
    }

    export class REQUESTDATA {
        TALLYMESSAGE: TALLYMESSAGE[];
    }

    export class IMPORTDATA {
        REQUESTDESC: REQUESTDESC;
        REQUESTDATA: REQUESTDATA;
    }

    export class BODY {
        IMPORTDATA: IMPORTDATA;
    }

    export class ENVELOPE {
        HEADER: HEADER;
        BODY: BODY;
    }

    export class AccountingVoucher {
        ENVELOPE: ENVELOPE;
    }

    export class ALLLEDGERENTRIESLIST {
        OLDAUDITENTRYIDS_LIST: OLDAUDITENTRYIDSLIST;
        LEDGERNAME: string;
        GSTCLASS: string;
        ISDEEMEDPOSITIVE: string;
        LEDGERFROMITEM: string;
        REMOVEZEROENTRIES: string;
        ISPARTYLEDGER: string;
        ISLASTDEEMEDPOSITIVE: string;
        ISCAPVATTAXALTERED: string;
        ISCAPVATNOTCLAIMED: string;
        AMOUNT: number;
        SERVICETAXDETAILS_LIST: string;
        BANKALLOCATIONS_LIST: BankallocationsList[];
        BILLALLOCATIONS_LIST: BillAllocationsList[];
        INTERESTCOLLECTION_LIST: string;
        OLDAUDITENTRIES_LIST: string;
        ACCOUNTAUDITENTRIES_LIST: string;
        AUDITENTRIES_LIST: string;
        INPUTCRALLOCS_LIST: string;
        DUTYHEADDETAILS_LIST: string;
        EXCISEDUTYHEADDETAILS_LIST: string;
        RATEDETAILS_LIST: string;
        SUMMARYALLOCS_LIST: string;
        STPYMTDETAILS_LIST: string;
        EXCISEPAYMENTALLOCATIONS_LIST: string;
        TAXBILLALLOCATIONS_LIST: string;
        TAXOBJECTALLOCATIONS_LIST: string;
        TDSEXPENSEALLOCATIONS_LIST: string;
        VATSTATUTORYDETAILS_LIST: string;
        COSTTRACKALLOCATIONS_LIST: string;
        REFVOUCHERDETAILS_LIST: string;
        INVOICEWISEDETAILS_LIST: string;
        VATITCDETAILS_LIST: string;
        ADVANCETAXDETAILS_LIST: string;

  constructor(){
    this.BILLALLOCATIONS_LIST = [];
    this.BANKALLOCATIONS_LIST = [];
}
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


export class BankallocationsList {
  date: Date;
  instrumentdate: Date;
  name: string;
  transactiontype: string;
  ifscode:string;
  bankbranchname: string;
  accountnumber:string;
  paymentfavouring:string;
  transactionname: string;
  uniquereferencenumber: string;
  status: string;
  cashdenomination: string;
  paymentmode: string;
  isconnectedpayment: string;
  issplit: string;
  iscontractused: string;
  isacceptedwithwarning: string;
  istransforced: string;
  chequeprinted: string;
  amount: number;
  contractdetailsList: string;
  bankstatusinfoList: string;
  instrumentNumber: string;
  email: string;
  narration: string;
  chequeCrossComment: string;
  constructor(){
    this.amount = 0;
  }

}

export class BillAllocationsList{
  name:string;
  billType:string;
  amount: number;
}
