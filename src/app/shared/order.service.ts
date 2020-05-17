import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Order, OrderItem } from '../Model/order';
import { VOUCHER, ALLINVENTORYENTRIESLIST, BATCHALLOCATIONSLIST, EXPIRYPERIOD, ACCOUNTINGALLOCATIONSLIST, LEDGERENTRIESLIST, OLDAUDITENTRYIDSLIST } from '../Model/voucher';
import uniqid from 'uniqid'
import { DatabaseService } from './database.service';
import { AppComponent } from '../app.component';
import { User } from '../Model/user';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  databaseService: DatabaseService
  constructor(private apiService?: ApiService) {
    this.databaseService = AppComponent.databaseService;
  }

  public async convertOrder(order: Order, voucher: VOUCHER, voucherType: string, priceList: string, godown: string): Promise<VOUCHER>{
    voucher.ORDERNUMBER = order.id;
    for(let item of order.itemList){
      await this.addInventoryToVoucher(item, godown, voucher);
    }
    const user: User = this.databaseService.getUser();
    var posClass: any; 
    await this.databaseService.getVoucherTypeByName(voucherType).then(
      res=> {
        var posClassName:string;
        user.voucherTypes
        .filter((v) => v.voucherTypeName == voucherType)
        .forEach((v)=> posClassName = v.voucherClass);
        var classList: any[] = [];
        if (res && res["VOUCHERCLASSLIST.LIST"]){
          if (res["VOUCHERCLASSLIST.LIST"] instanceof Array){
            classList = res["VOUCHERCLASSLIST.LIST"];
          }else{
            classList.push(res["VOUCHERCLASSLIST.LIST"]);
          }
        }else {
          alert("Please choose a different voucher type or contact administrator.")
          return;
        }
        posClass = classList.filter((p) => p.CLASSNAME.content == posClassName)[0];
      },
      err => {
        console.log(err);
      }
    );
    console.log(voucher);
    voucher.DATE = new Date();
    voucher._REMOTEID = uniqid();
    voucher.ENTEREDBY = user.tallyUserName;
    voucher.VOUCHERTYPENAME = voucherType;
    voucher._VCHTYPE = voucherType;
    voucher._OBJVIEW = "Invoice Voucher View";
    voucher._ACTION = "Create";
    voucher.CLASSNAME = posClass.CLASSNAME.content;
    voucher.PERSISTEDVIEW = "Invoice Voucher View";
    voucher.VOUCHERNUMBER = "TT-" + voucher._REMOTEID;
    voucher.LEDGERENTRIES_LIST = [];
    voucher.PRICELEVEL = priceList;
    voucher.BASICBUYERNAME = order.customerId;
    var tempArray: any[] = [];
    if (posClass["LEDGERENTRIESLIST.LIST"] instanceof Array){
      tempArray = posClass["LEDGERENTRIESLIST.LIST"]
    } else{
      tempArray.push(posClass["LEDGERENTRIESLIST.LIST"])
    }
    for (let ledger of tempArray){
      if (ledger.NAME){

      await this.databaseService.getLedger(ledger.NAME.content).then(
        async res1 =>{
          var res: any;
          if (res1 == null){
             res = this.databaseService.saveLedger(ledger.NAME);
          } else {
           res = res1
          }
          
          var ledgerEntry: LEDGERENTRIESLIST = new LEDGERENTRIESLIST();
          var oldaudit: OLDAUDITENTRYIDSLIST = new OLDAUDITENTRYIDSLIST();
          oldaudit.OLDAUDITENTRYIDS = "-1";
          ledgerEntry.OLDAUDITENTRYIDS_LIST = oldaudit;
          ledgerEntry.LEDGERNAME = res.NAME;
          ledgerEntry.METHODTYPE = ledger.METHODTYPE.content
          ledgerEntry.ISDEEMEDPOSITIVE = res.ISDEEMEDPOSITIVE.content;
          ledgerEntry.LEDGERFROMITEM = ledger.LEDGERFROMITEM.content;
          ledgerEntry.ROUNDLIMIT = ledger.ROUNDLIMIT.content;
          ledgerEntry.ROUNDTYPE = ledger.ROUNDTYPE.content;
          ledgerEntry.REMOVEZEROENTRIES = ledger.REMOVEZEROENTRIES.content;
          ledgerEntry.ISPARTYLEDGER = "No";
          ledgerEntry.tallyObject = res;
          voucher.LEDGERENTRIES_LIST.push(ledgerEntry);
        },
        err=>{
          console.log(err);
        }
      );
      }
    }

    if (posClass.POSENABLECARDLEDGER){
      var ledgerEntry: LEDGERENTRIESLIST = new LEDGERENTRIESLIST();
      ledgerEntry.LEDGERNAME = posClass.POSCARDLEDGER.content
      ledgerEntry.POSPAYMENTTYPE = "Card";
      voucher.LEDGERENTRIES_LIST.push(ledgerEntry)
    }

    if (posClass.POSENABLECASHLEDGER){
      var ledgerEntry: LEDGERENTRIESLIST = new LEDGERENTRIESLIST();
      ledgerEntry.LEDGERNAME = posClass.POSCASHLEDGER.content
      ledgerEntry.POSPAYMENTTYPE = "Cash";
      voucher.LEDGERENTRIES_LIST.push(ledgerEntry);
    }

    if (posClass.POSENABLECHEQUELEDGER){
      var ledgerEntry: LEDGERENTRIESLIST = new LEDGERENTRIESLIST();
      ledgerEntry.LEDGERNAME = posClass.POSCHEQUELEDGER.content
      ledgerEntry.POSPAYMENTTYPE = "Cheque";
      voucher.LEDGERENTRIES_LIST.push(ledgerEntry)
    }

    if (posClass.POSENABLEGIFTLEDGER){
      var ledgerEntry: LEDGERENTRIESLIST = new LEDGERENTRIESLIST();
      ledgerEntry.LEDGERNAME = posClass.POSGIFTLEDGER.content
      ledgerEntry.POSPAYMENTTYPE = "Gift";
      voucher.LEDGERENTRIES_LIST.push(ledgerEntry);
    }

     return voucher;
   }

   async addInventoryToVoucher(orderItem:OrderItem, godownName: string, voucher:VOUCHER){
    var item: ALLINVENTORYENTRIESLIST = new ALLINVENTORYENTRIESLIST();
    item.STOCKITEMNAME = orderItem.item;
    item.ACTUALQTY = orderItem.qty;
    item.BILLEDQTY = orderItem.qty;
    item.RATE = orderItem.rate;
    item.AMOUNT = item.BILLEDQTY * item.RATE;
    item.ISDEEMEDPOSITIVE = "No";
    return await this.databaseService.getStockItem(item.STOCKITEMNAME).then(
      async res1 => {
        const res = res1;
        console.log(res)
        item.BATCHALLOCATIONS_LIST = new BATCHALLOCATIONSLIST();
        
        var batch = (await this.databaseService.getProductBatch())
                        .filter(res => res.productId == orderItem.item)
                        .sort((a,b) => {
                          if (a.EXPIRYDATE && b.EXPIRYDATE){
                            return new Date(a.EXPIRYDATE).getTime() - new Date(b.EXPIRYDATE).getTime()
                          }
                          })[0];
        console.log(batch);
        item.BATCHALLOCATIONS_LIST.GODOWNNAME = godownName;
        item.BATCHALLOCATIONS_LIST.BILLEDQTY = orderItem.qty;
        item.BATCHALLOCATIONS_LIST.ACTUALQTY = orderItem.qty;
        item.BATCHALLOCATIONS_LIST.AMOUNT = item.RATE * item.BILLEDQTY;
        item.BATCHALLOCATIONS_LIST.EXPIRYPERIOD = new EXPIRYPERIOD(batch.EXPIRYDATE)
        item.BATCHALLOCATIONS_LIST.BATCHNAME = batch.NAME;




        item.ACCOUNTINGALLOCATIONS_LIST = new ACCOUNTINGALLOCATIONSLIST();
        item.ACCOUNTINGALLOCATIONS_LIST.LEDGERNAME = res["SALESLIST.LIST"].NAME.content;
        item.ACCOUNTINGALLOCATIONS_LIST.CLASSRATE = res["SALESLIST.LIST"].CLASSRATE.content;
        item.ACCOUNTINGALLOCATIONS_LIST.LEDGERFROMITEM = res["SALESLIST.LIST"].LEDGERFROMITEM.content;
        item.ACCOUNTINGALLOCATIONS_LIST.GSTOVRDNNATURE = res["SALESLIST.LIST"].GSTCLASSIFICATIONNATURE.content;
        item.ACCOUNTINGALLOCATIONS_LIST.REMOVEZEROENTRIES = res["SALESLIST.LIST"].REMOVEZEROENTRIES.content;
        item.ACCOUNTINGALLOCATIONS_LIST.AMOUNT = item.AMOUNT;
        item.ACCOUNTINGALLOCATIONS_LIST.LEDGERFROMITEM = "Yes"
        item.ACCOUNTINGALLOCATIONS_LIST.ISDEEMEDPOSITIVE = "No"
        voucher.ALLINVENTORYENTRIES_LIST.push(item);
        console.log(voucher);
      },
      err => {
        console.log(err);
      }
    )
  
   }
}
