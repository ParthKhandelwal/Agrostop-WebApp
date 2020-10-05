import { Component, OnInit, Output, ViewChild, ChangeDetectorRef, EventEmitter } from '@angular/core';
import { AgroVoucherService } from '../../../services/AgroVoucher/agro-voucher.service';
import { StockItem } from '../../../model/StockItem/stock-item';
import { Batch } from '../../../model/Batch/batch';
import { FormControl } from '@angular/forms';
import { AutoCompleteComponent } from '../../AgroComponents/auto-complete/auto-complete.component';
import { MatTable } from '@angular/material/table';
import { VoucherParentType } from '../../../model/VoucherType/voucher-type';
import { LEDGERENTRIESLIST, ALLINVENTORYENTRIESLIST, INVENTORYENTRIESIN_LIST, INVENTORYENTRIESOUT_LIST } from '../../../model/Voucher/voucher';
import { ParticularTableComponent } from '../particular-table/particular-table.component';
import { StockService } from '../../../services/Stock/stock.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { BatchAllocationComponent } from '../batch-allocation/batch-allocation.component';
import { AccountingAllocationComponent } from '../accounting-allocation/accounting-allocation.component';

@Component({
  selector: 'inventory-table',
  templateUrl: './inventory-table.component.html',
  styleUrls: ['./inventory-table.component.css']
})
export class InventoryTableComponent implements OnInit {
  @Output("complete") complete = new EventEmitter();
  @ViewChild("particularTable") particularTable: ParticularTableComponent;
  rateControl = new FormControl();
  qtyControl = new FormControl();
  batchControl = new FormControl();
  rateIncControl = new FormControl();

  @ViewChild('productAutoComp', { static: false}) productAutoComplete: AutoCompleteComponent;
  @ViewChild('table', { static: false}) table: MatTable<any>;


  displayedColumns: string[] = ['sno', 'name', 'batch', 'qty', 'rate', 'amount', 'action'];
  ledgerColumns: string[] = ["sno", "name", "amount", "action"];
  ledger: LEDGERENTRIESLIST = new LEDGERENTRIESLIST();
  item: ALLINVENTORYENTRIESLIST | INVENTORYENTRIESIN_LIST | INVENTORYENTRIESOUT_LIST;

  constructor(public service?: AgroVoucherService, private cd?: ChangeDetectorRef, public stockService?: StockService,private dialog?: MatDialog) {
    this.newInventory();
   }

  ngOnInit(): void {

  }


  newInventory(){
    switch (this.service.voucherParentType) {
      case VoucherParentType.Sales:
        this.item = new ALLINVENTORYENTRIESLIST();
        this.item.ISDEEMEDPOSITIVE = "No";
        break;

      case VoucherParentType.Purchase:
        this.item = new ALLINVENTORYENTRIESLIST();
        this.item.ISDEEMEDPOSITIVE = "Yes";
        break;
      case VoucherParentType.Material_Out:
        this.item = new INVENTORYENTRIESIN_LIST();
        this.item.ISDEEMEDPOSITIVE = "Yes"
        break;
      default:
        break;
    }
  }


