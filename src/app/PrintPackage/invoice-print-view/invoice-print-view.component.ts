import { Component, OnInit, Inject, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { Customer } from '../../Model/customer';
import {  MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { VOUCHER, PrintConfiguration } from '../../Model/voucher';
import { ApiService } from 'src/app/shared/api.service';
import { DatabaseService } from 'src/app/shared/database.service';
import { AppComponent } from 'src/app/app.component';
import { User } from 'src/app/Model/user';
import { StockItem } from 'src/app/Model/stock-item';
import { NgxPrintDirective } from 'ngx-print';



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

  constructor(@Inject(MAT_DIALOG_DATA) public data?: any,
  private apiService?: ApiService, private dialogRef?: MatDialogRef<InvoicePrintViewComponent>,
 ) {
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
          (res: StockItem) => {
            var tallyObject: StockItem = Object.assign(new StockItem, res);
            item.tallyObject = tallyObject;
            var taxItem: PrintTaxItem = this.hsnDetails.get(tallyObject.getHSNCODE());

            if (!taxItem && tallyObject){
              taxItem = new PrintTaxItem();
              taxItem.hsnCode = tallyObject.getHSNCODE();
              taxItem.cgst.rate = tallyObject.getTaxRate("", "Central Tax");
              taxItem.sgst.rate = tallyObject.getTaxRate("", "State Tax");
              this.hsnDetails.set(taxItem.hsnCode, taxItem);
            }
            taxItem.cgst.amount = taxItem.cgst.amount + this.calculate(taxItem.cgst.rate, item.AMOUNT);
            taxItem.sgst.amount = taxItem.sgst.amount + this.calculate(taxItem.sgst.rate, item.AMOUNT);
            
          }
        ).then(()=>{
          this.complete = true
          this.print();
          console.log("printing");

        }
          
        )
      });
   
        this.date = new Date(this.voucher.DATE);   

    }
  }

  ngOnInit() {
    this.setVoucherToPrint(this.data)
  }

  ngAfterViewInit(){
  }

  match(){
    return (this.voucher.VOUCHERNUMBER + "").match('^DM-');
  }

  print(){
    
    document.getElementById("printButton").click();
    //this.printService.$printItems.subscribe((item) => this.printService.printPrintItems(item));
    this.dialogRef.close();
    
  }


  async setVoucherToPrint(data){
    if (data != null) {
      this.voucher = data;
      this.customer = await this.databaseService.getCustomer(this.voucher.BASICBUYERNAME);
      this.address = await this.databaseService.getAddress(this.customer.addressId);
      this.printConf = await this.databaseService.getPrintConfigurations(this.voucher.VOUCHERTYPENAME);
      this.stockItems = this.voucher.ALLINVENTORYENTRIES_LIST;
      this.voucher.ALLINVENTORYENTRIES_LIST.forEach(async (item) => {
        var res: StockItem = await this.databaseService.getStockItem(item.STOCKITEMNAME)
            var tallyObject: StockItem = Object.assign(new StockItem, res);
            item.tallyObject = tallyObject;
            var taxItem: PrintTaxItem = this.hsnDetails.get(tallyObject.getHSNCODE());

            if (!taxItem && tallyObject){
              taxItem = new PrintTaxItem();
              taxItem.hsnCode = tallyObject.getHSNCODE();
              taxItem.cgst.rate = tallyObject.getTaxRate("", "Central Tax");
              taxItem.sgst.rate = tallyObject.getTaxRate("", "State Tax");
              this.hsnDetails.set(taxItem.hsnCode, taxItem);
            }
            taxItem.cgst.amount = taxItem.cgst.amount + this.calculate(taxItem.cgst.rate, item.AMOUNT);
            taxItem.sgst.amount = taxItem.sgst.amount + this.calculate(taxItem.sgst.rate, item.AMOUNT);
            
          }
        )
          this.complete = true
          this.print();
          console.log("printing");
          this.print();
          
       
      
   
        this.date = new Date(this.voucher.DATE);   

    }
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
