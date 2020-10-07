import { PrintConfiguration } from "../PrintConfiguration/print-configuration";



export class VoucherTypeConfig {
  voucherType: string;
  voucherCategory: string;
  printConfiguration: PrintConfiguration;
  coupons: Coupon[];
  prefix: string;
  suffix: number;

  constructor(){
    this.printConfiguration = new PrintConfiguration();
    this.coupons = [];
  }

}

export class Coupon{
     id: string;
     title: string;
     startDate: Date;
     endDate: Date;
     validTill: Date;
     couponCategory: string;
     lessThan: number;
     greaterThan: number;
     amountOffered: number;
     sendSMSAfterSave: boolean;
     printAfterSave: boolean;
}
