import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { VOUCHER, ALLLEDGERENTRIESLIST } from 'src/app/Model/voucher';
import { PaymentServiceService } from 'src/app/shared/payment-service.service';
import { ApiService } from 'src/app/shared/api.service';
import { AuthenticationService } from 'src/app/shared/authentication.service';
import { FormControl } from '@angular/forms';
import { Observable, from } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-payment-voucher-wizard',
  templateUrl: './payment-voucher-wizard.component.html',
  styleUrls: ['./payment-voucher-wizard.component.css']
})
export class PaymentVoucherWizardComponent implements OnInit {
  loading: boolean = false;
  @Input("voucher") voucher:VOUCHER;
  @Output("valueChanged") valueChanged = new EventEmitter();
  voucherSettings: boolean;
  entryView: boolean;
  syncView: boolean;
  voucherType: any;
  voucherTypeSelectionEnabled: boolean;
  filteredOptions: Observable<any[]>;
  ledgers$ : any[] =[]
  date = new FormControl();
  value = new FormControl();
  endVoucher: any = {
    NAME: "End of List"
  }
  posClass: any;
  voucherTypeList: any[] = [];
  ledgerName = new FormControl();
  @ViewChild("ledgerRef", {static: false}) ledgerRef : ElementRef;
  @ViewChild("partyLedgerRef", {static: false}) partyLedgerRef : ElementRef;
  @ViewChild("valueRef",  {static: false}) valueRef: ElementRef;


  constructor(private paymentService?: PaymentServiceService,
     private apiService?: ApiService, private auth?: AuthenticationService) { }

  ngOnInit() {
    this.voucher.DATE = new Date();
    
    for(let item of JSON.parse(sessionStorage.getItem("currentUser")).user.voucherTypes) {
      if (item.voucherCategory == "Payment"){
        this.voucherTypeList.push(item);
      }
    }
    this.voucherType = this.paymentService.getVoucherType();
    this.posClass = this.paymentService.getPaymentClass();
    this.voucherSettings = true;
    if (this.voucherType && this.posClass){
      this.voucherTypeSelectionEnabled = false;
      this.setVoucher();
    } else {
      this.voucherTypeSelectionEnabled = true;
    }
    this.paymentService.openDatabase().then(
      () => {
         from(this.paymentService.getLedgers()).pipe(
        map((ledgers) => ledgers.filter((ledger: any) => ledger.PARENT.content === "Indirect Expenses"))
      ).subscribe(
        res => {
          console.log(res);
          this.ledgers$ = res;
        },
        err => {
          console.log(err);
        }
      );
      
      }
    );

    
  
    this.filteredOptions = this.ledgerName.valueChanges.pipe(
      startWith(''),
      map(value => this.product_filter(value))

    );
    
    
  }


  getVoucherType(value){
    if(this.voucherType && this.voucherType.NAME == value.voucherTypeName ){
      
    } else {
      this.apiService.getVoucherType(value.voucherTypeName).subscribe(
        res => {
          this.voucherType = res.ENVELOPE.BODY.DATA.TALLYMESSAGE.VOUCHERTYPE;
          console.log(this.voucherType);
          this.paymentService.saveVoucherType(this.voucherType);
          if (this.voucherType["VOUCHERCLASSLIST.LIST"] instanceof Array){
            for(let item of this.voucherType["VOUCHERCLASSLIST.LIST"]){
              if (value.voucherClass == item.CLASSNAME.content){
                this.paymentService.savePaymentClass(this.voucherType["VOUCHERCLASSLIST.LIST"])
                this.posClass = this.voucherType["VOUCHERCLASSLIST.LIST"]
                this.setVoucher()
                return;
              }
            }
            alert ("Please ask your administrator to re-configure your payment voucher settings. The class you are assigned does not exists.")
          } else {
            if (value.voucherClass == this.voucherType["VOUCHERCLASSLIST.LIST"].CLASSNAME.content){
              this.posClass = this.voucherType["VOUCHERCLASSLIST.LIST"];
              this.paymentService.savePaymentClass(this.voucherType["VOUCHERCLASSLIST.LIST"])
              this.setVoucher();

            }else{
              alert ("Please ask your administrator to re-configure your payment voucher settings. The class you are assigned does not exists.")
            }
          }
        },
        err => {
          console.log(err);
        }
      ).add(
        () => this.setVoucher()
      )
    }
  }



