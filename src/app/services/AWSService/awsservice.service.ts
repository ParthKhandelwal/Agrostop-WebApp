import { Injectable } from '@angular/core';
import * as AWS from 'aws-sdk';
import { Notification, NotificationType } from '../../model/Notification/notification';
import { ApiService } from '../API/api.service';
import { SyncService } from '../Sync/sync.service';
import { NotificationService } from '../Notification/notification.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AWSServiceService {

  private sqs;
  private queueUrl : BehaviorSubject<string> = new BehaviorSubject("");


  constructor(private apiService?: ApiService, private syncService?: SyncService, public notificationService?: NotificationService) {
    
    

  }

  initiate(username: string){
    this.apiService.getAWSCred().subscribe(
      res => {
        AWS.config.credentials = new AWS.Credentials(res.key, res.secret);
        AWS.config.region = "ap-south-1";

        this.sqs = new AWS.SQS();
        this.queueUrl = new BehaviorSubject(sessionStorage.getItem("queueURL"));
        this.listenMessages();
        var createParams = {
          QueueName: "user-"+username, /* required */
        };
        let that = this;
        this.sqs.createQueue(createParams, function(err, data) {
            if(err){
              console.log(err)
            }else{
              that.queueUrl.next(data.QueueUrl);
              sessionStorage.setItem("queueURL", data.QueueUrl);
            }
        })
      }
    )

      


    }

    listenMessages(){


      let sqs = new AWS.SQS()


      let that = this
      setInterval(() => {
        console.log("recieving notifications")
        console.log(this.queueUrl.getValue());
        if( this.queueUrl.getValue()){
          var params = {
            QueueUrl: this.queueUrl.getValue(),
            MaxNumberOfMessages: 10,

          };
          sqs.receiveMessage(params, function(err, data) {
            if (err) {
              if(err.code == "NetworkingError"){
                that.notificationService.internetConnected$.next(false);
              }
            } // an error occurred
            else{
              that.notificationService.internetConnected$.next(true);
              data.Messages.forEach((message) => {
                console.log(message.Body)
                let notification: Notification = JSON.parse(message.Body);
                that.handleNotification(notification);
                that.notificationService.addNotification(notification);
                var params = {
                  QueueUrl: that.queueUrl.getValue(), /* required */
                  ReceiptHandle: message.ReceiptHandle /* required */
                };
                sqs.deleteMessage(params, function(err, data) {
                  if (err) console.log(err, err.stack); // an error occurred
                  else     console.log(data);           // successful response
                });
              });

            }              // successful response
          });

        }
      }, 30000);

    }

    handleNotification(n: Notification){

      switch (n.type) {
        case NotificationType.UPDATESTOCKITEM:
          this.apiService.getStockItem(n.narration).subscribe(
            res => {
              this.syncService.updateStockItem(res);
            },
            err => {
              console.log(err);
            }
          )
          break;
        case NotificationType.UPDATELEDGER:
          console.log(n);
          this.apiService.getLedger(n.narration).subscribe(
            res => {
              this.syncService.updateLedger(res);
            },
            err => {
              console.log(err);
            }
          )
          break;

        case NotificationType.UPDATEVOUCHERTYPE:
          this.apiService.getVoucherType(n.narration).subscribe(
            res => {
              this.syncService.updateVoucherType(res);
            },
            err => {
              console.log(err);
            }
          )
          break;
        case NotificationType.UPDATECUSTOMER:
          this.apiService.getCustomer(n.narration).subscribe(
            res => {
              this.syncService.updateCustomer(res);
            },
            err => {
              console.log(err);
            }
          )
          break;

        default:
          break;
      }
    }

}

