export class User {
      baseEntity:          string;
      password:            string;
      lastLogin:           string;
      emailId:             string;
      contactNumber:       string;
      name:                string;
      role:                string;
      userName:            string;
      tallyUserName:       string;
      godownList:          string[];
      defaultGodown:       string;
      salesVoucherSettings: SalesVoucherSettings;

  constructor(){
    this.salesVoucherSettings = new SalesVoucherSettings();
    this.godownList = [];
  }
}

export class SalesVoucherSettings{
  voucherTypeList: VoucherTypeClass[];
  defaultVoucherType: string;
  defaultClass: string;
  cashLedgerList: string[];
  priceLists: string[];
  defaultCashLedger: string;
  placeOfSupply: string;

  constructor(){
    this.voucherTypeList = [];
    this.cashLedgerList = [];
    this.priceLists = [];
  }
}

export class VoucherTypeClass{
  voucherTypeName: string;
  voucherClass: string;

  constructor(){
    this.voucherClass = "";
  }
}
