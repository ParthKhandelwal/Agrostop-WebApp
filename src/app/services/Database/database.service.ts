import { Injectable } from '@angular/core';

import { NgxIndexedDBService } from 'ngx-indexed-db';


import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from '../../model/User/user';
import { ApiService } from '../API/api.service';
import { Customer } from '../../model/Customer/customer';
import { StockItem } from '../../model/StockItem/stock-item';
import {  VOUCHER } from '../../model/Voucher/voucher';
import { Address } from '../../model/Address/address';
import { PrintConfiguration } from '../../model/PrintConfiguration/print-configuration';


@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  //public WEB_SOCKET_URL = "https://agrostop-web-server.herokuapp.com"
  public WEB_SOCKET_URL = "http://localhost:5000";
  //public WEB_SOCKET_URL = "http://agrostopserver-env.eba-vei6xp54.ap-south-1.elasticbeanstalk.com";

  public batchPercent: number = 100;
  public itemPercent: number = 100;
  public ledgerPercent: number = 100;
  public customerPercent: number = 100;
  public addressPercent: number = 100;
  public upSyncPercent: number = 100;


  database: Promise<any>;
  connected: boolean;
  stompClient: any;
  map: Map<string, string> = new Map();
  user: User;
  numberOfCacheVoucher: number = 0;


  constructor(private apiService?: ApiService, private snackBar?: MatSnackBar,
      private db?: NgxIndexedDBService) {

   }




  clearDatabse(){
    this.db.deleteDatabase();
  }





   syncingOver() : boolean{
    return (this.ledgerSavedSoFar == this.totalLedger)
            && (this.itemsSavedSoFar == this.totalItems)
            && (this.batchesSavedSoFar == this.totalBatches)
            && (this.voucherTypesSavedSoFar == this.totalVoucherTypes)

  }





totalLedger: number =0;
ledgerSavedSoFar: number = 0;
async ledgerQuickSync(){
  this.ledgerSavedSoFar = 0;
  var totalPage : number = 1;
  var currentPage: number = 0;
  var res;
  while (currentPage <= totalPage){
        res = await this.apiService.getCachePage(currentPage,"LEDGER").toPromise().catch((err) => console.log(err));
        this.saveLedgersToDatabaseQuick(res.content);
        totalPage = res.totalPages;
        currentPage = currentPage + 1;
        this.totalLedger = res.totalElements;
        res = null;
  }

}

totalItems: number = 0;
itemsSavedSoFar: number = 0;
async itemsQuickSync(){
  let totalPage : number = 1;
  let currentPage: number = 0;
  const batches: any[] = await this.treatBatches();
  console.log(batches);
  let stockItem: StockItem = new StockItem();
  while (currentPage <= totalPage){
    var res  = await this.apiService.getCachePage(currentPage,"STOCKITEM").toPromise().catch((err) => console.log(err));
    for (let item of res.content){
      if (item && item.STOCKITEM ){
          stockItem.convertFromJSON(item.STOCKITEM);
          stockItem.BATCHES = batches.filter((b) => {

            return ( b.productId === stockItem.NAME ) && (b.CLOSINGBALANCE != 0)
            && (b.EXPIRYDATE ? new Date(b.EXPIRYDATE) >= new Date(): true)
          }).sort((a,b) => b.CLOSINGBALANCE - a.CLOSINGBALANCE);
          await this.db.update("items", stockItem);

        }
    }

        totalPage = res.totalPages;
        currentPage = currentPage + 1;
        this.totalItems = res.totalElements;


  }

}

totalBatches: number = 0;
batchesSavedSoFar: number = 0;


async treatBatches(): Promise<any[]>{
  let totalPage : number = 1;
  let currentPage: number = 0;
  let batches: any[] = []
  while (currentPage <= totalPage){
    let res  = await this.apiService.getCachePage(currentPage,"BATCH").toPromise().catch((err) => console.log(err));
        for (let batchList of res.content){
          if(batchList.BATCHLIST && batchList.BATCHLIST.BATCH){
            batchList.BATCHLIST.BATCH = (batchList.BATCHLIST.BATCH instanceof Array)
                                    ? batchList.BATCHLIST.BATCH
                                    : [batchList.BATCHLIST.BATCH]
           let uniqueBatches = batchList.BATCHLIST.BATCH.map(
            (r) => {
              r.productId = batchList.productId
              return r
            })

            uniqueBatches
            .reduce((acc: Map<string, any>, val) => {

              val.CLOSINGBALANCE = (acc.get(val.BATCHID)?acc.get(val.BATCHID).CLOSINGBALANCE: 0) + val.CLOSINGBALANCE;

              acc.set(val.BATCHID, val)
              return acc
            }, new Map())
            .forEach((value: boolean, key: string) => {
              batches.push(value);
            });


          }


        }

        totalPage = res.totalPages;
        currentPage = currentPage + 1;
        this.totalBatches = res.totalElements;

  }
  return batches;

}

