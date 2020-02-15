import { Component, AfterViewInit, OnInit, ViewChild, ElementRef, ViewChildren, Inject } from '@angular/core';
import { Customer } from '../../Model/customer';
import { Address } from '../../Model/address';
import { StockItem } from '../../Model/stock-item';
import { Batch } from '../../Model/batch';
import { BilledStockItem } from '../../Model/billed-stock-item';
import { TallyVoucher } from '../../Model/tally-voucher';
import { ApiService } from '../../shared/api.service';
import { FormControl } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material';
import { Observable, Observer, fromEvent, merge  } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material';
import { MatTable } from '@angular/material/table';
import { MatTableDataSource } from '@angular/material';
import { MatDialog, MatDialogConfig, MAT_DIALOG_DATA } from '@angular/material';
import { CreateCustomerFormComponent } from '../../create-form/create-customer-form/create-customer-form.component';
import { CookieService } from 'ngx-cookie-service';
import * as uniqid from 'uniqid';
import { NgForm } from '@angular/forms';
import { CashTenderedComponent } from '../../VoucherPackage/cash-tendered/cash-tendered.component';
import { InvoicePrintViewComponent } from '../../PrintPackage/invoice-print-view/invoice-print-view.component';
import { VoucherService } from '../../shared/voucher.service';
import { PosService } from '../../shared/pos.service';
import { AccountingVoucher } from '../../Model/voucher';
import { VOUCHER } from '../../Model/voucher';
import { NgxIndexedDB } from 'ngx-indexed-db';

@Component({
  selector: 'app-create-voucher',
  templateUrl: './create-voucher.component.html',
  styleUrls: ['./create-voucher.component.css']
})
export class CreateVoucherComponent implements OnInit {
  internetStatus: boolean = false;
  tallyServerStatus: boolean = false;
  //voucher: Voucher[];
  @ViewChild('printView', { static: false }) printView: InvoicePrintViewComponent;
  customer: Customer = {
    id: '',
    name: '',
    fatherName: '',
    phoneNumber: '',
    addressId: '',
    fullAddress: new Address(),
    landHolding: 0

  };

  voucher: VOUCHER;
  IsSalesVoucher: false;
  IsPaymentVoucher: false;
  IsReceiptVoucher: false;

  tallyVoucher: TallyVoucher = {
    _id: "",
    customVoucherDetails: {
      date: null,
      basicBuyerName: "",
      address: "",
      posCashRecieved: 0,
      customerId: "",
      voucherNumber: "",
      createdBy: "",
    },
    ledgerEntry: {
      cgst: 0,
      sgst: 0,
      roundOff: 0,
      cash: 0,
      subTotal: 0,
      cashLedgerName: this.cookie.get('tallyVoucher.ledgerEntry.cashLedgerName')

    },
    basicVoucherDetails: {
      stateName: this.cookie.get('tallyVoucher.basicVoucherDetails.stateName'),
      countryOfResidence: this.cookie.get('tallyVoucher.basicVoucherDetails.countryOfResidence'),
      className: this.cookie.get('tallyVoucher.basicVoucherDetails.className'),
      posCashLedgerName: this.cookie.get('tallyVoucher.basicVoucherDetails.posCashLedgerName'),
      basicBasePartyName: this.cookie.get('tallyVoucher.basicVoucherDetails.basicBasePartyName'),
      placeOfSupply: this.cookie.get('tallyVoucher.basicVoucherDetails.placeOfSupply'),
      voucherTypeName: this.cookie.get('tallyVoucher.basicVoucherDetails.voucherTypeName')
    },

    billedStockItems: []
  };
  customers: Customer[];
  product: StockItem;
  products: any[];
  myControl = new FormControl();
  invControl = new FormControl();
  qtyControl = new FormControl();
  batch: any;
  batches;
  date = new FormControl();
  productFilteredOptions: Observable<StockItem[]>;
  filteredOptions: Observable<Customer[]>;
  displayedColumns: string[] = ["Sno", "itemName", "batchName", "quantity", "rate", "amount", "delete"];
  customerHistoryDisplayedColumn: string[] = ["itemName", "date", "quantity"];
  customerHistoryDataSource: MatTableDataSource<CustomerPrevProduct>;
  customerHistory: CustomerPrevProduct[]; //= [{ _id: { name: "parth" }, date: new Date(), quantity: 0 }];
  dataSource: MatTableDataSource<BilledStockItem>;

