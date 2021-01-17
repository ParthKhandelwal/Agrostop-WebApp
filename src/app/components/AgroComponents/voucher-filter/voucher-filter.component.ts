import { Component, OnInit, Inject, ChangeDetectorRef, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { VOUCHER } from '../../../model/Voucher/voucher';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { VoucherFilter } from 'src/app/model/HelperClass/HelperClass';
import { AutoCompleteComponent } from '../auto-complete/auto-complete.component';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { AuthenticationService } from 'src/app/services/Authentication/authentication.service';

@Component({
  selector: 'app-voucher-filter',
  templateUrl: './voucher-filter.component.html',
  styleUrls: ['./voucher-filter.component.css'],

})
export class VoucherFilterComponent implements OnInit {

 
  @ViewChild("customerAuto") customerAuto: AutoCompleteComponent;
  @ViewChild("addressAuto") addressAuto: AutoCompleteComponent;

  voucherTypes: any[] = [];


  constructor(@Inject(MAT_DIALOG_DATA) public data?: VoucherFilter, private db?: NgxIndexedDBService,
  private auth?: AuthenticationService,
  public dialogRef?: MatDialogRef<VoucherFilterComponent>) {
    
  }

  async ngOnInit(): Promise<void> {
    this.voucherTypes = (await this.db.getAll("Voucher Types")).filter((v: any) => this.auth.user.voucherTypes.filter((l) => l.voucherTypeName == v.NAME).length>0);
  }


  reset(){
    this.data = new VoucherFilter() 
    this.dialogRef.close(this.data);
  }

 



}
