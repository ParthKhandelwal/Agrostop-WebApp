import { Component, OnInit, Input, EventEmitter, Output, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { VOUCHER, LEDGERENTRIESLIST, OLDAUDITENTRYIDSLIST, ALLINVENTORYENTRIESLIST, BATCHALLOCATIONSLIST, EXPIRYPERIOD, ACCOUNTINGALLOCATIONSLIST, ADDRESSLIST } from '../../Model/voucher';
import { VoucherService } from '../../shared/voucher.service';
import { User } from '../../Model/user';
import { Customer } from '../../Model/customer';
import { ApiService } from '../../shared/api.service';
import { PosService } from 'src/app/shared/pos.service';
import { merge, fromEvent, Observable, Observer, of, from } from 'rxjs';
import { map, filter, startWith } from 'rxjs/operators';
import { ThemePalette, MatDialog, MatDialogConfig, MatSelect } from '@angular/material';
import uniqid from 'uniqid'
import { InvoicePrintViewComponent } from 'src/app/PrintPackage/invoice-print-view/invoice-print-view.component';
import { UniqueSelectionDispatcher } from '@angular/cdk/collections';
import { DatabaseService } from 'src/app/shared/database.service';
import { AppComponent } from 'src/app/app.component';
import { FormControl } from '@angular/forms';
import { timingSafeEqual } from 'crypto';
import { CreateCustomerFormComponent } from 'src/app/create-form/create-customer-form/create-customer-form.component';



@Component({
  selector: 'voucher-wizard',
  templateUrl: './voucher-wizard.component.html',
  styleUrls: ['./voucher-wizard.component.css']
})
export class VoucherWizardComponent implements OnInit, AfterViewInit {
  printReady: boolean = false;
  
  printView: boolean = false;
  databaseService: DatabaseService;
  godownName: string;
  customers: any[];
  products: any[];
  batches: any[];
  sundryDebtors: any[];
  customerControl = new FormControl();
  rateControl = new FormControl();
  qtyControl = new FormControl();
  batchControl = new FormControl();
  customerFilteredOptions: Observable<Customer[]>;
  productControl = new FormControl();
  productFilteredOptions: Observable<any[]>;
  user: User;
  ledgerList: any[] = [];
  customer: Customer;
  @Input("voucher") voucher: VOUCHER;
  @ViewChild('quantityField', { static: false }) quantityRef: ElementRef;
  @ViewChild('rateField', { static: false }) rateRef: ElementRef;

  @ViewChild('invField', { static: false }) productRef: ElementRef;
  @ViewChild('batchField', { static: false }) batchRef: MatSelect;
  saveOffline: boolean = false;
  
  constructor( private apiService?: ApiService, private dialog?: MatDialog,) {
    this.databaseService = AppComponent.databaseService;
    this.user = this.databaseService.getUser();
    this.databaseService.openDatabase().then(
      () => this.setNewVoucher(),
    )
    
   }
  ngAfterViewInit(): void {
    this.databaseService.openDatabase().then(() => {

      //GETTING ALL THE CUSTOMERS FROM LOCAL STORAGE
      this.databaseService.getCustomers().then((res) => {
        this.customers = res.map((cus) => {
          this.databaseService.getAddress(cus.addressId).then(
            (add) => {
              cus.fullAddress = add
            }
          )
          return cus;
        });
        console.log(this.customers);
        this.customerFilteredOptions = this.customerControl.valueChanges.pipe(
          startWith(''),
          map(value => this.customer_filter(value))
        );
      });

      //GETTING ALL THE BATCHES
       //GETTING ALL THE PRODUCTS FROM LOCAL STORAGE
      this.databaseService.getProductBatch().then(
        (batches)=> {
          this.batches = batches;
          this.databaseService.getAllStockItemsForBilling().then(
            (res) => {
              
     
              this.products = res.map((pro) => {
                pro.BATCHES = batches.filter((batch) => {
                  return batch.productId == pro.NAME
                })
                return pro;
              })
              this.productFilteredOptions = this.productControl.valueChanges.pipe(
                startWith(''),
                map(value => this.product_filter(value))
              );
              
            }
            );
        }
      )
        


      
    
      this.databaseService.getLedgers().then((res)=> this.sundryDebtors = res);
    })
    
    
  }

  ngOnInit() {        
      
  }

  private customer_filter(value: string): Customer[] {
    const filterValue = value.toString().toLowerCase();
    return this.customers.filter(option => 
      option.phoneNumber.toLowerCase().indexOf(filterValue) === 0);
  }

  private product_filter(value: string): any[] {
    const filterValue = value.toString().toLowerCase();
    return this.products.filter(option => option.NAME.toLowerCase().indexOf(filterValue) === 0);
  }

  displayFnCustomer(user?: any): string | undefined {
    return user && user.phoneNumber ? user.phoneNumber : '';
  }

  displayFnProduct(user?: any): string | undefined {
    return user && user.NAME ? user.NAME : '';
  }

  setNewVoucher(){
    this.customer = new Customer();
    this.renew();
    this.godownName = this.databaseService.getGodown();
    this.voucher = new VOUCHER();
    this.voucher.DATE = new Date();
    this.voucher._REMOTEID = uniqid();
    const voucherType = this.databaseService.getVoucherType();
    const posClass = this.databaseService.getPOSClass();
    this.voucher.VOUCHERTYPENAME = voucherType.NAME;
    this.voucher._VCHTYPE = voucherType.NAME;
    this.voucher._OBJVIEW = "Invoice Voucher View";
    this.voucher._ACTION = "Create";
    this.voucher.CLASSNAME = posClass.CLASSNAME.content;
    this.voucher.PERSISTEDVIEW = "Invoice Voucher View";
    this.voucher.VOUCHERNUMBER = "TT-" + this.voucher._REMOTEID;
    this.voucher.LEDGERENTRIES_LIST = [];
    this.voucher.PRICELEVEL = this.databaseService.getPriceList();

    this.ledgerList = [];
    var tempArray: any[] = [];
    if (posClass["LEDGERENTRIESLIST.LIST"] instanceof Array){
      tempArray = posClass["LEDGERENTRIESLIST.LIST"]
    } else{
      tempArray.push(posClass["LEDGERENTRIESLIST.LIST"])
    }
    for (let ledger of tempArray){
      if (ledger.NAME){

      this.databaseService.getLedger(ledger.NAME.content).then(
        res1 =>{
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
          this.voucher.LEDGERENTRIES_LIST.push(ledgerEntry);
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
      this.voucher.LEDGERENTRIES_LIST.push(ledgerEntry)
    }

    if (posClass.POSENABLECASHLEDGER){
      var ledgerEntry: LEDGERENTRIESLIST = new LEDGERENTRIESLIST();
      ledgerEntry.LEDGERNAME = posClass.POSCASHLEDGER.content
      ledgerEntry.POSPAYMENTTYPE = "Cash";
      this.voucher.LEDGERENTRIES_LIST.push(ledgerEntry);
    }

    if (posClass.POSENABLECHEQUELEDGER){
      var ledgerEntry: LEDGERENTRIESLIST = new LEDGERENTRIESLIST();
      ledgerEntry.LEDGERNAME = posClass.POSCHEQUELEDGER.content
      ledgerEntry.POSPAYMENTTYPE = "Cheque";
      this.voucher.LEDGERENTRIES_LIST.push(ledgerEntry)
    }

    if (posClass.POSENABLEGIFTLEDGER){
      var ledgerEntry: LEDGERENTRIESLIST = new LEDGERENTRIESLIST();
      ledgerEntry.LEDGERNAME = posClass.POSGIFTLEDGER.content
      ledgerEntry.POSPAYMENTTYPE = "Gift";
      this.voucher.LEDGERENTRIES_LIST.push(ledgerEntry);
    }

  }


  addCustomer(value){
    console.log(this.voucher);
    this.voucher.BASICBUYERNAME = value.id;
    this.voucher.ADDRESS_LIST = new ADDRESSLIST(value.addressId, "","", "");
  }

  
  save() {
    

    if (this.saveOffline){
      this.databaseService.addCacheVoucher(this.voucher).then(
        () => {
          console.log("Saving Voucher locally...")
          this.printVoucher();
        }
      )
    }else {
      this.apiService.saveTallyVoucher(this.voucher).subscribe(
        res => {
          if (res && res.RESPONSE){
          if (res.RESPONSE.CREATED == 1 || res.RESPONSE.UPDATED == 1){
            alert("Voucher Saved to Tally Successfully")
            this.printVoucher();
          } else {
            
  
            this.databaseService.addCacheVoucher(this.voucher).then(
              () => {
                this.printVoucher();
              }
            )
            
          }
        }else {
          this.databaseService.addCacheVoucher(this.voucher).then(
            () => {
              this.printVoucher();
            }
          )
        }
        },
        err => {
         
            this.databaseService.addCacheVoucher(this.voucher).then(
              () => {
                
                this.printVoucher();
          
                
              }
            )
          
          
        }
      );
    }
    

    
    
  }


  

  printVoucher(){
  const dialogConfig = new MatDialogConfig();
   dialogConfig.autoFocus = true;
   dialogConfig.width = "50%";
   const dialogRef = this.dialog.open(InvoicePrintViewComponent, {data: this.voucher, maxHeight: '90vh'});
    dialogRef.afterClosed().subscribe(
      res => {
        this.setNewVoucher();
      }
    )
  }

  

  
  createCustomerAction() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = "50%";
    const dialogRef = this.dialog.open(CreateCustomerFormComponent, { maxHeight: '90vh' });
    dialogRef.afterClosed().subscribe((result: any) => {
      //@TODO: Save the recently added customer to local storage andto the customer List
      if (result && result.id){
  
          this.databaseService.addCustomer(result)
          this.databaseService.getCustomers().then(
            res => {
              this.customers = res
              this.customerFilteredOptions = this.customerControl.valueChanges.pipe(
                startWith(''),
                map(value => this.customer_filter(value))
              );
              
            }
        )
     
      
    }
  },
    err => console.log(err)
    );
  }

  getRate(res: any){
        var returnObject = {rate : 0, exists: false}
        var tempDate: Date = null;
        if (res["FULLPRICELIST.LIST"] instanceof Array){
          for (let item of res["FULLPRICELIST.LIST"]){
            if (item.PRICELEVEL.content == this.voucher.PRICELEVEL && item["PRICELEVELLIST.LIST"].RATE != null){
        
              if(!tempDate || tempDate< new Date(item["PRICELEVELLIST.LIST"].DATE.content)){
                
                  returnObject.exists = true;
                  tempDate = new Date(item["PRICELEVELLIST.LIST"].DATE.content);
                  let temp:string = item["PRICELEVELLIST.LIST"].RATE.content;
                  returnObject.rate = +this.getNumbers(temp);
                
              }
            }
          }
          
      } else {
        if (res && res["FULLPRICELIST.LIST"] && res["FULLPRICELIST.LIST"].PRICELEVEL
        && res["FULLPRICELIST.LIST"].PRICELEVEL.content == this.voucher.PRICELEVEL){
          if (res["FULLPRICELIST.LIST"]["PRICELEVELLIST.LIST"].RATE != null){
          let temp:string = res["FULLPRICELIST.LIST"]["PRICELEVELLIST.LIST"].RATE.content;
            returnObject.exists = true;
          returnObject.rate =  +this.getNumbers(temp);
          }
      }
    }
    return returnObject;
  }

  validateInventoryEntry(){
    if (this.productControl.value == null || this.productControl.value ==""){
      this.productRef.nativeElement.focus();
      return;
    }
   
    if (this.batchControl.value == null){
      alert("Please select a batch");
      return;
    }
    if (this.qtyControl.value == null || this.qtyControl.value == 0){
      this.quantityRef.nativeElement.focus();
      return;
    }
    const res = this.productControl.value;
    console.log(res);
    var inventoryEntry: ALLINVENTORYENTRIESLIST = new ALLINVENTORYENTRIESLIST();
    inventoryEntry.STOCKITEMNAME = res.NAME;
    inventoryEntry.BILLEDQTY = this.qtyControl.value;
    inventoryEntry.ACTUALQTY = inventoryEntry.BILLEDQTY;
    inventoryEntry.ISDEEMEDPOSITIVE = "No";
    var rateObject = this.getRate(res);
    if (rateObject.exists){
      inventoryEntry.RATE = rateObject.rate;
    }else {
      alert("There is no price set for this item. Try changing price list or contact administrator.")
      this.renew();
      return;
    }
    
    console.log(this.batchControl.value);
    inventoryEntry.BATCHALLOCATIONS_LIST = new BATCHALLOCATIONSLIST();
    inventoryEntry.BATCHALLOCATIONS_LIST.BATCHNAME = this.batchControl.value.NAME;
    inventoryEntry.BATCHALLOCATIONS_LIST.GODOWNNAME = this.databaseService.getGodown();
    inventoryEntry.BATCHALLOCATIONS_LIST.BILLEDQTY = inventoryEntry.BILLEDQTY;
    inventoryEntry.BATCHALLOCATIONS_LIST.ACTUALQTY = inventoryEntry.ACTUALQTY;
    inventoryEntry.BATCHALLOCATIONS_LIST.AMOUNT = inventoryEntry.RATE * inventoryEntry.BILLEDQTY;
    inventoryEntry.BATCHALLOCATIONS_LIST.EXPIRYPERIOD = new EXPIRYPERIOD(this.batchControl.value.EXPIRYDATE 
      ? new Date(this.batchControl.value.EXPIRYDATE)
      : null);
    

    inventoryEntry.AMOUNT = inventoryEntry.RATE * inventoryEntry.BILLEDQTY;
    inventoryEntry.ACCOUNTINGALLOCATIONS_LIST = new ACCOUNTINGALLOCATIONSLIST();
    inventoryEntry.ACCOUNTINGALLOCATIONS_LIST.LEDGERNAME = res["SALESLIST.LIST"].NAME.content;
    inventoryEntry.ACCOUNTINGALLOCATIONS_LIST.CLASSRATE = res["SALESLIST.LIST"].CLASSRATE.content;
    inventoryEntry.ACCOUNTINGALLOCATIONS_LIST.LEDGERFROMITEM = res["SALESLIST.LIST"].LEDGERFROMITEM.content;
    inventoryEntry.ACCOUNTINGALLOCATIONS_LIST.GSTOVRDNNATURE = res["SALESLIST.LIST"].GSTCLASSIFICATIONNATURE.content;
    inventoryEntry.ACCOUNTINGALLOCATIONS_LIST.REMOVEZEROENTRIES = res["SALESLIST.LIST"].REMOVEZEROENTRIES.content;
    inventoryEntry.ACCOUNTINGALLOCATIONS_LIST.AMOUNT = inventoryEntry.AMOUNT;
    inventoryEntry.ACCOUNTINGALLOCATIONS_LIST.LEDGERFROMITEM = "Yes"
    inventoryEntry.ACCOUNTINGALLOCATIONS_LIST.ISDEEMEDPOSITIVE = "No"
  
    this.voucher.ALLINVENTORYENTRIES_LIST.push(inventoryEntry);
    this.adjustLedgers();
    this.renew()


}

  renew(){
    this.productControl.setValue("");
    this.qtyControl.setValue(null);
    this.rateControl.setValue(null);
    this.batchControl.setValue(null);
    this.productRef.nativeElement.focus();
  }

  deleteStockItem(pos: number){
    this.voucher.ALLINVENTORYENTRIES_LIST.splice(pos);
    this.adjustLedgers();
  }

  adjustLedgers(){
    console.log(this.voucher);
    this.voucher.LEDGERENTRIES_LIST.filter((ledger) => !ledger.POSPAYMENTTYPE && ledger.METHODTYPE == "GST")
    .forEach((ledger) => this.calculate(ledger));
    this.voucher.LEDGERENTRIES_LIST.filter((ledger) => !ledger.POSPAYMENTTYPE && ledger.METHODTYPE == "As Total Amount Rounding")
    .forEach((ledger) => this.calculate(ledger));
   
  }

  adjustRounding(){
    this.voucher.LEDGERENTRIES_LIST.filter((ledger) => !ledger.POSPAYMENTTYPE && ledger.METHODTYPE == "As Total Amount Rounding")
    .forEach((ledger) => this.calculate(ledger));
  }

  calculate(ledger: LEDGERENTRIESLIST) {
    ledger.AMOUNT = 0
    switch(ledger.METHODTYPE){
      case "GST" :
      
        var gstDutyHead: any;
        this.databaseService.getLedger(ledger.LEDGERNAME).then(
          res => {
            gstDutyHead = res.GSTDUTYHEAD.content
       
            for (let product of this.voucher.ALLINVENTORYENTRIES_LIST){
        
              this.databaseService.getStockItem(product.STOCKITEMNAME).then( (item) => {
            
                if (item["GSTDETAILS.LIST"] 
              && item["GSTDETAILS.LIST"]["STATEWISEDETAILS.LIST"] 
              && item["GSTDETAILS.LIST"]["STATEWISEDETAILS.LIST"]["RATEDETAILS.LIST"]){
                var gstRate = item["GSTDETAILS.LIST"]["STATEWISEDETAILS.LIST"]["RATEDETAILS.LIST"]
                .filter((rate) => rate.GSTRATEDUTYHEAD.content == gstDutyHead)[0]
                .GSTRATE.content
               
                
                ledger.AMOUNT = ledger.AMOUNT + (Math.round(gstRate * product.AMOUNT *1.0)/100);
                this.adjustRounding();
      
              }
              } );
              
            }
          
          }
        )
        break;

      case "As Total Amount Rounding":
          var total: number =0 
          for (let item of this.voucher.LEDGERENTRIES_LIST){
            if (item.AMOUNT != null && item.METHODTYPE !="As Total Amount Rounding"
            && (item.POSPAYMENTTYPE == null || item.POSPAYMENTTYPE == "")){
              console.log(item.AMOUNT);
              total = total + item.AMOUNT;
            }
          }
      
          for (let item of this.voucher.ALLINVENTORYENTRIES_LIST){
            if (item.AMOUNT != null){
              total = total + item.AMOUNT;
            }
          }
          
          ledger.AMOUNT =  Math.round((Math.round(total) - total)*100) *0.01;
          break;
      case "As User Defined Value":
          break;

    }
  }

  getRemainingBalance(){
    var temp: number = 0;
    var cashLedger: LEDGERENTRIESLIST = new LEDGERENTRIESLIST();
    
    for (let i of this.voucher.LEDGERENTRIES_LIST){
      if ((i.POSPAYMENTTYPE != null && i.POSPAYMENTTYPE != "") && i.AMOUNT != null){
        temp = temp + i.AMOUNT;
      }
    }
    

    return (Math.round((this.getTotal() - temp)*100))/100;
  }

  getTotal(){

    var total: number =0 
    for (let item of this.voucher.LEDGERENTRIES_LIST){
      if (item.AMOUNT != null && (item.POSPAYMENTTYPE == null || item.POSPAYMENTTYPE == "")){
        total = total + item.AMOUNT;
      }
    }

    for (let item of this.voucher.ALLINVENTORYENTRIES_LIST){
      if (item.AMOUNT != null){
        total = total + item.AMOUNT;
      }
    }

    return total;
  
  }

  getNumbers(temp: string): number{
    
    var returnNumber;
    returnNumber = temp.replace(/\//g, "");
    returnNumber = returnNumber.replace(/[^\d.-]/g, "");

    return returnNumber;
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
}
