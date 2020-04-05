import { Component, OnInit, Inject, Input, Output, EventEmitter } from '@angular/core';
import { Customer } from '../../Model/customer';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { VOUCHER } from '../../Model/voucher';
import { ApiService } from 'src/app/shared/api.service';
import { PosService } from 'src/app/shared/pos.service';



@Component({
  selector: 'invoice-print-view',
  templateUrl: './invoice-print-view.component.html',
  styleUrls: ['./invoice-print-view.component.css']
})
export class InvoicePrintViewComponent implements OnInit {

  public voucher: VOUCHER;
  @Output("valueChanged") valueChanged = new EventEmitter();
  @Input('customer') customer: Customer;
  uniqueHSN: PrintTaxItem[] = [];

  stockItems: any [] =[];
  company: any;
  items$: Promise<any[]>;
  customerAddress: any[] = [];
  date: Date;


  constructor(@Inject(MAT_DIALOG_DATA) public data?: any,private apiService?: ApiService, private posService?: PosService) {
    if (data != null) {
      this.voucher = data;
    }
  }

  ngOnInit() {
        console.log(this.voucher);
      
        this.stockItems = this.voucher.ALLINVENTORYENTRIES_LIST;
        
        this.company = this.posService.getCompany().COMPANY;
        this.customerAddress = this.voucher.ADDRESS_LIST.ADDRESS
        this.date = new Date(this.voucher.DATE);   
        

        this.posService.getItems().then((re: any[]) =>{
          for (let item of this.stockItems){
            if (!item.tallyObject){
              item.tallyObject = re.filter((i) => i.NAME == item.STOCKITEMNAME)[0];
              item.RATE = this.getNumbers(item.RATE);
              item.ACTUALQTY = this.getNumbers(item.ACTUALQTY);
                 
            }
          }
          console.log(this.stockItems);
        })

     
         
    
    
    


    
  }

  hsnDetails(): PrintTaxItem[]{
    let uniqueHSN: PrintTaxItem[] = [];
    const items = this.voucher.ALLINVENTORYENTRIES_LIST.map(a => a);
    const unique = Array.from(new Set(items))


    for (let code of unique){
      var totalTaxableValue: number = 0;
      var cgst;
      var sgst;
      for (let item of this.voucher.ALLINVENTORYENTRIES_LIST) {
        if (item == code) {
          totalTaxableValue = totalTaxableValue + item.AMOUNT;
          cgst = item.calculateCGST;
          sgst = item.calculateSGST;
      }
    }

  }
  return uniqueHSN;
  }

  getNumbers(temp: string): number{
    var returnNumber;
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

export interface PrintTaxItem{
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
}
