import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from 'src/app/services/API/api.service';

@Component({
  selector: 'app-stock-transfer-comparison',
  templateUrl: './stock-transfer-comparison.component.html',
  styleUrls: ['./stock-transfer-comparison.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class StockTransferComparisonComponent implements OnInit {

  fromDate: Date = new Date();
  toDate:Date = new Date();
  datasource: MatTableDataSource<any>;
  columnsToDisplay = ["vouchernumber", "sourcegodown","destinationgodown" ]
  displayedColumns = ["itemname", "transferqty", "billedqty", "verified", "action"]
  expandedElement : any|null;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private apiService?: ApiService) { }

  ngOnInit(): void {

  }


  fetch(){
    this.getData().subscribe(
      res => {
        this.datasource = res;
        this.datasource.paginator = this.paginator;
        this.datasource.sort = this.sort;
      }
    )
  }

  getData(): Observable<MatTableDataSource<any>>{
    return this.apiService.getStockComparison(this.fromDate, this.toDate).pipe(
      map(
        data => {

          data.forEach((d) => {
            let arr = [];
            d.match = true;
            for(let i of d.transferEntries){
              let temp: any = {};
              
              temp.itemname = i.stockitemname;
              temp.transferqty = i.billedqty;
              temp.billedqty = this.getBilledQty(d.voucherEntries, i.stockitemname);
              temp.verified = i.verified;
              temp.match = (temp.billedqty ==temp.transferqty);
              temp.remoteId = i.remoteId;
              temp.agroId = i.agroId;
              d.match = d.match && (temp.billedqty ==temp.transferqty)
              arr.push(temp);
            }
            d.data = arr;

            console.log(d.data);
          })
          return new MatTableDataSource(data);
        }
      )
    );
  }

  getBilledQty(voucherEntries: any[], name: string){
    if(!voucherEntries){
      return 0;
    }
    var arr: any [] = voucherEntries.filter((k) => k.stockitemname==name);
    if(arr && arr.length != 0){
      return arr[0].actualqty;
    }
    return 0;

  }

  reset(element){
    this.apiService.resetVoucher(element.id)
  }

  verify(row){
    console.log(row);
    this.apiService.verifyInventoryIN(row.remoteId, row.agroId).subscribe(
      res => {
        alert("Verified Successfully")
      },
      err => {
        console.log(err);
        alert("Error ocurred");
      }
    )
  }

}
