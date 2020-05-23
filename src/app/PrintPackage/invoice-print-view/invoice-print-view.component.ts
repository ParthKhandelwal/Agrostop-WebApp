import { Component, OnInit, Inject, Input, Output, EventEmitter } from '@angular/core';
import { Customer } from '../../Model/customer';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { VOUCHER, ALLINVENTORYENTRIESLIST, PrintConfiguration } from '../../Model/voucher';
import { ApiService } from 'src/app/shared/api.service';
import { PosService } from 'src/app/shared/pos.service';
import { Address } from 'src/app/Model/address';
import { DatabaseService } from 'src/app/shared/database.service';
import { AppComponent } from 'src/app/app.component';
import { User } from 'src/app/Model/user';




@Component({
  selector: 'invoice-print-view',
  templateUrl: './invoice-print-view.component.html',
  styleUrls: ['./invoice-print-view.component.css']
})
export class InvoicePrintViewComponent implements OnInit {

  public voucher: VOUCHER;
  @Output("valueChanged") valueChanged = new EventEmitter();
  customer: Customer;
  uniqueHSN: PrintTaxItem[] = [];
  complete:boolean;
  stockItems: any [] =[];
  company: any;
  items$: Promise<any[]>;
  customerAddress: any[] = [];
  date: Date;
  address: any;
  databaseService: DatabaseService;
  user: User;
  hsnDetails: Map<string, PrintTaxItem> = new Map();
  printConf: PrintConfiguration;

  constructor(@Inject(MAT_DIALOG_DATA) public data?: any,private apiService?: ApiService) {
    this.databaseService = AppComponent.databaseService;
    this.user = this.databaseService.getUser();
    if (data != null) {
      this.voucher = data;
      this.databaseService.getCustomer(this.voucher.BASICBUYERNAME).then(
        (res: Customer) => {
          console.log(res);
          this.customer = res
          this.databaseService.getAddress(res.addressId).then(
            add => {
              this.address = add;
            }
          );
        }
      );
      this.databaseService.getPrintConfigurations(this.voucher.VOUCHERTYPENAME).then(
        res=> {
          this.printConf = res
        }
      )
      this.stockItems = this.voucher.ALLINVENTORYENTRIES_LIST;
      this.databaseService.getItems().then((re: any[]) =>{
        for (let item of this.stockItems){
          if (!item.tallyObject){
            item.tallyObject = re.filter((i) => i.NAME == item.STOCKITEMNAME)[0];
            item.RATE = this.getNumbers(item.RATE);
            item.ACTUALQTY = this.getNumbers(item.ACTUALQTY);
            var taxItem: PrintTaxItem = this.hsnDetails.get(item.tallyObject["GSTDETAILS.LIST"].HSNCODE);

            if (!taxItem && item.tallyObject && item.tallyObject["GSTDETAILS.LIST"] 
            && item.tallyObject["GSTDETAILS.LIST"].HSNCODE){
              taxItem = new PrintTaxItem();
              taxItem.hsnCode = item.tallyObject["GSTDETAILS.LIST"].HSNCODE.content;
              taxItem.cgst.rate = this.calculateCGSTRate(item);
              taxItem.sgst.rate = this.calculateSGSTRate(item);
              console.log(taxItem);
              this.hsnDetails.set(taxItem.hsnCode, taxItem);
            }
            taxItem.cgst.amount = taxItem.cgst.amount + this.calculateCGST(item);
            taxItem.sgst.amount = taxItem.sgst.amount + this.calculateSGST(item);
          }
          this.complete = true;
        }
      })
      
        
        //this.company = this.databaseService.getCompany();
   
        this.date = new Date(this.voucher.DATE);   

    }
  }

  ngOnInit() {
  
  }

  match(){
    return (this.voucher.VOUCHERNUMBER + "").match('^DM-');
  }

  calculateCGSTRate(item : any): number{
    if (item && item.tallyObject && item.tallyObject["GSTDETAILS.LIST"] 
    && item.tallyObject["GSTDETAILS.LIST"]["STATEWISEDETAILS.LIST"] && 
    item.tallyObject["GSTDETAILS.LIST"]["STATEWISEDETAILS.LIST"]["RATEDETAILS.LIST"]
    &&  item.tallyObject["GSTDETAILS.LIST"]["STATEWISEDETAILS.LIST"]["RATEDETAILS.LIST"] instanceof Array){
    var rateList: any[] = item.tallyObject["GSTDETAILS.LIST"]["STATEWISEDETAILS.LIST"]["RATEDETAILS.LIST"].filter((r) => r.GSTRATEDUTYHEAD.content == "Central Tax");
      return rateList[0].GSTRATE.content;
    } else {
      return 0;
    }
  }

