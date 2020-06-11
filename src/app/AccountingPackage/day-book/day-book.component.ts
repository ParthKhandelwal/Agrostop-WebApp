import { Component, OnInit, Inject, ViewChild, Input } from '@angular/core';
import { VOUCHER, LEDGERENTRIESLIST, ALLINVENTORYENTRIESLIST, ALLLEDGERENTRIESLIST } from '../../Model/voucher';
import { ApiService } from '../../shared/api.service';
import { VoucherTableComponent } from '../../tables/voucher-table/voucher-table.component';
import { TallyVoucher, Request } from '../../Model/tally-voucher';
import { VoucherService } from '../../shared/voucher.service';
import { Observable, from } from 'rxjs';
import { Router } from '@angular/router';
import * as cloneDeep from 'lodash/cloneDeep';
import { FormControl } from '@angular/forms';
import { map, filter, startWith } from 'rxjs/operators';
import { PosService } from 'src/app/shared/pos.service';
import { VoucherTypeClass } from 'src/app/Model/user';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import uniqid from 'uniqid';
import { DatePipe } from '@angular/common';
import { DatabaseService } from 'src/app/shared/database.service';
import { AppComponent } from 'src/app/app.component';
import { Address } from 'src/app/Model/address';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { InvoicePrintViewComponent } from 'src/app/PrintPackage/invoice-print-view/invoice-print-view.component';




@Component({
  selector: 'app-day-book',
  templateUrl: './day-book.component.html',
  styleUrls: ['./day-book.component.css']
})
export class DayBookComponent implements OnInit {
  loading: boolean = false
  editMode: boolean = false
  showDetails: boolean = false;
  voucher: VOUCHER = new VOUCHER();
  fromDate = new FormControl();
  toDate = new FormControl();
  vouchers:any[] = []
  @ViewChild(VoucherTableComponent, { static: false }) table: VoucherTableComponent;
  stream$ : Observable<any[]>
  filterFieldFC = new FormControl();
  filterOperationFC = new FormControl();
  filterValueFC = new FormControl();
  filteredArray : any[] =[]
  masterIds: any[] = [];
  voucherPercent: number = 100;
  cacheVouchers: any[] = [];
  stompClient: any;
  connected: boolean;
  filterValue: any;
  map: Map<string, string> = new Map();
  filteredOptions: Observable<string[]>;

  filterField: any[] = [
    "Voucher Type",
    "Tally Username",
    "Customer"
  ]
  filterOperation: any[] = [
    "Equal"
  ]
  databaseService: DatabaseService;
  filterValue$: any[];
  filterMap: Map<String, any[]>;
  filterValues: string[];

  constructor(private apiService?: ApiService,private dialog?: MatDialog, private datePipe?: DatePipe, private router?: Router ) {
    this.databaseService = AppComponent.databaseService;
   }

  ngOnInit() {
    this.toDate.setValue(new Date());
    this.fromDate.setValue(new Date());
    this.sync();
    this.databaseService.openDatabase().then(
      res =>{
        this.databaseService.getAllCacheVouchers().then(
          (res) => {
            this.cacheVouchers = res;
            console.log(res);
          }
        );
       
      }
    );
    
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.filterValues.filter(option => option.toLowerCase().indexOf(filterValue) >= 0);
  }

  sync(){
    
    if (!this.stompClient || !this.stompClient.connected){
      let ws = new SockJS(this.apiService.WEB_SOCKET_URL + "/tallySocket");

      this.stompClient = Stomp.over(ws);

      const that = this;
      this.stompClient.connect({}, function (frame) {
        that.stompClient.subscribe("/topic/sync", (message) => {
          if (message.body) {
            console.log(message.body);
            var type: string = that.map.get(message.body);
            if (type == "VOUCHER"){
              that.getVouchers(message.body);
            } 
           
          }
        });
        that.createVoucherRequest();
      })
          
       
      
      this.connected = this.stompClient.connected;
      
      
    }
    
  
  

  }

  createVoucherRequest(){
    const user = this.databaseService.getUser();
    var request : Request = new Request("VOUCHER");
    request.guid = uniqid();
    request.fromDate = this.datePipe.transform(this.fromDate.value, "yyyyMMdd");
    request.toDate = this.datePipe.transform(this.toDate.value, "yyyyMMdd");
    request.request = "";
    request.name = "";
    request.parentList = user.voucherTypes.map(res => res.voucherTypeName);
    this.map.set(request.guid, "VOUCHER");
    this.sendRequest(request);
  }


