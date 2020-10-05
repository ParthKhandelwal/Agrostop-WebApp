import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FormControl } from '@angular/forms';

import { User } from '../../model/User/user';
import { StockCheckItem, StockCheck } from '../../model/StockItem/stock-item';
import { AuthenticationService } from '../../services/Authentication/authentication.service';
import { ApiService } from '../../services/API/api.service';
import { StockService } from '../../services/Stock/stock.service';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { StockCheckPrintViewComponent } from '../PrintComponents/stock-check-print-view/stock-check-print-view.component';

@Component({
  selector: 'stock-check',
  templateUrl: './stock-check.component.html',
  styleUrls: ['./stock-check.component.css']
})
export class StockCheckComponent implements OnInit {

  productControl = new FormControl();
  stockCheckItem: StockCheckItem = new StockCheckItem();
  createMode: boolean = false;
  check: StockCheck = new StockCheck;
  currentCheck: StockCheck;
  checks$: Observable<any[]>
  remainingItems$: Observable<any[]>;
  filteredOptions: Observable<any[]>;
  stockSummary : any[] = [];
  temp: any;
  products : any[] = [];

  displayedColumns: string[] = ['sno', 'product', 'expected', 'actual'];

  stompClient: any;
  connected: boolean;
  map: Map<string, string> = new Map();

  @ViewChild("qtyRef", {static: false}) qtyRef: ElementRef;
  constructor(public auth?: AuthenticationService,private dialog?: MatDialog, private apiService?: ApiService, private stockService?: StockService) {
      this.checks$ = this.apiService.getStockCheck(this.auth.user.userName);

   }


  ngOnInit() {
    this.filteredOptions = this.productControl.valueChanges.pipe(
      startWith(''),
      map(value => this.product_filter(value))

    );

  }


  showDetailView: boolean;
  detailView(){
    this.showDetailView = true;
  }






  initiateCreateMode(){
    if (this.createMode){
      this.check.dateOfRequest = new Date();
      this.apiService.saveStockCheck(this.check).subscribe(
        res => {
          console.log(res)
          this.check = new StockCheck();
          this.createMode = !this.createMode
        },
        err => {
          console.log(err)
          this.check = new StockCheck();
          this.createMode = !this.createMode
        }
      );
    } else {
      this.createMode = !this.createMode
    }
  }

  getNumbers(temp: string): number{
    var returnNumber;
    returnNumber = temp.replace(/\//g, "");
    returnNumber = returnNumber.replace(/[^\d.-]/g, "");
    return returnNumber*1;
  }

  displayFnProduct(user?: any): string | undefined {
    return user && user.ITEMNAME ? user.ITEMNAME : '';
  }

  private product_filter(value: string): any[] {
    const filterValue = value.toString().toLowerCase();
    return this.products.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
  }


  getItems(guid: string){
    this.products = [];

    this.apiService.getTallyData(guid).pipe(
      map((items) => items.map(
          (item) =>  new si(item.BATCHES.filter((i) => i.GODOWN === this.currentCheck.godown), item.ITEMNAME, item.GODOWN))

        ),
     map ((items) => items.filter((item) => item.batches.length > 0))
    ).subscribe(
      res => {
        this.products = res
        console.log(res);
      }
    )
  }


  completeCheck(){
    this.currentCheck.completed = true;
    this.apiService.saveStockCheck(this.currentCheck).subscribe(
      res => {alert("The stock check report has been saved successfully")
    location.reload();
    },
      err => console.log(err)
    );
  }

  getTotalQty(){

    this.stockCheckItem.expectedQty = 0;
    for (let batch of this.temp.batches){
      console.log(this.getNumbers(batch.QTY));
      this.stockCheckItem.expectedQty = this.stockCheckItem.expectedQty + this.getNumbers(batch.QTY);
    }
  }

  selectProduct(){
    this.getTotalQty()
    this.qtyRef.nativeElement.focus();
  }


  deleteStockCheck(){
    if(confirm("Are you sure you want to delete this item?")){
      this.apiService.deleteStockCheck(this.currentCheck.id).subscribe(
        res => {alert("Deletion Successful!!!")
        location.reload();
      },
        err => console.log(err)
      )
    }

  }

  itemSelected(value){
    console.log(value)
    this.stockCheckItem.itemName = value.NAME;
    this.stockCheckItem.expectedQty = this.stockService.getTotalClosingBalance(value.NAME, this.currentCheck.godown);
  }

  addItem(){
    this.stockCheckItem.dateOfCheck = new Date();
    this.stockCheckItem.username = this.auth.user.userName;
    console.log(this.stockCheckItem);

    this.apiService.saveStockCheckItem(this.currentCheck.id, this.stockCheckItem).subscribe(
      res => {
        this.stockCheckItem = new StockCheckItem();
        this.apiService.getStockCheckById(this.currentCheck.id).subscribe(
          res => {
            this.currentCheck = res;
          }
        )
      }
    );
  }
}

export class si{
  batches: any[];
  name: string;
  godown: string;
  constructor(list: any[], name: string, god: string){
    this.batches = list;
    this.name = name;
    this.godown = god;
  }
}
