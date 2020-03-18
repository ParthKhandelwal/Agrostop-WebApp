import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { NgxIndexedDB } from 'ngx-indexed-db';
import { User } from '../Model/user';
import { VOUCHER } from '../Model/voucher';
import { ApiService } from './api.service';



@Injectable({
  providedIn: 'root'
})
export class PosService {

  user: User;
  databaseCreated: boolean = false;
  database: Promise<any>;
  db = new NgxIndexedDB('agrostop', 1);
  posModeEnabled: boolean = false;
  products: any[];
  cacheVouchers: VOUCHER[];

  constructor(private apiService?: ApiService, private cookie?: CookieService) {
    this.database = this.db.openDatabase(1, evt => {
      let objectStore = evt.currentTarget.result.createObjectStore('cacheVoucher', { keyPath: "VOUCHERNUMBER",autoIncrement: false, unique:true });
      let objectStore2 = evt.currentTarget.result.createObjectStore('items', { keyPath: "NAME",autoIncrement: false, unique: true });
      let objectStore3 = evt.currentTarget.result.createObjectStore('customers', {keyPath: "_id.counter", autoIncrement: false, unique: true });
      let objectStore4 = evt.currentTarget.result.createObjectStore('Ledgers', {keyPath: "NAME",autoIncrement: false, unique: true });
      let objectStore5 = evt.currentTarget.result.createObjectStore('Batches', {keyPath: "id",autoIncrement: false, unique: true });
     
      //objectStore.createIndex('name', 'name', { unique: false });
      //objectStore.createIndex('email', 'email', { unique: true });
    })
  }

  async openDatabase(): Promise<any>{
    return this.database = this.db.openDatabase(1, evt => {
      let objectStore = evt.currentTarget.result.createObjectStore('cacheVoucher', { keyPath: "VOUCHERNUMBER",autoIncrement: false, unique:true });
      let objectStore2 = evt.currentTarget.result.createObjectStore('items', { keyPath: "NAME",autoIncrement: false, unique: true });
      let objectStore3 = evt.currentTarget.result.createObjectStore('customers', {keyPath: "_id.counter", autoIncrement: false, unique: true });
      let objectStore4 = evt.currentTarget.result.createObjectStore('Ledgers', {keyPath: "NAME",autoIncrement: false, unique: true });
      let objectStore5 = evt.currentTarget.result.createObjectStore('Batches', {keyPath: "id",autoIncrement: false, unique: true });
     
      //objectStore.createIndex('name', 'name', { unique: false });
      //objectStore.createIndex('email', 'email', { unique: true });
    })
  }
  

  enablePOSMode(){
      this.saveItems();
      this.saveCustomers();
      this.saveLedgers();
       
  }

  getItems(): Promise<any>{
  return  this.db.getAll("items");
  }

  async getCustomers():Promise<any[]>{
  return  await this.db.getAll("customers");
  }

   saveItems(){
     this.apiService.getAllStockItemsForBilling().subscribe(
       res =>{
          
          for (let item of res){
            
           this.apiService.getStockItem(item).subscribe(
               (result) => {
                if ((result && result.ENVELOPE && result.ENVELOPE.BODY && result.ENVELOPE.BODY.DATA
                  && result.ENVELOPE.BODY.DATA.TALLYMESSAGE && result.ENVELOPE.BODY.DATA.TALLYMESSAGE.STOCKITEM)){
                     this.db.update("items",result.ENVELOPE.BODY.DATA.TALLYMESSAGE.STOCKITEM).then(
                      res => console.log("Saved Item")
                    )
                }
              }
            )
             this.apiService.getProductBatch(item).subscribe(
               r => {
                 if (r != null && r instanceof Array){
                   for (let re of r){
                     re.productId = item;
                     this.db.update("Batches",re);
                   }
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

 async getAllStockItemsForBilling(): Promise<any[]>{
   
  return await this.db.getAll("items");
  }

  getStockItem(str: string): Promise<any>{
    return this.db.getByKey("items", str);
  }


  saveVoucherType(voucherType: any){
    sessionStorage.setItem("voucherType", JSON.stringify(voucherType));
  }

  getVoucherType(): any {
    return JSON.parse(sessionStorage.getItem("voucherType"));
  }

  savePriceList(str: string){
    sessionStorage.setItem("priceList", str);
  }

  getPriceList(): string{
    return sessionStorage.getItem("priceList");
  }

  saveGodown(str: string){
    sessionStorage.setItem("godown", str);
  }

  getGodown(): string{
    return sessionStorage.getItem("godown");
  }

  savePOSClass(str: any){
    sessionStorage.setItem("posClass", JSON.stringify(str));
    const v  = this.getPOSClass();
    if (v != null && v["LEDGERENTRIESLIST.LIST"] instanceof Array){
      for (let ledger of v["LEDGERENTRIESLIST.LIST"]){
        if (ledger.NAME){
          console.log(ledger.NAME.content);
        this.apiService.getLedger(ledger.NAME.content).subscribe(
          res1 =>{

            this.db.update("Ledgers", res1.ENVELOPE.BODY.DATA.TALLYMESSAGE.LEDGER);
          },
          err => {
            console.log(err);
          });
  
        }
      }
    
    }
  }

  getPOSClass(): any{
    return JSON.parse(sessionStorage.getItem("posClass"));
  }
   
  posClear(){
    sessionStorage.removeItem("priceList");
    sessionStorage.removeItem("posClass");
    sessionStorage.removeItem("priceList");
  }

    saveLedgers(){
    this.apiService.getLedgerByGroup("Sundry Debtors").subscribe(
      res =>{
        for (let item of res){
          this.apiService.getLedger(item).subscribe(
            r => {
              if (r.ENVELOPE != null){
              var re = r.ENVELOPE.BODY.DATA.TALLYMESSAGE.LEDGER;
               this.db.update("Ledgers", re);
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

   async saveLedger(str: string): Promise<any>{
  
         var val = this.apiService.getLedger(str).subscribe(
            r => {
              var re = r.ENVELOPE.BODY.DATA.TALLYMESSAGE.LEDGER;
              this.db.update("Ledgers", re);
              return re;
            },
            e => {
              console.log(e);
            }
          );
    
       
  }


  getBatch(str: string){

  }

  getProductBatch(): Promise<any[]>{
    return this.db.getAll("Batches");
  }

  getLedger(name : string): Promise<any>{
    return this.db.getByKey("Ledgers", name);
  }

  saveCustomers(){
     this.apiService.getCustomers().subscribe(
      res =>{

          for(let item of res){
            this.db.getByKey("customers", item._id.counter).then(
              async res => {
                if(res){
                  console.log(res);
                  await this.db.update("customers", item);
                }else{
                  await this.db.add("customers", item);
                }
              },
              err => {
                console.log(err);
              }
            )
          .then(
            () => console.log("Customer Saved: " + item.name)
          );
        }
      },
      err =>{
        console.log(err);
      }
    )
  }

  async addCacheVoucher(voucher: VOUCHER): Promise<any>{
    console.log(voucher);
        return this.db.update('cacheVoucher', voucher);
    
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
    this.apiService.getPOSUser().subscribe(
      res => {
        this.user = res;
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
