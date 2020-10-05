import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Crop } from '../../model/Crop/crop';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ApiService } from '../../services/API/api.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CropEntryComponent } from '../AgroEntryComponents/crop-entry/crop-entry.component';
import { CropPatternSummaryComponent } from '../AgroComponents/crop-pattern-summary/crop-pattern-summary.component';

@Component({
  selector: 'app-crop-profile',
  templateUrl: './crop-profile.component.html',
  styleUrls: ['./crop-profile.component.css']
})
export class CropProfileComponent implements OnInit {

  displayedColumns: string[] = ['name', 'action',];
  dataSource: MatTableDataSource<Crop>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private apiService?: ApiService, private dialog?: MatDialog, ) { }

  ngOnInit(): void {
    this.apiService.getAllCrops().subscribe(
      res => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    )
  }

  edit(crop){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = "50%";
    const dialogRef = this.dialog.open(CropEntryComponent, {data: Object.assign(new Crop(),crop), maxHeight: '90vh'});

  }

  add(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = "50%";
    const dialogRef = this.dialog.open(CropEntryComponent, {data: new Crop(), maxHeight: '90vh'});

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  showSummary(crop){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = "80%";
    const dialogRef = this.dialog.open(CropPatternSummaryComponent, {data: crop.name, maxHeight: '90vh'});

  }


}
