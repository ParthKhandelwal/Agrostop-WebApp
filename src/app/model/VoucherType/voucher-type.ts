
export class VOUCHERTYPE {
  GUID: string;
  PARENT: string;
  MAILINGNAME: string;
  TAXUNITNAME: string;
  VCHPRINTTITLE: string;
  VCHPRINTDECL: string;
  NUMBERINGMETHOD: string;
  EXCISEUNITNAME: string;
  LBTDECLARATION: string;
  VCHPRINTJURISDICTION: string;
  VCHPRINTBANKNAME: string;
  CONTRACONTRA: string;
  PAYMENTCONTRA: string;
  RECEIPTCONTRA: string;
  JOURNALCONTRA: string;
  CNOTECONTRA: string;
  DNOTECONTRA: string;
  SALESCONTRA: string;
  PURCHASECONTRA: string;
  CREDITCSTCTR: string;
  DEBITCSTCTR: string;
  PREVIOUSPURCHASE: string;
  PREVIOUSSALES: string;
  PREVIOUSGODOWN: string;
  PREVNARRATION: string;
  ISUPDATINGTARGETID: string;
  ASORIGINAL: string;
  ISDEEMEDPOSITIVE: string;
  AFFECTSSTOCK: string;
  PREVENTDUPLICATES: string;
  PREFILLZERO: string;
  PRINTAFTERSAVE: string;
  FORMALRECEIPT: string;
  ISOPTIONAL: string;
  ASMFGJRNL: string;
  EFFECTIVEDATE: string;
  COMMONNARRATION: string;
  MULTINARRATION: string;
  ISTAXINVOICE: string;
  USEFORPOSINVOICE: string;
  USEFOREXCISETRADERINVOICE: string;
  USEFOREXCISE: string;
  USEFORJOBWORK: string;
  ISFORJOBWORKIN: string;
  ALLOWCONSUMPTION: string;
  USEFOREXCISEGOODS: string;
  USEFOREXCISESUPPLEMENTARY: string;
  ISDEFAULTALLOCENABLED: string;
  SORTPOSITION: string;
  ALTERID: string;
  BEGINNINGNUMBER: string;
  VOUCHERCLASSLIST_LIST: VOUCHERCLASSLISTLIST[];
  NAME: string;
}


export interface LedgerEntriesList {
  methodType: string;
  name: string;
}

export interface VOUCHERCLASSLISTLIST {
  className: string;
  ledgerEntriesList: LedgerEntriesList[];
  posCardLedger: string;
  posCashLedger: string;
  posChequeLedger: string;
  posGiftLedger: string;
  posEnableCardLedger: string;
  posEnableCashLedger: string;
  posEnableChequeLedger: string;
  posenableGiftLedger: string;
}


export enum VoucherParentType{


    Contra = "Contra",
    Credit_Note = "Credit Note",
    Journal = "Journal",
    Material_In = "Material In",
    Material_Out = "Material Out",
    Payment = "Payment",
    Purchase = "Purchase",
    Receipt = "Receipt",
    Sales = "Sales",
}
