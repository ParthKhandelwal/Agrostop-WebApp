import { Component, OnInit, Input, EventEmitter, Output, ViewChild, AfterViewInit, ElementRef, ChangeDetectorRef } from '@angular/core';
import { VOUCHER, LEDGERENTRIESLIST, OLDAUDITENTRYIDSLIST, ALLINVENTORYENTRIESLIST, BATCHALLOCATIONSLIST, EXPIRYPERIOD, ACCOUNTINGALLOCATIONSLIST, ADDRESSLIST } from '../../Model/voucher';
import { User, VoucherTypeClass } from '../../Model/user';
import { Customer } from '../../Model/customer';
import { ApiService } from '../../shared/api.service';
import { merge, fromEvent, Observable, Observer } from 'rxjs';
import { map, startWith, flatMap } from 'rxjs/operators';
import { MatDialog, MatDialogConfig, MatSelect, MatStepper, MatHorizontalStepper, MatInput } from '@angular/material';
import uniqid from 'uniqid'
import { InvoicePrintViewComponent } from 'src/app/PrintPackage/invoice-print-view/invoice-print-view.component';
import { DatabaseService } from 'src/app/shared/database.service';
import { AppComponent } from 'src/app/app.component';
import { FormControl } from '@angular/forms';
import { CreateCustomerFormComponent } from 'src/app/create-form/create-customer-form/create-customer-form.component';
import { CustomerViewComponent } from 'src/app/view/customer-view/customer-view.component';
import { Order } from 'src/app/Model/order';
import { OrderService } from 'src/app/shared/order.service';
import { StockItem } from 'src/app/Model/stock-item';
import { Address } from 'src/app/Model/address';



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
  rateIncControl = new FormControl();
  productFilteredOptions: Observable<any[]>;
  user: User;
  ledgerList: any[] = [];
  customer: Customer;
  addressList: any[];
  printAfterSave: boolean = true;
  smsAfterSave: boolean;
  @Input("voucher") voucher: VOUCHER;
  @ViewChild('quantityField', { static: false }) quantityRef: ElementRef;
  @ViewChild('createCustomerNameRef', { static: false }) newCustomerNameRef: ElementRef;

  @ViewChild('quantityField', { static: false }) customerRef: ElementRef;
  @ViewChild('rateField', { static: false }) rateRef: ElementRef;  
  @ViewChild('cashRecievedField', { static: false }) cashRecievedRef: ElementRef;  

  @ViewChild('invField', { static: false }) productRef: ElementRef;
  @ViewChild('batchField', { static: false }) batchRef: MatSelect;
  saveOffline: boolean = false;
  disableSaveOption: boolean;
  voucherType: VoucherTypeClass; 
  saving:boolean;
  cacheVoucher: number;
  endVoucher: any ={"NAME": "END OF LIST"};
  
  constructor( private cd?: ChangeDetectorRef,private apiService?: ApiService, private dialog?: MatDialog, private orderService?: OrderService) {
    this.databaseService = AppComponent.databaseService;
    this.user = this.databaseService.getUser();
    this.databaseService.openDatabase().then(
      () => {
        if (this.voucher.VOUCHERNUMBER && !this.voucher.ORDERNUMBER){
          console.log(this.voucher);
          this.godownName = this.voucher.ALLINVENTORYENTRIES_LIST[0].BATCHALLOCATIONS_LIST.GODOWNNAME
          this.voucherType = this.user.voucherTypes.filter((v) => v.voucherTypeName == this.voucher.VOUCHERTYPENAME)[0];
          this.saveOffline = !this.voucher.MASTERID;
          this.voucher.LEDGERENTRIES_LIST
          .filter((l) => l.POSPAYMENTTYPE != null)
          .map((l) => {

            var ledgerEntry: LEDGERENTRIESLIST = new LEDGERENTRIESLIST();
            ledgerEntry.AMOUNT = l.AMOUNT;
            console.log(l);
            ledgerEntry.POSPAYMENTTYPE = ledgerEntry.POSPAYMENTTYPE;
            ledgerEntry.LEDGERNAME = ledgerEntry.LEDGERNAME;
            return ledgerEntry;
          })
          this.disableSaveOption = true;
        }else if(this.voucher.ORDERNUMBER){
          this.voucherType = this.user.voucherTypes.filter((v) => v.voucherTypeName == this.voucher.VOUCHERTYPENAME)[0];
          this.godownName = this.voucher.ALLINVENTORYENTRIES_LIST[0].BATCHALLOCATIONS_LIST.GODOWNNAME
          this.adjustLedgers();
          this.disableSaveOption = true;
          this.saveOffline = false;

        }
        
        else {
          this.setNewVoucher()
        }
        
      },
    )
    
   }
  ngAfterViewInit(): void {
    this.databaseService.openDatabase().then(() => {

      //GETTING ALL THE CUSTOMERS FROM LOCAL STORAGE
      this.databaseService.getCustomers().then((res) => {
        this.customers = res.map((cus) => {
          if (cus.addressId){
            this.databaseService.getAddress(cus.addressId).then(
              (add) => {
                cus.fullAddress = add
              }
            )
          }
          
          return cus;
        });
        
        this.customer = this.customers.filter((cus) => cus.id == this.voucher.BASICBUYERNAME)[0];

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
            (res: StockItem[]) => {
              
     
              this.products = res.map((pro) => {
                pro.BATCHES = batches.filter((batch) => {
                  return (batch.productId == pro.NAME) && (batch.CLOSINGBALANCE != 0) 
                  && (batch.EXPIRYDATE ? new Date(batch.EXPIRYDATE) >= new Date(): true);
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
        
      this.databaseService.getAddresses().then(
        res => {
          this.addresses = res;
          this.addressFilteredOptions = this.addressControl.valueChanges.pipe(
            startWith(''),
            map(value => this.address_filter(value))
          );
        },
        err=>{
          console.log("Cannot fetch customer at this moment");
        }
      )


      
    
      this.databaseService.getLedgers().then((res)=> this.sundryDebtors = res);
    })
    
    
  }


  ngOnInit() {        
      
  }

  addresses: Address[] = [];
  addressFilteredOptions: Observable<any[]>;
  addressControl = new FormControl();
  address: Address = new Address();
  disableSaveButton : boolean
  createCustomer: Customer = new Customer();
  customerCreationActive: boolean;

  displayFnAddress(user?: any): string | undefined {
    return user && user._id ? user.name : '';
  }
  private address_filter(value: string): any[] {
    const filterValue = value.toString().toLowerCase();
    return this.addresses.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
  }


  submit(stepper): void{
    this.disableSaveButton = true;
    this.createCustomer.addressId = this.address._id
    this.apiService.addCustomer(this.createCustomer).subscribe(
      result =>{
        
        if (result && result.id){
          this.databaseService.addCustomer(result)
          this.databaseService.getAddress(result.addressId).then(
            (add) =>{
              result.fullAddress = add;
              this.customers.push(result);
              this.createCustomer = new Customer();
              this.disableSaveButton = false;
              this.customerCreationActive = false;
              this.customer = result;
              this.addCustomer(this.customer, stepper);
            })
          
        }
        
      },
      err =>{
        console.log(err);
        alert("Cannot create customer at this point");
      }
    );
  }

  private customer_filter(value: string): Customer[] {
    const filterValue = value? value.toString().toLowerCase(): "";
    return this.customers.filter(option => {
      return option.phoneNumber.toLowerCase().indexOf(filterValue) === 0 
      || option.name.toLowerCase().indexOf(filterValue) === 0;
    }
    )
      
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
    
    this.databaseService.countCacheVoucher();
    this.customer = new Customer();
    this.renew();
    this.godownName = this.databaseService.getGodown();
    const voucherType = this.databaseService.getVoucherType();
    const posClass = this.databaseService.getPOSClass();
    const priceList = this.databaseService.getPriceList();
    this.voucherType = this.user.voucherTypes.filter((v) => v.voucherTypeName == voucherType.NAME)[0];
    if (!voucherType && !posClass && !this.godownName && !priceList ){
      return;
    }
    this.voucher = new VOUCHER();
    this.voucher.DATE = new Date();
    this.voucher._REMOTEID = uniqid();
    
    this.voucher.VOUCHERTYPENAME = voucherType.NAME;
    this.voucher._VCHTYPE = voucherType.NAME;
    this.voucher._OBJVIEW = "Invoice Voucher View";
    this.voucher._ACTION = "Create";
    this.voucher.CLASSNAME = posClass.CLASSNAME.content;
    this.voucher.PERSISTEDVIEW = "Invoice Voucher View";
    this.voucher.LEDGERENTRIES_LIST = [];
    this.voucher.PRICELEVEL = priceList;

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


  createNewCustomer(){
    this.createCustomer.phoneNumber = this.customerControl.value;
    this.customerCreationActive = true; 
    this.createCustomer.gSTREGISTRATIONTYPE = 'Consumer';
    this.cd.detectChanges();
    this.newCustomerNameRef.nativeElement.focus();
  }


  getVoucherType(value){
    
    const service = this.databaseService;
    

    let voucherType: any;
    this.databaseService.getVoucherTypeByName(value.voucherTypeName).then(
      res => {voucherType = res;
        console.log(service);
        service.saveVoucherType(voucherType);
      if (voucherType["VOUCHERCLASSLIST.LIST"] instanceof Array){
        var found : boolean = false;
        for (let item of voucherType["VOUCHERCLASSLIST.LIST"]){
          console.log(item.CLASSNAME.content);
          console.log()
          if (item.CLASSNAME.content == value.voucherClass){
            service.saveClass(item);
            this.setNewVoucher();
            found = true;
          }
        }
        if (!found){
          alert("The POS Class does not exists. Please ask administrator to update your profile.")
        }
      } else {
        if (voucherType["VOUCHERCLASSLIST.LIST"].CLASSNAME.content == value.voucherClass){
          service.saveClass(voucherType["VOUCHERCLASSLIST.LIST"]);
        }else {
          alert("The POS Class does not exists. Please ask administrator to update your profile.")
        }
      }

      },
      err => {
        console.log(err);
      }
    )
    
  }

  addCustomer(value, stepper){
    this.voucher.BASICBUYERNAME = value.id;
    this.voucher.ADDRESS_LIST = new ADDRESSLIST(value.name, value.fullAddress.name,"", "");
    stepper._selectedIndex = 2;
    
    setTimeout(()=>{ // this will make the execution after the above boolean has changed
      this.cd.detectChanges();
      this.productRef.nativeElement.focus();
    },1000);

  }

  viewCustomerProfile(id) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = "50%";

    const dialogRef = this.dialog.open(CustomerViewComponent, {
      data: id,
      maxHeight: '90vh'
    });

    dialogRef.afterClosed().subscribe(
      (res1: Order) => {
        this.orderService.convertOrder(res1, this.voucher, this.databaseService.getVoucherType(), this.databaseService.getPriceList(), this.databaseService.getGodown()).then(res => {
          this.voucher = res;
        
          console.log(this.voucher);
        });
      }
    );

    
  }

  
  async save() {
    this.saving = true;
    this.voucher.LEDGERENTRIES_LIST.map((ledger) => {
      if (ledger.POSPAYMENTTYPE){
        ledger.AMOUNT = Math.abs(ledger.AMOUNT) * (-1);
      }
    });
    if (!this.voucher.VOUCHERNUMBER){
      const num = await this.apiService.getVoucherNumber(this.voucher.VOUCHERTYPENAME).toPromise();
      if(num && num.seq){
        this.voucher.VOUCHERNUMBER = num.prefix + num.seq;
      }else {
        this.voucher.VOUCHERNUMBER = "DM-"+this.voucher._REMOTEID;
      }  
    }
    if(!this.saveOffline) {
      var res = await this.apiService.saveTallyVoucher(this.voucher).toPromise();
      if (res && res.RESPONSE){
        if (res.RESPONSE.CREATED == 1 || res.RESPONSE.UPDATED == 1){
          this.afterVoucherSaveProcess();
          return
        }
      }
    }
    await this.databaseService.addCacheVoucher(this.voucher);
    this.afterVoucherSaveProcess();
    return; 
  }

  saveVoucherOffline(voucher){
    this.databaseService.addCacheVoucher(voucher);
  }

  afterVoucherSaveProcess(){
    this.printVoucher();
    this.saving = false;
  }

  

  printVoucher(){
    if(this.printAfterSave){
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
    if(this.smsAfterSave){
      alert("Voucher messaging service not available");
    }
  
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


  selectInventory(stepper, pro:StockItem){
    if (this.productControl.value == this.endVoucher){
      stepper._selectedIndex = 3;
      this.getRemainingBalance();
      setTimeout(()=>{ // this will make the execution after the above boolean has changed
        this.cd.detectChanges();
        this.cashRecievedRef.nativeElement.focus();
      },1000);
      return;
    }
    console.log(pro)
    var temp = Object.assign(new StockItem(), pro);
    this.rateControl.setValue( temp.getRate(this.voucher.PRICELEVEL));
    this.rateIncControl.setValue(temp.getRateInclusiveOfTax(this.rateControl.value, ""));
    this.quantityRef.nativeElement.focus();
  }

  setRateInclusiveOfTax(){
    var temp = Object.assign(new StockItem(), this.productControl.value);
    this.rateIncControl.setValue(temp.getRateInclusiveOfTax(this.rateControl.value, ""));
    this.batchRef.focus();
  }

  validateInventoryEntry(){
   
    if (this.productControl.value == null || this.productControl.value ==""){
      this.productRef.nativeElement.focus();
      return;
    }
   
    if (this.batchControl.value == null){
      alert("Please select a batch");
      this.batchRef.focus();
      return;
    }
    if (this.qtyControl.value == null || this.qtyControl.value == 0){
      this.quantityRef.nativeElement.focus();
      return;
    }
    const res: StockItem = this.productControl.value;
    console.log(res);
    var inventoryEntry: ALLINVENTORYENTRIESLIST = new ALLINVENTORYENTRIESLIST();
    inventoryEntry.STOCKITEMNAME = res.NAME;
    inventoryEntry.BILLEDQTY = this.qtyControl.value;
    inventoryEntry.ACTUALQTY = inventoryEntry.BILLEDQTY;
    inventoryEntry.ISDEEMEDPOSITIVE = "No";
    inventoryEntry.RATE = this.rateControl.value;
    console.log(this.rateControl.value)
    inventoryEntry.BATCHALLOCATIONS_LIST = new BATCHALLOCATIONSLIST();
    inventoryEntry.BATCHALLOCATIONS_LIST.BATCHNAME = this.batchControl.value.NAME;
    inventoryEntry.BATCHALLOCATIONS_LIST.GODOWNNAME = this.databaseService.getGodown();
    inventoryEntry.BATCHALLOCATIONS_LIST.BILLEDQTY = inventoryEntry.BILLEDQTY;
    inventoryEntry.BATCHALLOCATIONS_LIST.ACTUALQTY = inventoryEntry.ACTUALQTY;
    inventoryEntry.BATCHALLOCATIONS_LIST.AMOUNT = Math.round(inventoryEntry.RATE * inventoryEntry.BILLEDQTY*100)/100;
    inventoryEntry.BATCHALLOCATIONS_LIST.EXPIRYPERIOD = new EXPIRYPERIOD(this.batchControl.value.EXPIRYDATE 
      ? new Date(this.batchControl.value.EXPIRYDATE)
      : null);
    

    inventoryEntry.AMOUNT =  Math.round(inventoryEntry.RATE * inventoryEntry.BILLEDQTY*100)/100;
    inventoryEntry.ACCOUNTINGALLOCATIONS_LIST = new ACCOUNTINGALLOCATIONSLIST();
    
      
    
    inventoryEntry.ACCOUNTINGALLOCATIONS_LIST.LEDGERNAME = res.salesList[0].name;
    inventoryEntry.ACCOUNTINGALLOCATIONS_LIST.CLASSRATE = res.salesList[0].classRate;
    inventoryEntry.ACCOUNTINGALLOCATIONS_LIST.LEDGERFROMITEM = res.salesList[0].ledgerFromItem;
    inventoryEntry.ACCOUNTINGALLOCATIONS_LIST.GSTOVRDNNATURE = res.salesList[0].gstCLassificationNature;
    inventoryEntry.ACCOUNTINGALLOCATIONS_LIST.REMOVEZEROENTRIES = res.salesList[0].removeZeroEntries;
    inventoryEntry.ACCOUNTINGALLOCATIONS_LIST.AMOUNT = inventoryEntry.AMOUNT;
    inventoryEntry.ACCOUNTINGALLOCATIONS_LIST.LEDGERFROMITEM = "Yes"
    inventoryEntry.ACCOUNTINGALLOCATIONS_LIST.ISDEEMEDPOSITIVE = "No"
  
    this.voucher.ALLINVENTORYENTRIES_LIST.push(inventoryEntry);
    this.adjustLedgers();
    this.renew()
    this.cd.detectChanges();
    this.productRef.nativeElement.focus();

}
productFocus:boolean;
  renew(){
    
    this.productControl.setValue("");
    this.qtyControl.setValue(null);
    this.rateControl.setValue(null);
    this.batchControl.setValue(null);
    
  }

  deleteStockItem(pos: number){
    this.voucher.ALLINVENTORYENTRIES_LIST.splice(pos,1);
    this.adjustLedgers();
  }

  adjustLedgers(){
    console.log(this.voucher);
    this.voucher.LEDGERENTRIES_LIST.filter((ledger) => !ledger.POSPAYMENTTYPE && ledger.METHODTYPE == "GST")
    .forEach((ledger) => this.calculate(ledger));
    this.voucher.LEDGERENTRIES_LIST.filter((ledger) => !ledger.POSPAYMENTTYPE && ledger.METHODTYPE == "As Total Amount Rounding")
    .forEach((ledger) => this.calculate(ledger));
   this.cd.detectChanges();
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
        
              this.databaseService.getStockItem(product.STOCKITEMNAME).then( (productItem: StockItem) => {
                var item = Object.assign(new StockItem(), productItem);
              
                ledger.AMOUNT = ledger.AMOUNT + item.getTax(product.BILLEDQTY,product.RATE,"",gstDutyHead)
                ledger.AMOUNT =  parseFloat((Math.round(ledger.AMOUNT * 100) / 100).toFixed(2));
                this.adjustRounding();
                
              
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

  cashLedger: LEDGERENTRIESLIST;
  getRemainingBalance(){
    var temp: number = 0;
    var withoutCash: number = 0;
   
    if (!this.cashLedger){
      this.cashLedger = this.voucher.LEDGERENTRIES_LIST.filter((led) => led.POSPAYMENTTYPE == "Cash")[0];
    }
    
    for (let i of this.voucher.LEDGERENTRIES_LIST){
      if ((i.POSPAYMENTTYPE != null && i.POSPAYMENTTYPE != "") && i.AMOUNT != null){
        temp = temp + i.AMOUNT;
        if (i.POSPAYMENTTYPE != "Cash" && i.AMOUNT){
        
          withoutCash = withoutCash + i.AMOUNT;
          
        }
      }
      
    }
    
    if (this.cashLedger){
      this.cashLedger.AMOUNT = (Math.round((this.getTotal() - withoutCash)*100))/100;
    }

    return 0;
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
