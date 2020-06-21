import { Component, OnInit, Input, EventEmitter, Output, ViewChild, AfterViewInit, ElementRef, ChangeDetectorRef } from '@angular/core';
import { VOUCHER, LEDGERENTRIESLIST, OLDAUDITENTRYIDSLIST, ALLINVENTORYENTRIESLIST, BATCHALLOCATIONSLIST, EXPIRYPERIOD, ACCOUNTINGALLOCATIONSLIST, ADDRESSLIST, PrintConfiguration } from '../../Model/voucher';
import { User, VoucherTypeClass } from '../../Model/user';
import { Customer } from '../../Model/customer';
import { ApiService } from '../../shared/api.service';
import { merge, fromEvent, Observable, Observer } from 'rxjs';
import { map, startWith, flatMap } from 'rxjs/operators';
import { MatDialog, MatDialogConfig, MatSelect, MatStepper, MatHorizontalStepper, MatInput } from '@angular/material';
import uniqid from 'uniqid'
import { InvoicePrintViewComponent, PrintTaxItem } from 'src/app/PrintPackage/invoice-print-view/invoice-print-view.component';
import { DatabaseService } from 'src/app/shared/database.service';
import { AppComponent } from 'src/app/app.component';
import { FormControl } from '@angular/forms';
import { CustomerViewComponent } from 'src/app/view/customer-view/customer-view.component';
import { Order } from 'src/app/Model/order';
import { OrderService } from 'src/app/shared/order.service';
import { StockItem } from 'src/app/Model/stock-item';
import { Address } from 'src/app/Model/address';
import { AutoCompleteComponent } from 'src/app/AgroComponent/auto-complete/auto-complete.component';
import { ObjectId } from 'bson';

@Component({
  selector: 'voucher-wizard',
  templateUrl: './voucher-wizard.component.html',
  styleUrls: ['./voucher-wizard.component.css']
})
export class VoucherWizardComponent implements OnInit {
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
  @ViewChild('productAutoComp', { static: false}) productAutoComplete: AutoCompleteComponent;
  @ViewChild('customerAutoComp', { static: false}) customerAutoComplete: AutoCompleteComponent;
  
  @ViewChild('batchField', { static: false }) batchRef: MatSelect;
  saveOffline: boolean = true;
  disableSaveOption: boolean;
  voucherType: VoucherTypeClass; 
  saving:boolean;
  cacheVoucher: number;
  endVoucher: any ={"NAME": "END OF LIST"};
  
  loading: boolean;
  
  constructor( private cd?: ChangeDetectorRef,private apiService?: ApiService, private dialog?: MatDialog, private orderService?: OrderService) {
    this.databaseService = AppComponent.databaseService;
    this.user = this.databaseService.getUser();
    this.databaseService.openDatabase().then(
      async () => {
        if (this.voucher.VOUCHERNUMBER && !this.voucher.ORDERNUMBER){
          this.voucher = Object.assign(new VOUCHER(), this.voucher);
          await this.voucher.getTallyObject();
          this.godownName = this.voucher.ALLINVENTORYENTRIES_LIST[0].BATCHALLOCATIONS_LIST.GODOWNNAME
          this.voucherType = this.user.voucherTypes.filter((v) => v.voucherTypeName == this.voucher.VOUCHERTYPENAME)[0];
          this.saveOffline = !this.voucher.MASTERID;
          this.customer = await this.databaseService.getCustomer(this.voucher.BASICBUYERNAME);
          this.disableSaveOption = true;
        }else if(this.voucher.ORDERNUMBER){
          this.voucherType = this.user.voucherTypes.filter((v) => v.voucherTypeName == this.voucher.VOUCHERTYPENAME)[0];
          this.godownName = this.voucher.ALLINVENTORYENTRIES_LIST[0].BATCHALLOCATIONS_LIST.GODOWNNAME
          this.voucher.adjustLedgers();
          this.disableSaveOption = true;
          this.saveOffline = false;

        }
        
      },
    )
    
  }
  

  async initialize(){
    await this.databaseService.openDatabase();

    this.customers = await Promise.all((await this.databaseService.getCustomers()).map(async (cus) => {
      if (cus.addressId){
        cus.fullAddress = await this.databaseService.getAddress(cus.addressId);
      }
      
      return cus;
    }));  
  
    var batches: any[] = await this.databaseService.getProductBatch();
    this.products = (await this.databaseService.getAllStockItemsForBilling())
                    .map((pro) => {
                      pro.BATCHES = batches.filter((batch) => {
                        return (batch.productId == pro.NAME) && (batch.CLOSINGBALANCE != 0) 
                        && (batch.EXPIRYDATE ? new Date(batch.EXPIRYDATE) >= new Date(): true);
                      })
                      return pro;
                    })
      
      this.addresses = await this.databaseService.getAddresses();
      this.addressFilteredOptions = this.addressControl.valueChanges.pipe(
        startWith(''),
        map(value => this.address_filter(value))
      );

      this.sundryDebtors = await this.databaseService.getLedgers();
      this.cd.detectChanges();
    
    

  }


