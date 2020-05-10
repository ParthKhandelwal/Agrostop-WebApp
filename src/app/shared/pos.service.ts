import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { NgxIndexedDB } from 'ngx-indexed-db';
import { User } from '../Model/user';
import { VOUCHER } from '../Model/voucher';
import { ApiService } from './api.service';
import { Customer } from '../Model/customer';
import { Address } from '../Model/address';



@Injectable({
  providedIn: 'root'
})
export class PosService {
  public batchPercent: number = 100;
  public itemPercent: number = 100;
  public ledgerPercent: number = 100;
  public customerPercent: number = 100;
  public addressPercent: number = 100;
  public upSyncPercent: number = 100;
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
      let objectStore3 = evt.currentTarget.result.createObjectStore('customers', {keyPath: "id", autoIncrement: false, unique: true });
      let objectStore4 = evt.currentTarget.result.createObjectStore('Ledgers', {keyPath: "NAME",autoIncrement: false, unique: true });
      let objectStore5 = evt.currentTarget.result.createObjectStore('Batches', {autoIncrement: true, unique: true });
      let objectStore6 = evt.currentTarget.result.createObjectStore('Addresses', {    keyPath: "id",autoIncrement: false, unique: true });

      //objectStore.createIndex('name', 'name', { unique: false });
      //objectStore.createIndex('email', 'email', { unique: true });
    })
  }

  async openDatabase(): Promise<any>{
    return this.database = this.db.openDatabase(1, evt => {
      let objectStore = evt.currentTarget.result.createObjectStore('cacheVoucher', { keyPath: "VOUCHERNUMBER",autoIncrement: false, unique:true });
      let objectStore2 = evt.currentTarget.result.createObjectStore('items', { keyPath: "NAME",autoIncrement: false, unique: true });
      let objectStore3 = evt.currentTarget.result.createObjectStore('customers', {keyPath: "id", autoIncrement: false, unique: true });
      let objectStore4 = evt.currentTarget.result.createObjectStore('Ledgers', {keyPath: "NAME",autoIncrement: false, unique: true });
      let objectStore5 = evt.currentTarget.result.createObjectStore('Batches', {autoIncrement: true, unique: true });
      let objectStore6 = evt.currentTarget.result.createObjectStore('Addresses', {    keyPath: "id",autoIncrement: false, unique: true });

      //objectStore.createIndex('name', 'name', { unique: false });
      //objectStore.createIndex('email', 'email', { unique: true });
    })
  }

  syncingOver() : boolean{
    return (this.itemPercent == 100) 
            && (this.batchPercent == 100)
            && (this.customerPercent == 100)
            && (this.ledgerPercent == 100)
            && (this.addressPercent == 100)
  }   
  
  upSyncingOver() : boolean{
    return (this.upSyncPercent == 100) 
           
  }

  enablePOSMode(){
  
      this.customerPercent = 0;
      this.batchPercent = 0;
      this.ledgerPercent = 0;
      this.itemPercent = 0;
      this.db.clear("items");
      this.db.clear("Batches")
      this.saveCompany();
      this.saveItems();
      this.db.clear("customers")
      this.saveCustomers();
      this.db.clear("Ledgers")
      this.saveLedgers();
      this.saveAddresses();

      }

  getItems(): Promise<any>{
  return  this.db.getAll("items");
  }

  async getCustomers():Promise<any[]>{
  return  await this.db.getAll("customers");
  }

  async getCustomer(id: string):Promise<Customer>{
    return  await this.db.getByKey("customers", id);
  }

  async getAddress(id: string):Promise<Address>{
    return  await this.db.getByKey("Addresses", id);
  }


  async saveAddresses(){
    await this.apiService.getAddresses().subscribe(
      async res => {
        const length: number = res.length;
        var index: number = 0;
        for (let address of res){
          console.log(address)
           await this.db.update("Addresses", address).then(
             res2 => {
              index++;
              this.addressPercent = Math.round((index/length) * 100);
             }
           );
        }
        
      },
      err => {
        console.log(err);
      }
    )
  }

  async saveItems(){
    var len: number = 0
    var index: number = 0
    this.apiService.createRequestForStockItems().subscribe(
      response => {
        console.log(response);
        setTimeout(() => 
        {
          this.apiService.getStockItemFullObject(response.guid).subscribe(
            (res) => {
                len = len+res.length;
                for (let item of res){
                  this.db.update("items",item.ENVELOPE.BODY.DATA.TALLYMESSAGE.STOCKITEM).then(
                    res => {
                      index++;
                      this.itemPercent = Math.round((index/len) * 100);
                    }
                  )
                }
              
            },
            err =>{
              console.log(err);
            }
          )
        },
        30000);
          
        
      },
      err => console.log(err)
    )
    

    this.apiService.getAllBatches().subscribe(
      res => {
        var length: number = 0;
        var index: number = 0
        if (res && res instanceof Array){
          for (let group of res){
            
            
            if (group.BATCHLIST && group.BATCHLIST.BATCH && (group.BATCHLIST.BATCH instanceof Array)){
              length = length + group.BATCHLIST.BATCH.length
              console.log(group.BATCHLIST.BATCH);
              for (let re of group.BATCHLIST.BATCH){
            
                re.productId = group.productId;
                this.db.update("Batches",re).then(
                  res => {
               
                      index++
                
                      this.batchPercent = Math.round((index/length)*100);
                    
                    
                  }
                );
               
             }
            }else if (group.BATCHLIST && group.BATCHLIST.BATCH) {
              length = length + 1;
              console.log(group.BATCHLIST.BATCH);
              var re = group.BATCHLIST.BATCH;
              re.productId = group.productId;
                this.db.update("Batches",re).then(
                  res => {
                  
                      index++
                
                      this.batchPercent = Math.round((index/length)*100);
                    
                    
                  }
                );
            }
           
            }
                             
        }
      },
      err => {
        console.log(err);
      }
    );

    // await this.apiService.getAllStockItemsForBilling().subscribe(
    //    async (res: any[]) =>{
    //       const len: number = res.length;
    //       var index: number = 0
    //       var batchIndex: number = 0
    //       for (let item of res){
            
    //       await this.apiService.getStockItem(item).subscribe(
    //           async (result) => {
    //             if ((result && result.ENVELOPE && result.ENVELOPE.BODY && result.ENVELOPE.BODY.DATA
    //               && result.ENVELOPE.BODY.DATA.TALLYMESSAGE && result.ENVELOPE.BODY.DATA.TALLYMESSAGE.STOCKITEM)){
    //                 await this.db.update("items",result.ENVELOPE.BODY.DATA.TALLYMESSAGE.STOCKITEM).then(
    //                   res => {
    //                     index++;
    //                     this.itemPercent = Math.round((index/len) * 100);
    //                   }
    //                 )
    //             }
    //           }
    //         )
    //         this.apiService.getProductBatch(item).subscribe(
    //             (r:any[]) => {
    //              if (r != null && r instanceof Array){
    //                const length: number = res.length;
    //                var index: number = 0
    //                for (let re of r){
    //                  re.productId = item;
    //                   this.db.update("Batches",re).then(
    //                     res => {
    //                       index++
    //                       batchIndex = index/length;
    //                       this.batchPercent = Math.round((batchIndex/len)*100);
    //                     }
    //                   );
                     
    //                }
    //              }
                
    //            },
    //            e => {
                
    //              console.log(e);
    //            }
    //          );
            
    //       }
          
    //   },
    //   err =>{
    //     console.log(err);
    //   }
    // )
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

  saveClass(str: any){
    sessionStorage.setItem("posClass", JSON.stringify(str));
    const v  = this.getPOSClass();
    if (v != null && v["LEDGERENTRIESLIST.LIST"] instanceof Array){
      for (let ledger of v["LEDGERENTRIESLIST.LIST"]){
        if (ledger.NAME){   
          console.log(ledger    .NAME.content);
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
      this.apiService.getLedgerFullObject("Sundry Debtors").subscribe(
        (res) => {
          const len: number = res.length;
          var index: number = 0;
          for (let r of res){
            if (r.ENVELOPE != null){    
              var re = r.ENVELOPE.BODY.DATA.TALLYMESSAGE.LEDGER;
               this.db.update("Ledgers", re).then(
                 res => {
                      index++;  
                   this.ledgerPercent = Math.round((index/len)*100)
                 }
               );   
              }
          }
        },
        (err) => {
          console.log(err)
        }
      );



    // this.apiService.getLedgerByGroup("Sundry Debtors").subscribe(
    //   (res: any[]) =>{
    //     const len: number = res.length;
    //     var index: number = 0;
    //     for (let item of res){
    //       this.apiService.getLedger(item).subscribe(
    //         r => {
    //           if (r.ENVELOPE != null){    
    //           var re = r.ENVELOPE.BODY.DATA.TALLYMESSAGE.LEDGER;
    //            this.db.update("Ledgers", re).then(
    //              res => {
    //                   index++;  
    //                this.ledgerPercent = Math.round((index/len)*100)
    //              }
    //            );   
    //           }
    //         },
    //         e => {
    //           console.log(e);
    //         }
    //       );
    //     }
        
          
    //   },
    //   err =>{
    //     console.log(err);
    //   }
    // )
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

  getCompany(): any{
    return JSON.parse(sessionStorage.getItem("company"));
  }

  saveCompany(){
    this.apiService.getCompany("Tirupati Traders - Nalkheda").subscribe(
      res => {
        sessionStorage.setItem("company", JSON.stringify(res));
      },
      err => {
        console.log(err);
      }
    )
  }

  getBatch(str: string){

  }

  getProductBatch(): Promise<any[]>{
    return this.db.getAll("Batches");
  }

  getLedger(name : string): Promise<any>{
    return this.db.getByKey("Ledgers", name);
  }   


  getLedgers(): Promise<any[]>{
    return this.db.getAll("Ledgers");
  }   

      addCustomer(cus: any){
    this.db.update("customers", cus);
  }

  saveCustomers(){
     this.apiService.getCustomers().subscribe(
      (res:any[]) =>{
        const len : number = res.length;
        var index: number = 0;
          for(let item of res){
            
             this.db.update("customers", item).then(
               res => {
                 index++;
                this.customerPercent = Math.round((index/len)*100)
               },
                
              err => {
                console.log(err);
              }
            
          
        )
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
    
    return JSON.parse(sessionStorage.getItem("currentUser")).user;
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