  private product_filter(value: string): any[] {
    const filterValue = value.toString().toLowerCase();
    return this.ledgers$.filter(option => option.NAME.toLowerCase().indexOf(filterValue) === 0);
  }
  displayFnProduct(user?: any): string | undefined {
    return user && user.NAME ? user.NAME : '';
  }


  selectLedger(value){
    console.log(value);
    if(value == "End of List"){
      this.next();
    } else{
      this.valueRef.nativeElement.focus();
    }
  }

  addLedgerEntry(value){
    var entry: ALLLEDGERENTRIESLIST = new ALLLEDGERENTRIESLIST();
    entry.LEDGERNAME = this.ledgerName.value.NAME;
    entry.AMOUNT = this.value.value * (-1);
    entry.ISDEEMEDPOSITIVE = "Yes";
    entry.ISPARTYLEDGER = "No";
    console.log(entry);
    this.voucher.ALLLEDGERENTRIES_LIST.push(entry);
    this.value.setValue(0);
    this.ledgerName.setValue("");
    this.partyLedgerRef.nativeElement.focus();
  }

  setToFalse(){
    this.voucherSettings = false;
    this.entryView = false;
    this.syncView = false;
  }

  upSync(){
    this.paymentService.syncAllCacheVouchers();
  }

  downSync(){
    this.paymentService.saveLedgers();
  }



  next(){
    console.log(this.voucher)
    if (this.voucherSettings){
      this.setToFalse()
      
      this.entryView = true;
    } else if(this.entryView){
      this.setToFalse();
      if (this.voucherCompleted()){
        this.save()
      } else {
        alert("Please complete the voucher before saving")
      }
    }
  }

  voucherCompleted(): boolean {
    if (this.voucher.VOUCHERTYPENAME == ""){
      return false;
    }
    if (this.voucher._ACTION == ""){
      return false;
    }
    if (this.voucher.VOUCHERTYPENAME == ""){
      return false;
    }
    if (this.voucher.ALLLEDGERENTRIES_LIST.length < 1){
      return false;
    }
    if (this.voucher.PARTYLEDGERNAME == ""){
      return false;
    }
    if (this.voucher.VOUCHERNUMBER == ""){
      return false;
    }
    if (this.voucher.DATE == null){
      return false;
    }
    return true;
  }

  setVoucher(){
    this.voucher._VCHTYPE = this.voucherType.NAME;
    this.voucher.VOUCHERTYPENAME = this.voucherType.NAME;
    this.voucher.VOUCHERNUMBER = Date.now().toString(16);
    this.voucher._ACTION = "Create";
    this.voucher._OBJVIEW = "Accounting Voucher View";
    this.voucher.PARTYLEDGERNAME = this.posClass["LEDGERFORINVENTORYLIST.LIST"].NAME.content;
    
    
  }


  save() {

    this.loading = true;
    var total: number = 0;
    
    for(let item of this.voucher.ALLLEDGERENTRIES_LIST){
      if (item.ISPARTYLEDGER != "Yes"){
        total = total + item.AMOUNT
      }
    }
    var entry: ALLLEDGERENTRIESLIST = new ALLLEDGERENTRIESLIST();
    entry.LEDGERNAME = this.posClass["LEDGERFORINVENTORYLIST.LIST"].NAME.content;
    entry.ISDEEMEDPOSITIVE = "No";
    entry.ISPARTYLEDGER = "Yes";
    entry.AMOUNT = total*(-1);
    this.voucher.ALLLEDGERENTRIES_LIST.push(entry);
    this.voucher.EFFECTIVEDATE = this.voucher.DATE;
    console.log("Saving Voucher...")
    console.log(this.voucher);
    this.apiService.saveTallyVoucher(this.voucher).subscribe(
      res => {
        if (res.RESPONSE.CREATED == 0 && res.RESPONSE.UPDATED == 0){
     
          this.paymentService.addCacheVoucher(this.voucher).then(
            () => {
              this.loading = false;
              
              
            }
          )
  
        } else {
          alert("Voucher Saved to Tally Successfully")
          this.setToFalse();
          this.voucherSettings = true;
          this.valueChanged.emit("voucherCompleted");
          this.loading = false;
        }
      },
      err => {
       
          this.paymentService.addCacheVoucher(this.voucher).then(
            () => {
              this.loading = false;
              
            }
          )
        
        
      }
    );
  }
}
