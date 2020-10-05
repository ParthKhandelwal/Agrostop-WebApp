import { Component, OnInit, Input, ViewChild, HostListener, ViewEncapsulation} from '@angular/core';
import { ALLLEDGERENTRIESLIST, LEDGERENTRIESLIST, VOUCHER } from '../../../model/Voucher/voucher';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { InvoicePrintViewComponent } from '../../invoice-print-view/invoice-print-view.component';
import { VoucherSummaryComponent } from '../voucher-summary/voucher-summary.component';
import { Router } from '@angular/router';
import { InventoryBreakdownComponent, InventoryBreakdownList, InventoryBreakDown } from '../inventory-breakdown/inventory-breakdown.component';
import { Observable} from 'rxjs';
import { FormControl } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';
import { MatSidenav } from '@angular/material/sidenav';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AgroVoucherService } from '../../../services/AgroVoucher/agro-voucher.service';
import { VoucherParentType } from '../../../model/VoucherType/voucher-type';
import { SyncService } from '../../../services/Sync/sync.service';
import { AuthenticationService } from '../../../services/Authentication/authentication.service';

@Component({
  selector: 'voucher-table',
  templateUrl: './voucher-table.component.html',
  styleUrls: ['./voucher-table.component.css'],
  encapsulation: ViewEncapsulation.None

})
export class VoucherTableComponent implements OnInit {

  @Input('vouchers') vouchers: VOUCHER[];
  loading

  displayedColumns: string[] = ['date', 'voucherNumber', 'customer', 'address', 'amount'];

  @ViewChild("inventoryBreakdown", {static: false}) inventoryBreakdown: InventoryBreakdownComponent;
  @ViewChild("drawer", {static: false}) drawer: MatSidenav;
  @ViewChild("table", {static: false}) table: MatTable<LedgerItem>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  voucherDataSource: MatTableDataSource<VOUCHER> = new MatTableDataSource([]);
  colorsMap = new Map<string, string>();
  colors= ["purple", "cyan", "pink", "teal"];

  constructor(private dialog?: MatDialog,
    private service?: AgroVoucherService,
    private router?: Router,
    private syncService?: SyncService,
    private auth?: AuthenticationService

    ) {

    }

  ngOnInit(): void {
    this.voucherDataSource.sort = this.sort;
    this.voucherDataSource.paginator = this.paginator;
  }

  setVouchers(vouchers: VOUCHER[]){
    let index = 0
    this.vouchers = vouchers.map(
      (voucher: any) => {
        voucher.VOUCHERPARENTTYPE = VoucherParentType[this.auth.user.voucherTypes.filter((v) => v.voucherTypeName === voucher.VOUCHERTYPENAME)[0].voucherCategory.replace(" ", "_")];
        if(!this.colorsMap.get(voucher.VOUCHERTYPENAME)){
          this.colorsMap.set(voucher.VOUCHERTYPENAME,  "badge "+ this.colors[index % 4]);
          index++;
        }
        console.log(voucher.VOUCHERPARENTTYPE)
        voucher.classname = this.colorsMap.get(voucher.VOUCHERTYPENAME);
        return voucher;
      }
    ).sort((a,b) => a.VOUCHERTYPENAME == b.VOUCHERTYPENAME?(a.VOUCHERNUMBER> b.VOUCHERNUMBER ? 1:-1):(a.VOUCHERTYPENAME> b.VOUCHERTYPENAME ? 1:-1));
    this.filter();
    this.setFilterValues();
    this.breakLedgersFromVoucher(vouchers);
    this.table.renderRows()
  }

