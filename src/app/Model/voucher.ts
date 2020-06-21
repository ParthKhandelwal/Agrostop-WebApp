import { DatePipe } from '@angular/common';
import { Batch } from './batch';
import { StockItem } from './stock-item';
import uniqid from 'uniqid'
import { DatabaseService } from '../shared/database.service';


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
          this.BATCHNAME = batchId.NAME;
          this.EXPIRYPERIOD = new EXPIRYPERIOD(batchId.EXPIRYDATE);
        } else {
          this.BATCHNAME = "";
          this.EXPIRYPERIOD = null;
        }
      }

      public changeBatch(batch: Batch) {
        this.BATCHNAME = batch.NAME;
        this.EXPIRYPERIOD = new EXPIRYPERIOD(batch.EXPIRYDATE);
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

export class VOUCHER {

  CUSTOMERID: string;
  ADDRESS_LIST: ADDRESSLIST;
  OLDAUDITENTRYIDS_LIST: OLDAUDITENTRYIDSLIST;
  DATE: Date;
  GUID: string;
  NARRATION: string;
  BASICVOUCHERCHEQUENAME: string;
  STATENAME: string;
  GSTREGISTRATIONTYPE: string;
  PRICELEVEL: string;
  CLASSNAME: string;
  POSCASHLEDGER: string;
  VOUCHERTYPENAME: string;
  VOUCHERNUMBER: string;
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
  databaseService: DatabaseService;




  constructor() {
    this.ALLINVENTORYENTRIES_LIST = [];
    this.ALLLEDGERENTRIES_LIST = [];
    this.LEDGERENTRIES_LIST = [];

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
  }

  public async getTallyObject(): Promise<void>{
    if(this.databaseService){
      for(let ledger of this.LEDGERENTRIES_LIST){
        ledger.tallyObject = await this.databaseService.getLedger(ledger.LEDGERNAME);
      }
      for(let item of this.ALLINVENTORYENTRIES_LIST){
        item.tallyObject = Object.assign(new StockItem(),await this.databaseService.getStockItem(item.STOCKITEMNAME));
      }
    }
  }



  public async setVoucherType(voucherType: any, posClass: any, priceList: string, databaseService: DatabaseService){
    this.DATE = new Date();
    this._REMOTEID = uniqid();
    this.databaseService = databaseService;
    this.VOUCHERTYPENAME = voucherType.NAME;
    this._VCHTYPE = voucherType.NAME;
    this._OBJVIEW = "Invoice Voucher View";
    this._ACTION = "Create";
    this.CLASSNAME = posClass.CLASSNAME.content;
    this.PERSISTEDVIEW = "Invoice Voucher View";
    this.LEDGERENTRIES_LIST = [];
    this.PRICELEVEL = priceList;

    var tempArray: any[] = [];
    if (posClass["LEDGERENTRIESLIST.LIST"] instanceof Array){
      tempArray = posClass["LEDGERENTRIESLIST.LIST"]
    } else{
      tempArray.push(posClass["LEDGERENTRIESLIST.LIST"])
    }


    for(let ledger of tempArray){
      if(ledger.NAME){
        var ledgerEntry: LEDGERENTRIESLIST = new LEDGERENTRIESLIST();
        console.log(ledger.NAME.content);
        ledgerEntry.tallyObject = await this.databaseService.getLedger(ledger.NAME.content);
        ledgerEntry.set(ledger);
        this.LEDGERENTRIES_LIST.push(ledgerEntry);
      }
    }


    if (posClass.POSENABLECARDLEDGER){
      var ledgerEntry: LEDGERENTRIESLIST = new LEDGERENTRIESLIST();
      ledgerEntry.LEDGERNAME = posClass.POSCARDLEDGER.content
      ledgerEntry.POSPAYMENTTYPE = "Card";
      if(posClass.POSCARDLEDGER.content){
        ledgerEntry.tallyObject = await this.databaseService.getLedger(posClass.POSCARDLEDGER.content)
      }
      this.LEDGERENTRIES_LIST.push(ledgerEntry)
    }

    if (posClass.POSENABLECASHLEDGER){
      var ledgerEntry: LEDGERENTRIESLIST = new LEDGERENTRIESLIST();
      ledgerEntry.LEDGERNAME = posClass.POSCASHLEDGER.content
      ledgerEntry.POSPAYMENTTYPE = "Cash";
      if(posClass.POSCARDLEDGER.content){
        ledgerEntry.tallyObject = await this.databaseService.getLedger(posClass.POSCARDLEDGER.content)
      }

      this.LEDGERENTRIES_LIST.push(ledgerEntry);
    }

    if (posClass.POSENABLECHEQUELEDGER){
      var ledgerEntry: LEDGERENTRIESLIST = new LEDGERENTRIESLIST();
      ledgerEntry.LEDGERNAME = posClass.POSCHEQUELEDGER.content
      ledgerEntry.POSPAYMENTTYPE = "Cheque";
      if(posClass.POSCHEQUELEDGER.content){
        ledgerEntry.tallyObject = await this.databaseService.getLedger(posClass.POSCHEQUELEDGER.content)
      }

      this.LEDGERENTRIES_LIST.push(ledgerEntry)
    }

    if (posClass.POSENABLEGIFTLEDGER){
      var ledgerEntry: LEDGERENTRIESLIST = new LEDGERENTRIESLIST();
      ledgerEntry.LEDGERNAME = posClass.POSGIFTLEDGER.content
      ledgerEntry.POSPAYMENTTYPE = "Gift";
      if(posClass.POSGIFTLEDGER.content){
        ledgerEntry.tallyObject = await this.databaseService.getLedger(posClass.POSGIFTLEDGER.content);
      }

      this.LEDGERENTRIES_LIST.push(ledgerEntry);
    }
  }


  public getSubTotal(): number{
    let total = 0;
    for (let item of this.ALLINVENTORYENTRIES_LIST) {
      total = total + item.AMOUNT;
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
        for (let product of this.ALLINVENTORYENTRIES_LIST){
          var productItem = product.tallyObject;
          var item = Object.assign(new StockItem(), productItem); 
          ledger.AMOUNT = ledger.AMOUNT + item.getTax(product.BILLEDQTY,product.RATE,"",gstDutyHead)
          ledger.AMOUNT =  parseFloat((Math.round(ledger.AMOUNT * 100) / 100).toFixed(2));    
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
    return total;
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
    inventoryEntry.BATCHALLOCATIONS_LIST.BATCHNAME = batch.NAME;
    inventoryEntry.BATCHALLOCATIONS_LIST.GODOWNNAME = godown;
    inventoryEntry.BATCHALLOCATIONS_LIST.BILLEDQTY = qty;
    inventoryEntry.BATCHALLOCATIONS_LIST.ACTUALQTY = qty;
    inventoryEntry.BATCHALLOCATIONS_LIST.AMOUNT = Math.round(inventoryEntry.RATE * inventoryEntry.BILLEDQTY*100)/100;
    inventoryEntry.BATCHALLOCATIONS_LIST.EXPIRYPERIOD = new EXPIRYPERIOD(batch.EXPIRYDATE 
      ? new Date(batch.EXPIRYDATE)
      : null);
    inventoryEntry.AMOUNT =  Math.round(inventoryEntry.RATE * inventoryEntry.BILLEDQTY*100)/100;
    inventoryEntry.ACCOUNTINGALLOCATIONS_LIST = new ACCOUNTINGALLOCATIONSLIST();
    inventoryEntry.ACCOUNTINGALLOCATIONS_LIST.LEDGERNAME = stockItem.salesList[0].name;
    inventoryEntry.ACCOUNTINGALLOCATIONS_LIST.CLASSRATE = stockItem.salesList[0].classRate;
    inventoryEntry.ACCOUNTINGALLOCATIONS_LIST.LEDGERFROMITEM = stockItem.salesList[0].ledgerFromItem;
    inventoryEntry.ACCOUNTINGALLOCATIONS_LIST.GSTOVRDNNATURE = stockItem.salesList[0].gstCLassificationNature;
    inventoryEntry.ACCOUNTINGALLOCATIONS_LIST.REMOVEZEROENTRIES = stockItem.salesList[0].removeZeroEntries;
    inventoryEntry.ACCOUNTINGALLOCATIONS_LIST.AMOUNT = inventoryEntry.AMOUNT;
    inventoryEntry.ACCOUNTINGALLOCATIONS_LIST.LEDGERFROMITEM = "Yes"
    inventoryEntry.ACCOUNTINGALLOCATIONS_LIST.ISDEEMEDPOSITIVE = "No"
    this.ALLINVENTORYENTRIES_LIST.push(inventoryEntry);
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

  constructor(){
}
    }


    export class PrintConfiguration{
      voucherType: string;
       name: string;
       address: string[];
      contactNumber: string;
      emailId: string;
      licenseNumbers: LicenseNumbers[];;
      termsAndConditions: string[];
      constructor(){
        this.address = [];
        this.licenseNumbers = [];
        this.termsAndConditions = [];
      }
    }

    export class LicenseNumbers{
      licenseName:string;
      licenseNumber: string;
    }