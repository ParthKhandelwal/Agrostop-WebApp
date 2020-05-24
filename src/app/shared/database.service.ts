import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { NgxIndexedDB } from 'ngx-indexed-db';
import { Request } from '../Model/tally-voucher';
import uniqid from 'uniqid';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { Customer } from '../Model/customer';
import { Address } from '../Model/address';
import { VOUCHER, PrintConfiguration } from '../Model/voucher';
import { User } from '../Model/user';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  public WEB_SOCKET_URL = "https://agrostop-web-server.herokuapp.com"
  //public WEB_SOCKET_URL = "http://localhost:5000";
  public batchPercent: number = 100;
  public itemPercent: number = 100;
  public ledgerPercent: number = 100;
  public customerPercent: number = 100;
  public addressPercent: number = 100;
  public upSyncPercent: number = 100;


  database: Promise<any>;
  db = new NgxIndexedDB('agrostop', 2);
  connected: boolean;
  stompClient: any;
  map: Map<string, string> = new Map();
  user: User;
  numberOfCacheVoucher: number = 0;


  constructor(private apiService?: ApiService, private cookie?: CookieService) {
    this.sync();
    setInterval(this.maintainConnection, 10000)
    this.database = this.db.openDatabase(1, evt => {
      let objectStore = evt.currentTarget.result.createObjectStore('cacheVoucher', { keyPath: "VOUCHERNUMBER",autoIncrement: false, unique:true });
      let objectStore2 = evt.currentTarget.result.createObjectStore('items', { keyPath: "NAME",autoIncrement: false, unique: true });
      let objectStore3 = evt.currentTarget.result.createObjectStore('customers', {keyPath: "id", autoIncrement: false, unique: true });
      let objectStore4 = evt.currentTarget.result.createObjectStore('Ledgers', {keyPath: "NAME",autoIncrement: false, unique: true });
      let objectStore7 = evt.currentTarget.result.createObjectStore('Voucher Types', {keyPath: "NAME",autoIncrement: false, unique: true });
      let objectStore8 = evt.currentTarget.result.createObjectStore('Addresses', {    keyPath: "_id",autoIncrement: false, unique: true });

      let objectStore5 = evt.currentTarget.result.createObjectStore('Batches', {keyPath : "BATCHID", autoIncrement: false, unique: true });
      let objectStore6 = evt.currentTarget.result.createObjectStore('PrintConfiguration', {    keyPath: "voucherType",autoIncrement: false, unique: true });

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
      let objectStore7 = evt.currentTarget.result.createObjectStore('Voucher Types', {keyPath: "NAME",autoIncrement: false, unique: true });
      let objectStore8 = evt.currentTarget.result.createObjectStore('Addresses', {    keyPath: "_id",autoIncrement: false, unique: true });

      let objectStore5 = evt.currentTarget.result.createObjectStore('Batches', {keyPath : "BATCHID", autoIncrement: false, unique: true });
      let objectStore6 = evt.currentTarget.result.createObjectStore('PrintConfiguration', {    keyPath: "voucherType",autoIncrement: false, unique: true });

      //objectStore.createIndex('name', 'name', { unique: false });
      //objectStore.createIndex('email', 'email', { unique: true });
    })
  }

  clearDatabse(){
    this.openDatabase().then(() => this.db.deleteDatabase());
  }

  
   

   maintainConnection(){
     console.log(this.stompClient);
    if (this.connected){
      this.sendRequest(new Request("STOCKITEM"));
    }
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
   
 async enablePOSMode(){
  this.customerPercent = 0;
  this.batchPercent = 0;
  this.ledgerPercent = 0;
  this.itemPercent = 0;
 
  
  // this.saveCompany();
  // await this.saveItems();
  
   this.saveCustomers();
  
  // this.saveLedgers();
  this.sendRequestForAllLedgers();
   this.saveAddresses();
  this.sendRequestForItems();
    
      this.sendRequestForBatches();

  this.sendAllVoucherTypeRequests();
      

     

}

sendAllVoucherTypeRequests(){
  var user: User = this.getUser();
  for (let name of user.voucherTypes){
    this.sendRequestForVoucherType(name.voucherTypeName);
  }
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

    async getVoucherTypeByName(id: string): Promise<any>{
      return await this.db.getByKey("Voucher Types", id);
    }
  
    sync(){
  
        if (!this.stompClient || !this.stompClient.connected){
          let ws = new SockJS(this.WEB_SOCKET_URL + "/tallySocket");
  
          this.stompClient = Stomp.over(ws);
    
          const that = this;
          this.stompClient.connect({}, function (frame) {
            that.stompClient.subscribe("/topic/sync", (message) => {
              if (message.body) {
                console.log(message.body);
                var type: string = that.map.get(message.body);
                if (type == "STOCKITEM"){
                  that.saveAllItems(message.body);
                } else if (type == "LEDGER"){
                  that.saveAllLedgers(message.body);
                }else if (type == "BATCH"){
                  that.saveAllBatches(message.body);
                }else if (type == "VOUCHER"){
                  that.getAllCacheVouchers()
                }else if (type == "VOUCHERTYPE"){
                  console.log(message);
                  that.saveAllVoucherTypes(message.body);
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
          var length: number  = 0;
          var index: number= 0;
          for (let batchList of res){
            if (batchList.BATCHLIST && batchList.BATCHLIST.BATCH){
              if (batchList.BATCHLIST.BATCH instanceof Array){
                length = length + batchList.BATCHLIST.BATCH.length;
                for (let re of batchList.BATCHLIST.BATCH){
                  re.productId = batchList.productId;
                  this.db.update("Batches", re)
                
                      index++;
                      this.batchPercent =  Math.round((index/length) * 100);
                   
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
                this.db.update("items", item.ENVELOPE.BODY.DATA.TALLYMESSAGE.STOCKITEM)
                  
                   index++;
                   this.itemPercent = Math.round((index/length) * 100);
                  
              
              }
          }
        },
        err => console.log(err)
      );
    }
  
    saveAllLedgers(guid: string){
      this.apiService.getTallyData(guid).subscribe(
        (response) => {
          
          var res: any[] = [];
          console.log(response);
          
          if (response instanceof Array){
            res = response;
          }else{
            res.push(response);
          }
          const length: number  = res.length;
          var index: number= 0;
          for (let item of res){
            if (item && item.ENVELOPE && item.ENVELOPE.BODY && item.ENVELOPE.BODY.DATA
              && item.ENVELOPE.BODY.DATA.TALLYMESSAGE && item.ENVELOPE.BODY.DATA.TALLYMESSAGE.LEDGER ){
                this.db.update("Ledgers", item.ENVELOPE.BODY.DATA.TALLYMESSAGE.LEDGER)
             
                   index++;
                   this.ledgerPercent = Math.round((index/length) * 100);
                
              }
          }
        },
        err => console.log(err)
      );
    }

    saveAllVoucherTypes(guid: string){

      this.apiService.getTallyData(guid).subscribe(
        res => {
          if (res && res.ENVELOPE && res.ENVELOPE.BODY && res.ENVELOPE.BODY.DATA
            && res.ENVELOPE.BODY.DATA.TALLYMESSAGE && res.ENVELOPE.BODY.DATA.TALLYMESSAGE.VOUCHERTYPE){
              var voucherType = res.ENVELOPE.BODY.DATA.TALLYMESSAGE.VOUCHERTYPE;
              this.db.update("Voucher Types", voucherType);
              this.apiService.getPrintConfiguration(voucherType.NAME).subscribe(
                (res)=>{
                  if(res){
                    console.log(res)
                    res.voucherType = voucherType.NAME
                    this.db.update("PrintConfiguration",res);
                  }
                  
                },
                err => console.log(err)
              )
              
              var classList: any[] = [];
              if(voucherType["VOUCHERCLASSLIST.LIST"] instanceof Array){
                classList = voucherType["VOUCHERCLASSLIST.LIST"];
              }else {
                classList.push(voucherType["VOUCHERCLASSLIST.LIST"]);
              }
              for (let tallyClass of classList){
                var ledgerList : any[] = [];
                if (tallyClass["LEDGERENTRIESLIST.LIST"] instanceof Array){
                  ledgerList = tallyClass["LEDGERENTRIESLIST.LIST"];
                } else {
                  ledgerList.push(tallyClass["LEDGERENTRIESLIST.LIST"])
                }
                for (let ledger of ledgerList){
                  if (ledger){
                    console.log(ledger);
                    var request: Request = new Request("LEDGER");
                    request.guid = uniqid("LEDGER");
                    request.name = ledger.NAME.content;
                    request.fetchList = [];
                    request.fetchList.push("*.*");
                    this.map.set(request.guid, "LEDGER");
                    this.sendRequest(request);
                  }
                }
              }
              
            }
          
        },
        err => console.log(err)
      );
    }
  
  
    public sendRequest(request: Request){
      this.stompClient.send("/app/tallySync", {}, JSON.stringify(request));   
    }
  
  
    saveAddresses(){
       this.apiService.getAddresses().subscribe(
         res => {
          const length: number = res.length;
          var index: number = 0;
          for (let address of res){
              this.db.update("Addresses", address)
                index++;
                this.addressPercent = Math.round((index/length) * 100);
              
          }
          
        },
        err => {
          console.log(err);
        }
      )
    }

    public sendRequestForAllLedgers(){
      this.sendRequestForLedgers("Sundry Debtors");
      this.sendRequestForLedgers("Indirect Expenses");
    }
  
   public sendRequestForBatches(){
      var request: Request = new Request("BATCH");
      request.guid = uniqid("BATCH-");
      request.name = "";
      request.fetchList = [];
      this.map.set(request.guid, "BATCH");
      this.sendRequest(request);
    }

    public sendRequestForVoucherType(name: string){
      var list: string[] = [];
      list.push("Voucher Class List");
      var request: Request = new Request("VOUCHERTYPE");
      request.fetchList = list;
      request.name = name;
      request.guid = uniqid("VOUCHERTYPE-");
      this.map.set(request.guid, "VOUCHERTYPE");
      this.sendRequest(request);
    }
  
    public sendRequestForLedgers(groupName:string){
      var list: string[] = [];
          list.push("NAME");
          list.push("PARENT");
          list.push("PARTYGSTIN");
      var request:Request = new Request("LEDGER")
      request.fetchList = list;
      request.name = "";
      request.guid = uniqid("LEDGER-")
      request.filter = "$Parent =" + "\""+groupName+"\""
      this.map.set(request.guid, "LEDGER");
      this.sendRequest(request);
    }
  

    public sendRequestForLedgersDutiesAndTaxes(){
      var list: string[] = [];
          list.push("*.*");
      var request:Request = new Request("LEDGER")
      request.fetchList = list;
      request.name = "";
      request.guid = uniqid("LEDGER-")
      request.filter = "$Parent =" + "\"Sundry Debtors\""
      this.map.set(request.guid, "LEDGER");
      this.sendRequest(request);
    }

    public sendRequestForItems(){
      var list: string[] = [];
          list.push("NAME");
          list.push("PARENT");
          list.push("CATEGORY");
          list.push("GSTDETAILS.HSNCODE");
          list.push("GSTDETAILS.APPLICABLEFROM");
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
          this.map.set(request.guid, "STOCKITEM");
          this.sendRequest(request);
  
    }
  
   async getAllStockItemsForBilling(): Promise<any[]>{
     
    return await this.db.getAll("items");
    }
  

    getPrintConfigurations(id: string): Promise<PrintConfiguration>{
      return this.db.getByKey("PrintConfiguration", id);
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

    getBatches(productId: string): Promise<any>{
      return this.db.getByIndex("Batches", "productId",productId);
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
          this.db.clear("customers")
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
  
  countCacheVoucher(){
    this.db.count('cacheVoucher').then(
      voucherCount => {
        this.numberOfCacheVoucher = voucherCount;
      },
      error => {
        console.log(error);
      }
    );
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
  
    deleteVoucher(voucherNumber){
      this.db.delete('cacheVoucher', voucherNumber).then(
        () => {
          // Do something after delete
        },
        error => {
          console.log(error);
        }
      );
    }
  
    syncAllCacheVouchers(){
      this.upSyncPercent = 0;
      this.db.getAll('cacheVoucher').then(
        async (vouchers: any[]) => {
          if (vouchers == null || vouchers.length == 0){
            this.upSyncPercent = 100;
          }
          const length: number = vouchers.length;
          var index: number = 0;
          for (let voucher of vouchers){
            if ((voucher.VOUCHERNUMBER + "").match('^DM-')){
              await this.apiService.getVoucherNumber(voucher.VOUCHERTYPENAME).subscribe(
                async (num) => {
                  voucher.VOUCHERNUMBER = num.prefix + num.seq;
                  voucher.NARRATION = "This bill is generated against DM-"+voucher._REMOTEID 
                  await this.apiService.saveTallyVoucher(voucher).subscribe(
                    res => {
                      console.log(res);
                      if (res && res.RESPONSE){
                        if (res.RESPONSE.CREATED == 1 || res.RESPONSE.ALTERED == 1){
                          index++;
                          this.upSyncPercent = Math.round((index/length)* 100);
                          this.addCacheVoucher(voucher).then(
                            (res) => {
                              this.deleteVoucher("DM-"+voucher.VOUCHERNUMBER);
                            }
                            );
                        }
                      }
                      
                    },
                    err => {
                      this.addCacheVoucher(voucher).then(
                        (res) => {
                          this.deleteVoucher("DM-"+voucher.VOUCHERNUMBER);
                        }
                        );
                      console.log('Voucher could not be saved');
                      alert("Voucher could not be saved");  
                    }
                  );
              });
            } else {
              await this.apiService.saveTallyVoucher(voucher).subscribe(
                res => {
                  console.log(res);
                  if (res && res.RESPONSE){
                    if (res.RESPONSE.CREATED == 1 || res.RESPONSE.ALTERED == 1){
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
                    }
                  }
                  
                },
                err => {
                  console.log('Voucher could not be saved');
                  alert("Voucher could not be saved");  
                }
              );
            }
            
          }
        },
        err =>{
          alert ("Error ocurred")
        }
      );
    }
  
}
