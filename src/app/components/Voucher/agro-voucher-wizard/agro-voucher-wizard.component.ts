import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { AgroVoucherService } from '../../../services/AgroVoucher/agro-voucher.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { VoucherSettingsComponent } from '../voucher-settings/voucher-settings.component';
import { VoucherParentType } from '../../../model/VoucherType/voucher-type';
import { AutoCompleteComponent } from '../../AgroComponents/auto-complete/auto-complete.component';
import { ParticularTableComponent } from '../particular-table/particular-table.component';
import { BankAllocationComponent } from '../bank-allocation/bank-allocation.component';
import { SyncService } from '../../../services/Sync/sync.service';
import { ALLLEDGERENTRIESLIST, ADDRESSLIST } from '../../../model/Voucher/voucher';
import { InventoryTableComponent } from '../inventory-table/inventory-table.component';
import { CollectionComponent } from '../collection/collection.component';
import { MatStepper } from '@angular/material/stepper';
import { InvoicePrintViewComponent } from '../../invoice-print-view/invoice-print-view.component';
import { ApiService } from '../../../services/API/api.service';
import { AuthenticationService } from '../../../services/Authentication/authentication.service';
import { VoucherDetailComponent } from '../voucher-detail/voucher-detail.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { catchError, finalize, map } from 'rxjs/operators';
import { VoucherTypeConfig } from 'src/app/model/VoucherType/voucher-type-config';
import { NgxIndexedDBService } from 'ngx-indexed-db';


@Component({
  selector: 'app-agro-voucher-wizard',
  templateUrl: './agro-voucher-wizard.component.html',
  styleUrls: ['./agro-voucher-wizard.component.css']
})
export class AgroVoucherWizardComponent implements OnInit {
  voucherParent= VoucherParentType;

  constructor(public service?: AgroVoucherService, public auth?: AuthenticationService,
    private dialog?: MatDialog, private syncService?: SyncService,
    private db?: NgxIndexedDBService,
    private cd?: ChangeDetectorRef,private apiService?: ApiService,
    private _bottomSheet?: MatBottomSheet ) { }

  ngOnInit(): void {
    if(!this.service.voucherParentType || !this.service.voucher || ! this.service.voucher.VOUCHERTYPENAME
      || ! this.service.voucher.DATE || ! this.service.voucher.VOUCHERNUMBER || ! this.service.voucher._REMOTEID ){
        this.voucherSettings();
      }
  }

@ViewChild("ledgerAutoComp") ledgerAutoComp: AutoCompleteComponent;
@ViewChild("particularTable") particularTable: ParticularTableComponent;
@ViewChild("inventoryTable") inventoryTable: InventoryTableComponent;
@ViewChild("collection") collection: CollectionComponent;
@ViewChild("stepper") stepper: MatStepper;
@ViewChild("voucherDetail") voucherDetail: VoucherDetailComponent;
editVoucherNumber: boolean;
  voucherSettings(){
    const dialogRef = this._bottomSheet.open(VoucherSettingsComponent);
    dialogRef.afterDismissed().subscribe(
      res => {
        this.handleTabOne();

      }
    )
  }


  handleSelectionChange(value){
    switch (value.selectedIndex) {
      case 0:
        this.handleTabOne();
        break;
      case 1:
        setTimeout(() => {
          switch (this.service.voucherParentType) {
            case VoucherParentType.Contra:
              this.particularTable.focus();
              break;

            case VoucherParentType.Payment:
              this.particularTable.focus();
              break;

            case VoucherParentType.Receipt:
              this.particularTable.focus();
              break;
            case VoucherParentType.Sales:
              console.log("focus");
              this.inventoryTable.focus();
              break;
            case VoucherParentType.Purchase:
              console.log("focus");
              this.inventoryTable.focus();
              break;

            case VoucherParentType.Journal:
              this.particularTable.focus();
              break;

            case VoucherParentType.Material_Out:
              this.inventoryTable.focus();
              break;

            default:
              break;
          }
        }, 300)
        break;
      case 2:
        this.handleTabThree()
        if(this.isPOSVoucher()){
          setTimeout(() => {
            this.collection.focus();
          },300)
        }
        break;
      default:
        break;
    }

  }

  handleTabOne(){
    this.voucherDetail.focus();
  }

