import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'batch-table',
  templateUrl: './batch-table.component.html',
  styleUrls: ['./batch-table.component.css']
})
export class BatchTableComponent implements OnInit {

  displayedColumns: string[] = ['item', 'batch','godown', 'expiry', 'stock'];
  dataSource: MatTableDataSource<any>;

  @Input("title") title: string;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild("table", {static: false}) table: MatTable<any>;

  constructor() {
  
  }

  ngOnInit() {
    
  }

  setBatch(batches){
    this.dataSource = new MatTableDataSource(batches);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
