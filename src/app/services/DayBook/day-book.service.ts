import { Injectable } from '@angular/core';
import { ApiService } from '../API/api.service';
import { BehaviorSubject, from, interval } from 'rxjs';
import { DatabaseService } from '../Database/database.service';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { flatMap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class DayBookService {

  vouchers$ = new BehaviorSubject([]);
  cachVouchers$ = new BehaviorSubject([]);
  fromDate: Date = new Date();
  toDate: Date = new Date();
  loading: boolean;

  constructor(private apiService?: ApiService,private databaseService?: DatabaseService, private db?: NgxIndexedDBService) {
    interval(1000)
    .pipe(
        flatMap(() => from(this.getCacheVouchers())
    ))
    .subscribe()


  }


  async getCacheVouchers(){
    this.cachVouchers$.next(await this.db.getAll("cacheVoucher"));
  }

  getOnlineVouchers() {
    this.loading = true;
    this.apiService.getVouchers(this.fromDate, this.toDate)
      .subscribe((res) => {
        let vouchers = res
          .sort((a, b) => new Date(a.DATE).getTime() - new Date(b.DATE).getTime())
          .sort((a,b) => a.VOUCHERNUMBER> b.VOUCHERNUMBER ? 1:-1)
          .map(res => {
            if (res.BASICBUYERNAME) {
              this.databaseService.getCustomer(res.BASICBUYERNAME).then(
                (customer) => {
                  res.CUSTOMERNAME = customer ? customer.name : res.BASICBUYERNAME;

                  if (customer && customer.addressId) {
                    this.databaseService.getAddress(customer.addressId).then(
                      (address: any) => {
                        res.CUSTOMERADDRESS = address ? address.name : res.ADDRESS;
                      }
                    )

                  }
                }
              );
            }


            return res;
          });
        this.vouchers$.next(vouchers);
        this.loading = false;

      },
      err => {
        console.log(err);
        alert(err);
        this.loading = false;
      }
      )
  }




}
