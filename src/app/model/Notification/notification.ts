export class Notification{
  type: NotificationType;
  narration: string;
}

export enum NotificationType{
  UPDATESTOCKITEM = "UPDATESTOCKITEM",
  UPDATELEDGER = "UPDATELEDGER" ,
  UPDATEVOUCHERTYPE = "UPDATEVOUCHERTYPE",
  NOTIFICATION = "NOTIFICATION",
  UPDATECUSTOMER = "UPDATECUSTOMER"
}
