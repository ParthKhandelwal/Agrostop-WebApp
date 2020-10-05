import { Component, Inject, OnInit } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { Notification, NotificationType } from '../../../model/Notification/notification';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: Notification) {
    console.log(data);
  }

  ngOnInit() {}

  get getIcon() {
    switch (this.data.type) {
      case NotificationType.UPDATELEDGER:
        return 'face';
      case NotificationType.UPDATEVOUCHERTYPE:
        return 'receipt_long';
      case NotificationType.UPDATECUSTOMER:
        return 'account_circle';

      case NotificationType.UPDATESTOCKITEM:
        return 'category';
      case NotificationType.NOTIFICATION:
        return 'notifications';
      default:
        return 'announcement';
    }
  }

  get message() {
    switch (this.data.type) {

      case NotificationType.NOTIFICATION:
        return this.data.narration;
      default:
        return this.data.narration + " has been updated";
    }
  }

}
