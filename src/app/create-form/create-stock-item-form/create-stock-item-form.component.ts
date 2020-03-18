import { Component, OnInit, Inject, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../shared/api.service';
import { MAT_DIALOG_DATA } from '@angular/material';
import { StockItem, PriceListItem, RateDetail, UpdateStockItemData } from '../../Model/stock-item';
import { MatTable } from '@angular/material/table';
import { MatTableDataSource } from '@angular/material';
import { BilledStockItem } from '../../Model/billed-stock-item';

@Component({
  selector: 'app-create-stock-item-form',
  templateUrl: './create-stock-item-form.component.html',
  styleUrls: ['./create-stock-item-form.component.css']
})
export class CreateStockItemFormComponent implements OnInit {

godowns: string[] = [];
item: string = "";
priceListItem: PriceListItem = {
  godownName: "",
  price: 0
  }
  priceList: PriceListItem[] = [];
  taxList: RateDetail[] = []
  rateDetail: RateDetail = new RateDetail();

@ViewChild(MatTable, {static: false}) table: MatTable<PriceListItem>;
dataSource: MatTableDataSource<PriceListItem>;
  displayedColumns = ['godownName', 'price', 'update'];

  @ViewChild(MatTable, { static: false }) taxTable: MatTable<RateDetail>;
  taxDataSource: MatTableDataSource<RateDetail>;
  taxDisplayedColumns = ['head', 'tax'];

  constructor( @Inject(MAT_DIALOG_DATA) public data?: string, private router? :Router, @Inject(ApiService) private apiService? : ApiService) {
    if (data != null){
      this.item = data;

    }
  }

  ngOnInit() {
    
    this.dataSource = new MatTableDataSource<PriceListItem>(this.priceList);

    this.apiService.getGodownNames().subscribe(
      res =>{
        this.godowns = res;

      },
      err =>{
        console.log(err);
      }
    );

    this.apiService.getPriceList().subscribe(
      res => {
        
        for (var i = 0; i < res.FULLPRICELIST_LIST.length; i++) {
          this.addPriceListItem(res.FULLPRICELIST_LIST[i]);
        }
        for (var i = 0; i < res.GSTDETAILS_LIST.STATEWISEDETAILS_LIST.RATEDETAILS_LIST.length; i++) {
          this.addTaxItem(res.GSTDETAILS_LIST.STATEWISEDETAILS_LIST.RATEDETAILS_LIST[i]);
        }
        this.taxDataSource = new MatTableDataSource<RateDetail>(this.taxList);
        
        
      },
      err => {
        console.log(err)
      }

    );
    
    


    
  }

  ngAfterViewInit() {
    this.table.dataSource = this.dataSource;

  }

  submit() {
    var data: UpdateStockItemData = new UpdateStockItemData(this.priceList, this.taxList);
    this.apiService.savePriceList(this.item, data).subscribe(
      res => {console.log("stockItem saved")},
      err => {console.log("stockItem could not be saved")}
    )
  } 

  addPriceListItem(item: PriceListItem) {
    var itemTemp: PriceListItem = {
      godownName: item.godownName,
      price: item.price
    }
    var found: boolean = false;
    for (var i = 0; i < this.priceList.length; i++) {
      if (this.priceList[i].godownName == item.godownName) {
        this.priceList[i].price = item.price;
        found = true;
        break;
      }
    }
    if (!found) {
      this.priceList.push(itemTemp)
    }
    this.table.renderRows();
    this.priceListItem = {
      godownName: "",
      price: 0
    };

  }

  addTaxItem(item: RateDetail) {
    
    this.taxList.push(item)
    this.taxTable.renderRows();

  }


  updateTax(id: RateDetail) {
    console.log(id);
    console.log(this.taxList);
    for (var i = 0; i < this.taxList.length; i++) {
      if (this.taxList[i].gSTRATEDUTYHEAD == id.gSTRATEDUTYHEAD) {
        this.taxList[i].taxPercentage = id.taxPercentage;
      }
    }
    this.taxTable.renderRows();
    
  }

}


