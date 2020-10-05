import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AgroVoucherService } from '../../../services/AgroVoucher/agro-voucher.service';
import { SyncService } from '../../../services/Sync/sync.service';
import { StockItem } from '../../../model/StockItem/stock-item';
import { ACCOUNTINGALLOCATIONSLIST, ALLINVENTORYENTRIESLIST } from '../../../model/Voucher/voucher';
import { VoucherParentType } from '../../../model/VoucherType/voucher-type';

@Component({
  selector: 'app-accounting-allocation',
  templateUrl: './accounting-allocation.component.html',
  styleUrls: ['./accounting-allocation.component.css']
})
export class AccountingAllocationComponent implements OnInit {
  accountingAllocation: ACCOUNTINGALLOCATIONSLIST = new ACCOUNTINGALLOCATIONSLIST();
  constructor(public dialogRef?: MatDialogRef<AccountingAllocationComponent>,
    @Inject(MAT_DIALOG_DATA) public inventory?: ALLINVENTORYENTRIESLIST,
    public service?: AgroVoucherService,
    public syncService?: SyncService) {
    if(!inventory.ACCOUNTINGALLOCATIONS_LIST){
      inventory.ACCOUNTINGALLOCATIONS_LIST = new ACCOUNTINGALLOCATIONSLIST();
      switch (service.voucherParentType) {
        case VoucherParentType.Sales:
          let stockItem: StockItem = syncService.products$.getValue().filter((s)=> s.NAME == inventory.STOCKITEMNAME)[0];
          if(stockItem && stockItem.salesList && stockItem.salesList[0]){
            inventory.ACCOUNTINGALLOCATIONS_LIST.LEDGERNAME = stockItem.salesList[0].NAME;
            inventory.ACCOUNTINGALLOCATIONS_LIST.CLASSRATE = stockItem.salesList[0].CLASSRATE;
            inventory.ACCOUNTINGALLOCATIONS_LIST.LEDGERFROMITEM = stockItem.salesList[0].LEDGERFROMITEM;
            inventory.ACCOUNTINGALLOCATIONS_LIST.GSTOVRDNNATURE = stockItem.salesList[0].GSTCLASSIFICATIONATURE;
            inventory.ACCOUNTINGALLOCATIONS_LIST.REMOVEZEROENTRIES = stockItem.salesList[0].REMOVEZEROENTRIES;
            inventory.ACCOUNTINGALLOCATIONS_LIST.LEDGERFROMITEM = "Yes"
            inventory.ACCOUNTINGALLOCATIONS_LIST.ISDEEMEDPOSITIVE = "No"
            dialogRef.close(true);
          }

          break;
        case VoucherParentType.Purchase:
          inventory.ACCOUNTINGALLOCATIONS_LIST.ISDEEMEDPOSITIVE = "Yes";
          break;
        case VoucherParentType.Material_Out:

          break;

        default:
          break;
      }
    }
    inventory.ACCOUNTINGALLOCATIONS_LIST.AMOUNT = inventory.AMOUNT;

  }

  ngOnInit(): void {
  }

  ledgerSelected(value){
    this.inventory.ACCOUNTINGALLOCATIONS_LIST.LEDGERNAME = value.NAME;
    document.getElementById("accAmount").focus();
  }

}
