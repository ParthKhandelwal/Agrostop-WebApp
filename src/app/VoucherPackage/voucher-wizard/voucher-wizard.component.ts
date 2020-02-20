import { Component, OnInit, Input } from '@angular/core';
import { VOUCHER } from '../../Model/voucher';
import { VoucherService } from '../../shared/voucher.service';
import { User } from '../../Model/user';
import { Customer } from '../../Model/customer';

@Component({
  selector: 'voucher-wizard',
  templateUrl: './voucher-wizard.component.html',
  styleUrls: ['./voucher-wizard.component.css']
})
export class VoucherWizardComponent implements OnInit {
  customerSelection: boolean = false;
  inventorySelection: boolean = false;
  payment: boolean = false;

  @Input('voucher') voucher: VOUCHER;
  constructor(private voucherService?: VoucherService) { }

  ngOnInit() {
    this.voucherService.initializeWebSocketConnection();
    this.switchCustomer();
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
    console.log(this.voucher);
    this.voucherService.sendVoucher(this.voucher);
    const user: User = this.voucher.USER;
    this.voucher = new VOUCHER()
    this.voucher.setCustomer(new Customer());
    this.voucher.setUser(user);
    this.voucher.setDate(new Date());
    this.switchCustomer();
  }
}
