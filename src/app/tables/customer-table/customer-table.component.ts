import { AfterViewInit, Input, Component, OnInit, ViewChild, Inject, Output } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { MatTableDataSource } from '@angular/material';
import { ApiService } from '../../shared/api.service';
import { Customer } from '../../Model/customer';
import { filter } from 'rxjs/operators';
import {MatDialog, MatDialogConfig, MAT_DIALOG_DATA} from '@angular/material';
import {CreateCustomerFormComponent} from '../../create-form/create-customer-form/create-customer-form.component';
import { ConfirmationBoxComponent } from '../../confirmation-box/confirmation-box.component';


@Component({
  selector: 'app-customer-table',
  templateUrl: './customer-table.component.html',
  styleUrls: ['./customer-table.component.css']
})
export class CustomerTableComponent implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  @ViewChild(MatTable, {static: false}) table: MatTable<Customer>;
  dataSource: MatTableDataSource<Customer>;
  @Input('customers') customers: Customer[];


  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['phoneNumber', 'name', 'fatherName', 'address', 'landHolding', 'update'];

constructor(private apiService: ApiService, private dialog?: MatDialog, private dialogConfig?: MatDialogConfig){

}

  ngOnInit() {
    this.dataSource = new MatTableDataSource<Customer>(this.customers);
    //this.dataSource.data = this.customers;//this.getAllCustomers();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

  renderRows(){
    this.dataSource = new MatTableDataSource<Customer>(this.customers);
    this.table.dataSource = this.dataSource;
    this.table.renderRows();
  }

  applyFilter(filterValue: string) {
   this.dataSource.filter = filterValue.trim().toLowerCase();
 }

 viewCustomer(){

 }



 updateCustomer(data){
   const dialogConfig = new MatDialogConfig();
   dialogConfig.autoFocus = true;
   dialogConfig.width = "50%";
   this.dialog.open(CreateCustomerFormComponent, {data});
 }

 deleteCustomer(data){
   const dialogRef = this.dialog.open(ConfirmationBoxComponent, {
      width: '350px',
      data: "Do you confirm the deletion of this customer: " + data.name + " ?"
    });
dialogRef.afterClosed().subscribe(result => {
      if(result) {
        console.log(data);
        this.apiService.deleteCustomer(data.id).subscribe(
          res =>{
            alert("Customer deleted successfully");
          },
          err =>{
            console.log(err);
          }
        );
        // DO SOMETHING
      }
    });
  }


 createCustomer(){
   const dialogConfig = new MatDialogConfig();
   dialogConfig.autoFocus = true;
   dialogConfig.width = "50%";
   this.dialog.open(CreateCustomerFormComponent);

 }

}
