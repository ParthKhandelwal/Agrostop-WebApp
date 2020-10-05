import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { VOUCHER } from '../../../model/Voucher/voucher';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject, Subscription } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ApiService } from '../../../services/API/api.service';
import { ProductProfile } from '../../../model/ProductProfile/product-profile';

@Component({
  selector: 'inventory-breakdown',
  templateUrl: './inventory-breakdown.component.html',
  styleUrls: ['./inventory-breakdown.component.css']
})
export class InventoryBreakdownComponent implements OnInit {

  @Input('vouchers') vouchers: VOUCHER[]
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  vouchers$ = new BehaviorSubject([]);
  voucherSubscription: Subscription;
  datasource: MatTableDataSource<InventoryBreakDown> = new MatTableDataSource<InventoryBreakDown>([]);

  constructor(private apiService?: ApiService) { }

  ngOnInit(): void {
    this.datasource.paginator = this.paginator;
    this.datasource.sort = this.sort;
    //this.getStockItemBreakdown(this.vouchers);
  }

  inventoryBreakdownList: InventoryBreakdownList = new InventoryBreakdownList();
  productBreakdownList: InventoryBreakdownList = new InventoryBreakdownList();
  displayedColumnsItems = ["itemName", "qty", "rate", "value", "valuePercentage"]

  getStockItemBreakdown(vouchers: VOUCHER[]){
    this.showingGroup = false;
    this.vouchers = vouchers;
    this.inventoryBreakdownList = new InventoryBreakdownList();
    for(let item of this.vouchers){
      if(item.ALLINVENTORYENTRIES_LIST){
        if(item.ALLINVENTORYENTRIES_LIST instanceof Array){
          for(let i of item.ALLINVENTORYENTRIES_LIST){
            this.inventoryBreakdownList.add(i);
          }
        }else {
          this.inventoryBreakdownList.add(item.ALLINVENTORYENTRIES_LIST);
        }
      }
    }
    this.inventoryBreakdownList.setPercentage();
    this.inventoryBreakdownList.items.sort((a,b) => {
      if(a.itemName > b.itemName){
        return 1;
      }else {
        return -1;
      }
    })
    this.datasource.data = this.inventoryBreakdownList.items
    //this.datasource.connect()
    this.table.renderRows();
  }


  showingGroup: boolean = false;
  getProductGroupBreakdown(vouchers:VOUCHER[]){
    this.showingGroup = true
    this.apiService.getAllProductProfile().subscribe(
      (productGroups: ProductProfile[]) =>{

        this.vouchers = vouchers;
        this.productBreakdownList = new InventoryBreakdownList();
        for(let item of this.vouchers){
          if(item.ALLINVENTORYENTRIES_LIST){
            if(item.ALLINVENTORYENTRIES_LIST instanceof Array){
              for(let i of item.ALLINVENTORYENTRIES_LIST){
                let productPro = productGroups.filter((v)=> v.name === i.STOCKITEMNAME)[0];
                if(productPro){
                  this.productBreakdownList.addProductGroup(productPro.productGroup, productPro.unitConversion*i.ACTUALQTY, i.AMOUNT);
                }
              }
            }
          }
        }
        this.productBreakdownList.setPercentage();
        this.productBreakdownList.items.sort((a,b) => {
          if(a.itemName > b.itemName){
            return 1;
          }else {
            return -1;
          }
        })
        this.datasource.data = this.productBreakdownList.items
        //this.datasource.connect()
        this.table.renderRows();

    },
    err => console.log(err)
    );



  }



  @ViewChild('table', {static: false}) table: MatTable<InventoryBreakDown>;

}


export class  InventoryBreakDown {
  itemName: string;
  qty: number;
  value:number;
  valuePercentage: number;

  constructor() {

  }
}

export class InventoryBreakdownList{
  items: InventoryBreakDown[] = [];
  total: number = 0;

  add(item: any){
    for(let i of this.items){
      if(i.itemName == item.STOCKITEMNAME){
        i.qty = i.qty + item.ACTUALQTY;
        i.value = i.value + item.AMOUNT
        this.total = this.total + (item.AMOUNT? item.AMOUNT: 0);
        return;
      }
    }
    let i: InventoryBreakDown = new InventoryBreakDown();
    i.itemName = item.STOCKITEMNAME;
    i.qty = item.ACTUALQTY;
    i.value = item.AMOUNT;
    i.valuePercentage = 0;
    this.total = this.total + (i.value ? i.value : 0);
    this.items.push(i);
  }

  addProductGroup(name: string, qty: number, amt:number){
    for(let i of this.items){
      if(i.itemName == name){
        i.qty = i.qty + qty;
        i.value = i.value + amt
        this.total = this.total + (amt? amt: 0);
        return;
      }
    }
    let i: InventoryBreakDown = new InventoryBreakDown();
    i.itemName = name;
    i.qty = qty;
    i.value = amt;
    i.valuePercentage = 0;
    this.total = this.total + (i.value ? i.value : 0);
    this.items.push(i);
  }

  setPercentage(){
    for(let i of this.items){
      i.valuePercentage = i.value / this.total;
    }
  }

  getTotal(): number{
    let total: number = 0;
    for(let i of this.items){
      total = total + i.value;
    }
    return total;
  }
}