  handleTabThree(){
    var primaryLedger;
    var parent;
    switch (this.service.voucherParentType) {
      case VoucherParentType.Contra:
        primaryLedger = this.service.voucher.ALLLEDGERENTRIES_LIST.filter((l) => l.ISDEEMEDPOSITIVE =="Yes")[0]
        parent  = this.syncService.ledgers$.getValue().filter((v) => v.NAME == primaryLedger.LEDGERNAME)[0].PARENT;
        primaryLedger.AMOUNT = -1 * Math.round(this.service.getLedgerTotal()*100)/100;;
        this.service.voucher.PARTYLEDGERNAME = this.service.voucher.ALLLEDGERENTRIES_LIST[1].LEDGERNAME;

        if(parent == "Bank Accounts" || parent == "Bank OD A/c"){

          const dialogConfig = new MatDialogConfig();
          dialogConfig.autoFocus = true;
          dialogConfig.width = "50%";
          const dialogRef = this.dialog.open(BankAllocationComponent, {data: this.service.voucher.ALLLEDGERENTRIES_LIST.filter((v) => v.ISDEEMEDPOSITIVE === 'Yes')[0]});
          dialogRef.afterClosed().subscribe(
            (res: ALLLEDGERENTRIESLIST) => {

              document.getElementById("narration").focus();
            }
          )
        }else{
          setTimeout(() =>{
            document.getElementById("narration").focus();
          },300 )
        }

        break;

      case VoucherParentType.Payment:
        primaryLedger = this.service.voucher.ALLLEDGERENTRIES_LIST.filter((l) => l.ISDEEMEDPOSITIVE =="No")[0]
        parent  = this.syncService.ledgers$.getValue().filter((v) => v.NAME == primaryLedger.LEDGERNAME)[0].PARENT;
        primaryLedger.AMOUNT = -1 * Math.round(this.service.getLedgerTotal()*100)/100;;
        this.service.voucher.PARTYLEDGERNAME = this.service.voucher.ALLLEDGERENTRIES_LIST[1].LEDGERNAME;

        if(parent == "Bank Accounts" || parent == "Bank OD A/c"){

          const dialogConfig = new MatDialogConfig();
          dialogConfig.autoFocus = true;
          dialogConfig.width = "50%";
          const dialogRef = this.dialog.open(BankAllocationComponent, {data: this.service.voucher.ALLLEDGERENTRIES_LIST.filter((v) => v.ISDEEMEDPOSITIVE === 'No')[0]});
          dialogRef.afterClosed().subscribe(
            (res: ALLLEDGERENTRIESLIST) => {

              document.getElementById("narration").focus();
            }
          )
        }else{
          setTimeout(() =>{
            document.getElementById("narration").focus();
          },300 )
        }

        break;


      case VoucherParentType.Receipt:
        primaryLedger = this.service.voucher.ALLLEDGERENTRIES_LIST.filter((l) => l.ISDEEMEDPOSITIVE =="Yes")[0]
        parent  = this.syncService.ledgers$.getValue().filter((v) => v.NAME == primaryLedger.LEDGERNAME)[0].PARENT;
        primaryLedger.AMOUNT = -1 * Math.round(this.service.getLedgerTotal()*100)/100;;
        this.service.voucher.PARTYLEDGERNAME = this.service.voucher.ALLLEDGERENTRIES_LIST[1].LEDGERNAME;
        this.service.voucher.BASICVOUCHERCHEQUENAME = this.service.voucher.ALLLEDGERENTRIES_LIST[1].LEDGERNAME;
        if(parent == "Bank Accounts" || parent == "Bank OD A/c"){

          const dialogConfig = new MatDialogConfig();
          dialogConfig.autoFocus = true;
          dialogConfig.width = "50%";
          const dialogRef = this.dialog.open(BankAllocationComponent, {data: this.service.voucher.ALLLEDGERENTRIES_LIST.filter((v) => v.ISDEEMEDPOSITIVE === 'Yes')[0]});
          dialogRef.afterClosed().subscribe(
            (res: ALLLEDGERENTRIESLIST) => {

              document.getElementById("narration").focus();
            }
          )
        }else{
          setTimeout(() =>{
            document.getElementById("narration").focus();
          },300 )
        }

        break;

      case VoucherParentType.Purchase:
        console.log(this.service.voucher);
        primaryLedger = this.service.voucher.LEDGERENTRIES_LIST.filter((l) => l.ISDEEMEDPOSITIVE =="No")[0];
        console.log(primaryLedger);
        parent  = this.syncService.ledgers$.getValue().filter((v) => v.NAME == primaryLedger.LEDGERNAME)[0].PARENT;
        primaryLedger.AMOUNT = -1 * Math.round(this.service.getLedgerTotal()*100)/100;
        if(parent == "Bank Accounts" || parent == "Bank OD A/c"){

          const dialogConfig = new MatDialogConfig();
          dialogConfig.autoFocus = true;
          dialogConfig.width = "50%";
          const dialogRef = this.dialog.open(BankAllocationComponent, {data: this.service.voucher.ALLLEDGERENTRIES_LIST.filter((v) => v.ISDEEMEDPOSITIVE === 'Yes')[0]});
          dialogRef.afterClosed().subscribe(
            (res: ALLLEDGERENTRIESLIST) => {

              document.getElementById("narration").focus();
            }
          )
        }else{
          setTimeout(() =>{
            document.getElementById("narration").focus();
          },300 )
        }

        break;


        case VoucherParentType.Material_Out:
          this.service.voucher.USEFORGODOWNTRANSFER = "Yes";
        this.service.voucher.DESTINATIONGODOWN = this.service.voucher.VOUCHERDESTINATIONGODOWN;
        this.service.voucher.LEDGERENTRIES_LIST.filter((l) => l.ISDEEMEDPOSITIVE == "Yes")[0].AMOUNT =(-1)* Math.abs(this.service.getLedgerTotal());
        setTimeout(() =>{
          document.getElementById("narration").focus();
        },300 )
      default:
        break;
    }
  }



