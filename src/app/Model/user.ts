export interface User {
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
}

export interface SalesVoucherSettings{
  voucherTypeList: VoucherTypeClass[];
  defaultVoucherType: string;
  defaultClass: string;
  cashLedgerList: string[];
  defaultCashLedger: string;
  placeOfSupply: string;
}

export interface VoucherTypeClass{
  voucherTypeName: string;
  classes: string[];
}
