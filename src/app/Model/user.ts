export class User {
      baseEntity:          string;
      password:            string;
      lastLogin:           string;
      emailId:             string;
      contactNumber:       string;
      id:                  string;
      name:                string;
      role:                string;
      userName:            string;
      tallyUserName:       string;
      godownList:          string[];
      defaultGodown:       string;
      salesVocherSettings: SalesVoucherSettings;
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
