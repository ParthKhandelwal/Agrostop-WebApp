import { Component, OnInit, Inject, Output, EventEmitter, HostListener, Renderer2 } from '@angular/core';

import { VOUCHER } from '../../model/Voucher/voucher';
import { Customer } from '../../model/Customer/customer';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { StockItem } from '../../model/StockItem/stock-item';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { Address } from '../../model/Address/address';
import { SyncService } from '../../services/Sync/sync.service';
import { PrintConfiguration } from '../../model/PrintConfiguration/print-configuration';
import { AuthenticationService } from '../../services/Authentication/authentication.service';
import { VoucherTypeConfig } from '../../model/VoucherType/voucher-type-config';





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
  hsnDetails: Map<string, PrintTaxItem> = new Map();
  printConf: PrintConfiguration;
  voucherCategory: string;
  voucherType: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data?: any,public dialogRef?: MatDialogRef<InvoicePrintViewComponent>,
private db?: NgxIndexedDBService, public auth?: AuthenticationService,private syncService?: SyncService
 ) {



  }

  printReady: boolean;

  ngOnInit() {
    this.setVoucherToPrint(this.data).then(
      res => {
        this.printReady = true
      }
    )

  }


print(){
  this.printReady= false;
  console.log("printing")
  //this.electron.ipcRenderer.send("print");
}

  match(){
    return (this.voucher.VOUCHERNUMBER + "").match('^DM-');
  }


  async setVoucherToPrint(data){
    if (data != null) {

      this.voucher = Object.assign(new VOUCHER(),data);
      console.log(this.voucher);
      this.customer = await this.getCustomer(this.voucher.BASICBUYERNAME);
      this.address = this.customer ? this.customer.fullAddress: null;
      console.log(this.customer);
      console.log(this.address);
      let voucherTypeConfig = await this.getPrintConfigurations(this.voucher.VOUCHERTYPENAME);
      this.printConf = voucherTypeConfig.printConfiguration;
      this.voucherType = voucherTypeConfig.voucherType;
      this.voucherCategory = voucherTypeConfig.voucherCategory;
      this.stockItems = this.isSales()? this.voucher.ALLINVENTORYENTRIES_LIST : this.voucher.INVENTORYENTRIESIN_LIST;
      console.log(this.stockItems);
      for (let item of this.stockItems){
        var res: StockItem = await this.getStockItem(item.STOCKITEMNAME)
        console.log(res);
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


      this.complete = true
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
    for (let item of this.stockItems){
      if (item.AMOUNT != null){
        total = total + item.AMOUNT;
      }
    }
    return total;
  }

  public getTotal(): number{

      var total: number =0
      if(!this.isMO()){
        for (let item of this.voucher.LEDGERENTRIES_LIST){
          if (item.AMOUNT != null && (item.POSPAYMENTTYPE == null || item.POSPAYMENTTYPE == "")){
            total = total + item.AMOUNT;
          }
        }
      }


        for (let item of this.stockItems){
          if (item.AMOUNT != null){
            total = total + item.AMOUNT;
          }
        }



      return total;


  }



  async getStockItem(str: string): Promise<any>{
    return await this.syncService.products$.getValue().filter((c) => c.NAME === str)[0];
  }

  getLedger(name : string): Promise<any>{
    return this.db.getByKey("Ledgers", name);
  }

  getPrintConfigurations(id: string): Promise<VoucherTypeConfig>{
    return this.db.getByKey("PrintConfiguration", id);
  }

  async getCustomer(id: string):Promise<Customer>{
    return  await this.syncService.customers$.getValue().filter((c) => c.id === id)[0];
  }
  async getAddress(id: string):Promise<Address>{
    return  await this.syncService.addresses$.getValue().filter((c) => c._id === id)[0];
  }


  ngOnDestroy() {
    // remove listener
  }

  isSales(): boolean{
    return this.voucherCategory === "Sales";
  }


  isMO(): boolean{
    return this.voucherCategory === "Material Out";
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
