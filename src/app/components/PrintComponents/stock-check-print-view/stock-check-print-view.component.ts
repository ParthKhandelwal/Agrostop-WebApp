import { Component, OnInit, Inject, Input, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { StockCheck, StockItem, StockCheckItem } from '../../../model/StockItem/stock-item';
import { StockService } from '../../../services/Stock/stock.service';
import { SyncService } from '../../../services/Sync/sync.service';
import { AuthenticationService } from '../../../services/Authentication/authentication.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ApiService } from '../../../services/API/api.service';

@Component({
  selector: 'app-stock-check-print-view',
  templateUrl: './stock-check-print-view.component.html',
  styleUrls: ['./stock-check-print-view.component.css']
})
export class StockCheckPrintViewComponent implements OnInit {
  priceLevel: string;
  printReady: boolean;
  totalNegativeBalance: number = 0;
  totalPositiveBalance: number = 0;
  totalBalance: number = 0;
  purchaseAmount: number = 0;
  @Input("check") currentCheck: StockCheck;
  constructor(public stockService?: StockService, public syncService?: SyncService, public auth?: AuthenticationService, public apiService?: ApiService) { }

  ngOnInit(): void {
    let stock = this.stockService.stock$.getValue().filter((v) => v.GODOWN === this.currentCheck.godown);
    for (let item of stock) {
      if (!this.itemExists(item.ITEMNAME)) {
        let checkItem: StockCheckItem = new StockCheckItem();
        checkItem.itemName = item.ITEMNAME;
        checkItem.actualQty = 0;
        checkItem.expectedQty = this.stockService.getTotalClosingBalance(item.ITEMNAME, this.currentCheck.godown);
        this.currentCheck.items.push(checkItem);
      }
    }
    this.dataSource = new MatTableDataSource(this.currentCheck.items);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  itemExists(itemName: string) {
    return this.currentCheck.items.findIndex((v) => v.itemName === itemName) > -1;
  }

  date: Date = new Date();
  adjust() {

    if(confirm("Are you sure you wish to adjust the expected quantity?")){

      this.apiService.getStockSummary(this.date, this.date).subscribe(
        (res: any[]) => {
          var tempArr = res.map((v) => {
            v.BATCHES = v.BATCHES.map((batch) => {
              batch.ITEMNAME = v.ITEMNAME;
              return batch;
            })
            return v.BATCHES;
          })
          console.log(tempArr);
          let stock = [];
          stock = [].concat.apply([], tempArr).filter((v) => {

            return this.auth.user.godownList.includes(v.GODOWN);
          })
          console.log(stock);
          for (let item of this.currentCheck.items) {
            item.expectedQty = this.getTotalClosingBalance(stock, item.itemName, this.currentCheck.godown);
            this.apiService.saveStockCheckItem(this.currentCheck.id, item).subscribe(
              res => {
                console.log("done");
              }
            )
          }
        },
        err => { console.log(err) }
      )

    }

  }


  getTotalClosingBalance(stock: any[], NAME: string, godown: string): number {
    let temp = stock.filter((v) => v.ITEMNAME === NAME && v.GODOWN === godown);
    let total = 0;
    for (let item of temp) {
      total = total + this.stockService.parseToNumber(item.QTY);
    }
    return total;
  }

  print() {
    this.printReady = true;
    //this.electron.ipcRenderer.send("print");
  }




  getPrice(item: string): number {
    if (this.priceLevel) {
      let temp = this.syncService.products$.getValue().filter((v) => v.NAME === item)[0];
      if (temp) {
        let stockItem: StockItem = Object.assign(new StockItem(), temp);

        let amount: number = stockItem.getRateInclusiveOfTax(stockItem.getRate(this.priceLevel), "");
        return amount;
      }
    } else {
      return this.getPurchaseRate(item);
    }

    return 0;
  }

  getAmount(item: StockCheckItem): number {
    let price = this.getPrice(item.itemName) ? this.getPrice(item.itemName) : 0;
    return price * (item.actualQty - item.expectedQty)
  }

  totalBalanceAmount() {
    this.totalBalance = 0
    this.totalPositiveBalance = 0
    this.totalNegativeBalance = 0
    this.purchaseAmount = 0
    for (let item of this.currentCheck.items) {
      if (this.getAmount(item) > 0) {
        this.totalPositiveBalance = this.totalPositiveBalance + this.getAmount(item);
        this.totalBalance = this.totalBalance + this.getAmount(item);
        this.purchaseAmount = this.purchaseAmount + this.getPurchaseAmount(item);

      } else if (this.getAmount(item) < 0) {
        this.totalNegativeBalance = this.totalNegativeBalance + this.getAmount(item);
        this.totalBalance = this.totalBalance + this.getAmount(item);
        this.purchaseAmount = this.purchaseAmount + this.getPurchaseAmount(item);

      }
      //this.totalBalance = this.totalBalance +  this.getAmount(item);
    }
    this.totalPositiveBalance = Math.round(this.totalPositiveBalance * 100) / 100;
    this.totalNegativeBalance = Math.round(this.totalNegativeBalance * 100) / 100;
    this.totalBalance = Math.round(this.totalBalance * 100) / 100;

  }


  getPurchaseRate(itemName): number {
    return this.stockService.getPurchaseRateWithoutBatch(itemName, this.currentCheck.godown);
  }


  getPurchaseAmount(item): number {
    return this.stockService.getPurchaseRateWithoutBatch(item.itemName, this.currentCheck.godown) * (item.actualQty - item.expectedQty);
  }


  displayedColumns: string[] = ['sno', 'itemName', 'actualQty', 'expectedQty', 'balance', 'rate', 'balanceAmt', 'user', 'date'];

  dataSource: MatTableDataSource<StockCheckItem>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
