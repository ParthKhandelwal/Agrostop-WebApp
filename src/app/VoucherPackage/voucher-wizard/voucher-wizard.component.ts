import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { VOUCHER } from '../../Model/voucher';
import { VoucherService } from '../../shared/voucher.service';
import { User } from '../../Model/user';
import { Customer } from '../../Model/customer';
import { ApiService } from '../../shared/api.service';


@Component({
  selector: 'voucher-wizard',
  templateUrl: './voucher-wizard.component.html',
  styleUrls: ['./voucher-wizard.component.css']
})
export class VoucherWizardComponent implements OnInit {
  customerSelection: boolean = false;
  inventorySelection: boolean = false;
  payment: boolean = false;
  user: User;
  customerList: Customer[] = [];
  productList: any[] = [];

  @Output("valueChange") valueChanged = new EventEmitter
  @Input("editMode") editMode: boolean;
  @Input('voucher') voucher: VOUCHER;
  constructor(private voucherService?: VoucherService, private apiService?: ApiService) { }

  ngOnInit() {
 
    this.voucherService.initializeWebSocketConnection();
    this.apiService.getPOSUser().subscribe(
      res => {
        this.user = res;
        
        if (this.editMode) {
          this.voucher.setAction("Update")
          
        } else {
          this.voucher = new VOUCHER();
          this.voucher.setCustomer(new Customer());
          this.voucher.setDate(new Date());
          this.voucher.setAction("Create")
        }
        this.voucher.setUser(res);
        this.apiService.getAllStockItemsForBilling(this.voucher.PLACEOFSUPPLY).subscribe(
          res1 => {
            this.productList = res1;

            this.apiService.getCustomers().subscribe(
              res2 => {
                this.customerList = res2;

                this.switchCustomer();
              },
              err2 => {
                console.log(err2);
              });
          },
          err1 => {
            console.log(err1);
          }
        );

        


      },
      err => { }
    );

    

    
  }

  switchInventory() {
    this.inventorySelection = true;
    this.customerSelection = false;
    this.payment = false;
  }

  switchCustomer() {
    this.inventorySelection = false;
    this.customerSelection = true;
    this.payment = false;
  }

  switchPayment() {
    this.payment = true;
    this.inventorySelection = false;
    this.customerSelection = false;
  }

  next() {
    if (this.customerSelection) {
      this.switchInventory();
      
    } else if (this.inventorySelection) {
      this.switchPayment();
      console.log("switching to Payment")
    }
  }

  previous() {
    if (this.payment) {
      this.switchInventory();
    } else if (this.inventorySelection) {
      this.switchCustomer();
    }
  }

  save() {

    this.voucher.NARRATION = "{\"agrostop\" : { \"customerId\":\"" + this.voucher.CUSTOMERID + "\"}}";
    this.voucherService.sendVoucher(this.voucher);
    this.valueChanged.emit("voucherCompleted");
    this.voucher = new VOUCHER()
    this.voucher.setCustomer(new Customer());
    this.voucher.setUser(this.user);
    this.voucher.setDate(new Date());
    this.switchCustomer();
  }
}
