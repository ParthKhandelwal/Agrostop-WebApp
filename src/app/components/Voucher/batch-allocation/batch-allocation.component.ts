import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AgroVoucherService } from '../../../services/AgroVoucher/agro-voucher.service';
import { AuthenticationService } from '../../../services/Authentication/authentication.service';
import { StockService } from '../../../services/Stock/stock.service';
import { SyncService } from '../../../services/Sync/sync.service';
import { Batch } from '../../../model/Batch/batch';
import { ALLINVENTORYENTRIESLIST, BATCHALLOCATIONSLIST, EXPIRYPERIOD } from '../../../model/Voucher/voucher';
import { VoucherParentType } from '../../../model/VoucherType/voucher-type';

@Component({
  selector: 'app-batch-allocation',
  templateUrl: './batch-allocation.component.html',
  styleUrls: ['./batch-allocation.component.css']
})
export class BatchAllocationComponent implements OnInit {
  batch: BATCHALLOCATIONSLIST  = new BATCHALLOCATIONSLIST();

  constructor(public dialogRef?: MatDialogRef<BatchAllocationComponent>,
    @Inject(MAT_DIALOG_DATA) public inventory?: ALLINVENTORYENTRIESLIST,
    public service?: AgroVoucherService,
    public syncService?: SyncService,
    public auth?: AuthenticationService,
    public stockService?: StockService) {

    if(!this.inventory.BATCHALLOCATIONS_LIST){
      this.inventory.BATCHALLOCATIONS_LIST = new BATCHALLOCATIONSLIST();

      switch (this.service.voucherParentType) {
        case VoucherParentType.Sales:
          this.inventory.BATCHALLOCATIONS_LIST.GODOWNNAME = this.service.godown;
          this.godownSelected();
          break;
        case VoucherParentType.Material_Out:
          this.inventory.BATCHALLOCATIONS_LIST.DESTINATIONGODOWNNAME = this.service.voucher.VOUCHERSOURCEGODOWN;
          this.inventory.BATCHALLOCATIONS_LIST.GODOWNNAME = this.service.voucher.VOUCHERDESTINATIONGODOWN;
          this.godownSelected();
          break;
        default:
          break;
      }

    }else if (this.inventory.BATCHALLOCATIONS_LIST.GODOWNNAME){
      this.godownSelected();
    }


  }

  ngOnInit(): void {

  }

  ngAfterViewInit(){

  }

  add(batch){
    this.inventory.BATCHALLOCATIONS_LIST.BATCHNAME = batch.name;
    this.inventory.BATCHALLOCATIONS_LIST.EXPIRYPERIOD = new EXPIRYPERIOD(batch.expiryDate);
      switch (this.service.voucherParentType) {
        case VoucherParentType.Sales:
          this.inventory.AMOUNT = Math.round(this.inventory.RATE * this.inventory.BILLEDQTY*100)/100

          break;
        case VoucherParentType.Purchase:
          this.inventory.AMOUNT =(-1)* Math.round(this.inventory.RATE * this.inventory.BILLEDQTY*100)/100

          break;
        case VoucherParentType.Material_Out:
          this.inventory.RATE = this.stockService.getPurcRate(batch.name, this.inventory.STOCKITEMNAME, this.service.voucher.VOUCHERSOURCEGODOWN);
          this.inventory.AMOUNT = Math.round(this.inventory.RATE * this.inventory.BILLEDQTY*100)/100
          break;
        default:
          break;
      }
      this.inventory.BATCHALLOCATIONS_LIST.ACTUALQTY = this.inventory.ACTUALQTY;
      this.inventory.BATCHALLOCATIONS_LIST.BILLEDQTY = this.inventory.BILLEDQTY;
      this.inventory.BATCHALLOCATIONS_LIST.AMOUNT = this.inventory.AMOUNT;

    this.dialogRef.close(true);
  }

  batches: any[] =[];
  getBatches(){
    if(this.stockService.stock$.getValue() && this.stockService.stock$.getValue().length>0){
      switch (this.service.voucherParentType){
        case VoucherParentType.Sales:
          return this.stockService.stock$.getValue()
                  .filter((s) => s.ITEMNAME == this.inventory.STOCKITEMNAME && s.GODOWN == this.inventory.BATCHALLOCATIONS_LIST.GODOWNNAME)
                  .map((batch) => {
                    console.log(batch)
                    let b: Batch = new Batch(batch.BATCHNAME, batch.EXPIRYDATE ? new Date(batch.EXPIRYDATE):null);
                    b.closingBalance = this.stockService.parseToNumber(batch.QTY)
                    console.log(b)
                    return b;
                  })
                  .sort((a,b) => b.expiryDate.getTime() - a.expiryDate.getTime())
                  .sort((a, b) => b.closingBalance - a.closingBalance);
        case VoucherParentType.Material_Out:
          return this.stockService.stock$.getValue()
                  .filter((s) => s.ITEMNAME == this.inventory.STOCKITEMNAME && s.GODOWN == this.inventory.BATCHALLOCATIONS_LIST.DESTINATIONGODOWNNAME)
                  .map((batch) => {
                    console.log(batch)
                    let b: Batch = new Batch(batch.BATCHNAME, batch.EXPIRYDATE ? new Date(batch.EXPIRYDATE):null);
                    b.closingBalance = this.stockService.parseToNumber(batch.QTY)
                    console.log(b)
                    return b;
                  })
                  .sort((a, b) => b.closingBalance - a.closingBalance);
      }

    }else{
      return this.syncService.products$.getValue().filter((s)=>s.NAME == this.inventory.STOCKITEMNAME)[0].BATCHES;
    }

  }
  @ViewChild("batchField") batchField: ElementRef;

  godownSelected(){
    console.log(this.inventory.BATCHALLOCATIONS_LIST.GODOWNNAME);
      console.log();
    this.batches = this.getBatches();
      setTimeout(() => {
        document.getElementById("batchSelect").focus();
      }, 500);

  }

  dateSelected(value){
    this.inventory.BATCHALLOCATIONS_LIST.EXPIRYPERIOD = new EXPIRYPERIOD(value.value);
    if(this.inventory.BATCHALLOCATIONS_LIST.BATCHNAME){
      switch (this.service.voucherParentType) {
        case VoucherParentType.Sales:
          this.inventory.AMOUNT = Math.round(this.inventory.RATE * this.inventory.BILLEDQTY*100)/100

          break;
        case VoucherParentType.Purchase:
          this.inventory.AMOUNT =(-1)* Math.round(this.inventory.RATE * this.inventory.BILLEDQTY*100)/100

          break;
        case VoucherParentType.Material_Out:
          alert("Batch creation in Material Out voucher is not supported");
          throw new Error("Batch creation in Material Out voucher is not supported");
          break;
        default:
          break;
      }
      this.inventory.BATCHALLOCATIONS_LIST.ACTUALQTY = this.inventory.ACTUALQTY;
      this.inventory.BATCHALLOCATIONS_LIST.BILLEDQTY = this.inventory.BILLEDQTY;
      this.inventory.BATCHALLOCATIONS_LIST.AMOUNT = this.inventory.AMOUNT;
      this.dialogRef.close(true);
    }
  }

}
