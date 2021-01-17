import { Component, OnInit, ViewChild } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { StockTransferTableComponent } from '../stock-transfer-table/stock-transfer-table.component';
import { VoucherTableComponent } from '../voucher-table/voucher-table.component';
import { ApiService } from '../../../services/API/api.service';
import { Notification, NotificationType } from '../../../model/Notification/notification';
import { NotificationService } from '../../../services/Notification/notification.service';
import { AuthenticationService } from '../../../services/Authentication/authentication.service';
import { SyncService } from 'src/app/services/Sync/sync.service';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  mobileCards = [
    { title: 'Stock Transfer', cols: 1, rows: 1, id: "stock-transfer" },
    { title: 'Card 2', cols: 1, rows: 1 },
    { title: 'Card 3', cols: 1, rows: 1 , id: "notification"},
    { title: 'Cash Summary', cols: 1, rows: 1 ,id: "cashSummary"},
    { title: 'Cloud Voucher', cols: 1, rows: 1, id: "cloud-voucher" }
  ];



  desktopCards = [
    { title: 'Stock Transfer', cols: 2, rows: 1 , id: "stock-transfer" },
    { title: 'Cash Summary', cols: 1, rows: 1, id: "cashSummary" },
    { title: 'Notifications', cols: 1, rows: 2 , id: "notification"},
        { title: 'Sync', cols: 1, rows: 1 , id: "sync"},

    { title: 'Cloud Voucher', cols: 2, rows: 2 , id: "cloud-voucher" },
  ];

  /** Based on the screen size, switch from standard to one column per row */
  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return this.mobileCards;
      }

      return this.desktopCards;
    })
  );


  notification: Notification = new Notification();

  @ViewChild('voucherTable') voucherTable: VoucherTableComponent;
  @ViewChild('stockTransferTable') stockTransferTable: StockTransferTableComponent;

  cashLedgers: any[] = [];
  constructor(private breakpointObserver: BreakpointObserver,
    public apiService?: ApiService,public notificationService?: NotificationService,
     public auth?: AuthenticationService, public syncService?:SyncService) {
    this.notification.type = NotificationType.NOTIFICATION;
  }
  ngOnInit(): void {
    this.apiService.getCashLedgerClosingBalance().subscribe(
      res => this.cashLedgers = res,
      err => console.log(err)
    )
  }







  addNotification(){
    this.apiService.addNotification(this.notification).subscribe(
      res => {
        this.notification = new Notification();
        this.notification.type = NotificationType.NOTIFICATION;
      },
      err => {
        console.log(err);
        alert("Could not send notification right now");
      }
    )
  }


}
