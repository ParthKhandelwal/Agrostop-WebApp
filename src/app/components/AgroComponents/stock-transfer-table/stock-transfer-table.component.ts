import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/API/api.service';
import { INVENTORYENTRIESIN_LIST, VOUCHER } from '../../../model/Voucher/voucher';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { InvoicePrintViewComponent } from '../../invoice-print-view/invoice-print-view.component';
import { AgroVoucherService } from 'src/app/services/AgroVoucher/agro-voucher.service';
import { AuthenticationService } from 'src/app/services/Authentication/authentication.service';
import { Router } from '@angular/router';
import { VoucherParentType } from 'src/app/model/VoucherType/voucher-type';
import { InventoryEntryINComponent } from '../../Voucher/inventory-entry-in/inventory-entry-in.component';

@Component({
  selector: 'stock-transfer-table',
  templateUrl: './stock-transfer-table.component.html',
  styleUrls: ['./stock-transfer-table.component.css']
})
export class StockTransferTableComponent implements OnInit {


  displayedColumns = ['date', 'item', 'godown', 'qty', 'rate', 'action']
  items: INVENTORYENTRIESIN_LIST[];
  loading: boolean = false;

  constructor(private apiService? : ApiService,  private dialog?: MatDialog, private service?: AgroVoucherService, public auth?: AuthenticationService, private router?: Router) { }

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
    e.verifying = true;
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
  edit(id){
    const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = true;
      dialogConfig.width = "50%";
      const dialogRef = this.dialog.open(InventoryEntryINComponent , {data: id});
      dialogRef.afterClosed().subscribe(
        res => {
          if(res){
            this.revisit();
          }
        }
      )
  }
}
