import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { StockItem } from 'src/app/model/StockItem/stock-item';
import { INVENTORYENTRIESIN_LIST } from 'src/app/model/Voucher/voucher';
import { ApiService } from 'src/app/services/API/api.service';
import { SyncService } from 'src/app/services/Sync/sync.service';
import { BatchAllocationComponent } from '../batch-allocation/batch-allocation.component';

@Component({
  selector: 'app-inventory-entry-in',
  templateUrl: './inventory-entry-in.component.html',
  styleUrls: ['./inventory-entry-in.component.scss']
})
export class InventoryEntryINComponent implements OnInit {
  stockItem: StockItem;

  constructor(public dialogRef: MatDialogRef<InventoryEntryINComponent>,
    private apiService?: ApiService, private sync?: SyncService,
    @Inject(MAT_DIALOG_DATA) public item?: INVENTORYENTRIESIN_LIST, private dialog?: MatDialog,) { }

  ngOnInit(): void {
    this.stockItem = Object.assign(new StockItem(),this.sync.products$.getValue().filter((res) => res.NAME === this.item.STOCKITEMNAME)[0]);
    this.item = Object.assign(new INVENTORYENTRIESIN_LIST(), this.item)
    this.item.rejected = false;
    this.item.verified = false;
  }

  showBatchAllocation(){
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
                if(this.item instanceof INVENTORYENTRIESIN_LIST){
                  this.item.AMOUNT = this.item.BATCHALLOCATIONS_LIST.AMOUNT;
                  this.apiService.saveInventoryIn(this.item).subscribe(
                    res => {
                      this.dialogRef.close(true);
                    },
                    err => {
                      alert("Could not complete the edit. Please try again later");
                    }
                  )
                }
             
          }
  
  
  
        }
      )

  }
  setRateInclusiveOfTax(){
    if(this.stockItem){
      return this.stockItem.getRateInclusiveOfTax(this.item.RATE, "")
  
    }else{
      return 0;
    }
  }

}
