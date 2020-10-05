import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { CropPattern } from '../../../model/CropPattern/crop-pattern';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { CropPatternEntryComponent } from '../../AgroEntryComponents/crop-pattern-entry/crop-pattern-entry.component';
import { Customer } from '../../../model/Customer/customer';
import { ApiService } from '../../../services/API/api.service';

@Component({
  selector: 'crop-profile-table',
  templateUrl: './crop-profile-table.component.html',
  styleUrls: ['./crop-profile-table.component.css']
})
export class CropProfileTableComponent implements OnInit {

  displayedColumns: string[] = ['name', 'var', 'land', 'season', 'date', "user"];
  dataSource: MatTableDataSource<CropPattern>;
  customer: Customer;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private dialog?: MatDialog, private apiService?: ApiService) { }

  ngOnInit(): void {
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  addCropPattern(){
    let cp: CropPattern = new CropPattern();
    cp.customerId = this.customer.id;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = "50%";
    const dialogRef = this.dialog.open(CropPatternEntryComponent, {data: cp, maxHeight: '90vh'});
    dialogRef.afterClosed().subscribe(
      r=> {
        this.apiService.getCropPatternsByCustomer(this.customer.id).subscribe(
          (res: CropPattern[])=> {
            res = res.map((r) => {
              r.dateEntered = new Date(r.dateEntered);
              return r;
            })
            this.setPatterns(res)
          }
        )
      }
    )
  }

  setPatterns(list: CropPattern[]){
    console.log(list);
    this.dataSource = new MatTableDataSource(list);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

}
