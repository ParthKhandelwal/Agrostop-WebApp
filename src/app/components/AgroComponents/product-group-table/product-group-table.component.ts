import { Component, OnInit, ViewChild } from '@angular/core';
import {  MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ProductGroup } from '../../../model/ProductGroup/product-group';
import { ApiService } from '../../../services/API/api.service';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { ProductGroupEntryComponentsComponent } from '../../AgroEntryComponents/product-group-entry-components/product-group-entry-components.component';


@Component({
  selector: 'product-group-table',
  templateUrl: './product-group-table.component.html',
  styleUrls: ['./product-group-table.component.css']
})
export class ProductGroupTableComponent implements OnInit {
  displayedColumns: string[] = ['name', 'companyName', 'categoryName', 'unit', 'action'];
  dataSource: MatTableDataSource<ProductGroup>;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  constructor(private apiService?: ApiService,private dialog?: MatDialog) { }

  ngOnInit(): void {
    this.apiService.getAllProductGroup().subscribe(
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
    this.dialog.open(ProductGroupEntryComponentsComponent, {data: value, maxHeight: '90vh'});

  }
  create(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    this.dialog.open(ProductGroupEntryComponentsComponent, {data: new ProductGroup(), maxHeight: '90vh'});
  }

}
