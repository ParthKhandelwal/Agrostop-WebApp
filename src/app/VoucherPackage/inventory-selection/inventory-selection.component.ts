import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { VOUCHER } from '../../Model/voucher';
import { ApiService } from '../../shared/api.service';
import { Batch } from '../../Model/batch';
import { FormControl } from '@angular/forms';
import { Customer } from '../../Model/customer';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { MatSelect } from '@angular/material';

@Component({
  selector: 'inventory-selection',
  templateUrl: './inventory-selection.component.html',
  styleUrls: ['./inventory-selection.component.css']
})
export class InventorySelectionComponent implements OnInit {
  showBatchDropDown: boolean = false;
  product: any;
  qty: number =0;
  batch: Batch;
  batches: Batch[] = [];
  productControl = new FormControl();
  filteredOptions: Observable<Customer[]>;
  products: any[];
  @Output() valueChanged = new EventEmitter();
  @Input('voucher') voucher: VOUCHER;

  @ViewChild('quantityField', { static: false }) quantityRef: ElementRef;
  @ViewChild('invField', { static: false }) productRef: ElementRef;
  @ViewChild('batchField', { static: false }) batchRef: MatSelect;
  constructor(private apiService?: ApiService) { }

  ngOnInit() {

    //Get StockItem for Billing

    this.apiService.getAllStockItemsForBilling(this.voucher.PLACEOFSUPPLY).subscribe(
      res1 => {
        this.products = res1;
        this.filteredOptions = this.productControl.valueChanges.pipe(
          startWith(''),
          map(value => this.product_filter(value))

        );
        

      },
      err1 => {
        console.log(err1);
      }
    );
  }

  private product_filter(value: string): any[] {
    const filterValue = value.toString().toLowerCase();
    return this.products.filter(option => option._id.toLowerCase().indexOf(filterValue) === 0);
  }

  selectProduct(value) {
   
    if (value != null) {
      this.product = Object.assign({}, value);
      this.batches = value.bATCHALLOCATIONS;
      this.showBatchDropDown = true;
      setTimeout(() => {
        this.batchRef.focus();
      }, 500);
      
    }
  }

  goToPayment(value) {
    if (value == null && this.voucher.ALLINVENTORYENTRIES_LIST.length != 0) {
      this.valueChanged.emit("true");
      return;
    }
  }

  selectBatch(value) {
    this.batch = Object.assign({}, value);
    console.log(this.batch);
  }

  validateProduct(value) {
    
      if (this.qty != 0) {
        this.voucher.addInventoryEntry(this.product, this.batch, value);
        console.log(this.voucher);
        this.batch = null;
        this.product = null;
        this.qty = 0;
        this.showBatchDropDown = false;
        setTimeout(() => {
          this.productRef.nativeElement.value = null;
          this.productRef.nativeElement.focus();
        }, 500);
      } else {
        setTimeout(() => {
          this.quantityRef.nativeElement.focus();
        }, 500);
      }
    

  }


  validateBatch(event) {
    setTimeout(() => {
      this.quantityRef.nativeElement.focus();
    }, 500);
    
  }

  displayFnProduct(user?: any): string | undefined {
    return user && user._id ? user._id : '';
  }

  deleteItem(product: any) {
    this.voucher.deleteInventoryEntry(product);
  }
}
