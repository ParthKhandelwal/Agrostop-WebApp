import { Injectable } from '@angular/core';
import { NgxIndexedDB } from 'ngx-indexed-db';
import { ApiService } from './api.service';
import { VOUCHER } from '../Model/voucher';

@Injectable({
  providedIn: 'root'
})
export class ReceiptService {

  db = new NgxIndexedDB('agrostop', 1);
  public ledgerPercent: number = 100;
  public upSyncPercent: number = 100;
  constructor(private apiService?: ApiService) {
    this.openDatabase();
   }

  async openDatabase(): Promise<any>{
    return  this.db.openDatabase(1, evt => {
      let objectStore = evt.currentTarget.result.createObjectStore('cacheVoucher', { keyPath: "VOUCHERNUMBER",autoIncrement: false, unique:true });
      let objectStore4 = evt.currentTarget.result.createObjectStore('Ledgers', {keyPath: "NAME",autoIncrement: false, unique: true });     
      //objectStore.createIndex('name', 'name', { unique: false });
      //objectStore.createIndex('email', 'email', { unique: true });
    })
  }

  saveLedgers(){
    this.ledgerPercent = 0;
    this.apiService.getLedgerByGroup("Indirect Expenses").subscribe(
      (res: any[]) =>{
        const len: number = res.length;
        var index: number = 0;
        for (let item of res){
          this.apiService.getLedger(item).subscribe(
            r => {
              if (r.ENVELOPE != null){
              var re = r.ENVELOPE.BODY.DATA.TALLYMESSAGE.LEDGER;
               this.db.update("Ledgers", re).then(
                 res => {
                   index++;
                   this.ledgerPercent = Math.round((index/len)*100)
                 }
               );
              }
            },
            e => {
              console.log(e);
            }
          );
        }
        
          
      },
      err =>{
        console.log(err);
      }
    )
  }

  public getLedgers(): Promise<any>{
    return this.db.getAll("Ledgers");
  }

  saveClass(voucherType: any){
     sessionStorage.setItem("receiptClass", JSON.stringify(voucherType));
  }

  
  getPaymentClass(): any {
    return JSON.parse(sessionStorage.getItem("receiptClass"));
  }

  public saveVoucherType(voucherType: any){
    sessionStorage.setItem("receiptVoucherType", JSON.stringify(voucherType));
  }

  getVoucherType(): any {
    return JSON.parse(sessionStorage.getItem("receiptVoucherType"));
  }

  async addCacheVoucher(voucher: VOUCHER): Promise<any>{
    console.log(voucher);
        return this.db.update('cacheVoucher', voucher);
    
  }

  syncAllCacheVouchers(){
    this.upSyncPercent = 0;
    this.db.getAll('cacheVoucher').then(
      (vouchers: any[]) => {
        if (vouchers == null || vouchers.length == 0){
          this.upSyncPercent = 100;
        }
        const length: number = vouchers.length;
        var index: number = 0;
        for (let voucher of vouchers){
          this.apiService.saveTallyVoucher(voucher).subscribe(
            res => {
              console.log('Voucher saved Successfully');
              index++;
              this.upSyncPercent = Math.round((index/length)* 100);
              this.db.delete('cacheVoucher', voucher.VOUCHERNUMBER).then(
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
              alert("Voucher could not be saved");  
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
