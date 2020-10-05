import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../services/API/api.service';
import { StockService } from '../../services/Stock/stock.service';
import { BatchTableComponent } from '../AgroComponents/batch-table/batch-table.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-stock-summary',
  templateUrl: './stock-summary.component.html',
  styleUrls: ['./stock-summary.component.css']
})
export class StockSummaryComponent implements OnInit {
  loading:boolean = false;
  stock: any[];
  negative: any[];
  expiry: any[];
  soonToBeExpiry: any[];
  flatStock: any[] = [];
  sub : Subscription;
  constructor(private apiService?: ApiService, private stockService?: StockService) {
   }

  ngOnInit(): void {



  }
  ngAfterViewInit(){

    this.sub = this.stockService.stock$.subscribe(
                   res => {
                     console.log(res)
                     this.negativeTable.setBatch(this.stockService.getNegativeBatches());
                     this.expiryTable.setBatch(this.stockService.getExpiryBatches());
                     this.soonToBeExpiryTable.setBatch(this.stockService.getSoonToBeExpiredBatches());
                     this.flatStockTable.setBatch(this.stockService.getFlatStock());
                   }
                 )
  }

  @ViewChild("negativeTable", {static: false}) negativeTable: BatchTableComponent;
  @ViewChild("expiryTable", {static: false}) expiryTable: BatchTableComponent;
  @ViewChild("soonToBeExpiryTable", {static: false}) soonToBeExpiryTable: BatchTableComponent;
  @ViewChild("flatStockTable", {static: false}) flatStockTable: BatchTableComponent;


  ngOnDestroy(){
    this.sub.unsubscribe()
  }

}