  @ViewChild(MatDatepickerModule, { static: false }) datepicker: MatDatepickerModule;
  @ViewChild(MatTable, { static: false }) table: MatTable<BilledStockItem>;
  @ViewChild(MatTable, { static: false }) customerHistoryTable: MatTable<CustomerPrevProduct>;

  @ViewChild('productField', { static: false }) productRef: ElementRef;
  @ViewChild('quantityField', { static: false }) quantityRef: ElementRef
  @ViewChild('customerField', { static: false }) customerRef: ElementRef
  @ViewChild('batchField', { static: false }) batchRef: ElementRef

  editMode: boolean = false;



  constructor(private voucherService?: VoucherService,
    private apiService?: ApiService, private dialog?: MatDialog,
    private dialogConfig?: MatDialogConfig,
    private cookie?: CookieService,
  private posService?: PosService) {

  }

  ngOnInit() {
    let db = new NgxIndexedDB('agrostop', 1);
    db.openDatabase(1, evt => {
    let objectStore = evt.currentTarget.result.createObjectStore('cacheVoucher', { keyPath: "VOUCHERNUMBER",autoIncrement: true });
    let objectStore2 = evt.currentTarget.result.createObjectStore('items', { keyPath: "_NAME",autoIncrement: true, unique: true });
    let objectStore3 = evt.currentTarget.result.createObjectStore('customers', {keyPath: "_id.counter",autoIncrement: true, unique: true });
}).then(res => {

  //Get StockItem for Billing
  this.apiService.getAllStockItemsForBilling().subscribe(
    res1 =>{
        this.products = res1;
        for(var i = 0; i < res1.length; i++){
          db.update('items', res1[i]);
      }
      if (this.editMode){
        var p
      for (let item of this.tallyVoucher.billedStockItems){

        p = this.products.find(x => x.name == item.name);
        item.cgst = p.cgst;
        item.sgst = p.sgst;
        item.hsnCode = p.hsnCode;
      }
    }
      this.productFilteredOptions = this.invControl.valueChanges
              .pipe(
                startWith(''),
                map(value => typeof value === 'string' ? value : value.name),
                map(name => name ? this.product_filter(name) : this.products.slice())
              );
    },
    err1 =>{
      console.log(err1);
    }
  );
  //---------------------------------------------------------------
  //Get Customers for Billing Here
  this.apiService.getCustomers().subscribe(
    res2 =>{
        this.customers = res2;
        for(var i = 0; i < res2.length; i++){
          db.update('customers', res2[i]);
      }
      if (this.editMode){
        this.myControl.setValue(this.customers.find(x => x.id == this.tallyVoucher.customVoucherDetails.customerId));
        this.date.setValue(this.tallyVoucher.customVoucherDetails.date);
      } else{
        this.date.setValue(new Date());
      }
      this.filteredOptions = this.myControl.valueChanges
        .pipe(
          startWith(''),
          map(value => typeof value === 'string' ? value : value.name),
          map(name => name ? this._filter(name) : this.customers.slice())
        );
    },
    err2 =>{
      console.log(err2);
    });


    });
    //---------------------------------------------------------------

    if (this.voucherService.tallyVoucher != null){
      this.tallyVoucher = this.voucherService.tallyVoucher;
      this.editMode = true;
      this.voucherService.tallyVoucher = null;
    }

    this.dataSource = new MatTableDataSource<BilledStockItem>(this.tallyVoucher.billedStockItems)
    this.myControl.setValue(this.customer);
    this.createOnline$().subscribe(isOnline => {
      if(isOnline) {
        this.internetStatus = true;
      } else {
        this.internetStatus = false;
      }
    });


  }


