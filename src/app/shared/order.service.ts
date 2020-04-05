import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Order, OrderItem } from '../Model/order';
import { VOUCHER, ALLINVENTORYENTRIESLIST, BATCHALLOCATIONSLIST, EXPIRYPERIOD, ACCOUNTINGALLOCATIONSLIST, LEDGERENTRIESLIST, OLDAUDITENTRYIDSLIST } from '../Model/voucher';
import { PosService } from './pos.service';
import uniqid from 'uniqid'

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private apiService?: ApiService, private posService?: PosService) {

  }

  public async convertOrder(order: Order, voucher: VOUCHER): Promise<VOUCHER>{
    voucher.ORDERNUMBER = order.id;
    for(let item of order.itemList){
      await this.addInventoryToVoucher(item, this.posService.getGodown(), voucher);
    }
    console.log(voucher);
    voucher.DATE = new Date();
    voucher._REMOTEID = uniqid();
    voucher.ENTEREDBY = this.posService.getUser().tallyUserName;
    const voucherType = this.posService.getVoucherType();
    const posClass = this.posService.getPOSClass();
    voucher.VOUCHERTYPENAME = voucherType.NAME;
    voucher._VCHTYPE = voucherType.NAME;
    voucher._OBJVIEW = "Invoice Voucher View";
    voucher._ACTION = "Create";
    voucher.CLASSNAME = posClass.CLASSNAME.content;
    voucher.PERSISTEDVIEW = "Invoice Voucher View";
    voucher.VOUCHERNUMBER = "TT-" + voucher._REMOTEID;
    voucher.LEDGERENTRIES_LIST = [];
    voucher.PRICELEVEL = this.posService.getPriceList();
    voucher.BASICBUYERNAME = order.customerId;
    var tempArray: any[] = [];
    if (posClass["LEDGERENTRIESLIST.LIST"] instanceof Array){
      tempArray = posClass["LEDGERENTRIESLIST.LIST"]
    } else{
      tempArray.push(posClass["LEDGERENTRIESLIST.LIST"])
    }
    for (let ledger of tempArray){
      if (ledger.NAME){

      await this.posService.getLedger(ledger.NAME.content).then(
        async res1 =>{
          var res: any;
          if (res1 == null){
             res = this.posService.saveLedger(ledger.NAME);
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

     console.log(voucher);
     return voucher;
   }

   async addInventoryToVoucher(orderItem:OrderItem, godownName: string, voucher:VOUCHER){
    var item: ALLINVENTORYENTRIESLIST = new ALLINVENTORYENTRIESLIST();
    item.STOCKITEMNAME = orderItem.itemName;
    item.ACTUALQTY = orderItem.qty;
    item.BILLEDQTY = orderItem.qty;
    item.RATE = orderItem.rate;
    item.AMOUNT = item.BILLEDQTY * item.RATE;
    item.ISDEEMEDPOSITIVE = "No";
    return await this.apiService.getStockItem(item.STOCKITEMNAME).subscribe(
      async res1 => {
        const res = res1.ENVELOPE.BODY.DATA.TALLYMESSAGE.STOCKITEM;
        console.log(res)
        item.BATCHALLOCATIONS_LIST = new BATCHALLOCATIONSLIST();
        
        var batch = (await this.posService.getProductBatch())
                        .filter(res => res.productId == orderItem.itemName)
                        .sort((a,b) => {
                          if (a.expiryDate && b.expiryDate){
                            return new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime()
                          }
                          })[0];
        console.log(batch);
        item.BATCHALLOCATIONS_LIST.GODOWNNAME = godownName;
        item.BATCHALLOCATIONS_LIST.BILLEDQTY = orderItem.qty;
        item.BATCHALLOCATIONS_LIST.ACTUALQTY = orderItem.qty;
        item.BATCHALLOCATIONS_LIST.AMOUNT = item.RATE * item.BILLEDQTY;
        item.BATCHALLOCATIONS_LIST.EXPIRYPERIOD = new EXPIRYPERIOD(batch.expiryDate)
        item.BATCHALLOCATIONS_LIST.BATCHNAME = batch.name;




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
