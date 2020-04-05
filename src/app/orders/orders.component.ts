import { Component, OnInit, ViewChild } from '@angular/core';
import { Order } from '../Model/order';
import { ApiService } from '../shared/api.service';
import { map } from 'rxjs/operators';
import { OrderTableComponent } from '../tables/order-table/order-table.component';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  orders: Order[] = []
  constructor(private apiService?: ApiService) { }
  @ViewChild(OrderTableComponent, {static: false}) table: OrderTableComponent;

  ngOnInit() {
    this.apiService.getAllOrders().pipe(
      map((data) => data.sort((a,b) => new Date(b.dateOfCreation).getTime() - new Date(a.dateOfCreation).getTime()))
    ).subscribe(
      res => {
        for (let item of res){
          this.orders.push(item)
        }
       
        this.table.renderRows();
      }
    )
  }

}