  ngAfterViewInit() {

    //this.customerRef.nativeElement.focus();

  }

  createOnline$() {
      return merge<boolean>(
        fromEvent(window, 'offline').pipe(map(() => false)),
        fromEvent(window, 'online').pipe(map(() => true)),
        new Observable((sub: Observer<boolean>) => {
          sub.next(navigator.onLine);
          sub.complete();
        }));
    }

  resetVoucher() {
    this.myControl.setValue({
      _id: '',
      name: '',
      fatherName: '',
      phoneNumber: '',
      addressId: '',
      fullAddress: new Address(),
      landHolding: 0

    });

    this.tallyVoucher = {
      _id: "",
      customVoucherDetails: {
        date: this.date.value,
        basicBuyerName: "",
        address: "",
        posCashRecieved: 0,
        customerId: "",
        voucherNumber: this.cookie.get('tallyVoucher.voucherNumberPrefix') + "-*********",
        createdBy: ""

      },
      ledgerEntry: {
        cgst: 0,
        sgst: 0,
        roundOff: 0,
        cash: 0,
        subTotal: 0,
        cashLedgerName: this.cookie.get('tallyVoucher.ledgerEntry.cashLedgerName')

      },
      basicVoucherDetails: {
        stateName: "",
        countryOfResidence: "",
        className: this.cookie.get('tallyVoucher.basicVoucherDetails.className'),
        posCashLedgerName: this.cookie.get('tallyVoucher.basicVoucherDetails.posCashLedgerName'),
        basicBasePartyName: this.cookie.get('tallyVoucher.basicVoucherDetails.basicBasePartyName'),
        placeOfSupply: this.cookie.get('tallyVoucher.basicVoucherDetails.placeOfSupply'),
        voucherTypeName: this.cookie.get('tallyVoucher.basicVoucherDetails.voucherTypeName')
      },

      billedStockItems: []
    };
    this.dataSource = new MatTableDataSource<BilledStockItem>(this.tallyVoucher.billedStockItems);
    this.customerHistory = [];
    this.customerHistoryDataSource = new MatTableDataSource<CustomerPrevProduct>(this.customerHistory)
    this.customerRef.nativeElement.focus();
  }

  displayFn(user?: Customer): string | undefined {
    return user ? user.name : undefined;
  }
  displayFnProduct(user?: any): string | undefined {
    return user ? user._NAME : undefined;
  }

  private _filter(name: string): Customer[] {
    const filterValue = name.toLowerCase();

    return this.customers.filter(option => option.phoneNumber.toLowerCase().indexOf(filterValue) === 0);
  }

  private product_filter(name: string): any[] {
    const filterValue = name.toLowerCase();

    return this.products.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
  }

  generateVoucherNumber(): string {
    return this.cookie.get('tallyVoucher.voucherNumberPrefix') + '-' + Date.now().toString(16);
  }



  addStockItem(batchSelected: Batch) {
    let product = this.invControl.value;
    var priceListItem;
    var price;
    if (product.priceList == null){
      alert(product.name+" does not have price defined. Please ask the admin to set price for this product.");
      return;
    }
    if(this.cookie.get('tallyVoucher.basicVoucherDetails.godownName') ==null){
      alert("The current user is not setup for billing properly. Please ask the admin to set up the user properly.");
      return;
    }

    for (let priceListItem of product.priceList) {
      if (priceListItem.godownName == this.cookie.get('tallyVoucher.basicVoucherDetails.godownName')) {
        price = priceListItem.price
      }
    }
    if(price ==null){
      alert("The current godown does not have a price setup for this product. Please ask the admin to set up the price properly.");
      return;
    }
      var item: BilledStockItem = {

        name: product.name,
        godownName: this.cookie.get('tallyVoucher.basicVoucherDetails.godownName'),
        batches: product.batches,
        batch: this.batch,
        quantity: this.qtyControl.value,
        rate: price,
        hsnCode: product.hsnCode,
        cgst: product.cgst,
        sgst: product.sgst,
        amount: price * this.qtyControl.value
      };
      this.tallyVoucher.billedStockItems.push(item);
      this.dataSource._updateChangeSubscription();
      this.invControl.setValue("");
      this.qtyControl.setValue("");
      this.productRef.nativeElement.focus();
      this.calculateInvoiceTotal();



  }


