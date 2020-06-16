import { Component, OnInit, ViewChild } from '@angular/core';
import { AutoCompleteComponent } from 'src/app/AgroComponent/auto-complete/auto-complete.component';
import { StockItem } from 'src/app/Model/stock-item';
import { DatabaseService } from 'src/app/shared/database.service';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-product-stat',
  templateUrl: './product-stat.component.html',
  styleUrls: ['./product-stat.component.css']
})
export class ProductStatComponent implements OnInit {


  @ViewChild('autoComplete', { static: false}) productAutoComplete: AutoCompleteComponent;
  item: StockItem;
  priceLevel: string;
  databaseService: DatabaseService;
  user: any;
  displayedColumns: string[] = ['Name', 'Expiry Date', 'Closing Balance'];


  constructor() { 
    this.databaseService = AppComponent.databaseService;
    this.user = this.databaseService.getUser();
  }

  ngOnInit() {
    this.priceLevel = this.databaseService.getPriceList();
  }

  optionSelected(value){
    this.item = Object.assign(new StockItem(), value);
  }

}
