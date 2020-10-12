import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as upi from 'upi-link';
import * as QRCode from 'qrcode';

@Component({
  selector: 'app-upilink',
  templateUrl: './upilink.component.html',
  styleUrls: ['./upilink.component.scss']
})
export class UPILinkComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<UPILinkComponent>,@Inject(MAT_DIALOG_DATA) public data?: any,) { }

  ngOnInit(): void {
    let uri = upi.Static("tirupatiagrostore@upi", this.data.payeeName, Math.abs(this.data.amount))
      .setMerchant("Tirupati Traders")
      .setTxRef(this.data.id)
      .getLink();
      console.log(uri);
      QRCode.toCanvas("tirupatiagrostore@upi", { errorCorrectionLevel: 'H' }, function (err, canvas) {
        if (err) throw err

        var container = document.getElementById('container')
        container.appendChild(canvas)
      })
  }
  close(){
    this.dialogRef.close(false);
  }

  done(){
    this.dialogRef.close(true);
  }

}