  firstBatch(): Batch {
    let product = this.invControl.value;
    if (product.name) {
      var batchTemp: Batch;
      var entry: Batch;
      for (let entry of product.batches) {
        if (!batchTemp || batchTemp.expiryDate > entry.expiryDate) {
          batchTemp = entry;
        }
      }
      return batchTemp
    }
  }

  deleteItem(item: BilledStockItem) {

    for (var i = 0; i < this.tallyVoucher.billedStockItems.length; i++) {
      if (this.tallyVoucher.billedStockItems[i] === item) {
        this.tallyVoucher.billedStockItems.splice(i, 1);
      }
    }
    this.dataSource._updateChangeSubscription();
    this.calculateInvoiceTotal();
  }

  calculateInvoiceTotal() {
    var item;
    var sgst: number = 0;
    var cgst: number = 0;
    var subTotal: number = 0;
    var total: number = 0;
    for (let item of this.tallyVoucher.billedStockItems) {
      sgst = sgst + ((item.amount * item.sgst) / 100);
      cgst = cgst + ((item.amount * item.cgst) / 100);
      subTotal = subTotal + (item.amount);
      total = subTotal + sgst + cgst;
    }
    this.tallyVoucher.ledgerEntry.cgst = cgst;
    this.tallyVoucher.ledgerEntry.sgst = sgst;
    this.tallyVoucher.ledgerEntry.cash = total;
    this.tallyVoucher.ledgerEntry.subTotal = subTotal;
  }

  validateQuantity() {
    if (!this.qtyControl.value || this.qtyControl.value == 0) {
      this.quantityRef.nativeElement.focus();
    } else {
      this.batch = this.firstBatch();
      this.batchRef.nativeElement.focus();
    }
  }

  validateProduct() {
    if (!this.invControl.value) {
      this.saveVoucher();
    } else {
      if (this.invControl.value.name == null) {
        this.productRef.nativeElement.focus();
      } else {
        this.batches = this.invControl.value.batches;
        this.batch = this.firstBatch();
        this.quantityRef.nativeElement.focus();
      }
    }

  }

  validateCustomer() {
    if (!this.myControl.value) {
      this.createCustomer();
    } else {

      this.displayCustomerHistory();
      this.productRef.nativeElement.focus();
    }

  }

  displayCustomerHistory() {
    this.apiService.getCustomerHistory(JSON.stringify(this.myControl.value._id)).subscribe(
      res => {
        this.customerHistory = res;
        this.customerHistoryDataSource = new MatTableDataSource<CustomerPrevProduct>(this.customerHistory);

      },
      err => {
        console.log("Cannot fetch customer at this moment");
      }
    );
  }