  setVoucherForClass(){

  }

  save(stepper){
    this.service.save();
    stepper.reset();
    setTimeout(() => {
      this.cd.detectChanges();
      this.handleTabOne();

    }, 700);
  }

  voucherSet(){
    switch (this.service.voucherParentType) {
      case VoucherParentType.Material_Out:
        return this.service.voucherParentType && this.service.voucher.VOUCHERTYPENAME
                  && (this.service.voucher.DATE instanceof Date)
                  && this.service.voucher.VOUCHERDESTINATIONGODOWN
                  && this.service.voucher.VOUCHERSOURCEGODOWN
                  && this.service.voucher.LEDGERENTRIES_LIST.length > 0;
        break;


      case VoucherParentType.Sales:
        return true;
        break;


      default:
        return this.service.voucherParentType && this.service.voucher.VOUCHERTYPENAME && (this.service.voucher.DATE instanceof Date);
        break;
    }
  }

  isPOSVoucher(){
    return this.service.voucherParentType == VoucherParentType.Sales;
  }

  handleVoucherSave(){
    switch (this.service.voucherParentType) {
      case VoucherParentType.Material_Out:
        this.saveVoucherForVerification();
        break;


      default:
        this.saveExposed();
        break;
    }
  }


 saving: boolean;

  saveExposed(){
    let completed = false;
    this.saving = true;
    let sub = this.service.saveExposed().pipe(
      map((voucher) => {
        if(voucher._REMOTEID){
          this.service.voucher = voucher
          completed = true;

        }
      }),
      catchError(async error => {
        await this.service.addCacheVoucher(this.service.voucher);
      }),
      finalize(async () => {
        this.saving= false;
        let v:VoucherTypeConfig = await this.db.getByKey("PrintConfiguration", this.service.voucher.VOUCHERTYPENAME);
        if(v.printAfterSave){
          this.service.printVoucher(this.service.voucher);
        }
        this.service.postVoucherSave();
        this.stepper.reset();
          setTimeout(() => {
            this.cd.detectChanges();
            this.handleTabOne();

          }, 700);
      })
    ).subscribe();
    setTimeout(() => {
      sub.unsubscribe();
      if(!completed){

        this.service.addCacheVoucher(this.service.voucher).then(
          (res) => {
            this.saving= false;
            this.service.printVoucher(this.service.voucher);
            this.service.postVoucherSave();
            this.stepper.reset();
            setTimeout(() => {
              this.cd.detectChanges();
              this.handleTabOne();

            }, 700);
          },
          err =>{
            alert("Voucher Could not be saved. Please contact administrator.")
          }
        );

      }
    }, 7000);
  }



  saveVoucherForVerification(){
    this.saving = true
    this.apiService.saveInventroyInForVerification(this.service.voucher).subscribe(
      res => {
        this.saving = false;
        this.service.nextVocuher();
          this.stepper.reset();
            setTimeout(() => {
              this.cd.detectChanges();
              this.handleTabOne();

            }, 700);
            this.stepper.reset();

      }
    )
  }


}
