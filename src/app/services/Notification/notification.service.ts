import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject } from 'rxjs';
import { NotificationComponent } from '../../components/AgroComponents/notification/notification.component';
import { Notification, NotificationType } from '../../model/Notification/notification';


@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  notifications: Notification[] = []
  currentNotification$ = new BehaviorSubject(null)
  internetConnected$ = new BehaviorSubject(false);
  constructor(   private _snackBar?: MatSnackBar) {

  }

  addNotification(notification: Notification){

        switch (notification.type) {
          case NotificationType.NOTIFICATION:
            this.notifications.push(notification);
            break;

          default:
            break;
        }
        this._snackBar.openFromComponent(NotificationComponent, {
          duration: 2000,
          panelClass:"custom_sneak_bar",
          horizontalPosition: "right",
          verticalPosition: "bottom",
          data: notification
        })

  }
}
