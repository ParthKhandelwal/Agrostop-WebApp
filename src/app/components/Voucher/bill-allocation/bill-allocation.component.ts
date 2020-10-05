import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ALLLEDGERENTRIESLIST, BillAllocationsList, BankallocationsList } from '../../../model/Voucher/voucher';
import { MatTable } from '@angular/material/table';


@Component({
  selector: 'app-bill-allocation',
  templateUrl: './bill-allocation.component.html',
  styleUrls: ['./bill-allocation.component.css']
})
export class BillAllocationComponent implements OnInit {
  billAllocation : BillAllocationsList = new BillAllocationsList();
  displayedColumns: string[] = ['ref', 'name', 'dueDate', 'amount', "action"];
  typeRef: string[] = ["Advance", "New Ref", "On Account"];
  @ViewChild("table") table: MatTable<BillAllocationsList>;

  constructor(public dialogRef?: MatDialogRef<BillAllocationComponent>,@Inject(MAT_DIALOG_DATA) public ledger?: ALLLEDGERENTRIESLIST) {
    if(!ledger.BILLALLOCATIONS_LIST){
      this.ledger.BILLALLOCATIONS_LIST = [];
    }
  }

  ngOnInit(): void {
  }


  getBillAllocationTotal(): number{
    let total: number = 0;
    for(let item of this.ledger.BILLALLOCATIONS_LIST){
      total = total + item.amount;
    }
    return total;
  }

  getRemainingBalance(){
    return this.ledger.AMOUNT - this.getBillAllocationTotal();
  }

  typeRefSelected(){
    this.billAllocation.amount = this.getRemainingBalance();
    switch (this.billAllocation.billType) {
      case "Advance":
        setTimeout(() => {
          document.getElementById("name").focus();
        }, 300)
        break;
      case "New Ref":
        document.getElementById("name").focus();
        break;
      case "On Account":
        document.getElementById("amount").focus();
        break;


      default:
        break;
    }
    document.getElementById("name").focus()

  }

  add(){
    this.ledger.BILLALLOCATIONS_LIST.push(this.billAllocation);
    this.table.renderRows();
    this.billAllocation = new BillAllocationsList();
    if(this.getRemainingBalance() == 0){
      this.dialogRef.close(this.ledger);
    }else{
      document.getElementById("ref").focus();
    }
  }

  delete(i){
    this.ledger.BILLALLOCATIONS_LIST.splice(i,1)
    this.table.renderRows();
  }



}