  saveVoucher() {
    if (this.editMode) {
      this.tallyVoucher.customVoucherDetails.basicBuyerName = this.myControl.value.name;
      this.tallyVoucher.customVoucherDetails.address = this.myControl.value.addressName;
      this.tallyVoucher.customVoucherDetails.customerId = this.myControl.value._id;
      this.tallyVoucher.basicVoucherDetails.stateName = this.myControl.value.addressStateName;
      this.tallyVoucher.basicVoucherDetails.countryOfResidence = this.myControl.value.addressCountryName;
    } else {
      this.validateVoucher();
    }

    const dialogRef = this.dialog.open(CashTenderedComponent, {
      width: '350px',
      data: this.tallyVoucher.ledgerEntry.cash
    });
    dialogRef.afterClosed().subscribe(result => {

      if (result) {
        this.tallyVoucher.customVoucherDetails.posCashRecieved = result;
        //this.voucherService.sendVoucher(this.tallyVoucher);
        this.apiService.saveTallyVoucher(this.tallyVoucher).subscribe(
          res => {
            if (res.status == "SUCCESS") {
              this.editMode = false;
              console.log(res.voucherId);
              this.printView.print();
              this.resetVoucher();
            } else if (res.status == "FAILURE") {
              alert(res.cause);
            } else {
              alert("Problem Occured. Please try again later");
            }
          },
          err => {
            if (err.status == 500) {
              this.posService.addCacheVoucher(this.voucher).then(
                () => {
                  alert("Tally is offline. Please try again later. Meanwhile the data is stored locally");

                },
                err => {
                  alert("Tally is offline. Please try again later. Meanwhile the data is stored locally");
                }
              );
            } else {
              this.posService.addCacheVoucher(this.voucher).then(
                () => {
                  alert("Problem ocurred at backend. Please try again later. Meanwhile the data is stored locally");
                },
                err => {
                  alert("Could save voucher locally");
                }
              );

            }

          }
        );
        // DO SOMETHING

      }
    }
  );
  }


  validateVoucher() {
    //var uniqid = require('uniqid');

    this.tallyVoucher.customVoucherDetails.createdBy = this.cookie.get('currentUser');
    this.tallyVoucher.customVoucherDetails.voucherNumber = uniqid.time();
    this.tallyVoucher.customVoucherDetails.date = this.date.value;
    this.tallyVoucher.customVoucherDetails.basicBuyerName = this.myControl.value.name;
    this.tallyVoucher.customVoucherDetails.address = this.myControl.value.addressName;
    this.tallyVoucher.customVoucherDetails.customerId = this.myControl.value._id;
    this.tallyVoucher.basicVoucherDetails.stateName = this.myControl.value.addressStateName;
    this.tallyVoucher.basicVoucherDetails.countryOfResidence = this.myControl.value.addressCountryName;

  }

  createCustomer() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = "50%";
    this.dialog.open(CreateCustomerFormComponent);
  }

  sync() {
    this.apiService.getUserDetails().subscribe(
      res => {
        console.log(res);
        this.cookie.set('tallyVoucher.ledgerEntry.cashLedgerName', res.cashLedgerName),
          this.cookie.set('tallyVoucher.basicVoucherDetails.stateName', res.placeOfSupply),
          this.cookie.set('tallyVoucher.basicVoucherDetails.godownName', res.godownName),
          this.cookie.set('tallyVoucher.basicVoucherDetails.countryOfResidence', "India"),
          this.cookie.set('tallyVoucher.basicVoucherDetails.className', res.posClass),
          this.cookie.set('tallyVoucher.basicVoucherDetails.posCashLedgerName', res.posCashLedgerName),
          this.cookie.set('tallyVoucher.basicVoucherDetails.basicBasePartyName', res.basicBasePartyName),
          this.cookie.set('tallyVoucher.basicVoucherDetails.placeOfSupply', res.placeOfSupply),
          this.cookie.set('tallyVoucher.basicVoucherDetails.voucherTypeName', res.voucherTypeName)
      },
      err => {
        alert("You are not connected to Server at this point");
      }
    )

    this.apiService.getCustomers().subscribe(
      res => {
        this.customers = res;
        this.filteredOptions = this.myControl.valueChanges
          .pipe(
            startWith(''),
            map(value => typeof value === 'string' ? value : value.name),
            map(name => name ? this._filter(name) : this.customers.slice())
          );
      },
      err => {
        console.log("Cannot fetch customer at this moment");
      }
    )
  }

  setTallyVoucher(tallyVoucher: TallyVoucher) {
    this.tallyVoucher = tallyVoucher;
  }

}
export interface InvoiceTotal {
  sgst: number,
  cgst: number,
  subTotal: number,
  total: number,
}

export interface CustomerPrevProduct {

}
