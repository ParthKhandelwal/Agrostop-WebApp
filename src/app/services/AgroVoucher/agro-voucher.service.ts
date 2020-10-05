import { Injectable } from '@angular/core';
import { VOUCHERCLASSLISTLIST, VoucherParentType, VOUCHERTYPE } from "../../model/VoucherType/voucher-type";
import { VOUCHER, ALLLEDGERENTRIESLIST, LEDGERENTRIESLIST, ALLINVENTORYENTRIESLIST, INVENTORYENTRIESIN_LIST, INVENTORYENTRIESOUT_LIST } from "../../model/Voucher/voucher";
import { ObjectID } from 'bson';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { User } from '../../model/User/user';
import { Customer } from '../../model/Customer/customer';
import { AuthenticationService } from '../Authentication/authentication.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AgroVoucherService {
  voucherParentType: VoucherParentType;
  voucher:VOUCHER;
  contraLedger: string[] = ['Cash-in-hand', 'Bank Accounts', "Bank OD A/c"];
  salesAccountLedger: string[] = ['Sales Accounts', 'Purchase Accounts'];

  salesLedger: string[] = ['Direct Incomes', "Income (Direct)", "Income (Indirect)", "Indirect Incomes", "Duties & Taxes"]
  ledgerForSalesClass: string[] = []
  godown: string;
  customer : Customer;
  printAfterSave:boolean;
  editMode: boolean = false;
  posInvoice: boolean;
  coupons: any[];
  constructor(private db?: NgxIndexedDBService, public auth?: AuthenticationService, public router?: Router) {

    this.voucher = new VOUCHER();
   }



  createNewVoucher(voucherType, date?, vClass?, pricelist?){
    this.voucher = new VOUCHER();
    let id = new ObjectID();
    this.voucher._REMOTEID = id.toString();
    this.voucher.VOUCHERTYPENAME = voucherType;
    this.db.getByID("Voucher Types", voucherType).then(
      (res: VOUCHERTYPE) => {
        this.posInvoice = (res.USEFORPOSINVOICE == 'Yes')
      }
    )
    this.voucher.VOUCHERNUMBER = this.getVoucherNumber();
    this.voucher._ACTION = "Create";
    if(vClass){
      this.voucher.CLASSNAME = vClass;
      this.setVoucherForClass();
    }
    if(pricelist){
      this.voucher.PRICELEVEL = pricelist;
    }
    if(date){
      this.voucher.DATE = date;
    }else{
      this.voucher.DATE = new Date();
    }
    let primaryLedger = new ALLLEDGERENTRIESLIST();
    switch (this.voucherParentType) {
      case VoucherParentType.Contra:
        primaryLedger.ISDEEMEDPOSITIVE = "Yes";
        this.voucher.ALLLEDGERENTRIES_LIST.push(primaryLedger);
        break;
      case VoucherParentType.Payment:
        primaryLedger.ISDEEMEDPOSITIVE = "No";
        this.voucher.ALLLEDGERENTRIES_LIST.push(primaryLedger);
        break;

      case VoucherParentType.Receipt:
        primaryLedger.ISDEEMEDPOSITIVE = "Yes";
        this.voucher.ALLLEDGERENTRIES_LIST.push(primaryLedger);
        break;

      case VoucherParentType.Sales:
        this.voucher.PERSISTEDVIEW = "Invoice Voucher View";
        this.voucher._OBJVIEW = "Invoice Voucher View";
        break;

      case VoucherParentType.Purchase:
        this.voucher.PERSISTEDVIEW = "Invoice Voucher View";
        this.voucher._OBJVIEW = "Invoice Voucher View";
        this.voucher.ISINVOICE = "Yes";
        this.voucher.HASCASHFLOW = "No";
        break;

      case VoucherParentType.Journal:
        this.voucher.PERSISTEDVIEW = "Accounting Voucher View";
        this.voucher._OBJVIEW = "Accounting Voucher View";

        break;

      case VoucherParentType.Material_Out:
        let ledger = new LEDGERENTRIESLIST();
        ledger.ISDEEMEDPOSITIVE = "Yes";
        this.voucher.LEDGERENTRIES_LIST.push(ledger);
        console.log(this.voucher)
        this.voucher.USEFORGODOWNTRANSFER = "Yes";
        this.voucher.PERSISTEDVIEW = "Multi Consumption Voucher View";
        this.voucher._OBJVIEW = "Multi Consumption Voucher View";
        break;

      default:
        break;
    }
  }


  getLedgerTotal(){
    let total: number = 0;
    switch (this.voucherParentType) {
      case VoucherParentType.Contra:
        for(let ledger of this.voucher.ALLLEDGERENTRIES_LIST){
          if(ledger.ISDEEMEDPOSITIVE == "No"){
            total = total + ledger.AMOUNT
          }
        }
        break;
      case VoucherParentType.Payment:
        for(let ledger of this.voucher.ALLLEDGERENTRIES_LIST){
          if(ledger.ISDEEMEDPOSITIVE == "Yes"){
            total = total + ledger.AMOUNT
          }
        }
        break;

      case VoucherParentType.Receipt:
        for(let ledger of this.voucher.ALLLEDGERENTRIES_LIST){
          if(ledger.ISDEEMEDPOSITIVE == "No"){
            total = total + ledger.AMOUNT
          }
        }
        break;

      case VoucherParentType.Journal:
        for(let ledger of this.voucher.ALLLEDGERENTRIES_LIST){
          if(ledger.ISDEEMEDPOSITIVE == "No"){
            total = total + ledger.AMOUNT;
          }
        }
        break;

      case VoucherParentType.Material_Out:
        for(let item of this.voucher.INVENTORYENTRIESIN_LIST){
          if(item.ISDEEMEDPOSITIVE == "Yes"){
            total = total + item.AMOUNT;
          }
        }
        for(let ledger of this.voucher.LEDGERENTRIES_LIST){
          if(ledger.ISDEEMEDPOSITIVE == "No"){
            total = total + ledger.AMOUNT?ledger.AMOUNT:0;
          }
        }
        break;
      case VoucherParentType.Purchase:
        for(let item of this.voucher.ALLINVENTORYENTRIES_LIST){
          if(item.ISDEEMEDPOSITIVE == "Yes"){
            total = total + item.AMOUNT;
          }
        }
        for(let ledger of this.voucher.LEDGERENTRIES_LIST){
          if(ledger.ISDEEMEDPOSITIVE == "Yes"){
            total = total + ledger.AMOUNT;
          }
        }
        break;
      default:
        break;
    }
    return total;
  }


  setPrimaryLedger(name){
    switch (this.voucherParentType) {
      case VoucherParentType.Contra:
        this.voucher.ALLLEDGERENTRIES_LIST.filter((l) => l.ISDEEMEDPOSITIVE == "Yes")[0].LEDGERNAME = name;
        break;
      case VoucherParentType.Payment:
        this.voucher.ALLLEDGERENTRIES_LIST.filter((l) => l.ISDEEMEDPOSITIVE == "No")[0].LEDGERNAME = name;
        break;

      case VoucherParentType.Receipt:
        this.voucher.ALLLEDGERENTRIES_LIST.filter((l) => l.ISDEEMEDPOSITIVE == "Yes")[0].LEDGERNAME = name;
        break;

      case VoucherParentType.Material_Out:
        this.voucher.LEDGERENTRIES_LIST.filter((l) => l.ISDEEMEDPOSITIVE == "Yes")[0].LEDGERNAME = name;
        this.voucher.PARTYLEDGERNAME = name;

        break;


      default:
        break;
    }

  }

  getPrimaryLedger(): LEDGERENTRIESLIST | ALLLEDGERENTRIESLIST{
    switch (this.voucherParentType) {
      case VoucherParentType.Contra:
        return this.voucher.ALLLEDGERENTRIES_LIST.filter((l) => l.ISDEEMEDPOSITIVE == "Yes")[0];
        break;
      case VoucherParentType.Payment:
        return this.voucher.ALLLEDGERENTRIES_LIST.filter((l) => l.ISDEEMEDPOSITIVE == "No")[0];
        break;

      case VoucherParentType.Receipt:
        return this.voucher.ALLLEDGERENTRIES_LIST.filter((l) => l.ISDEEMEDPOSITIVE == "Yes")[0];
        break;

      case VoucherParentType.Material_Out:
        return this.voucher.LEDGERENTRIES_LIST.filter((l) => l.ISDEEMEDPOSITIVE == "Yes")[0];
        break;

      case VoucherParentType.Sales:
        return this.voucher.LEDGERENTRIES_LIST.filter((l) => l.ISDEEMEDPOSITIVE == "Yes")[0];
        break;

      default:
        break;
    }
  }

  getVoucherNumber(): string{
    let obj = JSON.parse(localStorage.getItem(this.voucher.VOUCHERTYPENAME));
    if(!obj){
      obj = {"prefix": "ASV-", "seq": 1};
      localStorage.setItem(this.voucher.VOUCHERTYPENAME, JSON.stringify(obj));
    }
    return obj.prefix + obj.seq;
  }

  voucherNumberIncrement(){
    if(!this.editMode){
      let obj = JSON.parse(localStorage.getItem(this.voucher.VOUCHERTYPENAME));
      if(!obj){
        throw new Error("No Voucher Number Exists");
      }
      obj.seq = +obj.seq + 1;
      localStorage.setItem(this.voucher.VOUCHERTYPENAME, JSON.stringify(obj));
    }


  }


  save(){
    this.voucher.EFFECTIVEDATE = this.voucher.DATE;
    if(this.voucher.getRemainingBalance() == 0){
      switch (this.voucherParentType) {
        case VoucherParentType.Material_Out:
          this.addCacheVoucher(this.voucher).then(
            res => {
          let voucherType = this.voucher.VOUCHERTYPENAME;
              let date = this.voucher.DATE;
              let vClass = this.voucher.CLASSNAME;
              let priceList = this.voucher.PRICELEVEL
              this.voucherNumberIncrement();
              this.createNewVoucher(voucherType, date, vClass, priceList);
            }).catch((e) => alert(e));
          break;

        default:
          this.addCacheVoucher(this.voucher).then(
            res => {
              let voucherType = this.voucher.VOUCHERTYPENAME;
              let date = this.voucher.DATE;
              let vClass = this.voucher.CLASSNAME;
              let priceList = this.voucher.PRICELEVEL
              this.voucherNumberIncrement();
              this.createNewVoucher(voucherType, date, vClass, priceList);

            }
          ).catch((e) => alert(e));
          break;
      }
      if(this.editMode){
        this.router.navigateByUrl("/daybook");
        this.editMode = false;
      }
    }else{
      alert("Voucher total does not match!");
      throw Error("Voucher Total do not match")
    }


  }

  nextVocuher(){
    let voucherType = this.voucher.VOUCHERTYPENAME;
    let date = this.voucher.DATE;
    let vClass = this.voucher.CLASSNAME;
    let priceList = this.voucher.PRICELEVEL
    this.voucherNumberIncrement();
    this.createNewVoucher(voucherType, date, vClass, priceList);
  }

  renew(){
    let voucherType = this.voucher.VOUCHERTYPENAME;
    let date = this.voucher.DATE;
    let vClass = this.voucher.CLASSNAME;
    let priceList = this.voucher.PRICELEVEL
    this.createNewVoucher(voucherType, date, vClass, priceList);
  }



  async addCacheVoucher(voucher: VOUCHER): Promise<any>{
    return this.db.update('cacheVoucher', voucher);
  }


  setVoucherForClass(){
    this.getClass().then(
      (vClass: VOUCHERCLASSLISTLIST )=> {
        if(vClass){
          switch (this.voucherParentType) {
            case VoucherParentType.Sales:
              for(let item of vClass.ledgerEntriesList){
                if(item.methodType == "As User Defined Value"){
                  this.ledgerForSalesClass.push(item.name);
                }else{
                  let existingLedger = this.voucher.LEDGERENTRIES_LIST.filter((l) => l.LEDGERNAME == item.name)[0]
                  if(!existingLedger){
                    let ledger = new LEDGERENTRIESLIST();
                    ledger.LEDGERNAME = item.name;
                    ledger.ISDEEMEDPOSITIVE = "No"
                    ledger.AMOUNT = 0;
                    ledger.METHODTYPE = item.methodType;
                    this.voucher.LEDGERENTRIES_LIST.push(ledger);
                  }else{
                    existingLedger.ISDEEMEDPOSITIVE = "No";
                    existingLedger.METHODTYPE = item.methodType
                  }



                }

              }
              break;

            case VoucherParentType.Payment:
              break;
            default:
              break;
          }
        }


      }
    );

  }

  async getClass(): Promise<VOUCHERCLASSLISTLIST>{
    if(this.voucher.CLASSNAME){
      switch (this.voucherParentType) {
        case VoucherParentType.Sales:
          let voucherType: any = await (this.db.getByID("Voucher Types", this.voucher.VOUCHERTYPENAME));
          if(voucherType.VOUCHERCLASSLIST_LIST){
            for(let item of voucherType.VOUCHERCLASSLIST_LIST){
              if(item.className === this.voucher.CLASSNAME){
                return item;
              }
            }
          }
          return null;

        default:
          return null;
      }
    }

  }

  getLedgersList(){
    switch (this.voucherParentType) {
      case VoucherParentType.Sales:
        return this.ledgerForSalesClass;
        break;

      default:
        return [];
        break;
    }
  }

  isPosVoucher(){
    return this.posInvoice;
  }

  setForEditing(){
    console.log(this.voucher);
    this.editMode = true;
    switch (this.voucherParentType) {
      case VoucherParentType.Material_Out:
        this.voucher.INVENTORYENTRIESIN_LIST = this.voucher.INVENTORYENTRIESIN_LIST.map((i) => Object.assign(new INVENTORYENTRIESIN_LIST(), i));
        this.voucher.INVENTORYENTRIESOUT_LIST = this.voucher.INVENTORYENTRIESOUT_LIST.map((i) => Object.assign(new INVENTORYENTRIESOUT_LIST, i));
        break;

      case VoucherParentType.Sales:
        if(this.voucher.ALLINVENTORYENTRIES_LIST && this.voucher.ALLINVENTORYENTRIES_LIST.length >0){
          this.voucher.ALLINVENTORYENTRIES_LIST = this.voucher.ALLINVENTORYENTRIES_LIST.map((i) => Object.assign(new ALLINVENTORYENTRIESLIST(), i));
          this.godown = this.voucher.ALLINVENTORYENTRIES_LIST[0].BATCHALLOCATIONS_LIST.GODOWNNAME;
        }
        break;

      default:
        break;
    }

    if(this.voucher.LEDGERENTRIES_LIST){
      this.voucher.LEDGERENTRIES_LIST = this.voucher.LEDGERENTRIES_LIST.map((i) => Object.assign(new LEDGERENTRIESLIST(), i));

    }
    if(this.voucher.ALLLEDGERENTRIES_LIST){
      this.voucher.ALLLEDGERENTRIES_LIST = this.voucher.ALLLEDGERENTRIES_LIST.map((i) => Object.assign(new ALLLEDGERENTRIESLIST(), i));

    }


  }
}