  public sendRequest(request: Request){
    this.stompClient.send("/app/tallySync", {}, JSON.stringify(request));   
  }





  getVouchers(guid: string){
    this.filterMap = new Map();
    this.voucherPercent = 0;
    this.loading = true;
    this.apiService.getTallyData(guid).subscribe(
        async (res: any) =>{
          
          if (res != null){
            if(!(res.VOUCHER instanceof Array)){
              this.vouchers = [];
              this.vouchers.push(res.VOUCHER);
            }else {
              this.vouchers = res.VOUCHER;
            }
            
           

            this.vouchers = this.vouchers.sort((a,b) => new Date(a.DATE).getTime() - new Date(b.DATE).getTime())
                          .filter((v) => v.INVENTORYENTRIES);
         
            this.vouchers = this.vouchers.map(res => {
                              var customer = this.databaseService.getCustomer(res.BASICBUYERNAME).then(
                                (customer) => {
                                  res.BASICBUYERNAME = customer ? customer.name : res.BASICBUYERNAME;
                                  if(customer && customer.addressId){
                                    var address = this.databaseService.getAddress(customer.addressId).then(
                                      (address) => {
                                        res.ADDRESS = address ? address.name : res.ADDRESS;
                                      }
                                    )
                                    
                                  }
                                }
                              );
                              
                              return res;
                            });
            this.filterMap.set("Voucher Number", [...new Set(this.vouchers.map((v)=> v.VOUCHERNUMBER))]);
            this.filterMap.set("Address", [...new Set(this.vouchers.map((v)=> v.ADDRESS))]);            
            this.filterMap.set("Voucher Type", [...new Set(this.vouchers.map((v)=> v.VOUCHERTYPENAME))]);     
            this.filterMap.set("Amount Greater Than", null);
            this.filterMap.set("Amount Smaller Than", null);
            this.filterMap.set("Including Stock Item", [...new Set([].concat(...this.vouchers.map((v)=> v.INVENTORYENTRIES ? v.INVENTORYENTRIES.STOCKITEM: null)).map((v) => v? v.STOCKITEMNAME: ""))])
                   
            console.log(this.vouchers);
            this.filteredArray = this.vouchers;
            this.loading = false;
            this.voucherPercent = 100;
          } else {
            this.loading = false;
            this.voucherPercent = 100;
          }
          
        },
        err => {
          console.log(err);
        }
      )
    
  }


  filterFieldSelected(res){
    this.filterValues = res;
    this.filteredOptions = this.filterValueFC.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }

  getVoucherTotalOffline(list){
    var total: number = 0;
      for (let item of list){
        total = total + (item.POSPAYMENTTYPE && item.AMOUNT ? (item.AMOUNT) : 0);
      }
      return total*(-1);
  }

  getVoucherTotal(list){
    if(list){
      if (list instanceof Array){
        var total: number = 0;
        for (let item of list){
          total = total + (item.ISDEEMEDPOSITIVE == "Yes" ? (item.AMOUNT) : 0);
        }
        return total*(-1);
      } else {
        return list.ISDEEMEDPOSITIVE == "Yes" ? (list.AMOUNT)*(-1) : 0;
      }
    }
    
    
  }


  dayBookTotal(): number{
    var total : number = 0;
    for(let v of this.filteredArray ){
      total = total + this.getVoucherTotal(v.LEDGERENTRIES ? v.LEDGERENTRIES.LEDGER: null);
    }
    return total;
  }


  dayBookTotalOffline(): number{
    var total : number = 0;
    for(let v of this.cacheVouchers ){
      total = total + this.getVoucherTotalOffline(v.LEDGERENTRIES_LIST)
    }
    return total;
  }

  getTotal(voucher: VOUCHER): number {
    var total = this.getSubTotal(voucher);
    var array:LEDGERENTRIESLIST[] = [];
    if (voucher["LEDGERENTRIES_LIST"] instanceof Array){
      array = voucher["LEDGERENTRIES_LIST"];
    } else {
      array.push(voucher["LEDGERENTRIES_LIST"]);
    }
    for (let item of array) {
      if (item.AMOUNT > 0) {
        total = total + item.AMOUNT;
      }
    }
    return total;
  }

  getSubTotal(voucher:VOUCHER){
    var total = 0;
    var array:ALLINVENTORYENTRIESLIST[] = [];
    if (voucher["ALLINVENTORYENTRIES_LIST"] instanceof Array){
      array = voucher["ALLINVENTORYENTRIES_LIST"];
    } else {
      array.push(voucher["ALLINVENTORYENTRIES_LIST"]);
    }
    for (let item of array) {
      total = total + item.AMOUNT;
    }
    return total;
  }