  setFilterValues(){
    this.filterMap = new Map();
      this.filterMap.set("Voucher Number", [...new Set(this.vouchers.map((v)=> v.VOUCHERNUMBER))]);
      this.filterMap.set("Address", [...new Set(this.vouchers.map((v: any)=> v.ADDRESS))]);
      this.filterMap.set("Voucher Type", [...new Set(this.vouchers.map((v)=> v.VOUCHERTYPENAME))]);
      this.filterMap.set("Amount Greater Than", null);
      this.filterMap.set("Amount Smaller Than", null);
      this.filterMap.set("Including Stock Item", [...new Set([].concat(...this.vouchers.map((v) => v && v.ALLINVENTORYENTRIES_LIST? v.ALLINVENTORYENTRIES_LIST.map((i)=> i.STOCKITEMNAME): "")))]);
      this.filterMap.set("Including Ledger", [...new Set([].concat(...this.vouchers.map((v) => v && v.LEDGERENTRIES_LIST? v.LEDGERENTRIES_LIST.map((i)=> i.LEDGERNAME): "")))]);
      this.filterMap.set("Customer", [...new Set([].concat(...this.vouchers.map((v) => v.BASICBUYERNAME)))]);
      this.filterMap.set("Saved At", ["Tally", "Cloud"]);
      this.filterMap.set("Voucher Parent Type", Object.values(VoucherParentType));

  }


