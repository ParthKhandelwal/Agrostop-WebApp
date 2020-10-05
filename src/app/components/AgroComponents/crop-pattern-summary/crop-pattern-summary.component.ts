import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ApiService } from '../../../services/API/api.service';

@Component({
  selector: 'app-crop-pattern-summary',
  templateUrl: './crop-pattern-summary.component.html',
  styleUrls: ['./crop-pattern-summary.component.css']
})
export class CropPatternSummaryComponent implements OnInit {
  crops: any[] = []
  cropControl = new FormControl();
  filteredOptions: Observable<string[]>;

  constructor( public dialogRef: MatDialogRef<CropPatternSummaryComponent>,@Inject(MAT_DIALOG_DATA) public data?: any,public apiService?: ApiService) {
   }

  ngOnInit(): void {
    this.cropSelected();
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.crops.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }

  displayedColumns: string[] = ['address', 'cropLand', 'totalLand'];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  addressSummary: any[];
  showingCustomers: boolean
  cropSelected(){
    this.apiService.getCropPatterns(this.data).subscribe(
      res =>{
        this.addressSummary = res;
        this.switchToAddressTable();
      }
    )
  }

  switchToAddressTable(){
    this.displayedColumns = ['address', 'cropLand', 'totalLand']
    this.dataSource = new MatTableDataSource(this.addressSummary);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.showingCustomers = false;
  }

  address: string;
  switchToCustomerTable(row){
    this.address = row.name
    this.displayedColumns = ["farmerName", "cusCropLand", "date", "season"]
    this.dataSource = new MatTableDataSource(row.customers);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.showingCustomers = true;
  }

  switch(row) {
    if(this.showingCustomers){
      this.switchToAddressTable();
    }else{
      this.switchToCustomerTable(row)
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  showgraphs(row){
    console.log(row);
  }

}
