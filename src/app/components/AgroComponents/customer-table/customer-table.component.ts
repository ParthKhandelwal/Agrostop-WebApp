import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Customer } from '../../../model/Customer/customer';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { CustomerEntryComponent } from '../../AgroEntryComponents/customer-entry-components/customer-entry.component';
import { ApiService } from '../../../services/API/api.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CropPatternEntryComponent } from '../../AgroEntryComponents/crop-pattern-entry/crop-pattern-entry.component';
import { CropPattern } from '../../../model/CropPattern/crop-pattern';
import { AuthenticationService } from '../../../services/Authentication/authentication.service';

@Component({
  selector: 'customer-table',
  templateUrl: './customer-table.component.html',
  styleUrls: ['./customer-table.component.css']
})
export class CustomerTableComponent implements OnInit {
  @Input("customers") customers: Customer[];
  displayedColumns = ["name", "address", 'phoneNumber', "landHolding", "branch","action"]
  showCustomerSummary: boolean;
  customer: Customer;

  dataSource: MatTableDataSource<Customer>;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private dialog?: MatDialog, private apiService?: ApiService, public auth?: AuthenticationService) { }

  ngOnInit(): void {

  }


  editCustomer(customer: Customer){
    const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = true;
      dialogConfig.width = "50%";
      const dialogRef = this.dialog.open(CustomerEntryComponent, {data: Object.assign(new Customer(),customer), maxHeight: '90vh'});
      // dialogRef.afterClosed().subscribe(
      //   res => {
      //     this.databaseService.setVoucher();
      //   }
      // )
  }

  addCropPattern(c){
    console.log(c)
    let cp: CropPattern = new CropPattern();
    cp.customerId = c.id;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = "50%";
    const dialogRef = this.dialog.open(CropPatternEntryComponent, {data: cp, maxHeight: '90vh'});

  }

  viewSummary(customer: Customer){
    this.customer = customer;
    this.showCustomerSummary = true;
  }

  setCustomers(customers: Customer[]){
    this.dataSource = new MatTableDataSource(customers);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.filterPredicate = (data: Customer, filter) => {
      const dataStr =JSON.stringify(data).toLowerCase();

      return dataStr.indexOf(filter) != -1;
    }
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
