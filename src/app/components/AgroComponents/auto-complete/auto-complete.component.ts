import { Component, OnInit, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { FormControl } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';
import { Customer } from '../../../model/Customer/customer';
import { Address } from '../../../model/Address/address';

import { SyncService } from '../../../services/Sync/sync.service';



@Component({
  selector: 'auto-complete',
  templateUrl: './auto-complete.component.html',
  styleUrls: ['./auto-complete.component.css']
})
export class AutoCompleteComponent implements OnInit {
  @ViewChild('invField', { static: false }) productRef: ElementRef;
  @ViewChild('customerField', { static: false }) customerRef: ElementRef;
  @ViewChild('addressField', { static: false }) addressRef: ElementRef;
  @ViewChild('ledgerField', { static: false }) ledgerRef: ElementRef;

  @Input("type") type: string;
  @Input("list") list: any[];
  @Input("listProvided") provided: boolean;
  @Input("ledgerParent") ledgerParent: string[];
  @Input("ledgerList") ledgerList: string[];
  @Input("model")model: string;
  @Input("placeholder")placeholder: string;


  @Output() optionSelected: EventEmitter<any> = new EventEmitter();

  customerFilteredOptions: Observable<Customer[]>;
  customerControl = new FormControl();
  customers: Customer[] = []
  customers$: Subscription;

  productControl = new FormControl();
  productFilteredOptions: Observable<any[]>;
  products: any[];
  products$: Subscription;
  endVoucher: any ={"NAME": "END OF LIST"};


  ledgerControl = new FormControl();
  ledgerFilteredOptions: Observable<any[]>;
  ledgers: any[];
  ledgers$: Subscription;

  addresses: Address[] = [];
  addresses$: Subscription;
  addressFilteredOptions: Observable<any[]>;
  addressControl = new FormControl();
  address: Address;
  notVisible:boolean


  constructor(public service: SyncService) {
  }

  ngOnInit() {
    this.sync();
  }



  public sync(){
    if(this.type == "customer"){
      this.customers$ =  this.service.customers$.subscribe(
        res => {
          this.customers = res;
          this.customerFilteredOptions = this.customerControl.valueChanges.pipe(
            startWith(''),
            map(value => value.length > 1 ? this.customer_filter(value): [])
          );
        }
      )


    } else if(this.type == "product") {
      this.products$ = this.service.products$.subscribe(
        res => {
          this.products = res
          this.productFilteredOptions = this.productControl.valueChanges.pipe(
            startWith(''),
            map(value => value.length> 3 ? this.product_filter(value): [])
          );

        }
      )

    }else if(this.type == "address") {
      this.addresses$ = this.service.addresses$.subscribe(
        res => {
          this.addresses = res
          this.addressFilteredOptions = this.addressControl.valueChanges.pipe(
            startWith(''),
            map(value => value.length> 1 ? this.address_filter(value):[])
          );
        }
      )


    }else if(this.type == "ledger") {

      this.ledgers$ = this.service.ledgers$.subscribe(
        res => {
          if(this.ledgerList && this.ledgerList.length>0){
            this.ledgers = res.filter((l) => this.ledgerList.includes(l.NAME));
          }else if(this.ledgerParent && this.ledgerParent.length>0){
            this.ledgers = res.filter((l) => this.ledgerParent.includes(l.PARENT));
          }else {
            console.log("Fetching All Ledgers");
            this.ledgers = res;
          }
          this.ledgerFilteredOptions = this.ledgerControl.valueChanges.pipe(
            startWith(''),
            map(value => value.length> 0 ? this.ledger_filter(value): [])
          );
        }
      )


    }
  }



  private customer_filter(value: string): Customer[] {
    const filterValue = value? value.toString().toLowerCase(): "";
    return this.customers.filter(option => {
      return (option.phoneNumber ? option.phoneNumber.toLowerCase().indexOf(filterValue) == 0 : false)
      || option.name.toLowerCase().indexOf(filterValue) === 0;
    }
    )

  }

  private ledger_filter(value: string): Customer[] {
    const filterValue = value? value.toString().toLowerCase(): "";
    return this.ledgers.filter(option => {
      return  option.NAME.toLowerCase().indexOf(filterValue) > -1;
    }
    )

  }

  private address_filter(value: string): any[] {
    const filterValue = value.toString().toLowerCase();
    return this.addresses.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
  }

  displayFnAddress(user?: any): string | undefined {
    return user && user._id ? user.name : '';
  }

  displayFnLedger(user?: any): string | undefined {
    return user && user.NAME ? user.NAME : '';
  }


  displayFnCustomer(user?: any): string | undefined {
    return user && user.phoneNumber ? user.phoneNumber : '';
  }

  private product_filter(value: string): any[] {
    const filterValue = value.toString().toLowerCase();
    return this.products.filter(option => {
      return option.NAME.toLowerCase().indexOf(filterValue) >= 0 });
  }

  displayFnProduct(user?: any): string | undefined {
    return user && user.NAME ? user.NAME : '';
  }

  focus(){
    switch(this.type){
      case "product" :
        this.productRef.nativeElement.focus();
        break;
      case "customer" :
          this.customerRef.nativeElement.focus();
          break;
      case "product" :
          this.productRef.nativeElement.focus();
          break;
      case "address":
        this.addressRef.nativeElement.focus();
        break;
      default:
        break;
    }
  }


  ngOnDestroy(){
    this.customers$ ? this.customers$.unsubscribe(): false;
    this.ledgers$? this.ledgers$.unsubscribe(): false;
    this.addresses$? this.addresses$.unsubscribe(): false;
    this.products$? this.products$.unsubscribe(): false;
  }


  handleCustomer(value){
    console.log(value);
  }
}
