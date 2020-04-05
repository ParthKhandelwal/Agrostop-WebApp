import { Component, OnInit, Input, ViewChild, Output, EventEmitter, ElementRef } from '@angular/core';
import { VOUCHER, OLDAUDITENTRYIDSLIST, LEDGERENTRIESLIST, ALLLEDGERENTRIESLIST } from 'src/app/Model/voucher';
import { ApiService } from 'src/app/shared/api.service';
import { FormControl } from '@angular/forms';
import { PosService } from 'src/app/shared/pos.service';
import { User } from 'src/app/Model/user';


@Component({
  selector: 'voucher-setting',
  templateUrl: './voucher-setting.component.html',
  styleUrls: ['./voucher-setting.component.css']
})
export class VoucherSettingComponent implements OnInit {

  @ViewChild('saveButton', {static: false}) saveButton: ElementRef;

  @Input('voucher') voucher: VOUCHER;
  @Input('ledgerList') ledgerList: any[];
  @Output() valueChanged = new EventEmitter();
  date = new FormControl();
  voucherTypeList: any[] = [];
  voucherType: any;
  godowns: any[] = [];
  posClassList: any[] = [];
  posClass: any;
  pricelevels: any[] = [];
  change : boolean = false;
  godown: string;

  constructor(private apiService?: ApiService, private posService?: PosService) { }

  ngOnInit() {
    this.voucherType = this.posService.getVoucherType();
    this.posClass = this.posService.getPOSClass();
    this.voucher.PRICELEVEL = this.posService.getPriceList();

    this.godown = this.posService.getGodown();
    
    this.date.setValue(new Date());
    this.setVoucher();
  }
  ngAfterViewInit() {
 
  }

  






  

   setVoucher(){
    this.voucher.VOUCHERTYPENAME = this.voucherType.NAME;
    this.voucher._VCHTYPE = this.voucherType.NAME;
    this.voucher.DATE = this.date.value;
    this.voucher._OBJVIEW = "Invoice Voucher View";
    this.voucher._ACTION = "Create";
    this.voucher.CLASSNAME = this.posClass.CLASSNAME.content;
    this.voucher.PERSISTEDVIEW = "Invoice Voucher View";
    this.voucher.VOUCHERNUMBER = "TT-" + Date.now().toString(16);
    this.voucher.LEDGERENTRIES_LIST = [];

    this.ledgerList = [];
    var tempArray: any[] = [];
    if (this.posClass["LEDGERENTRIESLIST.LIST"] instanceof Array){
      tempArray = this.posClass["LEDGERENTRIESLIST.LIST"]
    } else{
      tempArray.push(this.posClass["LEDGERENTRIESLIST.LIST"])
    }
    for (let ledger of tempArray){
      if (ledger.NAME){

      this.posService.getLedger(ledger.NAME.content).then(
        res1 =>{
          var res: any;
          if (res1 == null){
             res = this.posService.saveLedger(ledger.NAME);
          } else {
           res = res1
          }
          
          var ledgerEntry: LEDGERENTRIESLIST = new LEDGERENTRIESLIST();
          var oldaudit: OLDAUDITENTRYIDSLIST = new OLDAUDITENTRYIDSLIST();
          oldaudit.OLDAUDITENTRYIDS = "-1";
          ledgerEntry.OLDAUDITENTRYIDS_LIST = oldaudit;
          ledgerEntry.LEDGERNAME = res.NAME;
          ledgerEntry.METHODTYPE = ledger.METHODTYPE.content
          ledgerEntry.ISDEEMEDPOSITIVE = res.ISDEEMEDPOSITIVE.content;
          ledgerEntry.LEDGERFROMITEM = ledger.LEDGERFROMITEM.content;
          ledgerEntry.ROUNDLIMIT = ledger.ROUNDLIMIT.content;
          ledgerEntry.ROUNDTYPE = ledger.ROUNDTYPE.content;
          ledgerEntry.REMOVEZEROENTRIES = ledger.REMOVEZEROENTRIES.content;
          ledgerEntry.ISPARTYLEDGER = "No";
          ledgerEntry.tallyObject = res;
          this.voucher.LEDGERENTRIES_LIST.push(ledgerEntry);
        },
        err=>{
          console.log(err);
        }
      );
      }
    }

    if (this.posClass.POSENABLECARDLEDGER){
      var ledgerEntry: LEDGERENTRIESLIST = new LEDGERENTRIESLIST();
      ledgerEntry.LEDGERNAME = this.posClass.POSCARDLEDGER.content
      ledgerEntry.POSPAYMENTTYPE = "Card";
      this.voucher.LEDGERENTRIES_LIST.push(ledgerEntry)
    }

    if (this.posClass.POSENABLECASHLEDGER){
      var ledgerEntry: LEDGERENTRIESLIST = new LEDGERENTRIESLIST();
      ledgerEntry.LEDGERNAME = this.posClass.POSCASHLEDGER.content
      ledgerEntry.POSPAYMENTTYPE = "Cash";
      this.voucher.LEDGERENTRIES_LIST.push(ledgerEntry);
    }

    if (this.posClass.POSENABLECHEQUELEDGER){
      var ledgerEntry: LEDGERENTRIESLIST = new LEDGERENTRIESLIST();
      ledgerEntry.LEDGERNAME = this.posClass.POSCHEQUELEDGER.content
      ledgerEntry.POSPAYMENTTYPE = "Cheque";
      this.voucher.LEDGERENTRIES_LIST.push(ledgerEntry)
    }

    if (this.posClass.POSENABLEGIFTLEDGER){
      var ledgerEntry: LEDGERENTRIESLIST = new LEDGERENTRIESLIST();
      ledgerEntry.LEDGERNAME = this.posClass.POSGIFTLEDGER.content
      ledgerEntry.POSPAYMENTTYPE = "Gift";
      this.voucher.LEDGERENTRIES_LIST.push(ledgerEntry);
    }

    this.valueChanged.emit("voucher set");
  }

}
