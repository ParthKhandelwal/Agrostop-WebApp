import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '../../../services/API/api.service';
import { StockService } from '../../../services/Stock/stock.service';
import { Batch } from '../../../model/Batch/batch';
import { EXPIRYPERIOD } from '../../../model/Voucher/voucher';
import * as _ from "lodash";

@Component({
  selector: 'app-batch-transfer',
  templateUrl: './batch-transfer.component.html',
  styleUrls: ['./batch-transfer.component.css']
})
export class BatchTransferComponent implements OnInit {
  batches: any[];
  constructor(public apiService?: ApiService, public stockService?: StockService) { }

  ngOnInit(): void {

  }
  productId: string;
  selectInventory(value){
    this.productId = value.NAME;
    this.batches = this.stockService.stock$.getValue().filter(
      (v) => v.ITEMNAME == value.NAME
    );
    this.batches = _(this.batches).groupBy(x => x.BATCHNAME)
                                  .map(x => {
                                    let total = 0;
                                    x.forEach(element => {
                                      total += this.stockService.parseToNumber(element.QTY);
                                    });
                                    return {BATCHNAME: x[0].BATCHNAME, QTY : total, EXPIRYDATE:x[0].EXPIRYDATE, PRODUCTID: x[0].ITEMNAME}
                                  })
                                  .value();
    console.log(this.batches);
  }

  batchSelected(value){
    this.apiService.getBatchVoucher(value.PRODUCTID, value.BATCHNAME).subscribe(
      res => {
        res = res.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime() )
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    )
  }
  total: number = 0;
  getTotal(){
    this.total = 0;
    for(let item of this.dataSource.data){
      if(item.select){
        this.total += item.qty
      }
    }

  }


  displayedColumns: string[] = ['date', 'vouchernumber', 'batch', 'godown','qty','select'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

 getSelectedIds(): string[]{
   return this.dataSource.data.filter(
     (r) => r.select
   ).map((r) => r.id)
 }

  updatedBatch: Batch;
  prevBatch: Batch;
  proceedUpdate(){
    let item : any = {
      prevBatch: this.prevBatch.name,
      updatedBatch: this.updatedBatch.name,
      ids: this.getSelectedIds(),
      period: new EXPIRYPERIOD(this.updatedBatch.expiryDate? new Date(this.updatedBatch.expiryDate): null),
      productId: this.prevBatch.productId
    }
    this.apiService.updateBatchVoucher(item).subscribe(
      res => {
        alert("Batches transferred successfully");
      }
    )
  }



}
