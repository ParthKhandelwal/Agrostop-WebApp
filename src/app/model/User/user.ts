
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
      voucherTypes: VoucherTypeClass[];
      cashBankProfile: CashBankProfile[];

  constructor(){
    this.salesVoucherSettings = new SalesVoucherSettings();
    this.godownList = [];
    this.voucherTypes = [];
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
  voucherCategory: string;
  voucherClass: string;

  constructor(){
    this.voucherClass = "";
  }
}

export class CashBankProfile{
  type: string;
  ledger: string;
}

export interface UserLogin{
  username: string;
  password: string;
}
export interface Response{
  token: string;
}

