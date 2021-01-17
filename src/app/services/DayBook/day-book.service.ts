import { Injectable } from '@angular/core';
import { ApiService } from '../API/api.service';
import { BehaviorSubject, from, interval } from 'rxjs';
import { DatabaseService } from '../Database/database.service';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { flatMap } from 'rxjs/operators';
import { AuthenticationService } from '../Authentication/authentication.service';
import { TimePeriod, VoucherDisplay } from 'src/app/model/HelperClass/HelperClass';


@Injectable({
  providedIn: 'root'
})
export class DayBookService {

  vouchers$ = new BehaviorSubject([]);
  cachVouchers$ = new BehaviorSubject([]);
  fromDate: Date = new Date();
  toDate: Date = new Date();
  loading: boolean;

  constructor(private apiService?: ApiService,public auth?: AuthenticationService,
    private databaseService?: DatabaseService, private db?: NgxIndexedDBService) {
    interval(1000)
    .pipe(
        flatMap(() => from(this.getCacheVouchers())
    ))
    .subscribe()


  }


  async getCacheVouchers(){
    this.cachVouchers$.next(await this.db.getAll("cacheVoucher"));
  }


}
