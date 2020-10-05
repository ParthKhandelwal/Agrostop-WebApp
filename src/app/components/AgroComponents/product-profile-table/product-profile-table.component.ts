import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../../services/API/api.service';
import { ProductProfile } from '../../../model/ProductProfile/product-profile';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { ProductProfileEntryComponentComponent } from '../../AgroEntryComponents/product-profile-entry-component/product-profile-entry-component.component';


@Component({
  selector: 'product-profile-table',
  templateUrl: './product-profile-table.component.html',
  styleUrls: ['./product-profile-table.component.css']
})
export class ProductProfileTableComponent implements OnInit {
  displayedColumns: string[] = ['name', 'productGroup', 'unit', 'action'];
  dataSource: MatTableDataSource<ProductProfile>;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  constructor(private apiService?: ApiService, private dialog?: MatDialog) { }

  ngOnInit(): void {
    this.apiService.getAllProductProfile().subscribe(
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
    this.dialog.open(ProductProfileEntryComponentComponent, {data: value, maxHeight: '90vh'});

  }
  create(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    this.dialog.open(ProductProfileEntryComponentComponent, {data: new ProductProfile(), maxHeight: '90vh'});
  }
}
