import { Injectable } from '@angular/core';
import { NgxIndexedDB } from 'ngx-indexed-db';
import { TallyVoucher } from '../Model/tally-voucher';
import { ApiService } from './api.service';
import { VOUCHER } from '../Model/voucher';
import { User } from '../Model/user';
import { CookieService } from 'ngx-cookie-service';


@Injectable({
  providedIn: 'root'
})
export class PosService {

  db = new NgxIndexedDB('agrostop', 1);
  posModeEnabled: boolean = false;
  products: any[];
  cacheVouchers: VOUCHER[];

  constructor(private apiService?: ApiService, private cookie?: CookieService) {
    this.db.openDatabase(1, evt => {
    let objectStore = evt.currentTarget.result.createObjectStore('cacheVoucher', { keyPath: "VOUCHERNUMBER",autoIncrement: true });
    let objectStore2 = evt.currentTarget.result.createObjectStore('items', { keyPath: "_NAME",autoIncrement: true, unique: true });
    let objectStore3 = evt.currentTarget.result.createObjectStore('customers', {keyPath: "_id.counter",autoIncrement: true, unique: true });

    //objectStore.createIndex('name', 'name', { unique: false });
    //objectStore.createIndex('email', 'email', { unique: true });
});
   }

  enablePOSMode(){
    if (!this.posModeEnabled){
      this.posModeEnabled = true;
      //this.db.clear("agrostop");
      this.saveUserOffline();
      this.saveItems();
      this.saveCustomers();
    }
  }

getItems(): Promise<any>{


 return  this.db.getAll("items");
}

getCustomers(): Promise<any>{
 return this.db.getAll("customers");
}

  saveItems(){
    this.apiService.getAllStockItemsForBilling().subscribe(
      res =>{
          console.log(res);
          for(var i = 0; i < res.length; i++){
          this.db.update("items",res[i]);
        }
      },
      err =>{
        console.log(err);
      }
    )
  }

  saveCustomers(){
    this.apiService.getCustomers().subscribe(
      res =>{

          for(var i = 0; i < res.length; i++){
          this.db.update("customers",res[i]);
        }
      },
      err =>{
        console.log(err);
      }
    )
  }

  addCacheVoucher(voucher: VOUCHER): Promise<any>{
    return this.db.add('cacheVoucher', voucher);
  }

countCacheVoucher(): number{
  this.db.count('cacheVoucher').then(
    voucherCount => {
    return voucherCount;
    },
    error => {
      console.log(error);
    }
  );
  return 0;
}

  getUser(): User{
    let user: User = JSON.parse(this.cookie.get("User"));
    return user;
  }

  getAllCacheVouchers(): Promise<any>{
    return this.db.getAll('cacheVoucher');
  }

  saveUserOffline(){
    this.apiService.getCurrentUser().subscribe(
      res => {
        this.cookie.set("User", JSON.stringify(res));
      },
      err =>{
        alert("POS Service cannot start. Please contact Admin.")
      }
    );
  }

  syncAllCacheVouchers(){
    this.db.getAll('cacheVoucher').then(
      vouchers => {
        for (let voucher of vouchers){
          this.apiService.saveTallyVoucher(voucher).subscribe(
            res => {
              console.log('Voucher saved Successfully');
              this.db.delete('cacheVoucher', voucher.customVoucherDetails.voucherNumber).then(
                  () => {
                    // Do something after delete
                  },
                  error => {
                    console.log(error);
                  }
                );
            },
            err => {
              console.log('Voucher could not be saved');
            }
          );

        }
      },
      err =>{
        alert ("Error ocurred")
      }
    );
  }

}
