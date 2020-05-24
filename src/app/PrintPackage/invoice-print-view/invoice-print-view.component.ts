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
      this.voucher.ALLINVENTORYENTRIES_LIST.forEach((item) => {
        this.databaseService.getStockItem(item.STOCKITEMNAME).then(
          (res) => {
            item.tallyObject = res;

                var GSTDETAILS: any;
                var gstlist: any[] =[];
                var STATEWISEDETAILS:any;
                var RATEDETAILS:any[];
                if (item.tallyObject["GSTDETAILS.LIST"] instanceof Array){
                    gstlist = item.tallyObject["GSTDETAILS.LIST"]
                }else {
                  
                  gstlist.push(item.tallyObject["GSTDETAILS.LIST"]);
                  
                }
                GSTDETAILS = gstlist.filter((g) => new Date(g.APPLICABLEFROM.content) < new Date())
                .sort((b,a) => new Date(a.APPLICABLEFROM.content).getTime() - new Date(b.APPLICABLEFROM.content).getTime())[0];
             

                if (GSTDETAILS){
                  if(GSTDETAILS["STATEWISEDETAILS.LIST"] instanceof Array){
                    STATEWISEDETAILS = GSTDETAILS["STATEWISEDETAILS.LIST"][0];
                  }else {
                    STATEWISEDETAILS = GSTDETAILS["STATEWISEDETAILS.LIST"]
                  }
                  if (STATEWISEDETAILS){
                    if (STATEWISEDETAILS["RATEDETAILS.LIST"] instanceof Array){
                      RATEDETAILS = STATEWISEDETAILS["RATEDETAILS.LIST"];
                    }else {
                      RATEDETAILS.push(STATEWISEDETAILS["RATEDETAILS.LIST"]);
                    }
                  }
                }
                var CGST = RATEDETAILS
                .filter((rate) => rate.GSTRATEDUTYHEAD.content == 'Central Tax')[0]
                var SGST = RATEDETAILS
                .filter((rate) => rate.GSTRATEDUTYHEAD.content == 'State Tax')[0]

            var taxItem: PrintTaxItem = this.hsnDetails.get(GSTDETAILS.HSNCODE);

            if (!taxItem && item.tallyObject && GSTDETAILS 
            && GSTDETAILS.HSNCODE){
              taxItem = new PrintTaxItem();
              taxItem.hsnCode = GSTDETAILS.HSNCODE.content;
              taxItem.cgst.rate = CGST.GSTRATE.content;
              taxItem.sgst.rate = SGST.GSTRATE.content;
              this.hsnDetails.set(taxItem.hsnCode, taxItem);
            }
            taxItem.cgst.amount = taxItem.cgst.amount + this.calculate(taxItem.cgst.rate, item.AMOUNT);
            taxItem.sgst.amount = taxItem.sgst.amount + this.calculate(taxItem.sgst.rate, item.AMOUNT);
            
          }
        ).then(()=>
          this.complete = true
        )
      });

            
        //this.company = this.databaseService.getCompany();
   
        this.date = new Date(this.voucher.DATE);   

    }
  }

  ngOnInit() {
  
  }

  match(){
    return (this.voucher.VOUCHERNUMBER + "").match('^DM-');
  }


  calculate(rate: number, amount: number): number{
    return rate * amount;
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