  edit(m:any, online: boolean) {
    this.loading = true;
    if (online){
      this.apiService.getTallyFullVoucher(m.MASTERID).subscribe(
        res => {
          this.voucher = res;
          console.log(this.voucher);
          this.voucher._REMOTEID = m.REMOTEID;
          this.voucher._ACTION = "Update"
          this.voucher.DATE = new Date(this.voucher.DATE);
          this.apiService.getVoucherType(this.voucher.VOUCHERTYPENAME).subscribe(
            res => {
              this.databaseService.saveVoucherType(res);
              this.databaseService.savePriceList(this.voucher.PRICELEVEL);
              if (!(this.voucher.ALLINVENTORYENTRIES_LIST instanceof Array)){
                const item: ALLINVENTORYENTRIESLIST = this.voucher.ALLINVENTORYENTRIES_LIST;
                this.voucher.ALLINVENTORYENTRIES_LIST = [];
                this.voucher.ALLINVENTORYENTRIES_LIST.push(item);
              }
              
              this.databaseService.saveGodown(this.voucher.ALLINVENTORYENTRIES_LIST[0].BATCHALLOCATIONS_LIST.GODOWNNAME);
              this.loading = false;
              this.editMode = true;
            }
          )
          
        },
        err => console.log(err)
      )
      
    } else {
      
      this.voucher = m;
      this.loading = false;
      this.editMode = true;
    } 
  }

  updateEditMode() {
    this.editMode = !this.editMode;
  }

  filter(){
    this.filteredArray = this.vouchers.filter((voucher: any) => {
        
        if (voucher && this.filterFieldFC.value && this.filterValueFC.value){
          if (this.filterFieldFC.value.key == "Voucher Type"){
            console.log(voucher);
            return voucher.VOUCHERTYPENAME == this.filterValueFC.value;
            
          } else if (this.filterFieldFC.value.key == "Customer"){
            return voucher.BASICBUYERNAME == this.filterValueFC.value;

          } else if (this.filterFieldFC.value.key == "Voucher Number"){
            return voucher.VOUCHERNUMBER == this.filterValueFC.value;
          }else if (this.filterFieldFC.value.key == "Address"){
            return voucher.ADDRESS == this.filterValueFC.value;

          }else if (this.filterFieldFC.value.key == "Amount Greater Than"){
            return this.getVoucherTotal(voucher.LEDGERENTRIES.LEDGER) > this.filterValueFC.value;

          }else if (this.filterFieldFC.value.key == "Amount Smaller Than"){
            return this.getVoucherTotal(voucher.LEDGERENTRIES.LEDGER) < this.filterValueFC.value;

          }else if (this.filterFieldFC.value.key == "Including Stock Item"){
            console.log()
            if(voucher.INVENTORYENTRIES.STOCKITEM instanceof Array){
              return voucher.INVENTORYENTRIES.STOCKITEM.filter((v)=> v.STOCKITEMNAME == this.filterValueFC.value).length > 0;

            }else {
              return [voucher.INVENTORYENTRIES.STOCKITEM].filter((v)=> v.STOCKITEMNAME == this.filterValueFC.value).length > 0;
            }

          }
          
        }else {
          return true;
        }
        
      }
    )
  }

  getFilterValue(value){
    console.log(value);
    if (value == "Voucher Type"){
      this.filterValue$ = this.databaseService.getUser().voucherTypes.map((voucherType:VoucherTypeClass) => voucherType.voucherTypeName);
    } else if (value == "Tally Username"){

    }
  }

  array(object: any): boolean{
    return object instanceof Array;
  }

  printOnline(voucher){
    this.apiService.getTallyFullVoucher(voucher.MASTERID).subscribe((res)=>{
      const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = true;
      dialogConfig.width = "50%";
      const dialogRef = this.dialog.open(InvoicePrintViewComponent, {data: res, maxHeight: '90vh'});
       dialogRef.afterClosed().subscribe(
         res => {
          
         }
       )
    },
    err => console.log(err))
    
  }

  printOffline(v){
    const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = true;
      dialogConfig.width = "50%";
      const dialogRef = this.dialog.open(InvoicePrintViewComponent, {data: v, maxHeight: '90vh'});
       dialogRef.afterClosed().subscribe(
         res => {
          
         }
       )
  }

  showDaybook(){
    this.editMode = false;
    this.ngOnInit();
  }
  
}
