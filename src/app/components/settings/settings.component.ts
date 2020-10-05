import { Component, OnInit } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { AuthenticationService } from '../../services/Authentication/authentication.service';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  object: any = {
    voucherType: "",
    seq:0,
    prefix:"ASV-"
  }
  voucherType: string;


  voucherTypes: any[] = [];

  constructor(private db?: NgxIndexedDBService, public auth?: AuthenticationService){

  }


  async ngOnInit(): Promise<void> {
    this.voucherTypes = (await this.db.getAll("Voucher Types")).map((v: any) => v.NAME);

  }

  save(){
    localStorage.setItem(this.object.voucherType, JSON.stringify(this.object));
    this.object =  {
      voucherType: "",
      seq:0,
      prefix:"ASV-"
    }
  }

  get(){
    let temp = JSON.parse(localStorage.getItem(this.object.voucherType));

    this.object.prefix = temp.prefix;
    this.object.seq = temp.seq;
    setTimeout(() => {
      document.getElementById("prefix");

    }, 300);

  }

}
