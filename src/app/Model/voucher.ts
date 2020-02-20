import { User } from './user';
import { Customer } from './customer';
import { ApiService } from '../shared/api.service';
import { DatePipe } from '@angular/common';
import { TaxDetails } from './tax-details';
import { Batch } from './batch';
import { RateDetail } from './stock-item';


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
        ADDRESS: string;
  _TYPE: string;
  STATENAME: string;

  constructor(addressName: string, addressTehsilName: string, addressDistrictName: string, addressStateName: string) {
    this.ADDRESS = addressName + " ," + addressTehsilName + " ," + addressDistrictName + " ," + addressStateName;
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

  constructor(res: any, ledgerType: string, amount: number) {
        console.log(res);
        this.LEDGERNAME = res._NAME;
        if (ledgerType == "GST") {
          // GST Functionality
          this.ISDEEMEDPOSITIVE = "No";
          this.ISPARTYLEDGER = "No";
          this.METHODTYPE = res.METHODTYPE;
          this.VATEXPAMOUNT = amount;

        } else if (ledgerType == "Cash-in-hand") {
          //Cash-in-hand functionality
          this.POSPAYMENTTYPE = "Cash";
          this.ISDEEMEDPOSITIVE = "Yes";
          this.ISPARTYLEDGER = "Yes";
          this.ISLASTDEEMEDPOSITIVE = "Yes";

        } else if (ledgerType == "Round Off") {
          this.ROUNDTYPE = "Normal Rounding";
          this.METHODTYPE = "As Total Amount Rounding";
          this.ISDEEMEDPOSITIVE = "No";
          this.ROUNDLIMIT = 1;
          this.VATEXPAMOUNT = amount;
        }
    this.AMOUNT = amount;
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

      constructor(batchId: Batch, godown: string, private apiService?: ApiService) {
        this.GODOWNNAME = godown;
        this.BATCHNAME = batchId.name;
        this.EXPIRYPERIOD = new EXPIRYPERIOD(batchId.expiryDate);

         
      }

      set expiryDate(expiryDate: Date) {
        
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
      STOCKITEMPARENT: string;
      STOCKITEMCATEGORY: string;
      TAXDETAILS: RateDetail[];
      BASEUNITS: string;
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
      HSNCODE: string

      constructor(res: any, batchId: Batch, qty: number, godown: string) {
        this.HSNCODE = res.gSTDETAILSLIST.hSNCODE;
        this.TAXDETAILS = res.gSTDETAILSLIST.sTATEWISEDETAILSLIST.rATEDETAILSLIST;
        this.STOCKITEMNAME = res._id;
            this.ISDEEMEDPOSITIVE = "No";
            this.ISLASTDEEMEDPOSITIVE = "No";
            this.ISAUTONEGATE = "No";
            this.ISCUSTOMSCLEARANCE = "No";
            this.ISSCRAP = "No";
            this.ISTRACKCOMPONENT = "No";
            this.ISTRACKPRODUCTION = "No"
            this.ISPRIMARYITEM = "No"
            this.STOCKITEMCATEGORY = res.cATEGORY;
            this.STOCKITEMPARENT = res.pARENT;
            this.BILLEDQTY = qty;
            this.ACTUALQTY = qty;
        for (let item of res.fULLPRICELISTLIST) {
          if (item.godownName == godown) {
            this.RATE = item.price;
            break;
          }
        }
            
            this.AMOUNT = this.RATE * qty;
            this.BATCHALLOCATIONS_LIST = new BATCHALLOCATIONSLIST(batchId, godown);
            this.ACCOUNTINGALLOCATIONS_LIST = new ACCOUNTINGALLOCATIONSLIST();
            this.ACCOUNTINGALLOCATIONS_LIST.LEDGERNAME = res.sALESLISTLIST.NAME;
            this.ACCOUNTINGALLOCATIONS_LIST.CLASSRATE = res.sALESLISTLIST.CLASSRATE;
            this.ACCOUNTINGALLOCATIONS_LIST.LEDGERFROMITEM = res.sALESLISTLIST.LEDGERFROMITEM;
            this.ACCOUNTINGALLOCATIONS_LIST.GSTOVRDNNATURE = res.sALESLISTLIST.STCLASSIFICATIONNATURE;
            this.ACCOUNTINGALLOCATIONS_LIST.REMOVEZEROENTRIES = res.sALESLISTLIST.rEMOVEZEROENTRIES;
            this.ACCOUNTINGALLOCATIONS_LIST.AMOUNT = this.AMOUNT;
           
      }

      getAmount(): number {
        console.log(this.AMOUNT)
        return this.AMOUNT;
      }

      calculateCGST(): number {
        for (let item of this.TAXDETAILS) {
          if (item.gSTRATEDUTYHEAD == "Central Tax") {
            return this.AMOUNT * item.taxPercentage / 100;
          }
        }
        return null;
      }
      calculateSGST(): number {
        for (let item of this.TAXDETAILS) {
          if (item.gSTRATEDUTYHEAD == "State Tax") {
            return this.AMOUNT * item.taxPercentage / 100;
          }
        }
        return null;
      }

      calculateIGST(): number {
        for (let item of this.TAXDETAILS) {
          if (item.gSTRATEDUTYHEAD == "Integrated Tax") {
            return this.AMOUNT * item.taxPercentage / 100;
          }
        }
        return null;
      }

      calculateCess(): number {
        for (let item of this.TAXDETAILS) {
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
  EFFECTIVEDATE: string;
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
  subInventoryTotal: number =0;
  Total: number;
  CUSTOMER: any;
  USER: User;



  constructor() {
    this.ALLINVENTORYENTRIES_LIST = [];
    this.ALLLEDGERENTRIES_LIST = [];
    this.LEDGERENTRIES_LIST = [];
  }

  setAction(action: string) {
    this._ACTION = action;
  }

  setDate(date: Date) {
    this.DATE = date;
  }

  public setUser(user: User) {
    this.USER = user;
    this._VCHTYPE = user.salesVoucherSettings.defaultVoucherType;
    this.CLASSNAME = user.salesVoucherSettings.defaultClass;
    this.POSCASHLEDGER = user.salesVoucherSettings.defaultCashLedger;
    this.VOUCHERTYPENAME = user.salesVoucherSettings.defaultVoucherType;
    this.PARTYLEDGERNAME = user.salesVoucherSettings.defaultCashLedger;
    this.PLACEOFSUPPLY = user.defaultGodown;
    this.ENTEREDBY = user.tallyUserName;
  }

 

  setCustomer(customer: any) {
    this.BASICBUYERNAME = customer.name
    this.CUSTOMER = customer;
    this.ADDRESS_LIST = new ADDRESSLIST(customer.addressName, customer.addressTehsilName, customer.addressDistrictName,
    customer.addressStateName);
    this.GSTREGISTRATIONTYPE = customer.gSTREGISTRATIONTYPE;
    this.STATENAME = this.ADDRESS_LIST.STATENAME;
  }
  addLedgerEntry(ledgerEntry: any, ledgerType: string, amount: number) {
    if (this.LEDGERENTRIES_LIST == null) {
      this.LEDGERENTRIES_LIST = [];
    }
    for (let item of this.LEDGERENTRIES_LIST) {
      if (item.LEDGERNAME == ledgerEntry._NAME) {
        item.AMOUNT = amount;
        return;
      } 
    }
    this.LEDGERENTRIES_LIST.push(new LEDGERENTRIESLIST(ledgerEntry, ledgerType, amount));
  }

  addInventoryEntry(inventoryEntry: any, batchId: Batch, qty: number) {
   
    var item = new ALLINVENTORYENTRIESLIST(inventoryEntry, batchId, qty, this.PLACEOFSUPPLY);
   
    this.subInventoryTotal = this.subInventoryTotal + item.getAmount();
    this.ALLINVENTORYENTRIES_LIST.push(item)
  }


  deleteInventoryEntry(inventoryEntry: any) {
    for (let i = 0; i < this.ALLINVENTORYENTRIES_LIST.length; i++) {
      if (this.ALLINVENTORYENTRIES_LIST[i].STOCKITEMNAME == inventoryEntry.STOCKITEMNAME
        && this.ALLINVENTORYENTRIES_LIST[i].BATCHALLOCATIONS_LIST.BATCHNAME == inventoryEntry.BATCHALLOCATIONS_LIST.BATCHNAME
        && this.ALLINVENTORYENTRIES_LIST[i].BATCHALLOCATIONS_LIST.EXPIRYPERIOD.DATE == inventoryEntry.BATCHALLOCATIONS_LIST.EXPIRYPERIOD.DATE
        && this.ALLINVENTORYENTRIES_LIST[i].BILLEDQTY == inventoryEntry.BILLEDQTY
        && this.ALLINVENTORYENTRIES_LIST[i].RATE == inventoryEntry.RATE) {

        this.ALLINVENTORYENTRIES_LIST.splice(i, 1);
        this.subInventoryTotal = this.subInventoryTotal - inventoryEntry.AMOUNT;

      }


        }
  }

  validatePOSVoucher(cashLedger: any, CGSTLedger: any, SGSTLedger: any) {
    this.addLedgerEntry(cashLedger, "Cash-in-hand", this.subInventoryTotal);
    this.addLedgerEntry(CGSTLedger, "GST", this.calculateCGST());
    this.addLedgerEntry(SGSTLedger, "GST", this.calculateSGST());
  }

  getTotal(): number{
    return this.subInventoryTotal + this.calculateTax();
  }

  save() {
    
  }
  calculateTax(): number{
    return this.calculateCGST() + this.calculateSGST();
  }

  calculateCGST(): number {
    console.log(this.ALLINVENTORYENTRIES_LIST);
    var total: number = 0;
    for (var i = 0; i < this.ALLINVENTORYENTRIES_LIST.length; i++) {
      total = total + this.ALLINVENTORYENTRIES_LIST[i].calculateCGST()
    }
    return total;
  }

  calculateSGST(): number {
    var total: number = 0;
    for (var i = 0; i < this.ALLINVENTORYENTRIES_LIST.length; i++) {
      total = total + this.ALLINVENTORYENTRIES_LIST[i].calculateSGST()
    }
    return total;
  }

  public static copyFrom(voucher: VOUCHER): VOUCHER {
    let tempVoucher: VOUCHER = new VOUCHER();
    tempVoucher = Object.assign(tempVoucher, voucher);
    


    return tempVoucher
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