  reset(){
    this.filteredArray = this.vouchers
    this.filterFieldFC.setValue(null);
    this.filterValueFC.setValue("");
    this.filter()
  }



  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    switch (event.keyCode) {
      case 112:
        this.drawer.toggle();
        break;

      default:
        break;
    }
  }

  handleTabSelection(event){

    switch (event.index) {
      case 1:
        this.inventoryBreakdown.getStockItemBreakdown(this.filteredArray)
        break;

      case 3:
        this.analyze()
      default:
        break;
    }

  }


  data: any[][] = [];
  analyze(){
    this.data = [];
    let items: string[] = []
    for(let v of this.analysis){
      items = items.concat(v.itemSummaryList.map((a) => a.itemName));
    }
    let itemSet = new Set(items);

    for(let item of itemSet){
      var tempArr: any = {
        item: item
      };
      for(let v of this.analysis){
        let temp = v.itemSummaryList.filter((a) => a.itemName == item)[0];
        tempArr[v.title] = temp? temp.qty : 0;
      }
      this.data.push(tempArr);

    }
    this.columnsToDisplay = ["item"]
    for(let v of this.analysis){
      this.columnsToDisplay.push(v.title);
    }

  }


  getVoucherTotal(voucher: VOUCHER){
    let total = 0;
    if(voucher.ALLINVENTORYENTRIES_LIST){
      if(voucher.ALLINVENTORYENTRIES_LIST.length>0){
        for (let item of voucher.ALLINVENTORYENTRIES_LIST){
          if(item.ISDEEMEDPOSITIVE == "No"){
            total = total + 1*(item.AMOUNT? item.AMOUNT: 0);
          }
        }
      }
    }

    if(voucher.INVENTORYENTRIESOUT_LIST){
      if(voucher.INVENTORYENTRIESOUT_LIST.length>0){
        for (let item of voucher.INVENTORYENTRIESOUT_LIST){
          if(item.ISDEEMEDPOSITIVE == "No"){
            total = total + 1*(item.AMOUNT? item.AMOUNT: 0);
          }
        }
      }
    }


    if(voucher.LEDGERENTRIES_LIST){
      for(let item of voucher.LEDGERENTRIES_LIST){
        if(item.ISDEEMEDPOSITIVE == "No"){
          total = total + 1*(item.AMOUNT? item.AMOUNT: 0);
        }
      }
    }

    if(voucher.ALLLEDGERENTRIES_LIST){
      for(let item of voucher.ALLLEDGERENTRIES_LIST){
        if(item.ISDEEMEDPOSITIVE == "No"){
          total = total + 1*(item.AMOUNT? item.AMOUNT: 0);
        }
      }
    }

    return total;
  }

  print(v){
    const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = true;
      dialogConfig.width = "50%";
      this.dialog.open(InvoicePrintViewComponent, {data: v, maxHeight: '90vh'});

  }

  viewInventory(v){
    const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = true;
      this.dialog.open(VoucherSummaryComponent, {data: v,panelClass: 'custom-dialog',
      backdropClass: 'backdropBackground-v'});

  }

  edit(v){
    let voucher: VOUCHER = Object.assign(new VOUCHER, v);
    this.service.voucher = voucher;
    this.service.voucherParentType = VoucherParentType[this.auth.user.voucherTypes.filter((v) => v.voucherTypeName === voucher.VOUCHERTYPENAME)[0].voucherCategory];
    if(voucher.CLASSNAME){
      this.service.setVoucherForClass();
    }
    this.service.setForEditing();
    this.router.navigateByUrl("/agro-voucher")
  }


  getTotal(): number{
    var total : number = 0;
    for(let v of this.filteredArray ){
      total = total + this.getVoucherTotal(v)
    }
    return total;
  }

  filter(){
    this.filteredArray = this.vouchers.filter( (voucher: any) => {

      if (voucher && this.filterFieldFC.value && this.filterValueFC.value){
        if (this.filterFieldFC.value.key == "Voucher Type"){

          return voucher.VOUCHERTYPENAME == this.filterValueFC.value;

        } else if (this.filterFieldFC.value.key == "Customer"){
          return voucher.BASICBUYERNAME == this.filterValueFC.value;

        } else if (this.filterFieldFC.value.key == "Voucher Number"){
          return voucher.VOUCHERNUMBER == this.filterValueFC.value;
        }else if (this.filterFieldFC.value.key == "Address"){
          return voucher.ADDRESS == this.filterValueFC.value;

        }else if (this.filterFieldFC.value.key == "Amount Greater Than"){
          return this.getVoucherTotal(voucher.LEDGERENTRIES_LIST) > this.filterValueFC.value;

        }else if (this.filterFieldFC.value.key == "Amount Smaller Than"){
          return this.getVoucherTotal(voucher.LEDGERENTRIES_LIST) < this.filterValueFC.value;

        }else if (this.filterFieldFC.value.key == "Including Stock Item"){
          console.log()
          if(voucher.ALLINVENTORYENTRIES_LIST instanceof Array){
            return voucher.ALLINVENTORYENTRIES_LIST.filter((v)=> v.STOCKITEMNAME == this.filterValueFC.value).length > 0;

          }else {
            return [voucher.ALLINVENTORYENTRIES_LIST].filter((v)=> v.STOCKITEMNAME == this.filterValueFC.value).length > 0;
          }

        }else if (this.filterFieldFC.value.key == "Including Ledger"){

          if(voucher.LEDGERENTRIES_LIST){
            if(voucher.LEDGERENTRIES_LIST instanceof Array){
              return voucher.LEDGERENTRIES_LIST.filter((v)=> v.LEDGERNAME == this.filterValueFC.value).length > 0;

            }else {
              return [voucher.LEDGERENTRIES_LIST].filter((v)=> v.LEDGERNAME == this.filterValueFC.value).length > 0;
            }
          }


        } else if(this.filterFieldFC.value.key == "Saved At"){
          if(this.filterValueFC.value =="Tally"){
            return voucher.savedToTally;
          }else if(this.filterValueFC.value =="Cloud"){
            return !voucher.savedToTally;
          }

        }else if (this.filterFieldFC.value.key == "Voucher Parent Type"){
          let voucherTypes = this.syncService.voucherTypes.filter((v) => v.PARENT === this.filterValueFC.value).map((v)=> v.NAME);

          return voucherTypes.includes(voucher.VOUCHERTYPENAME);
      }

      } else {
        return true;
      }

    }
  )
  this.voucherDataSource.data = this.filteredArray
  this.breakLedgersFromVoucher(this.filteredArray)
  }




  filterFieldFC = new FormControl();
  filterOperationFC = new FormControl();
  filterValueFC = new FormControl();
  filterValue: any;
  filterField: any[] = [
    "Voucher Type",
    "Tally Username",
    "Customer"
  ]
  filterValue$: any[];
  filterMap: Map<String, any[]>;
  filterValues: string[];
  filteredOptions: Observable<string[]>;
  filteredArray : any[] =[]



  filterFieldSelected(res){
    this.filterValues = res;
    this.filteredOptions = this.filterValueFC.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
    setTimeout(
      () => {
        document.getElementById("field").focus();
      }
      ,300)
  }


  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.filterValues.filter(option => option.toLowerCase().indexOf(filterValue) >= 0);
  }






  displayedLedgerColumns = ['name', 'amount'];
  ledgerBreakdown : LedgerItem[];

  breakLedgersFromVoucher(vouchers: VOUCHER[]){
    this.ledgerBreakdown = [];
    for(let v of vouchers){
      if(v.LEDGERENTRIES_LIST){
        for (let l of v.LEDGERENTRIES_LIST){
          let ledger = this.ledgerExists(l.LEDGERNAME)
          if(ledger){
            ledger.amount = ledger.amount + (l.AMOUNT? (l.AMOUNT)*1: 0);
          }else{
            var newLedger = new LedgerItem();
            newLedger.name = l.LEDGERNAME;
            newLedger.amount = (l.AMOUNT? (l.AMOUNT)*1: 0);
            this.ledgerBreakdown.push(newLedger);
          }
        }
      }

      if(v.ALLLEDGERENTRIES_LIST){
        for(let l of v.ALLLEDGERENTRIES_LIST){
          let ledger = this.ledgerExists(l.LEDGERNAME)
          if(ledger){
            ledger.amount = ledger.amount + (l.AMOUNT? (l.AMOUNT)*1: 0);
          }else{
            var newLedger = new LedgerItem();
            newLedger.name = l.LEDGERNAME;
            newLedger.amount = (l.AMOUNT? (l.AMOUNT)*1: 0);

          }
        }
      }

    }
  }

  ledgerExists(ledgerName): LedgerItem{
    for(let l of this.ledgerBreakdown){
      if(l.name == ledgerName){
        return l;
      }
    }
    return null;
  }

  analysis: AnalysisColumn[] = [];
  columnsToDisplay = ["item"];
  addForAnanlysis(tab){
    this.filter();
    let inventoryBreakdownList = new InventoryBreakdownList();
    for(let item of this.filteredArray){
      if(item.ALLINVENTORYENTRIES_LIST){
        if(item.ALLINVENTORYENTRIES_LIST instanceof Array){
          for(let i of item.ALLINVENTORYENTRIES_LIST){
            inventoryBreakdownList.add(i);
          }
        }else {
          inventoryBreakdownList.add(item.ALLINVENTORYENTRIES_LIST);
        }
      }
    }
    inventoryBreakdownList.setPercentage();
    let analysisColumn = new AnalysisColumn();
    analysisColumn.title = this.filterValueFC.value;
    analysisColumn.itemSummaryList = inventoryBreakdownList.items;

    this.analysis.push(analysisColumn);
    this.analyze();
    tab._selectedIndex = 3;
  }


  removeColumn(column){
    let temp: number;
    for(let i =0 ; i< this.analysis.length; i++){
      if(this.analysis[i].title == column){
        temp = i;
        break;
      }
    }
    this.analysis.splice(temp);
    this.analyze();
    return;

  }

  getLedgers(voucher){
    switch (voucher.VOUCHERPARENTTYPE) {
      case VoucherParentType.Contra:
        return voucher.ALLLEDGERENTRIES_LIST.filter((l) => l.ISDEEMEDPOSITIVE == 'Yes');
        break;

      case VoucherParentType.Payment:
        return voucher.ALLLEDGERENTRIES_LIST.filter((l) => l.ISDEEMEDPOSITIVE == 'No');
        break;

      case VoucherParentType.Receipt:
        return voucher.ALLLEDGERENTRIES_LIST.filter((l) => l.ISDEEMEDPOSITIVE == 'Yes');
        break;

      case VoucherParentType.Sales:

        return voucher.LEDGERENTRIES_LIST.filter((l) => l.ISDEEMEDPOSITIVE == 'Yes');

        break;

      case VoucherParentType.Purchase:

        return voucher.LEDGERENTRIES_LIST.filter((l) => l.ISDEEMEDPOSITIVE == 'No');

        break;

      case VoucherParentType.Journal:
        return voucher.ALLLEDGERENTRIES_LIST;
        break;

      case VoucherParentType.Material_Out:
        return voucher.LEDGERENTRIES_LIST.filter((l) => l.ISDEEMEDPOSITIVE == 'Yes');
        break;

      default:
        break;
    }

  }

}

class LedgerItem{
  name: string;
  amount: number;
}

class AnalysisColumn{
  title: string;
  itemSummaryList: InventoryBreakDown[] = []
}


