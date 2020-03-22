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
    if (!this.posService.getCompany){
      alert("please UpSync once to continue billing.")
    }
    this.voucherType = this.posService.getVoucherType();
    if (this.voucherType && this.voucherType["VOUCHERCLASSLIST.LIST"]){
      if (this.voucherType["VOUCHERCLASSLIST.LIST"] instanceof Array){
      for (let item of this.voucherType["VOUCHERCLASSLIST.LIST"]){
        if (this.posService.getPOSClass() != null 
            && item.CLASSNAME.content == this.posService.getPOSClass().CLASSNAME.content){
          this.posClass = item;
        }
      }
    } else {
      if (this.voucherType["VOUCHERCLASSLIST.LIST"].CLASSNAME.content = this.posService.getPOSClass()){
        this.posClass = this.voucherType["VOUCHERCLASSLIST.LIST"].CLASSNAME.content
      }
    }
    }
    this.voucher.PRICELEVEL = this.posService.getPriceList();

    this.godown = this.posService.getGodown();
    
    this.date.setValue(new Date());
  }
  ngAfterViewInit() {
    this.saveButton.nativeElement.focus();
  }

  valid(){
    return this.posService.getVoucherType && this.posService.getPOSClass && this.posService.getPriceList;
  }



  proceedChange(){
    const user: User = this.posService.getUser();
    console.log(user);
    this.voucherTypeList = user.voucherTypes.filter((voucher) => voucher.voucherClass == "sales")
    this.pricelevels = user.salesVoucherSettings.priceLists;
    this.godowns = user.godownList;
    // this.apiService.getSalesVoucherTypeName().subscribe(
    //   res => {
    //     this.voucherTypeList = res;
    //   },
    //   err => {
    //     console.log(err);
    //   }
    // );
    // this.apiService.getPriceList().subscribe(
    //   res => {
    //     this.pricelevels = res;
    //   },
    //   err => {
    //     console.log(err);
    //   }
    // );
    this.change = true
  }

  getVoucherType(value){
    console.log(value)
    this.apiService.getVoucherType(value.voucherTypeName).subscribe(
      res => {this.voucherType = res.ENVELOPE.BODY.DATA.TALLYMESSAGE.VOUCHERTYPE;
        this.posService.saveVoucherType(this.voucherType);
        this.posClassList = [];
      if (this.voucherType["VOUCHERCLASSLIST.LIST"] instanceof Array){
        var found : boolean = false;
        for (let item of this.voucherType["VOUCHERCLASSLIST.LIST"]){
          console.log(item.CLASSNAME.content);
          console.log()
          if (item.CLASSNAME.content == value.voucherClass){
            this.posService.savePOSClass(item);
            found = true;
          }
        }
        if (!found){
          alert("The POS Class does not exists. Please ask administrator to update your profile.")
        }
      } else {
        if (this.voucherType["VOUCHERCLASSLIST.LIST"].CLASSNAME.content == value.voucherClass){
          this.posService.savePOSClass(this.voucherType["VOUCHERCLASSLIST.LIST"]);
        }else {
          alert("The POS Class does not exists. Please ask administrator to update your profile.")
        }
      }

      },
      err => {
        console.log(err);
      }
    )
    
  }

  savePOSCLass(value){
    
  }

  saveGodown(value){
    this.posService.saveGodown(value);
  }

  savePriceList(value){
    console.log(value);
    this.posService.savePriceList(value);
  }


  

   setVoucher(){
    this.voucher.VOUCHERTYPENAME = this.voucherType.NAME;
    this.voucher._VCHTYPE = this.voucherType.NAME;
    this.voucher.ALLOWCONSUMPTION = "No";
    this.voucher.DATE = this.date.value;
    this.voucher._OBJVIEW = "Invoice Voucher View";
    this.voucher._ACTION = "Create";
    var old: OLDAUDITENTRYIDSLIST = new OLDAUDITENTRYIDSLIST();
    old.OLDAUDITENTRYIDS = "-1";
    old._TYPE = "Number";
    this.voucher.OLDAUDITENTRYIDS_LIST = old
    this.voucher.CLASSNAME = this.posClass.CLASSNAME.content;
    this.voucher.PERSISTEDVIEW = "Invoice Voucher View";
    this.voucher.VOUCHERNUMBER = "TT-" + Date.now().toString(16);
    this.voucher.FBTPAYMENTTYPE = "Default";
    this.voucher.DIFFACTUALQTY = "No";
    this.voucher.AUDITED = "No";
    this.voucher.ASORIGINAL = "No";
    this.voucher.ISMSTFROMSYNC = "No";
    this.voucher.FORJOBCOSTING = "No";
    this.voucher.ISOPTIONAL = "No";
    this.voucher.EFFECTIVEDATE = this.date.value;
    this.voucher.USEFOREXCISE = "No";
    this.voucher.ISFORJOBWORKIN = "No";
    this.voucher.ALLOWCONSUMPTION = "No";
    this.voucher.USEFORINTEREST = "No";
    this.voucher.USEFORGAINLOSS = "No";
    this.voucher.USEFORGODOWNTRANSFER = "No";
    this.voucher.USEFORCOMPOUND = "No";
    this.voucher.USEFORSERVICETAX = "No";
    this.voucher.ISEXCISEVOUCHER = "No";
    this.voucher.EXCISETAXOVERRIDE = "No";
    this.voucher.USEFORTAXUNITTRANSFER = "No";
    this.voucher.IGNOREPOSVALIDATION = "No";
    this.voucher.EXCISEOPENING = "No";
    this.voucher.USEFORFINALPRODUCTION = "No";
    this.voucher.ISTDSOVERRIDDEN = "No";
    this.voucher.ISTCSOVERRIDDEN = "No";
    this.voucher.ISTDSTCSCASHVCH = "No";
    this.voucher.INCLUDEADVPYMTVCH = "NO";
    this.voucher.ISSUBWORKSCONTRACT = "No";
    this.voucher.ISVATOVERRIDDEN = "No";
    this.voucher.IGNOREORIGVCHDATE = "No";
    this.voucher.ISVATPAIDATCUSTOMS = "No";
    this.voucher.ISDECLAREDTOCUSTOMS = "No";
    this.voucher.ISSERVICETAXOVERRIDDEN = "No";
    this.voucher.ISISDVOUCHER = "No";
    this.voucher.ISEXCISEOVERRIDDEN = "No";
    this.voucher.ISEXCISESUPPLYVCH = "No";
    this.voucher.ISGSTOVERRIDDEN = "No";
    this.voucher.GSTNOTEXPORTED = "NO";
    this.voucher.IGNOREGSTINVALIDATION = "No";
    this.voucher.ISVATPRINCIPALACCOUNT = "No";
    this.voucher.ISBOENOTAPPLICABLE = "No";
    this.voucher.ISSHIPPINGWITHINSTATE = "No";
    this.voucher.ISOVERSEASTOURISTTRANS = "No";
    this.voucher.ISDESIGNATEDZONEPARTY = "NO";
    this.voucher.ISCANCELLED = "No";
    this.voucher.HASCASHFLOW = "Yes";
    this.voucher.ISPOSTDATED = "NO";
    this.voucher.USETRACKINGNUMBER = "No";
    this.voucher.ISINVOICE = "Yes";
    this.voucher.MFGJOURNAL = "No";
    this.voucher.HASDISCOUNTS = "NO";
    this.voucher.ASPAYSLIP = "No";
    this.voucher.ISCOSTCENTRE = "No";
    this.voucher.ISSTXNONREALIZEDVCH = "No";
    this.voucher.ISEXCISEMANUFACTURERON = "No";
    this.voucher.ISBLANKCHEQUE = "No";
    this.voucher.ISVOID = "No";
    this.voucher.ISONHOLD = "No";
    this.voucher.ORDERLINESTATUS = "No";
    this.voucher.VATISAGNSTCANCSALES= "No";
    this.voucher.VATISPURCEXEMPTED = "NO";
    this.voucher.ISVATRESTAXINVOICE = "No";
    this.voucher.VATISASSESABLECALCVCH = "No";
    this.voucher.ISVATDUTYPAID = "Yes";
    this.voucher.ISDELIVERYSAMEASCONSIGNEE = "No";
    this.voucher.ISDISPATCHSAMEASCONSIGNOR = "No";
    this.voucher.ISDELETED = "No";
    this.voucher.CHANGEVCHMODE = "No";
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
