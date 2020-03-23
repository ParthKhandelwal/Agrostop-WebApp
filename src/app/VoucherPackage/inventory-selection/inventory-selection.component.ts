import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { VOUCHER, ALLINVENTORYENTRIESLIST, BATCHALLOCATIONSLIST, ACCOUNTINGALLOCATIONSLIST, EXPIRYPERIOD, LEDGERENTRIESLIST } from '../../Model/voucher';
import { ApiService } from '../../shared/api.service';
import { Batch } from '../../Model/batch';
import { FormControl } from '@angular/forms';
import { Observable, from } from 'rxjs';
import { startWith, map, filter } from 'rxjs/operators';
import { PosService } from 'src/app/shared/pos.service';
import { MatSelect } from '@angular/material';
import { ExpandOperator } from 'rxjs/internal/operators/expand';
import { StockItem } from 'src/app/Model/stock-item';

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
  constructor(private apiService?: ApiService, private posService?: PosService) { }

  ngOnInit() {
    this.endVoucher = {"NAME": "END OF LIST"}
    
    
    this.posService.getProductBatch().then(
      res => {
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
      this.valueChanged.emit("true");
      return;
    }
    this.batchCurrent = this.batches.filter(option => option.productId === value);
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
    if (this.productControl.value == null){
      this.productRef.nativeElement.focus();
      return;
    }
    if (this.batchControl.value == null){
      this.batchRef.focus();
      return;
    }
    if (this.qtyControl.value == null || this.qtyControl.value == 0){
      this.quantityRef.nativeElement.focus();
      return;
    }
    this.posService.getStockItem(this.productControl.value.NAME).then(
      res => {
        var inventoryEntry: ALLINVENTORYENTRIESLIST = new ALLINVENTORYENTRIESLIST();
        
    
        inventoryEntry.STOCKITEMNAME = res.NAME;
        inventoryEntry.BILLEDQTY = this.qtyControl.value;
        inventoryEntry.ACTUALQTY = inventoryEntry.BILLEDQTY;
        inventoryEntry.ISDEEMEDPOSITIVE = "No";
        
        if (res["FULLPRICELIST.LIST"] instanceof Array){
            for (let item of res["FULLPRICELIST.LIST"]){
              if (item.PRICELEVEL = this.voucher.PRICELEVEL){
                if (item["PRICELEVELLIST.LIST"].RATE != null){
                let temp:string = item["PRICELEVELLIST.LIST"].RATE.content;
                temp = temp.replace(/\//g, "");
                temp = temp.replace(/[^\d.-]/g, "");
            
                inventoryEntry.RATE = +(temp);
                break;
                }else {
                  
                  alert(res.NAME + "does not has a price defined for your current price list. " +
                  "Try changing the pricelist or contact your administrator.");
                  this.renew();
                }
              }
            }
        }else {
          
          alert(res.NAME + " does not have a price list set. Please contact your administrator.")
          this.renew();
          return;
        }
        
        inventoryEntry.BATCHALLOCATIONS_LIST = new BATCHALLOCATIONSLIST();
        inventoryEntry.BATCHALLOCATIONS_LIST.BATCHNAME = this.batchControl.value.name;
        inventoryEntry.BATCHALLOCATIONS_LIST.GODOWNNAME = this.posService.getGodown();
        inventoryEntry.BATCHALLOCATIONS_LIST.BILLEDQTY = inventoryEntry.BILLEDQTY;
        inventoryEntry.BATCHALLOCATIONS_LIST.ACTUALQTY = inventoryEntry.ACTUALQTY;
        inventoryEntry.BATCHALLOCATIONS_LIST.AMOUNT = inventoryEntry.RATE * inventoryEntry.BILLEDQTY;
        inventoryEntry.BATCHALLOCATIONS_LIST.EXPIRYPERIOD = new EXPIRYPERIOD(this.batchControl.value.expiryDate)
        

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
        inventoryEntry.tallyObject = res;
        this.voucher.ALLINVENTORYENTRIES_LIST.push(inventoryEntry);
        this.renew()
      },
      err => {
        console.log(err);
      }
    )
   
    
    
    
   
    
  }

  renew(){
    this.productControl.setValue("");
    this.batchControl.setValue("");
    this.qtyControl.setValue(1);
    this.showBatchDropDown = false;
    this.productRef.nativeElement.focus(); 
  }

  getNumbers(temp: string): number{
    var returnNumber;
    returnNumber = temp.replace(/\//g, "");
    returnNumber = returnNumber.replace(/[^\d.-]/g, "");
    return returnNumber;
  }

 
}