  validateInventoryEntry(){

    if(this.batchControl.value.closingBalanace < 0){
      if(!confirm("You have selected a batch with negative balance. Do you wish to continue?")){
        document.getElementById("batch").focus();
        return;
      }

    }

    if (this.productAutoComplete.productControl.value == null || this.productAutoComplete.productControl.value ==""){
      this.productAutoComplete.focus();
      return;
    }

    if (this.batchControl.value == null){
      alert("Please select a batch");
      document.getElementById("batch").focus();
      return;
    }
    if (this.qtyControl.value == null || this.qtyControl.value == 0){
      document.getElementById("qty").focus();
      return;
    }
    const res: StockItem = Object.assign(new StockItem(),
                                  this.productAutoComplete.productControl.value);

    switch (this.service.voucherParentType) {
      case VoucherParentType.Sales:
        this.service.voucher.addInventory(this.rateControl.value,
          this.qtyControl.value,
          this.batchControl.value,
          this.service.godown,
          res);
        break;

      case VoucherParentType.Material_Out:
        this.service.voucher.addInventoryEntriesIN(this.productAutoComplete.productControl.value.NAME,
          this.rateControl.value, this.qtyControl.value,
          this.batchControl.value, this.service.voucher.VOUCHERSOURCEGODOWN,
          this.service.voucher.VOUCHERDESTINATIONGODOWN );


      default:
        break;
    }

    this.table.renderRows();
    this.renew()


}

renew(){
  this.table.renderRows();
  this.productAutoComplete.productControl.setValue("");
  this.item = new ALLINVENTORYENTRIESLIST();
  this.particularTable.refreshLedgers();
  this.cd.detectChanges();
  this.productAutoComplete.focus();
  this.newInventory();
}

selectQty(){
  document.getElementById("rate").focus()
}

showBatchAllocation(){
  console.log(this.service.voucher);
  this.item.BILLEDQTY = this.item.ACTUALQTY;
  //this.item.AMOUNT = (-1)* Math.round(this.item.RATE * this.item.ACTUALQTY *100)/100
  const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = "50%";
    const dialogRef = this.dialog.open(BatchAllocationComponent , {data: this.item});
    dialogRef.afterClosed().subscribe(
      res => {
        console.log(this.item);
        if(res){
          switch (this.service.voucherParentType) {
            case VoucherParentType.Sales:
              this.showAccountingAllocation();
              break;
            case VoucherParentType.Purchase:
              this.showAccountingAllocation();
              break;
            case VoucherParentType.Material_Out:
              if(this.item instanceof INVENTORYENTRIESIN_LIST){
                this.item.AMOUNT = this.item.BATCHALLOCATIONS_LIST.AMOUNT;
                this.service.voucher.INVENTORYENTRIESIN_LIST.push(this.item)
                this.service.voucher.addInventoryEntriesOUT(this.item);
              }
              this.renew();
            default:
              break;
          }
        }



      }
    )
}

showAccountingAllocation(){
  const dialogConfig = new MatDialogConfig();
  dialogConfig.autoFocus = true;
  dialogConfig.width = "50%";
  const dialogRef = this.dialog.open(AccountingAllocationComponent, {data: this.item});
  dialogRef.afterClosed().subscribe(
    res => {
      if(res){
        if(this.item instanceof ALLINVENTORYENTRIESLIST){
          this.service.voucher.ALLINVENTORYENTRIES_LIST.push(this.item);
          this.renew();
        }else{
          document.getElementById("rate").focus()
        }
      }

    }
  )
}

selectInventory(pro:StockItem){
  if (pro.NAME == "END OF LIST"){
    this.particularTable.focus();
    return;
  }
  this.item.STOCKITEMNAME = pro.NAME;
  let temp = Object.assign(new StockItem(), pro);
  switch (this.service.voucherParentType) {
    case VoucherParentType.Sales:
      this.item.RATE = temp.getRate(this.service.voucher.PRICELEVEL);
      break;
    case VoucherParentType.Material_Out:

      break;


    default:
      break;
  }
  document.getElementById("qty").focus();
}


setRateInclusiveOfTax(){
  if(this.productAutoComplete.productControl.value.NAME && this.productAutoComplete.productControl.value.NAME != "END OF LIST"){
    let temp: StockItem = Object.assign(new StockItem(), this.productAutoComplete.productControl.value);
    return temp.getRateInclusiveOfTax(this.item.RATE, "")

  }else{
    return 0;
  }
}

focus(){
  setTimeout(() => {
    console.log("focus 2");
    this.productAutoComplete.productControl.setValue('');
    this.productAutoComplete.productRef.nativeElement.focus()
  }, 300);

}


getInventories(){
  switch (this.service.voucherParentType) {
    case VoucherParentType.Sales:
      return this.service.voucher.ALLINVENTORYENTRIES_LIST;
      break;
    case VoucherParentType.Purchase:
      return this.service.voucher.ALLINVENTORYENTRIES_LIST;
      break;

    case VoucherParentType.Material_Out:
      return this.service.voucher.INVENTORYENTRIESIN_LIST;

    default:
      break;
  }
}

delete(i){
  switch (this.service.voucherParentType) {
    case VoucherParentType.Sales:
      this.service.voucher.ALLINVENTORYENTRIES_LIST.splice(i,1);
      break;
    case VoucherParentType.Purchase:
      this.service.voucher.ALLINVENTORYENTRIES_LIST.splice(i,1);
      break;

    case VoucherParentType.Material_Out:
      this.service.voucher.INVENTORYENTRIESIN_LIST.splice(i,1);
      this.service.voucher.INVENTORYENTRIESOUT_LIST.splice(i,1);
      break;

    default:
      break;
  }

  this.table.renderRows();
  this.particularTable.refreshLedgers();
}

getLedgers(){
  switch (this.service.voucherParentType) {
    case VoucherParentType.Sales:
      return this.service.voucher.LEDGERENTRIES_LIST.filter((l) => l.ISDEEMEDPOSITIVE == "No");
      break;
    case VoucherParentType.Purchase:
      return this.service.voucher.LEDGERENTRIES_LIST.filter((l) => l.ISDEEMEDPOSITIVE == "Yes");
      break;
    case VoucherParentType.Material_Out:
      return this.service.voucher.LEDGERENTRIES_LIST.filter((l) => l.ISDEEMEDPOSITIVE == "No");
      break;

    default:
      break;
  }
}



}
