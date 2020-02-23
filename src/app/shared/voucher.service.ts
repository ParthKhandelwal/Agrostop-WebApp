import { Injectable } from '@angular/core';
import { TallyVoucher } from '../Model/tally-voucher';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { ApiService } from './api.service';
import { VOUCHER, ALLINVENTORYENTRIESLIST, LEDGERENTRIESLIST, ALLLEDGERENTRIESLIST } from '../Model/voucher';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VoucherService {

  voucher: VOUCHER;
  vouchers: VOUCHER[] = [];
  connected: boolean;

  constructor(private apiService?:ApiService) {
    this.initializeWebSocketConnection();
   }
  private serverUrl = this.apiService.WEB_SOCKET_URL + '/voucherSocket';
  private title = 'WebSockets chat';
  private stompClient;
  



  initializeWebSocketConnection() {
    this.apiService.getVouchers(new Date(), new Date()).subscribe(
      res => {
        this.vouchers = res.map(obj => Object.assign(new VOUCHER(), obj));

      },
      err => {
        console.log(err);
      })

    console.log("initialized");
    


    if (!this.connected) {

      let ws = new SockJS(this.serverUrl);
      this.stompClient = Stomp.over(ws);

      const that = this;
      this.stompClient.connect({
        'login': JSON.parse(sessionStorage.getItem("currentUser")).user.userName,
        'passcode': JSON.parse(sessionStorage.getItem("currentUser")).user.password}, function (frame) {
        that.stompClient.subscribe("/topic/voucher", (message) => {
          if (message.body) {
            that.addVoucher(JSON.parse(JSON.stringify(message.body)));
          }
        });
      })
      this.connected = this.stompClient.connected;
    }
    
   }
  
  
  addVoucher(voucher: any) {
    
    this.vouchers.push(JSON.parse(voucher));
   
  }

    sendVoucher(voucher){
      this.stompClient.send("/app/voucherSocket", {}, JSON.stringify(voucher));   
    }

}
