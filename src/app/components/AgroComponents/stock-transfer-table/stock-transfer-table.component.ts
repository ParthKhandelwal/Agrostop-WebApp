import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/API/api.service';
import { INVENTORYENTRIESIN_LIST } from '../../../model/Voucher/voucher';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { InvoicePrintViewComponent } from '../../invoice-print-view/invoice-print-view.component';

@Component({
  selector: 'stock-transfer-table',
  templateUrl: './stock-transfer-table.component.html',
  styleUrls: ['./stock-transfer-table.component.css']
})
export class StockTransferTableComponent implements OnInit {


  displayedColumns = ['date', 'item', 'godown', 'qty', 'rate', 'action']
  items: INVENTORYENTRIESIN_LIST[];

  constructor(private apiService? : ApiService,  private dialog?: MatDialog) { }

  ngOnInit(): void {
    this.revisit();
  }

  public revisit(){
    this.apiService.getStockTransfers().subscribe(
      res => {

        this.items = res;
      }
    )
  }

  verify(e){
    this.apiService.verifyInventoryIN(e.remoteId, e.agroId).subscribe(
      res => {
        alert("Product verified successfully");
        this.revisit();
      }
    )
  }

  reject(e){
    if(confirm("Are you sure you want to reject stock transfer of "+e.STOCKITEMNAME)){
      this.apiService.rejectInventoryIN(e.agroId).subscribe(
        res => {

          this.revisit();
        }
      )
    }

  }
  delete(e){
    if(confirm("Are you sure you want to delete stock transfer of "+e.STOCKITEMNAME)){
      this.apiService.deleteInventoryIN(e.agroId).subscribe(
        res => {

          this.revisit();
        }
      )
    }

  }

  print(id){
    this.apiService.getMaterialVoucher(id.remoteId).subscribe(
      res => {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.autoFocus = true;
        dialogConfig.width = "50%";
        const dialogRef = this.dialog.open(InvoicePrintViewComponent, {data: res, maxHeight: '90vh'});

      },
      err => {
        console.log(err);
      }
    )

  }
}
