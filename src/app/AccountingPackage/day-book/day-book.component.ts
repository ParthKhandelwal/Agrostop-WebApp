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
import { map, filter } from 'rxjs/operators';
import { PosService } from 'src/app/shared/pos.service';
import { VoucherTypeClass } from 'src/app/Model/user';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import uniqid from 'uniqid';
import { DatePipe } from '@angular/common';




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
  map: Map<string, string> = new Map();

  filterField: any[] = [
    "Voucher Type",
    "Tally Username",
    "Customer"
  ]
  filterOperation: any[] = [
    "Equal"
  ]

  filterValue$: any[];

  constructor(private apiService?: ApiService,private datePipe?: DatePipe, private router?: Router, private posService?: PosService) { }

  ngOnInit() {
    this.toDate.setValue(new Date());
    this.fromDate.setValue(new Date());
    this.sync();
    
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
    const user = this.posService.getUser();
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
    this.voucherPercent = 0;
    this.loading = true;
    

    this.apiService.getTallyData(guid).subscribe(
        (res: any) =>{
          
          if (res != null){
            if(!(res.VOUCHER instanceof Array)){
              this.vouchers = [];
              this.vouchers.push(res.VOUCHER);
            }else {
              this.vouchers = res.VOUCHER;
            }
            
            
            this.vouchers.sort((a,b) => new Date(a.DATE).getTime() - new Date(b.DATE).getTime())
            this.vouchers.map(res => {
              this.posService.getCustomer(res.BASICBUYERNAME).then(
                customer=> {
                  res.BASICBUYERNAME = customer ? customer.name : res.BASICBUYERNAME;
                }
              )
              this.posService.getAddress(res.ADDRESS+"").then(
                address=> {
                  res.ADDRESS = address ? address.name : res.ADDRESS;
                }
              )
              
              return res;
            })
           
            this.filter();
            console.log(this.filteredArray);
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
    
      this.posService.openDatabase().then(
        res =>{
          this.posService.getAllCacheVouchers().then(
            (res) => {
              this.cacheVouchers = res;
              console.log(res);
            }
          );
         
        }
      );
     
    
  }

  getVoucherTotal(list){
  
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


  dayBookTotal(): number{
    var total : number = 0;
    for(let v of this.vouchers ){
      total = total + this.getVoucherTotal(v.LEDGERENTRIES.LEDGER)
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
              this.posService.saveVoucherType(res);
              this.posService.savePriceList(this.voucher.PRICELEVEL);
              if (!(this.voucher.ALLINVENTORYENTRIES_LIST instanceof Array)){
                const item: ALLINVENTORYENTRIESLIST = this.voucher.ALLINVENTORYENTRIES_LIST;
                this.voucher.ALLINVENTORYENTRIES_LIST = [];
                this.voucher.ALLINVENTORYENTRIES_LIST.push(item);
              }
              
              this.posService.saveGodown(this.voucher.ALLINVENTORYENTRIES_LIST[0].BATCHALLOCATIONS_LIST.GODOWNNAME);
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
      this.posService.deleteVoucher(this.voucher.VOUCHERNUMBER);
    }
    
    
  }

  updateEditMode() {
    this.editMode = !this.editMode;
  }

  filter(){
    
    this.filteredArray = this.vouchers.filter((voucher: any) => {
        
        if (voucher.VOUCHER){
          if (this.filterFieldFC.value == "Voucher Type"){
            console.log(voucher);
            return voucher.VOUCHER.VOUCHERTYPENAME == this.filterValueFC.value;
            
          } else if (this.filterFieldFC.value == "Tally Username"){
            alert("Not Supported");
            return true;
          } else if (this.filterFieldFC.value == "Customer"){
            alert("Not Supported")
            return true;
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
      this.filterValue$ = this.posService.getUser().voucherTypes.map((voucherType:VoucherTypeClass) => voucherType.voucherTypeName);
    } else if (value == "Tally Username"){

    }
  }

  array(object: any): boolean{
    return object instanceof Array;
  }


  
}
