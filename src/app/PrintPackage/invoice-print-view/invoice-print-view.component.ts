import { Component, OnInit, Inject, Input } from '@angular/core';
import { TallyVoucher } from '../../Model/tally-voucher';
import { Customer } from '../../Model/customer';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { VOUCHER } from '../../Model/voucher';

@Component({
  selector: 'app-invoice-print-view',
  templateUrl: './invoice-print-view.component.html',
  styleUrls: ['./invoice-print-view.component.css']
})
export class InvoicePrintViewComponent implements OnInit {

  @Input('tallyVoucher') voucher: VOUCHER;
  @Input('customer') customer: Customer;
  uniqueHSN: PrintTaxItem[] = [];
  printing: boolean = false;

  constructor() {

  }

  ngOnInit() {
  }

  hsnDetails(): PrintTaxItem[]{
    let uniqueHSN: PrintTaxItem[] = [];
    const items = this.voucher.ALLINVENTORYENTRIES_LIST.map(a => a.HSNCODE);
    const unique = Array.from(new Set(items))


    for (let code of unique){
      var totalTaxableValue: number = 0;
      var cgst;
      var sgst;
      for (let item of this.voucher.ALLINVENTORYENTRIES_LIST) {
        if (item.HSNCODE == code) {
          totalTaxableValue = totalTaxableValue + item.AMOUNT;
          cgst = item.calculateCGST;
          sgst = item.calculateSGST;
      }
    }
    uniqueHSN.push({hsnCode: code, taxableValue: totalTaxableValue, cgst: {rate: cgst, amount: (totalTaxableValue * cgst)/100}, sgst: {rate: sgst, amount: (totalTaxableValue * sgst)/100} })

  }
  return uniqueHSN;
  }

  print(){
    this.printing = true;
    //this.uniqueHSN = this.hsnDetails();
    let printContents, popupWin;
        printContents = document.getElementById('print-section').innerHTML;
        popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
        popupWin.document.open();
        popupWin.document.write(`
          <html>
            <head>
              <title>Invoice</title>
              <style>




              .invoicePrintView{
                padding: 10px;
                font-size: 12px;
              }
              .header{

              }

              .voucherInformation{
                display: flex;
                width: 100%;
                margin-bottom: 20px;
              }

              .customerInformation{
               width: 45%;
              }
              .customVoucherInformation{
                width: 45%;
                margin-left:10%;
              }

              .body{
              width: 100%;
              }

              .lowerBody{
                margin-top: 20px;
                display: flex;
              }
              .total{
                margin-left: 10%;
                width: 45%;

              }

              .posDetails{
                width: 45%

              }

              .footer{

              }
              .hsnPart{
                width: 100%;
              }

              #productTable {
                font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;
                border-collapse: collapse;
                width: 100%;
              }

              #productTable td, #productTable th {
                border: 1px solid #ddd;
                padding: 2px;
              }

              #productTable tr:nth-child(even){background-color: #f2f2f2;}

              #productTable tr:hover {background-color: #ddd;}

              #productTable th {
                padding-top: 2px;
                padding-bottom: 2px;
                text-align: left;
                background-color: #4CAF50;
                color: white;
              }

              #totalTable td{
                border-bottom: 1px solid #ddd;
              }

              #posTable td{
                border-bottom: 1px solid #ddd;
              }
              #hsnTable{
                font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;
                border-collapse: collapse;
                width: 100%;
              }

              #hsnTable td, #hsnTable th {
                border: 1px solid #ddd;
                padding: 2px;
              }

              #hsnTable tr:nth-child(even){background-color: #f2f2f2;}

              #hsnTable tr:hover {background-color: #ddd;}

              #hsnTable th {
                padding-top: 2px;
                padding-bottom: 2px;
                text-align: left;
                background-color: #F1C40F;
                color: white;
              }



              </style>
            </head>
        <body onload="window.print();window.close()">${printContents}</body>
          </html>`
        );
        popupWin.document.close();
        this.printing = true;
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
