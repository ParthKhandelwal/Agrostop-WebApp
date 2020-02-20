import { Injectable } from '@angular/core';
import { TallyVoucher } from '../Model/tally-voucher';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { ApiService } from './api.service';
import { VOUCHER } from '../Model/voucher';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VoucherService {

  voucher: VOUCHER;
  vouchers : VOUCHER[] = [];

  constructor(private apiService?:ApiService) {
    this.initializeWebSocketConnection();
   }
  private serverUrl = this.apiService.WEB_SOCKET_URL + '/voucherSocket';
  private title = 'WebSockets chat';
  private stompClient;
  



  initializeWebSocketConnection() {
    this.apiService.getVouchers(new Date(), new Date()).subscribe(
      res => {
        this.vouchers = res;

      },
      err => {
        console.log(err);
      }
    )

    

      let ws = new SockJS(this.serverUrl);
      this.stompClient = Stomp.over(ws);
      const that = this;
      this.stompClient.connect({}, function(frame) {
        that.stompClient.subscribe("/topic/voucher", (message) => {
          if (message.body) {
            that.addVoucher(JSON.parse(JSON.stringify(message.body)));
          }
        });
      });
    
   }
  

  addVoucher(voucher: any) {
    
    this.vouchers.push(JSON.parse(voucher));
   
  }

    sendVoucher(voucher){
      this.stompClient.send("/app/voucherSocket", {}, JSON.stringify(voucher));
       
    }

}
