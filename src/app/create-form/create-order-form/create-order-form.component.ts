import { Component, OnInit } from '@angular/core';
import { VoucherService } from '../../shared/voucher.service';
import { ApiService } from 'src/app/shared/api.service';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { Order, OrderItem } from 'src/app/Model/order';
import { Customer } from 'src/app/Model/customer';

@Component({
  selector: 'app-create-order-form',
  templateUrl: './create-order-form.component.html',
  styleUrls: ['./create-order-form.component.css']
})
export class CreateOrderFormComponent implements OnInit {

  filteredOptions: Observable<any[]>;
  products: any[] = [];
  productControl = new FormControl();
  customerControl = new FormControl();
  customerFilteredOptions: Observable<Customer[]>;
  customers: Customer[] = [];
  order:Order;
  godowns$: Observable<any>;
  item: OrderItem = new OrderItem();

  constructor(public apiService?: ApiService) { }

  ngOnInit() {
    this.order = new Order();
    this.apiService.getAllStockItemsForBilling().subscribe(
      res => {this.products = res
        console.log(res)
        this.filteredOptions = this.productControl.valueChanges.pipe(
          startWith(''),
          map(value => this.product_filter(value))
        );
      }
    )

    this.apiService.getCustomers().subscribe(
      res => {
        this.customers = res;
        this.customerFilteredOptions = this.customerControl.valueChanges.pipe(
          startWith(''),
          map(value => this.customer_filter(value))
        );
      }
    )
     

    this.godowns$ = this.apiService.getGodownNames();
    

  }

  private customer_filter(value: string): Customer[] {
    const filterValue = value.toString().toLowerCase();
    return this.customers.filter(option => option.phoneNumber.toLowerCase().indexOf(filterValue) === 0);
  }

  displayFnCustomer(user?: any): string | undefined {
    return user && user.name ? user.name : '';
  }

  private product_filter(value: string): any[] {
    const filterValue = value.toString().toLowerCase();
    return this.products.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }

  displayFnProduct(user?: any): string | undefined {
    return user ? user : '';
  }

  saveOrder(){
    this.order.dateOfCreation = new Date();
  
    this.apiService.saveOrder(this.order).subscribe(
      res => {
        alert("Order Saved");
        
      },
      err => {
        console.log(err);
      }
    );
  }

  addProduct(){
    console.log(this.item);
    this.order.itemList.push(this.item);
    this.item = new OrderItem();
    this.item.itemName = ""

  }

  deleteItem(i : number) {
    this.order.itemList.splice(i, 1);
  }

}