  ngOnInit() {  
    this.loading = true;
    this.cd.detectChanges();
    console.log("started loading")
    this.initialize().then(()=> {
      console.log("finished")
      this.loading = false
    });
  }


  // CUSTOMER BLOCK

  


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
    this.createCustomer.id = (new ObjectId()).toHexString();
    this.createCustomer.fullAddress = this.address;
    this.databaseService.addCustomer(this.createCustomer);
    this.databaseService.addCacheCustomer(this.createCustomer);
    this.disableSaveButton = false;
    this.customerCreationActive = false;
    this.customer = this.createCustomer
    this.createCustomer = new Customer();
    this.addCustomer(this.customer, stepper);
  }


  async setNewVoucher(){
    let v = this.databaseService.getVoucherType();
    this.voucherType = v 
    ? this.user.voucherTypes.filter((v) => v.voucherTypeName == this.databaseService.getVoucherType().NAME)[0]
    : null
    this.customer = new Customer();
    this.godownName = this.databaseService.getGodown();
    await this.voucher.setVoucherType(this.databaseService.getVoucherType(),
                                this.databaseService.getPOSClass(),
                                this.databaseService.getPriceList(),
                                this.databaseService);
    
    console.log(this.voucherType);
  }


  createNewCustomer(){
    this.customerCreationActive = true; 
    this.createCustomer = new Customer();
    this.createCustomer.gSTREGISTRATIONTYPE = 'Consumer';
    this.createCustomer.phoneNumber = this.customerAutoComplete.customerControl.value;
    console.log()
    this.cd.detectChanges();
    this.newCustomerNameRef.nativeElement.focus();
  }


  async getVoucherType(value){
    
    const service = this.databaseService;
    
    
    let voucherType: any;
    voucherType = await this.databaseService.getVoucherTypeByName(value.voucherTypeName)
   
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

      
    
  }

  addCustomer(value, stepper){
    console.log(value);
    this.customer = value;
    this.voucher.BASICBUYERNAME = value.id;
    this.voucher.ADDRESS_LIST = new ADDRESSLIST(value.name, value.fullAddress.name,"", "");
    stepper._selectedIndex = 2;
    
    setTimeout(()=>{ // this will make the execution after the above boolean has changed
      this.cd.detectChanges();
      this.productAutoComplete.focus();
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

  setSelect(event, stepper){
    console.log("changed: "+ event.selectedIndex);
    this.cd.detectChanges();
    if(event.selectedIndex == 0){
      if (!this.voucher.VOUCHERNUMBER && !this.voucher.ORDERNUMBER){
        this.setNewVoucher();
      }
    }
    if(event.selectedIndex == 1){
      console.log(this.customerAutoComplete);
      setTimeout(()=>{ // this will make the execution after the above boolean has changed
        this.cd.detectChanges();
        this.customerAutoComplete.focus();
      },0);
    }
    if(event.selectedIndex == 2){
      setTimeout(()=>{ // this will make the execution after the above boolean has changed
        this.cd.detectChanges();
        this.productAutoComplete.focus();
      },500);
    }
    if(event.selectedIndex == 3){
      setTimeout(()=>{ // this will make the execution after the above boolean has changed
        this.cd.detectChanges();
        this.cashRecievedRef.nativeElement.focus();
      },500);
    }
    if(event.selectedIndex == 5){
      console.log("Now Saving "+ event.selectedIndex);
      this.save(stepper);
    }
    if(event.selectedIndex == 6){
      console.log("Now Printing "+ event.selectedIndex);
      
    }
  }
  
  async save(stepper) {
    this.saving = true;
    this.voucher.databaseService = null;
    this.voucher.LEDGERENTRIES_LIST.map((ledger) => {
      if (ledger.POSPAYMENTTYPE){
        ledger.AMOUNT = Math.abs(ledger.AMOUNT) * (-1);
      }
    });
    this.cd.detectChanges();
    if (!this.voucher.VOUCHERNUMBER){
      if(this.createOnline$){
        this.apiService.getVoucherNumber(this.voucher.VOUCHERTYPENAME).subscribe(
          async (num) => {
            if(num && num.seq){
              this.voucher.VOUCHERNUMBER = num.prefix + num.seq;
            }else {
              this.voucher.VOUCHERNUMBER = "DM-"+this.voucher._REMOTEID;
            } 
            await this.databaseService.addCacheVoucher(this.voucher);
            this.afterVoucherSaveProcess(stepper);
            return; 
          },
          async err => {
            this.voucher.VOUCHERNUMBER = "DM-"+this.voucher._REMOTEID;
            await this.databaseService.addCacheVoucher(this.voucher);
            this.afterVoucherSaveProcess(stepper);
            return; 
          }
        )
      } else{
        this.voucher.VOUCHERNUMBER = "DM-"+this.voucher._REMOTEID;
        await this.databaseService.addCacheVoucher(this.voucher);
        this.afterVoucherSaveProcess(stepper);
        return; 
      }
      
    }else{
      this.databaseService.addCacheVoucher(this.voucher).then(
        (res) => {
          this.afterVoucherSaveProcess(stepper);
        }
      );
      
    }
    console.log(this.voucher);
    
  }

  saveVoucherOffline(voucher){
    this.databaseService.addCacheVoucher(voucher);
  }

  hsnDetails: Map<string, PrintTaxItem> = new Map();

  afterVoucherSaveProcess(stepper){
    
    this.hsnDetails = new Map();
    this.voucher.ALLINVENTORYENTRIES_LIST.forEach(async (item: ALLINVENTORYENTRIESLIST) => {
          
          item.tallyObject = Object.assign(new StockItem(), item.tallyObject);
          var tallyObject: StockItem =  item.tallyObject;
          console.log(item.tallyObject);
          var taxItem: PrintTaxItem = this.hsnDetails.get(tallyObject.getHSNCODE());
          if (!taxItem && tallyObject){
            taxItem = new PrintTaxItem();
            taxItem.hsnCode = tallyObject.getHSNCODE();
            taxItem.cgst.rate = tallyObject.getTaxRate("", "Central Tax");
            taxItem.sgst.rate = tallyObject.getTaxRate("", "State Tax");
            this.hsnDetails.set(taxItem.hsnCode, taxItem);
          }
          taxItem.cgst.amount = taxItem.cgst.amount + (taxItem.cgst.rate * item.AMOUNT);
          taxItem.sgst.amount = taxItem.sgst.amount + (taxItem.sgst.rate * item.AMOUNT);
          if(!this.printConf){
            this.printConf = await this.databaseService.getPrintConfigurations(this.voucher.VOUCHERTYPENAME);   
          }
          this.cd.detectChanges();
          this.printReady = true;
          this.saving = false;
          stepper._selectedIndex = 6;
          document.getElementById("printButton").click();
          stepper.reset();
          this.renew();
          this.voucher = new VOUCHER();
          this.customer = new Customer();
          this.customerAutoComplete.customerControl.setValue("");
          await this.setNewVoucher()
          
         
          
          
        }
      )
    
    
    
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

    if (pro.NAME == "END OF LIST"){
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
    var temp = Object.assign(new StockItem(), this.productAutoComplete.productControl.value);
    this.rateIncControl.setValue(temp.getRateInclusiveOfTax(this.rateControl.value, ""));
    this.batchRef.focus();
  }

  validateInventoryEntry(){
   
    if (this.productAutoComplete.productControl.value == null || this.productAutoComplete.productControl.value ==""){
      this.productAutoComplete.focus();
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
    const res: StockItem = Object.assign(new StockItem(),
                                  this.productAutoComplete.productControl.value);
    this.voucher.addInventory(this.rateControl.value, 
                              this.qtyControl.value, 
                              this.batchControl.value, 
                              this.databaseService.getGodown(),
                              res);
    this.voucher.adjustLedgers();
    this.renew()
    this.cd.detectChanges();
    this.productAutoComplete.focus();

}

  renew(){
    this.productAutoComplete.productControl.setValue("");
    this.qtyControl.setValue(null);
    this.rateControl.setValue(null);
    this.batchControl.setValue(null);
    
  }

  deleteStockItem(pos: number){
    this.voucher.ALLINVENTORYENTRIES_LIST.splice(pos,1);
    this.voucher.adjustLedgers();
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
                this.cd.detectChanges();
                this.voucher.adjustRounding();
                
              
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
          this.cd.detectChanges();
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
      fromEvent(window, 'online').pipe(map(async () => {
        await this.databaseService.setNumbersToAllMemos();
        return true;
      })),
      new Observable((sub: Observer<boolean>) => {
        sub.next(navigator.onLine);
        sub.complete();
      }));
  }

  match(){
    return (this.voucher.VOUCHERNUMBER + "").match('^DM-');
  }

  printConf: PrintConfiguration;


}
