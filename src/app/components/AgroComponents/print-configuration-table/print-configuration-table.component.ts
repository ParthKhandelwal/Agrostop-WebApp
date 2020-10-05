import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../../services/API/api.service';
import { MatTableDataSource } from '@angular/material/table';
import { PrintConfiguration } from '../../../model/PrintConfiguration/print-configuration';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { PrintConfigurationEntryComponent } from '../../AgroEntryComponents/print-configuration-entry/print-configuration-entry.component';
import { VoucherTypeConfig } from '../../../model/VoucherType/voucher-type-config';
@Component({
  selector: 'print-configuration-table',
  templateUrl: './print-configuration-table.component.html',
  styleUrls: ['./print-configuration-table.component.css']
})
export class PrintConfigurationTableComponent implements OnInit {


  displayedColumns: string[] = ['voucherType', 'voucherCategory', 'action'];
  dataSource: MatTableDataSource<PrintConfiguration>;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private apiService?: ApiService,private dialog?: MatDialog) { }

  ngOnInit(): void {
    this.apiService.getAllVocuherTypeConfig().subscribe(
      res => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    )
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  edit(value){
    console.log(value);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    this.dialog.open(PrintConfigurationEntryComponent, {data: value, maxHeight: '90vh'});

  }
  create(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    this.dialog.open(PrintConfigurationEntryComponent, {data: new VoucherTypeConfig(), maxHeight: '90vh'});
  }


}
