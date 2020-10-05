import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { ApiService } from '../../services/API/api.service';
import { SyncService } from '../../services/Sync/sync.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-address-profile',
  templateUrl: './address-profile.component.html',
  styleUrls: ['./address-profile.component.css']
})
export class AddressProfileComponent implements OnInit {

  displayedColumns: string[] = ['name', 'customerTotal', 'landTotal', 'voucherTotal', 'avgLandHolding', 'expPerLand'];
  dataSource: MatTableDataSource<any>;
  loading: boolean;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  sub: Subscription
  constructor(public apiService?: ApiService, public syncService?: SyncService) {
  }

  ngOnInit() {
    this.syncService.getAddressSummary();
    this.sub = this.syncService.addresses$.subscribe(
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

  ngOnDestroy(){
    this.sub.unsubscribe();
  }


}