totalVoucherTypes: number = 0;
voucherTypesSavedSoFar: number = 0;
async vouchertypeQuickSync(){
  var totalPage : number = 1;
  var currentPage: number = 0;
  let res;
  while (currentPage <= totalPage){
        res  = await this.apiService.getCachePage(currentPage,"VOUCHERTYPE").toPromise().catch((err) => console.log(err));
        await this.saveVoucherTypeToDatabaseQuick(res.content);
        totalPage = res.totalPages;
        currentPage = currentPage + 1;
        this.totalVoucherTypes = res.totalElements;
  }

}




   getItems(): Promise<any>{
    return  this.db.getAll("items");
    }

    async getCustomers():Promise<any[]>{
    return  await this.db.getAll("customers");
    }

    async getAddresses():Promise<any[]>{
      return  await this.db.getAll("Addresses");
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


    initialSync(){

        this.itemsQuickSync();
        this.ledgerQuickSync();
        this.vouchertypeQuickSync();



    }





    saveItemsToDatabase(res){
      const length: number  = res.length;
          var index: number= 0;
          for (let item of res){
            if (item && item.ENVELOPE && item.ENVELOPE.BODY && item.ENVELOPE.BODY.DATA
              && item.ENVELOPE.BODY.DATA.TALLYMESSAGE && item.ENVELOPE.BODY.DATA.TALLYMESSAGE.STOCKITEM ){
                var stockItem: StockItem = new StockItem();
                stockItem.convertFromJSON(item.ENVELOPE.BODY.DATA.TALLYMESSAGE.STOCKITEM);
                this.db.update("items", stockItem)

                   index++;
                   this.itemPercent = Math.round((index/length) * 100);


              }
          }
    }

    saveItemsToDatabaseQuick(res){
          const length: number  = res.length;
          var index: number= 0;
          for (let item of res){
            if (item && item.STOCKITEM ){
                var stockItem: StockItem = new StockItem();
                stockItem.convertFromJSON(item.STOCKITEM);
                this.db.update("items", stockItem).then(
                  (r) =>{
                    this.itemsSavedSoFar = this.itemsSavedSoFar + 1;
                    if(this.itemsSavedSoFar == this.totalItems){
                      this.snackBar.open(this.itemsSavedSoFar + " Items Saved Offline","Cancel",{
                        duration: 5000
                      });
                    }
                  }
                )

                   index++;
                   this.itemPercent = Math.round((index/length) * 100);


              }
          }
    }

    saveAllItems(guid: string){
      this.apiService.getTallyData(guid).subscribe(
        (res) => {
          this.saveItemsToDatabase(res);
        },
        err => console.log(err)
      );
    }



    async saveLedgersToDatabaseQuick(response){
          if (response instanceof Array){
            for (let item of response){
              if (item && item.LEDGER ){
                  await this.db.update("Ledgers", item.LEDGER)

                }
            }
          }else{
            await this.db.update("Ledgers", response.LEDGER)
          }

    }

    async saveVoucherTypeToDatabaseQuick(items){
      for(let res of items){
        if (res && res.VOUCHERTYPE){
          var voucherType = res.VOUCHERTYPE;
          await this.db.update("Voucher Types", voucherType)
          var response = await this.apiService.getPrintConfiguration(voucherType.NAME).toPromise()
          .catch(err => console.log(err));

              if(response){
                console.log(response)
                response.voucherType = voucherType.NAME
                await this.db.update("PrintConfiguration",response);
              }

        }
      }
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

    deleteCustomer(cus: string){
      this.db.delete("customers", cus);
    }

    addCacheCustomer(cus: any){
      this.db.update("cacheCustomers", cus);
    }

    deleteCacheCustomer(cus: string){
      this.db.delete("cacheCustomers", cus);
    }

    getAllCacheCustomer(): Promise<any[]>{
      return this.db.getAll("cacheCustomers");
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


    getAllCacheVouchers(): Promise<any>{
      return this.db.getAll('cacheVoucher');
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
      this.uploadAllCacheCustomers();
      this.getAllCacheVouchers().then((vouchers: any[]) => {
        vouchers.sort((a,b) => new Date(a.DATE).getTime() - new Date(b.DATE).getTime())
                .forEach( async (voucherPromise) => {
                      var voucher: VOUCHER = await voucherPromise
                      console.log(voucher);
                      this.apiService.saveTallyVoucher(voucher).subscribe(
                        (res) => {
                          this.deleteVoucher(voucher._REMOTEID);
                        },
                        err => {
                          console.log(err);
                          this.addCacheVoucher(voucher);
                        }
                      );


                })
      })
    }

    async continuousSyncVouchers(){
      let vouchers: any[] = await this.getAllCacheVouchers();
      if(vouchers.length >0){
        this.syncAllCacheVouchers()
      }
    }

    async setNumbersToAllMemos(){
      var vouchers: any[] = await this.getAllCacheVouchers();
      vouchers.sort((a,b) => a.DATE.getTime() - b.DATE.getTime())
                .forEach(async (voucher) => {
                  if ((voucher.VOUCHERNUMBER + "").match('^DM-')){
                    var num = await this.apiService.getVoucherNumber(voucher.VOUCHERTYPENAME).toPromise();
                    voucher.VOUCHERNUMBER = num.prefix + num.seq;
                    voucher.NARRATION = "This bill is generated against DM-"+voucher._REMOTEID
                    await this.addCacheVoucher(voucher);
                  }
                })

      }


      async uploadAllCacheCustomers(){
        var customers: any[] = await this.getAllCacheCustomer();
        for(let c of customers){
          this.apiService.addCustomer(c).subscribe(
            err => {
              this.deleteCacheCustomer(c.id);
            },
            err => {
              alert("Customer cannot be saved. Please check all the details")
            }
          )
        }
      }

}
