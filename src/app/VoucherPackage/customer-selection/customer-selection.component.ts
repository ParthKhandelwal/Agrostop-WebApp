import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { VOUCHER, ADDRESSLIST } from '../../Model/voucher';
import { ApiService } from '../../shared/api.service';
import { Customer } from '../../Model/customer';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { CreateCustomerFormComponent } from '../../create-form/create-customer-form/create-customer-form.component';
import { CustomerViewComponent } from '../../view/customer-view/customer-view.component';
import {_} from 'lodash';
import { PosService } from 'src/app/shared/pos.service';
import { Order } from 'src/app/Model/order';
import { OrderService } from 'src/app/shared/order.service';
import { DatabaseService } from 'src/app/shared/database.service';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'customer-selection',
  templateUrl: './customer-selection.component.html',
  styleUrls: ['./customer-selection.component.css']
})
export class CustomerSelectionComponent implements OnInit {
  createCustomer: boolean = false;
  loaded: boolean = false;
  customer: Customer;
  customerControl = new FormControl();
  filteredOptions: Observable<Customer[]>;
  basicBuyerName: string;
  orderMode: boolean = false;
  order: Order;
  NACustomer: Customer = new Customer();
  @Input("isOrder") isOrder: boolean;
  @Input('customerList') customers: Customer[];
  @ViewChild('customerField', { static: false }) customerRef: ElementRef;
  @Input('voucher') voucher: VOUCHER;
  @Output() valueChange = new EventEmitter();
  databaseService: DatabaseService
  constructor(private apiService?: ApiService, private dialog?: MatDialog,
    private dialogConfig?: MatDialogConfig, private orderService?: OrderService) {
      this.databaseService = AppComponent.databaseService
     }

  ngOnInit() {
    console.log(this.voucher);

        this.databaseService.getCustomers().then(
          res => {
            this.customers = res
            this.NACustomer.id = "NA";
            this.NACustomer.name = "END OF LIST";
            this.NACustomer.phoneNumber = "NA";
            this.customers.push(this.NACustomer)
            this.customerRef.nativeElement.focus();
            if(this.voucher.BASICBUYERNAME){
              this.customer = this.customers.filter(obj => obj.id == this.voucher.BASICBUYERNAME)[0];    
              console.log(this.customer);  
            }
            this.filteredOptions = this.customerControl.valueChanges.pipe(
              startWith(''),
              map(value => this.customer_filter(value))
            );
          }
        );
      
    
    
  }

  ngAfterViewInit() {
    

  }
  
  
  

  private customer_filter(value: string): Customer[] {
    const filterValue = value.toString().toLowerCase();
    return this.customers.filter(option => 
      option.phoneNumber.toLowerCase().indexOf(filterValue) === 0);
  }

  validateCustomer() {
    if(this.customer && this.customer.id && this.customer.id != "NA"){
    this.voucher.BASICBUYERNAME = this.customer.id
    this.voucher.ADDRESS_LIST = new ADDRESSLIST(this.customer.addressId,"","","");
    this.voucher.COUNTRYOFRESIDENCE = "India";
    this.voucher.GSTREGISTRATIONTYPE = this.customer.gSTREGISTRATIONTYPE;
    //this.voucher.STATENAME = this.customer.addressStateName;
    this.valueChange.emit("Customer Successfully Selected");
    } else if (this.customer && this.customer.id == "NA") {
      this.createCustomerAction();
      this.customerRef.nativeElement.focus();
    }else{
      alert("An error ocurred. Please reload the page and continue")
    }
    
  }

  displayFnProduct(user?: any): string | undefined {
    return user && user.phoneNumber ? user.phoneNumber : '';
  }

  createCustomerAction() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = "50%";
    const dialogRef = this.dialog.open(CreateCustomerFormComponent, { maxHeight: '90vh' });
    dialogRef.afterClosed().subscribe((result: any) => {
      //@TODO: Save the recently added customer to local storage andto the customer List
      if (result && result.id){
  
          this.databaseService.addCustomer(result)
          this.databaseService.getCustomers().then(
            res => {
              this.customers = res
              this.filteredOptions = this.customerControl.valueChanges.pipe(
                startWith(''),
                map(value => this.customer_filter(value))
              );
              this.customerRef.nativeElement.focus();
            }
        )
     
      
    }
  },
    err => console.log(err)
    );
  }

  viewCustomerProfile(id) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = "50%";

    const dialogRef = this.dialog.open(CustomerViewComponent, {
      data: id,
      maxHeight: '90vh'
    });

    dialogRef.afterClosed().subscribe(
      (res1: Order) => {
        this.orderService.convertOrder(res1, this.voucher, this.databaseService.getVoucherType(), this.databaseService.getPriceList(), this.databaseService.getGodown()).then(res => {
          this.voucher = res;
        
          console.log(this.voucher);
          this.valueChange.emit("order applied")
        });
        this.orderMode = true;
      }
    );

    
  }
}
