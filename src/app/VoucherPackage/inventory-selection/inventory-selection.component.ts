import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { VOUCHER, ALLINVENTORYENTRIESLIST, BATCHALLOCATIONSLIST, ACCOUNTINGALLOCATIONSLIST, EXPIRYPERIOD, LEDGERENTRIESLIST } from '../../Model/voucher';
import { ApiService } from '../../shared/api.service';
import { Batch } from '../../Model/batch';
import { FormControl } from '@angular/forms';
import { Observable, from } from 'rxjs';
import { startWith, map, filter } from 'rxjs/operators';
import { PosService } from 'src/app/shared/pos.service';
import { MatSelect } from '@angular/material';
import { DatabaseService } from 'src/app/shared/database.service';
import { AppComponent } from 'src/app/app.component';


@Component({
  selector: 'inventory-selection',
  templateUrl: './inventory-selection.component.html',
  styleUrls: ['./inventory-selection.component.css']
})
export class InventorySelectionComponent implements OnInit {
  endVoucher: any;
  showBatchDropDown: boolean = false;
  taxMap: Map<string, Map<number, number>>;
  batches: Batch[] = [];
  batchCurrent: Batch[] = []
  productControl = new FormControl();
  batchControl = new FormControl();
  qtyControl = new FormControl();
  rateControl = new FormControl();
  filteredOptions: Observable<any[]>;
  batchFilteredOptions: Observable<any[]>;
  productGSTDetail: any[] = [];
  @Output() valueChanged = new EventEmitter();
  @Input('voucher') voucher: VOUCHER;
  @Input('productList') products: any[];
  @Input('isOrder') isOrder: boolean;
  @Input('ledgerList') ledgerList: any[];
 
  @ViewChild('quantityField', { static: false }) quantityRef: ElementRef;
  @ViewChild('invField', { static: false }) productRef: ElementRef;
  @ViewChild('batchField', { static: false }) batchRef: MatSelect;
  databaseService: DatabaseService;
  constructor(private apiService?: ApiService, ) 
  { 
    this.databaseService = AppComponent.databaseService;
  }

  ngOnInit() {
    this.endVoucher = {"NAME": "END OF LIST"}
    
    this.databaseService.getItems().then(
      res => {this.products = res
        console.log(res)
        this.filteredOptions = this.productControl.valueChanges.pipe(
          startWith(''),
          map(value => this.product_filter(value))
        );
      }
    )

    this.databaseService.getProductBatch().then(
      res => {
        console.log(res);
        this.batches = res;
      }
    );
  
    
    
  }

  ngAfterViewInit(){
    this.productRef.nativeElement.focus();
  }

  private product_filter(value: string): any[] {
    const filterValue = value.toString().toLowerCase();
    return this.products.filter(option => option.NAME.toLowerCase().indexOf(filterValue) === 0);
  }

  private batch_filter(value: string): any[] {
    const filterValue = value.toString().toLowerCase();
    return this.batches.filter(option => option.productId.indexOf(filterValue) === 0);
  }

  selectProduct(value) {
    if (value == "END OF LIST") {
      console.log(this.voucher);
      this.valueChanged.emit("true");
      return;
    }
    console.log(value);
    this.batchCurrent = this.batches.filter(option => option.productId == value);
    console.log(this.batchCurrent);
    this.quantityRef.nativeElement.focus();
  }

  validateQty(){
    if (this.qtyControl.value > 0 ){
      this.batchRef.focus();
      //this.validateInventoryEntry();
    } else {
      this.quantityRef.nativeElement.focus();
    }
  }

  goToPayment(value) {
    if (value == "NA" && this.voucher.ALLINVENTORYENTRIES_LIST.length != 0) {
      this.valueChanged.emit("true");
      return;
    }
  }



  displayFnProduct(user?: any): string | undefined {
    return user && user.NAME ? user.NAME : '';
  }
  displayFnBatch(user?: any): string | undefined {
    return user && user.name ? user.name : '';
  }

  deleteItem(i : number) {
    this.voucher.ALLINVENTORYENTRIES_LIST.splice(i, 1);
  }



  //HANDLE VOUCHER UPDATE

  validateInventoryEntry(){
        if (this.productControl.value == null || this.productControl.value ==""){
          this.productRef.nativeElement.focus();
          return;
        }
        if (this.productControl.value == this.endVoucher){
          console.log(this.voucher);
          this.valueChanged.emit("products added");
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
        inventoryEntry.BATCHALLOCATIONS_LIST.EXPIRYPERIOD = new EXPIRYPERIOD(this.batchControl.value.EXPIRYPERIOD)
        

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
        this.renew()
     
   
    
    
    
   
    
  }

  renew(){
    this.productRef.nativeElement.focus();
    this.productControl.setValue("");
    this.qtyControl.setValue(1);
    this.batchCurrent = [];
  }

  getRate(res: any){
    var returnObject = {rate : 0, exists: false}
    var tempDate: Date = null;
    if (res["FULLPRICELIST.LIST"] instanceof Array){
      for (let item of res["FULLPRICELIST.LIST"]){
        console.log(this.voucher.PRICELEVEL);
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

      console.log("price list found")
      if (res["FULLPRICELIST.LIST"]["PRICELEVELLIST.LIST"].RATE != null){
      let temp:string = res["FULLPRICELIST.LIST"]["PRICELEVELLIST.LIST"].RATE.content;
        returnObject.exists = true;
      returnObject.rate =  +this.getNumbers(temp);
      }
  }
}
 return returnObject;
  }

  getNumbers(temp: string): number{
    
    var returnNumber;
    returnNumber = temp.replace(/\//g, "");
    returnNumber = returnNumber.replace(/[^\d.-]/g, "");
    console.log(returnNumber);
    return returnNumber;
  }

 
}
