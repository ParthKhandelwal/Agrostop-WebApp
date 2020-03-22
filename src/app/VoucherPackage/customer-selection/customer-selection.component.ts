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

@Component({
  selector: 'customer-selection',
  templateUrl: './customer-selection.component.html',
  styleUrls: ['./customer-selection.component.css']
})
export class CustomerSelectionComponent implements OnInit {
  createCustomer: boolean = false;
  loaded: boolean = false;
  customer: any;
  customerControl = new FormControl();
  filteredOptions: Observable<Customer[]>;
  @Input("isOrder") isOrder: boolean;
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
    this.customerRef.nativeElement.focus();
    this.customer = this.customers.filter(obj => obj.customerId == this.voucher.CUSTOMERID)[0];

  }
  
  
  

  private customer_filter(value: string): Customer[] {
    const filterValue = value.toString().toLowerCase();
    return this.customers.filter(option => option.phoneNumber.toLowerCase().indexOf(filterValue) === 0);
  }

  validateCustomer() {
    if(this.customer){
    this.voucher.CUSTOMERID = this.customer.customerId;
    this.voucher.BASICBUYERNAME = this.customer.name
    this.voucher.ADDRESS_LIST = new ADDRESSLIST(this.customer.addressName, this.customer.addressTehsilName, this.customer.addressDistrictName,
                                                this.customer.addressStateName);
    this.voucher.COUNTRYOFRESIDENCE = "India";
    this.voucher.GSTREGISTRATIONTYPE = this.customer.gSTREGISTRATIONTYPE;
    this.voucher.STATENAME = this.customer.addressStateName;
    this.valueChange.emit("Customer Successfully Selected");
    }
    
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

    const dialogRef = this.dialog.open(CustomerViewComponent, {
      data: id,
      maxHeight: '90vh'
    });

    dialogRef.afterClosed().subscribe(result => {
      let temp: VOUCHER = new VOUCHER();
      temp = _.assign(temp, new VOUCHER);
      this.voucher.ALLINVENTORYENTRIES_LIST = temp.ALLINVENTORYENTRIES_LIST;
    });
  }
}
