import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { StockItem } from '../../../model/StockItem/stock-item';
import { TallyService } from '../../../services/Tally/tally.service';
import { User } from '../../../model/User/user';
import { Subscription } from 'rxjs';
import { ApiService } from '../../../services/API/api.service';
import { SyncService } from '../../../services/Sync/sync.service';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { AuthenticationService } from '../../../services/Authentication/authentication.service';

@Component({
  selector: 'app-inventory-info',
  templateUrl: './inventory-info.component.html',
  styleUrls: ['./inventory-info.component.css']
})
export class InventoryInfoComponent implements OnInit {

  item: StockItem;
  priceList: string;
  subscription: Subscription;
  connectedToClient: boolean
  constructor(public dialogRef: MatDialogRef<InventoryInfoComponent>,
    public tallyService?: TallyService,
    public auth?: AuthenticationService,
    public apiService?: ApiService,
    public syncService?: SyncService,
    private db?: NgxIndexedDBService) {
    this.priceList = sessionStorage.getItem("priceList");
  }

  ngOnInit(): void {
    this.subscription= this.tallyService.connectedToClient.subscribe(
      res => {
        this.connectedToClient = res;
      }
    )
  }


  selectInventory(event){
    console.log(event);
    this.item = Object.assign(new StockItem(), event);
  }

  update(){
    this.tallyService.updateStockItem(this.item.NAME).subscribe(
      res=> {
        alert(this.item.NAME+ " updated Successfully.");
      }
    )
  }

  getUpdates(){
    this.apiService.getStockItem(this.item.NAME).subscribe(
      newItem => {
          let index = this.syncService.products$.getValue().findIndex((item) => item.NAME === newItem.NAME);
          if (index> -1) {
            this.syncService.products$.getValue()[index] = newItem
          }else{
            this.syncService.products$.getValue().push(newItem);
          }
          this.db.update("items", newItem);
          this.item = newItem;
      },
      err=> console.log(err)
    )
  }


  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

}
