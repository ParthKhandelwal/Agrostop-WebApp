import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { VOUCHER } from '../../Model/voucher';
import { ApiService } from '../../shared/api.service';
import { Customer } from '../../Model/customer';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { CreateCustomerFormComponent } from '../../create-form/create-customer-form/create-customer-form.component';
import { CustomerListViewComponent } from '../../CustomerPackage/customer-list-view/customer-list-view.component';
import { CustomerViewComponent } from '../../view/customer-view/customer-view.component';


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
  @Input('customerList') customers: Customer[];
  @ViewChild('customerField', { static: false }) customerRef: ElementRef;
  @Input('voucher') voucher: VOUCHER;
  @Output() valueChange = new EventEmitter();
  constructor(private apiService?: ApiService, private dialog?: MatDialog,
    private dialogConfig?: MatDialogConfig,) { }

  ngOnInit() {

    this.filteredOptions = this.customerControl.valueChanges.pipe(
      startWith(''),
      map(value => this.customer_filter(value))
    );
  }

  ngAfterViewInit() {

    this.customer = this.customers.filter(obj => obj.customerId == this.voucher.CUSTOMERID)[0];

  }
  
  
  

  private customer_filter(value: string): Customer[] {
    const filterValue = value.toString().toLowerCase();
    return this.customers.filter(option => option.phoneNumber.toLowerCase().indexOf(filterValue) === 0);
  }

  validateCustomer() {
    this.voucher.setCustomer(this.customer);
    this.valueChange.emit("Customer Successfully Selected");
  }

  displayFnProduct(user?: any): string | undefined {
    return user && user.phoneNumber ? user.phoneNumber : '';
  }

  createCustomerAction() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = "50%";
    this.dialog.open(CreateCustomerFormComponent, { maxHeight: '90vh' });
  }

  viewCustomerProfile(id) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = "50%";
    this.dialog.open(CustomerViewComponent, {
      data: id,
      maxHeight: '90vh'
    });
  }
}
