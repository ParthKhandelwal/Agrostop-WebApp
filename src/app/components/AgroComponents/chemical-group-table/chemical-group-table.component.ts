import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ChemicalGroup } from '../../../model/ChemicalGroup/chemical-group';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ApiService } from '../../../services/API/api.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ChemicalGroupEntryComponent } from '../../AgroEntryComponents/chemical-group-entry/chemical-group-entry.component';

@Component({
  selector: 'chemical-group-table',
  templateUrl: './chemical-group-table.component.html',
  styleUrls: ['./chemical-group-table.component.css']
})
export class ChemicalGroupTableComponent implements OnInit {

  displayedColumnsChemicalGroup = ["name", "parent", "action"];
  chemicalGroupDatasource : MatTableDataSource<ChemicalGroup>;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  constructor(private apiService?: ApiService,private dialog?: MatDialog) { }

  ngOnInit(): void {
    this.apiService.getAllChemicalGroup().subscribe(
      res => {
        this.chemicalGroupDatasource = new MatTableDataSource(res);
        this.chemicalGroupDatasource.paginator = this.paginator;
        this.chemicalGroupDatasource.sort = this.sort;
      },
      err => console.log(err)
    )
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.chemicalGroupDatasource.filter = filterValue.trim().toLowerCase();

    if (this.chemicalGroupDatasource.paginator) {
      this.chemicalGroupDatasource.paginator.firstPage();
    }
  }
  edit(value){
    console.log(value);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    this.dialog.open(ChemicalGroupEntryComponent, {data: value, maxHeight: '90vh'});

  }
  create(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    this.dialog.open(ChemicalGroupEntryComponent, {data: new ChemicalGroup(), maxHeight: '90vh'});
  }

}
