import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { NgxIndexedDB } from 'ngx-indexed-db';
import { User } from '../Model/user';
import { VOUCHER } from '../Model/voucher';
import { ApiService } from './api.service';
import { Customer } from '../Model/customer';
import { Address } from '../Model/address';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { Request } from '../Model/tally-voucher';
import uniqid from 'uniqid';



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
  stompClient: any;
  connected: boolean;

  constructor(private apiService?: ApiService, private cookie?: CookieService) {
    this.sync();
    setInterval(this.maintainConnection, 10000)
    this.database = this.db.openDatabase(1, evt => {
      let objectStore = evt.currentTarget.result.createObjectStore('cacheVoucher', { keyPath: "VOUCHERNUMBER",autoIncrement: false, unique:true });
      let objectStore2 = evt.currentTarget.result.createObjectStore('items', { keyPath: "NAME",autoIncrement: false, unique: true });
      let objectStore3 = evt.currentTarget.result.createObjectStore('customers', {keyPath: "id", autoIncrement: false, unique: true });
      let objectStore4 = evt.currentTarget.result.createObjectStore('Ledgers', {keyPath: "NAME",autoIncrement: false, unique: true });
      let objectStore5 = evt.currentTarget.result.createObjectStore('Batches', {autoIncrement: true, unique: true });
      let objectStore6 = evt.currentTarget.result.createObjectStore('Addresses', {    keyPath: "_id",autoIncrement: false, unique: true });

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
      let objectStore6 = evt.currentTarget.result.createObjectStore('Addresses', {    keyPath: "_id",autoIncrement: false, unique: true });

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

  maintainConnection(){
    if (this.connected){
      this.sendRequest(new Request("STOCKITEM"));
    }
  }

 async enablePOSMode(){
  this.customerPercent = 0;
  this.batchPercent = 0;
  this.ledgerPercent = 0;
  this.itemPercent = 0;
  this.db.clear("items");
  this.db.clear("Batches")
  // this.saveCompany();
  // await this.saveItems();
   this.db.clear("customers")
   //this.saveCustomers();
   this.db.clear("Ledgers")
  // this.saveLedgers();
   //this.saveAddresses();
      this.sendRequestForItems();
      this.sendRequestForLedgers();
      this.sendRequestForBatches();
      
     

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

  sync(){

      if (!this.stompClient || !this.stompClient.connected){
        let ws = new SockJS(this.apiService.WEB_SOCKET_URL + "/tallySocket");

        this.stompClient = Stomp.over(ws);
  
        const that = this;
        this.stompClient.connect({}, function (frame) {
          that.stompClient.subscribe("/topic/sync", (message) => {
            if (message.body) {
              console.log(message.body);
              var type: string = (message.body).split("-")[0];
              if (type == "STOCKITEM"){
                that.saveAllItems(message.body);
              } else if (type == "LEDGER"){
                that.saveAllLedgers(message.body);
              }else if (type == "BATCH"){
                that.saveAllBatches(message.body);
              }
             
            }
          });
        })
        
        this.connected = this.stompClient.connected;
        
        
      }
      
    
    
  }


  saveAllBatches(guid: string){
    this.apiService.getTallyData(guid).subscribe(
      (res) => {
        console.log(res);
        var length: number  = 0;
        var index: number= 0;
        for (let batchList of res){
          if (batchList.BATCHLIST && batchList.BATCHLIST.BATCH){
            if (batchList.BATCHLIST.BATCH instanceof Array){
              length = length + batchList.BATCHLIST.BATCH.length;
              for (let re of batchList.BATCHLIST.BATCH){
                re.productId = batchList.productId;
                this.db.update("Batches", re).then(
                  res => {
                    index++;
                    this.batchPercent =  Math.round((index/length) * 100);
                  }
                )
              }
            } else {
              length++;
              var re = batchList.BATCHLIST.BATCH;
              re.productId = batchList.productId;
              this.db.update("Batches", re).then(
                res => {
                  index++;
                  this.batchPercent =  Math.round((index/length) * 100);
                }
              )
            }
          }
        }
       
      },
      err => console.log(err)
    );
  }

  saveAllItems(guid: string){
    this.apiService.getTallyData(guid).subscribe(
      (res) => {
        const length: number  = res.length;
        var index: number= 0;
        for (let item of res){
          if (item && item.ENVELOPE && item.ENVELOPE.BODY && item.ENVELOPE.BODY.DATA
            && item.ENVELOPE.BODY.DATA.TALLYMESSAGE && item.ENVELOPE.BODY.DATA.TALLYMESSAGE.STOCKITEM ){
              this.db.update("items", item.ENVELOPE.BODY.DATA.TALLYMESSAGE.STOCKITEM).then(
                res2 => {
                 index++;
                 this.itemPercent = Math.round((index/length) * 100);
                }
              );
            }
        }
      },
      err => console.log(err)
    );
  }

  saveAllLedgers(guid: string){
    this.apiService.getTallyData(guid).subscribe(
      (res) => {
        console.log(res);
        const length: number  = res.length;
        var index: number= 0;
        for (let item of res){
          if (item && item.ENVELOPE && item.ENVELOPE.BODY && item.ENVELOPE.BODY.DATA
            && item.ENVELOPE.BODY.DATA.TALLYMESSAGE && item.ENVELOPE.BODY.DATA.TALLYMESSAGE.LEDGER ){
              this.db.update("Ledgers", item.ENVELOPE.BODY.DATA.TALLYMESSAGE.LEDGER).then(
                res2 => {
                 index++;
                 this.ledgerPercent = Math.round((index/length) * 100);
                }
              );
            }
        }
      },
      err => console.log(err)
    );
  }


  public sendRequest(request: Request){
    this.stompClient.send("/app/tallySync", {}, JSON.stringify(request));   
  }


  async saveAddresses(){
    await this.apiService.getAddresses().subscribe(
      async res => {
        const length: number = res.length;
        var index: number = 0;
        for (let address of res){
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

  sendRequestForBatches(){
    var request: Request = new Request("BATCH");
    request.guid = uniqid("BATCH-");
    request.name = "";
    request.fetchList = [];
    this.sendRequest(request);
  }

  sendRequestForLedgers(){
    var list: string[] = [];
        list.push("NAME");
        list.push("PARENT");
        list.push("PARTYGSTIN");
    var request:Request = new Request("LEDGER")
    request.fetchList = list;
    request.name = "";
    request.guid = uniqid("LEDGER-")
    request.filter = "$Parent =" + "\"Sundry Debtors\""
    this.sendRequest(request);
  }

  sendRequestForItems(){
    var list: string[] = [];
        list.push("NAME");
        list.push("PARENT");
        list.push("CATEGORY");
        list.push("GSTDETAILS.HSNCODE");
        list.push("GSTDETAILS.STATEWISEDETAILS.STATENAME");
        list.push("GSTDETAILS.STATEWISEDETAILS.RATEDETAILS.GSTRATEDUTYHEAD");
        list.push("GSTDETAILS.STATEWISEDETAILS.RATEDETAILS.GSTRATE");
        list.push("GSTDETAILS.STATEWISEDETAILS.RATEDETAILS.GSTDUTYHEAD");
        list.push("BATCHALLOCATIONS.BATCHNAME");
        list.push("BATCHALLOCATIONS.GODOWNNAME");
        list.push("BATCHALLOCATIONS.EXPIRYPERIOD");
        list.push("SALESLIST.NAME");
        list.push("SALESLIST.GSTCLASSIFICATIONNATURE");
        list.push("SALESLIST.CLASSRATE");
        list.push("SALESLIST.REMOVEZEROENTRIES");
        list.push("SALESLIST.LEDGERFROMITEM");
        list.push("FULLPRICELIST.PRICELEVEL");
        list.push("FULLPRICELIST.PRICELEVELLIST.RATE");
        list.push("FULLPRICELIST.PRICELEVELLIST.DATE");

        var request: Request = new Request("STOCKITEM");
        request.guid = uniqid("STOCKITEM-")
        request.name = "";
        request.fetchList = list;

        this.sendRequest(request);

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
