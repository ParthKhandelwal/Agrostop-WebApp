import { Component, AfterViewInit, OnInit, Input, Inject,  ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-cash-tendered',
  templateUrl: './cash-tendered.component.html',
  styleUrls: ['./cash-tendered.component.css']
})
export class CashTenderedComponent implements OnInit {

@ViewChild('continueButtonRef',{static: false}) buttonRef: ElementRef;

  data: number;
  isValid:boolean = false;
  amountRecieved: number;

  constructor(@Inject(MAT_DIALOG_DATA) public messageInjected: any,
  public dialogRef?: MatDialogRef<CashTenderedComponent>
  ) {
    console.log("message: " + messageInjected);
        this.data = messageInjected.CASHAMOUNT * (-1);
        this.amountRecieved = messageInjected.POSCASHRECIEVED
    }

  ngOnInit() {

  }

  ngAfterViewInit(){
      //this.buttonRef.nativeElement.disable(true);
  }

validate(){
  if (this.amountRecieved >= this.data){
    this.isValid = true;
    this.dialogRef.close({success: true, amountRecieved : this.amountRecieved});
  }
}




}