  calculateSGSTRate(item : any): number{
    if (item && item.tallyObject && item.tallyObject["GSTDETAILS.LIST"] 
    && item.tallyObject["GSTDETAILS.LIST"]["STATEWISEDETAILS.LIST"] && 
    item.tallyObject["GSTDETAILS.LIST"]["STATEWISEDETAILS.LIST"]["RATEDETAILS.LIST"]
    &&  item.tallyObject["GSTDETAILS.LIST"]["STATEWISEDETAILS.LIST"]["RATEDETAILS.LIST"] instanceof Array){
    var rateList: any[] = item.tallyObject["GSTDETAILS.LIST"]["STATEWISEDETAILS.LIST"]["RATEDETAILS.LIST"].filter((r) => r.GSTRATEDUTYHEAD.content == "State Tax");
      return rateList[0].GSTRATE.content;
    } else {
      return 0;
    }
  }

  calculateCGST(item : any): number{
    if (item && item.tallyObject && item.tallyObject["GSTDETAILS.LIST"] 
    && item.tallyObject["GSTDETAILS.LIST"]["STATEWISEDETAILS.LIST"] && 
    item.tallyObject["GSTDETAILS.LIST"]["STATEWISEDETAILS.LIST"]["RATEDETAILS.LIST"]
    &&  item.tallyObject["GSTDETAILS.LIST"]["STATEWISEDETAILS.LIST"]["RATEDETAILS.LIST"] instanceof Array){
    var rateList: any[] = item.tallyObject["GSTDETAILS.LIST"]["STATEWISEDETAILS.LIST"]["RATEDETAILS.LIST"].filter((r) => r.GSTRATEDUTYHEAD.content == "Central Tax");
      return rateList[0].GSTRATE.content * item.AMOUNT;
    } else {
      return 0;
    }
  }

  calculateSGST(item: any): number {
    if (item && item.tallyObject && item.tallyObject["GSTDETAILS.LIST"] 
    && item.tallyObject["GSTDETAILS.LIST"]["STATEWISEDETAILS.LIST"] && 
    item.tallyObject["GSTDETAILS.LIST"]["STATEWISEDETAILS.LIST"]["RATEDETAILS.LIST"]
    &&  item.tallyObject["GSTDETAILS.LIST"]["STATEWISEDETAILS.LIST"]["RATEDETAILS.LIST"] instanceof Array){
    var rateList: any[] = item.tallyObject["GSTDETAILS.LIST"]["STATEWISEDETAILS.LIST"]["RATEDETAILS.LIST"].filter((r) => r.GSTRATEDUTYHEAD.content == "State Tax");
      return rateList[0].GSTRATE.content * item.AMOUNT;
    } else {
      return 0;
    }
  }

  getNumbers(temp: string): number{
    var returnNumber;
    temp = temp +"";
    returnNumber = temp.replace(/\//g, "");
    returnNumber = returnNumber.replace(/[^\d.-]/g, "");
    return returnNumber;
  }

  public getSubTotal(): number{
    var total: number = 0;
    for (let item of this.voucher.ALLINVENTORYENTRIES_LIST){
      if (item.AMOUNT != null){
        total = total + item.AMOUNT;
      }
    }
    return total;
  }

  public getTotal(): number{

      var total: number =0 
      for (let item of this.voucher.LEDGERENTRIES_LIST){
        if (item.AMOUNT != null && (item.POSPAYMENTTYPE == null || item.POSPAYMENTTYPE == "")){
          total = total + item.AMOUNT;
        }
      }
  
      for (let item of this.voucher.ALLINVENTORYENTRIES_LIST){
        if (item.AMOUNT != null){
          total = total + item.AMOUNT;
        }
      }
  
      return total;
    
    
  }

 


}

export class PrintTaxItem{
  hsnCode: string;
  taxableValue: number;
  cgst: {
    rate: number;
    amount: number
  }
  sgst: {
    rate: number;
    amount: number
  }
  constructor(){
    this.cgst = {rate: 0, amount: 0}
    
    this.sgst = {rate: 0, amount: 0}
  }
}
