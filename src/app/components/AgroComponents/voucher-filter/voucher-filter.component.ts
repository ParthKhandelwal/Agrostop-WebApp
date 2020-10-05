import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { VOUCHER } from '../../../model/Voucher/voucher';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-voucher-filter',
  templateUrl: './voucher-filter.component.html',
  styleUrls: ['./voucher-filter.component.css'],

})
export class VoucherFilterComponent implements OnInit {

  filterFieldFC = new FormControl();
  filterOperationFC = new FormControl();
  filterValueFC = new FormControl();
  filterValue: any;
  filterField: any[] = [
    "Voucher Type",
    "Tally Username",
    "Customer"
  ]
  filterValue$: any[];
  filterMap: Map<String, any[]>;
  filterValues: string[];
  vouchers: VOUCHER[] = [];
  filteredOptions: Observable<string[]>;
  filteredArray : any[] =[]




  constructor(@Inject(MAT_DIALOG_DATA) public data?: VOUCHER[]) {
    this.vouchers = data;
   }

  ngOnInit(): void {
      
  }

  filterFieldSelected(res){
    this.filterValues = res;
    this.filteredOptions = this.filterValueFC.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
    setTimeout(
      () => {
        document.getElementById("field").focus();
      }
      ,300)
  }


  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.filterValues.filter(option => option.toLowerCase().indexOf(filterValue) >= 0);
  }




  filter(){
    this.filteredArray = this.vouchers.filter((voucher: any) => {
        
        if (voucher && this.filterFieldFC.value && this.filterValueFC.value){
          if (this.filterFieldFC.value.key == "Voucher Type"){

            return voucher.VOUCHERTYPENAME == this.filterValueFC.value;
            
          } else if (this.filterFieldFC.value.key == "Customer"){
            return voucher.BASICBUYERNAME == this.filterValueFC.value;

          } else if (this.filterFieldFC.value.key == "Voucher Number"){
            return voucher.VOUCHERNUMBER == this.filterValueFC.value;
          }else if (this.filterFieldFC.value.key == "Address"){
            return voucher.ADDRESS == this.filterValueFC.value;

          }else if (this.filterFieldFC.value.key == "Amount Greater Than"){
            return this.getVoucherTotal(voucher.LEDGERENTRIES_LIST) > this.filterValueFC.value;

          }else if (this.filterFieldFC.value.key == "Amount Smaller Than"){
            return this.getVoucherTotal(voucher.LEDGERENTRIES_LIST) < this.filterValueFC.value;

          }else if (this.filterFieldFC.value.key == "Including Stock Item"){
            console.log()
            if(voucher.ALLINVENTORYENTRIES_LIST instanceof Array){
              return voucher.ALLINVENTORYENTRIES_LIST.filter((v)=> v.STOCKITEMNAME == this.filterValueFC.value).length > 0;

            }else {
              return [voucher.ALLINVENTORYENTRIES_LIST].filter((v)=> v.STOCKITEMNAME == this.filterValueFC.value).length > 0;
            }

          } else if(this.filterFieldFC.value.key == "Saved At"){
            if(this.filterValueFC.value =="Tally"){
              return voucher.savedToTally;
            }else if(this.filterValueFC.value =="Cloud"){
              return !voucher.savedToTally;
            }
            
          }
          
        }else {
          return true;
        }
        
      }
    )

  }

  reset(){
    this.filterFieldFC.setValue(null);
    this.filterValueFC.setValue("");
  }

  getVoucherTotal(voucher: VOUCHER){
    var credit: number = 0;
    var debit: number = 0;
    if(voucher.ALLINVENTORYENTRIES_LIST){
      for (let item of voucher.ALLINVENTORYENTRIES_LIST){
        credit = credit + 1*(item.AMOUNT? item.AMOUNT: 0);
      }
    }
   
    if(voucher.LEDGERENTRIES_LIST){
      for(let item of voucher.LEDGERENTRIES_LIST){
        if(item.AMOUNT>0){
          credit = credit + 1*(item.AMOUNT? item.AMOUNT: 0);
        }else {
          debit = debit + (item.AMOUNT? item.AMOUNT: 0);
        }
      }
    }
    
    if(voucher.ALLLEDGERENTRIES_LIST){
      for(let item of voucher.ALLLEDGERENTRIES_LIST){
        if(item.AMOUNT>0){
          credit = credit + 1*(item.AMOUNT? item.AMOUNT: 0);
        }else {
          debit = debit + 1*(item.AMOUNT? item.AMOUNT: 0);
        }
      }
    }
    
    return credit;
  }

}
