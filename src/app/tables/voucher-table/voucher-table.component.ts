import { AfterViewInit, Input, Component, OnInit, ViewChild, Inject, Output } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { MatTableDataSource } from '@angular/material';
import { ApiService } from '../../shared/api.service';
import { Voucher } from '../../Model/voucher';
import { filter } from 'rxjs/operators';
import {MatDialog, MatDialogConfig, MAT_DIALOG_DATA} from '@angular/material';
import {CreateCustomerFormComponent} from '../../create-form/create-customer-form/create-customer-form.component';
import { ConfirmationBoxComponent } from '../../confirmation-box/confirmation-box.component';
import { Customer } from '../../Model/customer';
import { TallyVoucher } from '../../Model/tally-voucher';
import { CreateVoucherComponent } from '../../create-form/create-voucher/create-voucher.component';
import { VoucherService } from '../../shared/voucher.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-voucher-table',
  templateUrl: './voucher-table.component.html',
  styleUrls: ['./voucher-table.component.css']
})
export class VoucherTableComponent implements OnInit {
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  @ViewChild(MatTable, {static: false}) table: MatTable<TallyVoucher>;
  dataSource: MatTableDataSource<TallyVoucher>;
  @Input('vouchers') vouchers: TallyVoucher[];


  displayedColumns = [ 'date', 'voucherNumber', 'customerId','address', 'amount', 'update'];


  constructor(private apiService: ApiService, private dialog?: MatDialog,
    private dialogConfig?: MatDialogConfig, private voucherService?: VoucherService, private router?: Router) { }

  ngOnInit(){
  this.dataSource = new MatTableDataSource<TallyVoucher>(this.vouchers);
  console.log (this.vouchers);
  console.log("customers table componenet called");
  }

  ngAfterViewInit() {

    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

  renderRows(res: TallyVoucher[]){
    this.dataSource = new MatTableDataSource<TallyVoucher>(res);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
    this.table.renderRows();
  }

updateVoucher(data){
  this.voucherService.tallyVoucher = data;
  this.router.navigate(['/sales/create-sales-voucher']);

}

  applyFilter(filterValue: string) {
   this.dataSource.filter = filterValue.trim().toLowerCase();
 }

}
