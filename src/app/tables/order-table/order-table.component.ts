import { AfterViewInit, Input, Component, OnInit, ViewChild, Inject, Output } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { MatTableDataSource } from '@angular/material';
import { ApiService } from '../../shared/api.service';
import { Order } from '../../Model/order';
import { filter } from 'rxjs/operators';
import {MatDialog, MatDialogConfig, MAT_DIALOG_DATA} from '@angular/material';
import { ConfirmationBoxComponent } from '../../confirmation-box/confirmation-box.component';
import { CreateOrderFormComponent } from 'src/app/create-form/create-order-form/create-order-form.component';
import { OrderService } from 'src/app/shared/order.service';
import { VOUCHER } from 'src/app/Model/voucher';

@Component({
  selector: 'app-order-table',
  templateUrl: './order-table.component.html',
  styleUrls: ['./order-table.component.css']
})
export class OrderTableComponent implements OnInit {
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  @ViewChild(MatTable, {static: false}) table: MatTable<Order>;
  dataSource: MatTableDataSource<Order>;
  @Input('orders') orders: Order[];
  completeOrder: boolean = false;
  voucher: VOUCHER;

  displayedColumns = ['id', 'dateOfCreation', 'customerId', 'update'];


  constructor(private apiService: ApiService, 
    private dialog?: MatDialog, 
    private orderService?: OrderService,
    private dialogConfig?: MatDialogConfig) { }

  ngOnInit(){
    this.voucher = new VOUCHER();
  this.dataSource = new MatTableDataSource<Order>(this.orders);
  console.log("Order table componenet called");
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

  renderRows(){
    this.table.renderRows();
    this.dataSource._updateChangeSubscription();
  }

  applyFilter(filterValue: string) {
   this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  create(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = "50%";

    const dialogRef = this.dialog.open(CreateOrderFormComponent, {
     
      maxHeight: '90vh'
    });
  }

  delete(id: string){
    this.apiService.deleteOrder(id).subscribe();
  }

  completeVoucher(order: Order){
    this.orderService.convertOrder(order, this.voucher).then(res => {
      this.voucher = res;
      this.completeOrder = true;
    });
  }



}
