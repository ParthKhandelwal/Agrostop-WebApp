import { Component, OnInit } from '@angular/core';
import { VoucherService } from '../../shared/voucher.service';

@Component({
  selector: 'app-create-order-form',
  templateUrl: './create-order-form.component.html',
  styleUrls: ['./create-order-form.component.css']
})
export class CreateOrderFormComponent implements OnInit {

  constructor(private voucherService?: VoucherService) { }

  ngOnInit() {
  }

}
