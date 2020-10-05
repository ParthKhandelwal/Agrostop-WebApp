import { Component, OnInit, Inject, Output, ViewChild } from '@angular/core';
import { ALLLEDGERENTRIESLIST, BankallocationsList } from '../../../model/Voucher/voucher';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';

@Component({
  selector: 'app-bank-allocation',
  templateUrl: './bank-allocation.component.html',
  styleUrls: ['./bank-allocation.component.css']
})
export class BankAllocationComponent implements OnInit {
  bankAllocation: BankallocationsList = new BankallocationsList()
  displayedColumns: string[] = ['type', 'amount', 'action'];
  @ViewChild("table") table: MatTable<BankallocationsList>;

  constructor(public dialogRef?: MatDialogRef<BankAllocationComponent>,@Inject(MAT_DIALOG_DATA) public ledger?: ALLLEDGERENTRIESLIST) {
    if(!ledger.BANKALLOCATIONS_LIST){
      ledger.BANKALLOCATIONS_LIST = [];

    }
  }

  ngOnInit(): void {
  }

  save(){

    this.dialogRef.close(this.ledger);
  }


  add(){
    this.ledger.BANKALLOCATIONS_LIST.push(this.bankAllocation);
    this.table.renderRows();
    this.bankAllocation = new BankallocationsList();
    this.bankAllocation.amount = this.getRemainingBalance();

    if(this.getRemainingBalance() == 0){
      this.dialogRef.close(this.ledger)
    }
  }

  delete(i){
    this.bankAllocation = this.ledger.BANKALLOCATIONS_LIST[i]
    this.ledger.BANKALLOCATIONS_LIST.splice(i,1);
    setTimeout(()=> {
      document.getElementById("typeS").focus();
    }, 300)
    this.table.renderRows();
  }

  getTotal(): number{
    let total = 0
    for(let item of this.ledger.BANKALLOCATIONS_LIST){
      total = total + (+item.amount);
    }
    console.log(total);
    return total;
  }

  getRemainingBalance(): number{
    return +this.ledger.AMOUNT - this.getTotal();
  }

  nextFromTransactionType(){
    let str;
    setTimeout(() => {
      if(this.ledger.ISDEEMEDPOSITIVE == 'No'){
        switch (this.bankAllocation.transactiontype) {
          case "Cheque/DD":
            str = "crossCmt"
            break;
          case "e-Fund Transfer":
              str = "accNo"
              break;
          default:
            str = "instno"
            break;
        }
      }else{
        str = "instno"
      }
      this.bankAllocation.amount = this.getRemainingBalance();
      document.getElementsByName(str)[0].focus();
    }, 300)
  }
}
