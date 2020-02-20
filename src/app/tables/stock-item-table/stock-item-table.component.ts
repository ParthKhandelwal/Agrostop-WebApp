import { AfterViewInit, Input, Component, OnInit, ViewChild, Inject, Output } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { MatTableDataSource } from '@angular/material';
import { ApiService } from '../../shared/api.service';
import { StockItem } from '../../Model/stock-item';
import { filter } from 'rxjs/operators';
import {MatDialog, MatDialogConfig, MAT_DIALOG_DATA} from '@angular/material';
import {CreateStockItemFormComponent} from '../../create-form/create-stock-item-form/create-stock-item-form.component';
import { ConfirmationBoxComponent } from '../../confirmation-box/confirmation-box.component';

@Component({
  selector: 'app-stock-item-table',
  templateUrl: './stock-item-table.component.html',
  styleUrls: ['./stock-item-table.component.css']
})
export class StockItemTableComponent implements OnInit {
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  @ViewChild(MatTable, {static: false}) table: MatTable<StockItem>;
  dataSource: MatTableDataSource<StockItem>;
  @Input('stockItems') stockItems: StockItem[];

  displayedColumns = ['name', 'parent', 'category', 'closingBalance', 'price', 'update'];


  constructor(private apiService: ApiService, private dialog?: MatDialog, private dialogConfig?: MatDialogConfig) { }

  ngOnInit(){
  this.dataSource = new MatTableDataSource<StockItem>(this.stockItems);
  console.log("stockItems table componenet called");
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

  renderRows(){
    this.dataSource = new MatTableDataSource<StockItem>(this.stockItems);
    this.table.dataSource = this.dataSource;
    this.table.renderRows();
  }

  applyFilter(filterValue: string) {
   this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onCreate(){
    alert("Stock Item creation is not supported. Please use Tally ERP to create Stock Item.");
  }

  updateStockItem(data){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = "50%";
    dialogConfig.height = "70%";
    this.dialog.open(CreateStockItemFormComponent, { data, maxHeight: '90vh'});
  }
}
