import { Component, OnInit, Inject, ViewChild, Input } from '@angular/core';
import { ApiService } from '../../../services/API/api.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProductProfile, LoyaltyPointDetail } from '../../../model/ProductProfile/product-profile';
import { MatTable } from '@angular/material/table';
import { AutoCompleteComponent } from '../../AgroComponents/auto-complete/auto-complete.component';

@Component({
  selector: 'app-product-profile-entry-component',
  templateUrl: './product-profile-entry-component.component.html',
  styleUrls: ['./product-profile-entry-component.component.css']
})
export class ProductProfileEntryComponentComponent implements OnInit {

  @ViewChild('table', {static: false}) table: MatTable<LoyaltyPointDetail>;
  @ViewChild('productAutoComp', {static: false}) productAutoComp: AutoCompleteComponent;
  edit: boolean;
  displayedColumns= ["startingDate", "endingDate", "points", "action"];
  loyalty: LoyaltyPointDetail = new LoyaltyPointDetail();
  productGroups: string[]

  constructor(private apiService?: ApiService,public dialogRef?: MatDialogRef<ProductProfileEntryComponentComponent>,
    @Inject(MAT_DIALOG_DATA) public productProfile?: ProductProfile ) {
      if(productProfile && productProfile.name){
        this.edit = true;
      }
     }

  ngOnInit(): void {
    this.apiService.getAllProductGroupId().subscribe(
      res => {
        this.productGroups = res.map((v) => v.name);
      }
    )
  }



  selectInventory(value){

    this.apiService.getProductProfile(value.NAME).subscribe(
      res => {
        if(res) {
          this.productProfile = res;
          this.productAutoComp.productControl.setValue(this.productAutoComp.products.filter((v) => v.NAME === value.NAME)[0])
          this.apiService.getProductGroup(this.productProfile.productGroup).subscribe(
            res2 => this.productProfile = res2,
            err => console.log(err)
          )
        }else{
          this.productProfile = new ProductProfile();
          this.productProfile.name = value.NAME;
        }

      },
      err => {
        console.log(err)
        this.productProfile = new ProductProfile();
        this.productProfile.name = value.NAME;
      }
    )
  }

  deleteLoyaltyEntry(index){
    this.productProfile.loyaltyPointDetailList.splice(index, 1);
    this.table.renderRows();
  }

  addLoyalty(){
    if(this.loyalty.startingDate> this.loyalty.endingDate){
      alert("Starting Date cannot be greater than Ending Date");
      return;
    }
    this.productProfile.loyaltyPointDetailList.push(this.loyalty);
    this.loyalty = new LoyaltyPointDetail()
    this.table.renderRows()
    console.log(this.productProfile);
  }
  save(){
    this.apiService.saveProductProfile(this.productProfile).subscribe(
      res => this.productProfile = new ProductProfile(),
      err => console.log(err)
    )
  }

}
