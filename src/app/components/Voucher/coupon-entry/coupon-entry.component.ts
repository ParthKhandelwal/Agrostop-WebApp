import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AgroVoucherService } from '../../../services/AgroVoucher/agro-voucher.service';
import { ApiService } from '../../../services/API/api.service';
import { SyncService } from '../../../services/Sync/sync.service';
import { StockItem } from '../../../model/StockItem/stock-item';
import { LEDGERENTRIESLIST } from '../../../model/Voucher/voucher';
import { AutoCompleteComponent } from '../../AgroComponents/auto-complete/auto-complete.component';

@Component({
  selector: 'app-coupon-entry',
  templateUrl: './coupon-entry.component.html',
  styleUrls: ['./coupon-entry.component.css']
})
export class CouponEntryComponent implements OnInit {

  ledgerSelection: boolean = false;
  coupon: any;
  @ViewChild("ledgerAutoComp") ledgerAutoComp: AutoCompleteComponent;
  constructor(public dialogRef?: MatDialogRef<CouponEntryComponent>,@Inject(MAT_DIALOG_DATA) public coupons?: any[],
              public apiService?: ApiService, public service?: AgroVoucherService,
              public syncService?: SyncService, public cd?: ChangeDetectorRef ) { }

  ngOnInit(): void {

  }

  redeemCoupon(ledger: LEDGERENTRIESLIST){
    if(this.coupon){
      this.apiService.redeemCoupon(this.coupon.id).subscribe(
        res => {
          this.dialogRef.close(ledger);
          let index = this.service.coupons.findIndex((c)=> c.id === this.coupon.id);
          this.service.coupons.splice(index,1);
        },
        err =>{
          alert("Could not redeem voucher right now. Please Try Again?");
          this.dialogRef.close(null);
        }
      );
    }

  }
  couponSelected(coupon){
    this.coupon = coupon;
    this.ledgerSelection = true;
    this.cd.detectChanges();
    setTimeout(() => {
      this.ledgerAutoComp.ledgerRef.nativeElement.focus();
    }, 300);
  }

  addLedger(value){
    let ledger: LEDGERENTRIESLIST = new LEDGERENTRIESLIST();
    ledger.ISDEEMEDPOSITIVE = "No"
    ledger.LEDGERNAME = value
    ledger.AMOUNT = this.getAmount((-1)*this.coupon.couponAmount);
    this.redeemCoupon(ledger);
  }

  getAmount(amount): number{
    let invTotal = 0;
        let taxTotal = 0;
    for (let product of this.service.voucher.ALLINVENTORYENTRIES_LIST){
      var item: StockItem = Object.assign(new StockItem(),this.syncService.products$.getValue().filter((i) => i.NAME === product.STOCKITEMNAME)[0]);

      if(item){
        invTotal = invTotal + (product.BILLEDQTY*product.RATE)
        this.service.voucher.LEDGERENTRIES_LIST
        .filter((l) => l.METHODTYPE == "GST")
        .forEach((l) => {
          let ledger = this.syncService.ledgers$.getValue().filter((v) => v.NAME === l.LEDGERNAME)[0];
          let invTax = item.getTax(product.BILLEDQTY,product.RATE,"",ledger.GSTDUTYHEAD);
          taxTotal = taxTotal + invTax;
        })


      }else{
        throw new Error("Please re-select the product");

      }

    }
    return Math.round(amount/(1+ (taxTotal/invTotal))*100)/100
  }

}
