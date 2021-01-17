import { Injectable } from '@angular/core';
import { Customer } from '../../model/Customer/customer';
import { Address } from '../../model/Address/address';
import { StockItem } from '../../model/StockItem/stock-item';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { ApiService } from '../API/api.service';
import { Observable, BehaviorSubject, from, of, Subscription, interval } from 'rxjs';
import { flatMap } from 'rxjs/operators';
import { User } from '../../model/User/user';
import { VOUCHERTYPE } from '../../model/VoucherType/voucher-type';


@Injectable({
  providedIn: 'root'
})
export class SyncService {
  addresses: Address[] = [];
  ledgers: any[] = [];
  customers: Customer[] = []
  customers$ = new BehaviorSubject([]);
  products$ = new BehaviorSubject([]);
  ledgers$ = new BehaviorSubject([]);
  addresses$ = new BehaviorSubject([]);
  products: StockItem[] = [];
  loading: boolean = false;
  customerLoading: boolean = false;
  addressLoading: boolean = false;
  ledgerLoading: boolean = false;
  itemLoading: boolean = false;
  printConfig:boolean = false;
  voucherTypeLoading: boolean = false;
  subscription: Subscription;
  voucherTypes: any[];
  internetAvailable: boolean;
  printConfigLoading: boolean;



  constructor(private db?: NgxIndexedDBService, private apiService?: ApiService) {
    this.db.getAll("Voucher Types").then(
      res => {
        this.voucherTypes = res.map((v: any) => {
          return {"NAME": v.NAME, "PARENT":v.PARENT.content}
        });
      }
    );

    this.refresh();
 }



  sync(){
    this.saveLedgers();
    this.saveItems();
    this.saveAddresses();
    this.saveCustomers();
    this.savePrinConfiguration();
    this.saveVoucherTypes();
  }


  async refresh() {
    this.loading = true;

    this.customers$.next(await this.db.getAll("customers"));
    this.products$.next (await this.db.getAll("items"));
    this.addresses$.next(await this.db.getAll("Addresses"));
    this.ledgers$.next((await this.db.getAll("Ledgers")).map((l: any) => {
      return { "NAME": l.NAME, "ISBILLWISEON": l.ISBILLWISEON, "PARENT": l.PARENT,
              "TAXTYPE": l.TAXTYPE, "GSTDUTYHEAD": l.GSTDUTYHEAD, "APPROPRIATEFOR": l.APPROPRIATEFOR};
    }));
    this.loading = false;

  }

  saveItems() {
    this.itemLoading = true;
    this.apiService.getAllStockItemsForBilling().subscribe(
      res => {
        //this.db.clear("items")
        this.products$.next(res);
        this.itemLoading = false;
        for (let item of res) {
          this.db.update("items", item);
        }

      },
      err => {
        console.log(err);
      }
    )
  }

  saveLedgers() {
    this.ledgerLoading = true;
    this.apiService.getAllLedgers().subscribe(
      res => {

        this.ledgers$.next(res.map(res => {return {"NAME": res.NAME, "ISBILLWISEON": res.ISBILLWISEON}}))
        this.ledgerLoading = false;
        for (let add of res) {

          this.db.update("Ledgers", add)

        }

      }
    )
  }

  saveVoucherTypes() {
    this.voucherTypeLoading = true;
    this.apiService.getAllVoucherTypes().subscribe(
      res => {
        //this.db.clear("Voucher Types");
        for (let add of res) {
          let v: VOUCHERTYPE = Object.assign(new VOUCHERTYPE(), add);
          this.db.update("Voucher Types", v)

        }
        this.voucherTypeLoading = false;

      }
    )
  }

  saveAddresses() {
    this.addressLoading = true;
    this.apiService.getAddresses().subscribe(
      res => {
        //this.db.clear("Addresses");
        this.addresses$.next(res);
        this.addressLoading = false;
        for (let address of res) {
          this.db.update("Addresses", address)
        }

      },
      err => {
        console.log(err);
      }
    )
  }


  saveCustomers() {
    this.customerLoading = true;
    this.apiService.getCustomers().subscribe(
      (res: any[]) => {
        //this.db.clear("customers")
        this.customers$.next(res);
        this.customerLoading = false;
        for (let item of res) {
          this.db.update("customers", item)
        }
      },
      err => {
        console.log(err);
      }
    )
  }

  savePrinConfiguration(){
    this.printConfigLoading = true;
    this.apiService.getAllVocuherTypeConfig().subscribe(
      res =>{
        for(let item of res){
          this.db.update("PrintConfiguration", item)
        }
        this.printConfigLoading = false;
      }
    )
  }

  updateStockItem(item){
    this.db.update("items", item)
    var index = this.products$.getValue().findIndex((i) => i.name == item.name);
    this.products$.getValue()[index] = item;

  }

  updateLedger(ledger){
    this.db.update("Ledgers", ledger)
    var index = this.ledgers$.getValue().findIndex((i) => i.NAME == ledger.NAME);
    this.ledgers$.getValue()[index] = ledger;

  }


  updateVoucherType(vtype){
    this.db.update("Voucher Types", vtype)
  }

  updateCustomer(customer){
    customer.id = customer.customerId;
    this.db.update("customers", customer)
    var index = this.customers$.getValue().findIndex((i) => i.id == customer.id);
    this.customers$.getValue()[index] = customer;
  }


  update(str: string){
    this.apiService.getUpdates(str).subscribe(
      res => {
        switch (str) {
          case "items":
            this.products$.getValue()
              .map((o) => res.find( (item) => o.name === item.name))
            break;
        case "customers":
          this.customers$.getValue()
          .map((o) => res.find( (item) => o.id === item.id))
        break;
        // case "ledgers":
        //     url = this.BASE_URL + 'ledger/getUpdates';
        //     break;
        // case "vouchertypes":
        //     url = this.BASE_URL + 'voucherType/getUpdates';
        }
      },
      err => console.log(err)
    )
  }

  connectedToWeb():boolean{
    console.log(navigator.onLine);
      return navigator.onLine
  }


  loadingAddressSummary: boolean;
  async getAddressSummary(){
    this.loadingAddressSummary = true;
    let tempAddresses = this.addresses$.getValue();
    const pageSize = 30;
    let pageNumber = 0;
    let lastPage
    while(!lastPage){
      lastPage = await this.getAddressSummaryHelper(tempAddresses, pageNumber, pageSize);
      pageNumber += 1;
    }
    this.loadingAddressSummary = false;
  }

  async getAddressSummaryHelper(tempAddresses, pageNumber, pageSize){
    let response: any = await this.apiService.getAddressSummary(pageNumber, pageSize).toPromise();
        response.content.forEach(element => {
          let temp  = tempAddresses.filter((address) => element._id === address._id)[0];
          if(temp){
            temp.landTotal = element.landTotal;
            temp.customerTotal = element.customerTotal;
            temp.voucherTotal = (-1)*element.voucherTotal
            temp.averageLand = Math.round(this.divide(element.landTotal, element.customerTotal)*100)/100;
            temp.averageExpense = Math.round(this.divide((-1)*element.voucherTotal, element.landTotal)*100)/100;
          }
        });
        this.addresses$.next(tempAddresses);
    return response.last;
  }

  divide(num1, num2): number{
    return Math.round((num1/num2)*100)/100;
  }


}


