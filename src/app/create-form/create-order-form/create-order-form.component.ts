import { Component, OnInit, ElementRef, ViewChild, Inject } from '@angular/core';
import { VoucherService } from '../../shared/voucher.service';
import { ApiService } from 'src/app/shared/api.service';
import { Observable, of } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { Order, OrderItem } from 'src/app/Model/order';
import { Customer } from 'src/app/Model/customer';
import { DatabaseService } from 'src/app/shared/database.service';
import { AppComponent } from 'src/app/app.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { User } from 'src/app/Model/user';

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
  userList$: Observable<any>;
  item: OrderItem = new OrderItem();
  @ViewChild('quantityField', { static: false }) quantityRef: ElementRef;
  @ViewChild('invField', { static: false }) productRef: ElementRef;
  @ViewChild('rateField', { static: false }) rateRef: ElementRef;
  customer: Customer;
  databaseService: DatabaseService;
  voucherType: string;
  priceList: string;
  godown: string;
  user: User;
  createVoucherAfterSave: boolean = false;
  constructor(public apiService?: ApiService,@Inject(MAT_DIALOG_DATA) public data?: any, 
  private dialogRef?: MatDialogRef<CreateOrderFormComponent>) {
    this.databaseService = AppComponent.databaseService;
    if (this.data){
      this.apiService.getOrder(this.data).subscribe(
        res => {
          this.order = res;
          this.getCustomer();
        },
        err => console.log(err)
      )
    } else {
      this.order = new Order();
    }
    this.user = this.databaseService.getUser();
   }

  ngOnInit() {

    
    this.databaseService.getAllStockItemsForBilling().then(
      res => {this.products = res
        console.log(res)
        this.filteredOptions = this.productControl.valueChanges.pipe(
          startWith(''),
          map(value => this.product_filter(value))
        );
      }
    )

    this.databaseService.getCustomers().then(
      res => {
        this.customers = res;
        this.customerFilteredOptions = this.customerControl.valueChanges.pipe(
          startWith(''),
          map(value => this.customer_filter(value))
        );
      }
    )
     
      this.userList$ = this.apiService.getAllUsers();

    

  }

  getCustomer(){
    this.databaseService.getCustomer(this.order.customerId).then(
      res => {
        console.log(res);
        this.customer = res
      }
    );
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
    return this.products.filter(option => option.NAME.toLowerCase().indexOf(filterValue) === 0);
  }

  displayFnProduct(user?: any): string | undefined {
    return user && user.NAME ? user.NAME : '';
  }


  validateProduct(product: any){
    console.log(product);
    this.item.item = product.NAME;
    this.item.rate = this.chooseRate(product);
    this.item.qty = 1;
    this.productControl.setValue("");
    this.rateRef.nativeElement.focus();
  }

  chooseRate(product: any): number{
    return 0;
  }


  saveOrder(){
    this.order.dateOfCreation = new Date();
  
    this.apiService.saveOrder(this.order).subscribe(
      res => {
        alert("Order Saved");
        this.dialogRef.close({"createVoucher" : this.createVoucherAfterSave,
      "voucherType": this.voucherType, "priceList": this.priceList, 
      "order": this.order, "godown": this.godown})
        
      },
      err => {
        console.log(err);
      }
    );
  }

  addProduct(){
    this.order.itemList.push(this.item);
    this.item = new OrderItem();
    this.item.item = ""
  }

  deleteItem(i : number) {
    this.order.itemList.splice(i, 1);
  }

  createVoucher(){

  }

}
