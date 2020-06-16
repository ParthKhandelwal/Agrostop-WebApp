import { Component, OnInit, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { Customer } from 'src/app/Model/customer';
import { FormControl } from '@angular/forms';
import { DatabaseService } from 'src/app/shared/database.service';
import { AppComponent } from 'src/app/app.component';
import { startWith, map } from 'rxjs/operators';
import { StockItem } from 'src/app/Model/stock-item';

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
  @Output() optionSelected: EventEmitter<any> = new EventEmitter();

  customerFilteredOptions: Observable<Customer[]>;
  customerControl = new FormControl();
  customers: Customer[] = []
  databaseService: DatabaseService;


  productControl = new FormControl();
  productFilteredOptions: Observable<any[]>;
  products: any[];
  endVoucher: any ={"NAME": "END OF LIST"};


  ledgerControl = new FormControl();
  ledgerFilteredOptions: Observable<any[]>;
  ledgers: any[];




  constructor() {
    this.databaseService = AppComponent.databaseService;
  }

  ngOnInit() {
    this.databaseService.openDatabase().then((res) => {
      if(this.list){
        this.tempget();
      }else {
        this.get()
      }
      
    });
   
  }

  get(){
    if(this.type == "customer"){
      this.databaseService.getCustomers().then((res) => {
        this.customers = res.map((cus) => {
          if (cus.addressId){
            this.databaseService.getAddress(cus.addressId).then(
              (add) => {
                cus.fullAddress = add
              }
            )
          }
          
          return cus;
        });
        

        this.customerFilteredOptions = this.customerControl.valueChanges.pipe(
          startWith(''),
          map(value => this.customer_filter(value))
        );
      });
    } else if(this.type == "product") {

      this.databaseService.getProductBatch().then(
        (batches)=> {
          this.databaseService.getAllStockItemsForBilling().then(
            (res: StockItem[]) => {
              
     
              this.products = res.map((pro) => {
                pro.BATCHES = batches.filter((batch) => {
                  return (batch.productId == pro.NAME) && (batch.CLOSINGBALANCE != 0) 
                  && (batch.EXPIRYDATE ? new Date(batch.EXPIRYDATE) >= new Date(): true);
                })
                return pro;
              })
              this.productFilteredOptions = this.productControl.valueChanges.pipe(
                startWith(''),
                map(value => this.product_filter(value))
              );
              
            }
            );
        }
      )

    }else if(this.type == "ledger") {
      this.databaseService.getLedgers().then(
        (res)=> {
          this.ledgers = res
          this.ledgerFilteredOptions = this.ledgerControl.valueChanges.pipe(
            startWith(''),
            map(value => this.ledger_filter(value))
          );
        }
        );

    }
  }


  tempget(){
    if(this.type == "customer"){
      this.customers = this.list;
      this.customerFilteredOptions = this.customerControl.valueChanges.pipe(
        startWith(''),
        map(value => this.customer_filter(value))
      );
     
    } else if(this.type == "product") {

      this.products = this.list
              this.productFilteredOptions = this.productControl.valueChanges.pipe(
                startWith(''),
                map(value => this.product_filter(value))
              );

    }else if(this.type == "ledger") {
      this.databaseService.getLedgers().then(
        (res)=> {
          this.ledgers = res
          this.ledgerFilteredOptions = this.ledgerControl.valueChanges.pipe(
            startWith(''),
            map(value => this.ledger_filter(value))
          );
        }
        );

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
      return  option.NAME.toLowerCase().indexOf(filterValue) === 0;
    }
    )
      
  }

  displayFnLedger(user?: any): string | undefined {
    return user && user.phoneNumber ? user.phoneNumber : '';
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
      case "product" :
          this.productRef.nativeElement.focus();
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
}
