import { Injectable } from '@angular/core';
import { ApiService } from '../API/api.service';
import { BehaviorSubject, interval } from 'rxjs';
import { flatMap,  startWith } from 'rxjs/operators';
import { AuthenticationService } from '../Authentication/authentication.service';



@Injectable({
  providedIn: 'root'
})
export class StockService {

  stock$ = new BehaviorSubject([]);
  loading: boolean= false;

  constructor(private apiService?: ApiService, private auth?: AuthenticationService) {

    this.getStock();
  }

  getStock() {
    this.loading = true
    this.apiService.getAllBatches().subscribe(
      batches => {


        interval(30* 60 *1000)
          .pipe(
            startWith(0),
            flatMap(() => this.apiService.getStockSummary(new Date(), new Date())
            ))
          .subscribe((res: any[]) => {
            var tempArr = res.map((v) => {
              v.BATCHES = v.BATCHES.map((batch) => {
                batch.ITEMNAME = v.ITEMNAME;
                let tempBatch = batches.filter((b) => b.productId === batch.ITEMNAME && b.name === batch.BATCHNAME)[0];
                if (tempBatch) {
                  batch.EXPIRYDATE = tempBatch.expiryDate ? new Date(tempBatch.expiryDate) : null;
                }
                return batch;
              })
              return v.BATCHES;
            })
            this.stock$.next([].concat.apply([], tempArr).filter((v) => this.auth.user.godownList.includes(v.GODOWN)));

            this.loading = false



          })
      },
      err => console.log(err)
    )

  }


 getStockFromDate(){

 }

  getNegativeBatches(): any[] {
    return this.stock$.getValue().filter((v) => {
      let value = +this.parseToNumber(v.QTY)
      return value < 0
    }).sort((a, b) => this.parseToNumber(a.QTY) - this.parseToNumber(b.QTY))

  }

  getExpiryBatches(): any[] {
    return this.stock$.getValue().filter((v) => {
      return v.EXPIRYDATE && v.EXPIRYDATE < new Date() && this.parseToNumber(v.QTY) > 0
    }).sort((a, b) => a.EXPIRYDATE && b.EXPIRYDATE ? a.EXPIRYDATE.getTime() - b.EXPIRYDATE.getTime() : 0)

  }

  getSoonToBeExpiredBatches(): any[] {
    return this.stock$.getValue().filter((v) => {
      return v.EXPIRYDATE && v.EXPIRYDATE > new Date() && v.EXPIRYDATE < new Date(new Date().getTime() + 90 * 24 * 60 * 60 * 1000) && this.parseToNumber(v.QTY) > 0
    }).sort((a, b) => a.EXPIRYDATE && b.EXPIRYDATE ? a.EXPIRYDATE.getTime() - b.EXPIRYDATE.getTime() : 0)

  }

  getFlatStock(): any[] {
    var stockGrouped: any[] = []
    var that = this
    this.stock$.getValue().reduce(function (res, value) {
      if (!res[value.ITEMNAME + value.GODOWN]) {
        res[value.ITEMNAME + value.GODOWN] = { ID: value.ITEMNAME + value.GODOWN, GODOWN: value.GODOWN, ITEMNAME: value.ITEMNAME, QTY: 0 };
        stockGrouped.push(res[value.ITEMNAME + value.GODOWN])
      }
      res[value.ITEMNAME + value.GODOWN].QTY += that.parseToNumber(value.QTY);
      return res;
    }, {});
    return stockGrouped;
  }


  public parseToNumber(str): number {
    if(str){
      var value = str
      .replace(/[^0-9.-]/g, '')       // remove chars except number, hyphen, point.
      .replace(/(\..*)\./g, '$1')     // remove multiple points.
      .replace(/(?!^)-/g, '')         // remove middle hyphen.
      .replace(/^0+(\d)/gm, '$1');

    return value * (1);
    }else{
      return 0;
    }

  }

  getClosingBalance(batch:string, productId: string, godown: string): number{
    let temp = this.stock$.getValue().filter((v) => v.BATCHNAME === batch && v.ITEMNAME === productId && v.GODOWN === godown)[0];
    if(temp){
      return this.parseToNumber(temp.QTY)
    }else{
      return 0
    }

  }
  getTotalClosingBalance(NAME: string, godown: string): number {
    let temp = this.stock$.getValue().filter((v) => v.ITEMNAME === NAME && v.GODOWN === godown);
    let total = 0;
    for(let item of temp){
      total = total + this.parseToNumber(item.QTY);
    }
    return total;
  }

  getPurcRate(batch:string, productId: string, godown: string): number{
    let temp = this.stock$.getValue().filter((v) => v.BATCHNAME === batch && v.ITEMNAME === productId && v.GODOWN === godown)[0];
    if(temp){
      return this.parseToNumber(temp.RATE)
    }else{
      return 0
    }

  }

  getPurchaseRateWithoutBatch(productId: string, godown: string){
    let temp = this.stock$.getValue().filter((v:any) => v.RATE != null && v.ITEMNAME === productId && v.GODOWN === godown)[0];
    if(temp){
      return this.parseToNumber(temp.RATE)
    }else{
      return 0
    }
  }
}
