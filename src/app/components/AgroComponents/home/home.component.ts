import { Component, ViewChild } from '@angular/core';
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
export class HomeComponent {

  mobileCards = [
    { title: 'Stock Transfer', cols: 1, rows: 1, id: "stock-transfer" },
    { title: 'Card 2', cols: 1, rows: 1 },
    { title: 'Card 3', cols: 1, rows: 1 , id: "notification"},
    { title: 'Card 4', cols: 1, rows: 1 },
    { title: 'Cloud Voucher', cols: 1, rows: 1, id: "cloud-voucher" }
  ];

  desktopCards = [
    { title: 'Stock Transfer', cols: 2, rows: 1 , id: "stock-transfer" },
    { title: 'Sync', cols: 1, rows: 1 , id: "sync"},
    { title: 'Notifications', cols: 1, rows: 2 , id: "notification"},
    { title: 'Card 4', cols: 1, rows: 1 },
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

  constructor(private breakpointObserver: BreakpointObserver,
    public apiService?: ApiService,public notificationService?: NotificationService,
     public auth?: AuthenticationService, public syncService?:SyncService) {
    this.getOfflineVouchers();
    this.notification.type = NotificationType.NOTIFICATION;
  }


  getOfflineVouchers(){
    this.apiService.getCloudVouchers().subscribe(
      res => {

            this.voucherTable.setVouchers(res);



      },
      err => {
        console.log(err);
      }
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
