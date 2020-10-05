import { Component, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { ProductGroup } from '../../../model/ProductGroup/product-group';
import { ApiService } from '../../../services/API/api.service';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { startWith, map } from 'rxjs/operators';
import { ChemicalGroupEntryComponent } from '../chemical-group-entry/chemical-group-entry.component';
import { ChemicalGroup } from '../../../model/ChemicalGroup/chemical-group';



@Component({
  selector: 'app-product-group-entry-components',
  templateUrl: './product-group-entry-components.component.html',
  styleUrls: ['./product-group-entry-components.component.css']
})
export class ProductGroupEntryComponentsComponent implements OnInit {

  chemicals: any[] = []

  constructor(public dialogRef?: MatDialogRef<ProductGroupEntryComponentsComponent>,
    @Inject(MAT_DIALOG_DATA) public productGroup?: ProductGroup,
    private dialog?: MatDialog,
    private apiService?: ApiService) {
      if(productGroup && productGroup.name){
        this.apiService.getProductGroup(productGroup.name).subscribe(
          res =>  this.productGroup = res,
          err =>  console.log(err)
        )
      }else {
        productGroup = new ProductGroup();
      }
    }

  ngOnInit(): void {
    this.apiService.getAllChemicalGroup().subscribe(
      res => {
        this.chemicals = res
        this.filteredChemicals = this.fruitCtrl.valueChanges.pipe(
          startWith(null),
          map((fruit: string | null) => fruit ? this._filter(fruit) : this.chemicals.slice()));
      },
      err=> console.log(err)
    )

  }

  save(){
    this.apiService.saveProductGroup(this.productGroup).subscribe(
      res => {
        this.dialogRef.close();
      },
      err => {
        console.log(err);
        alert("Could not save product group");
      }
    )
  }

  addChemicalGroup(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    const ref = this.dialog.open(ChemicalGroupEntryComponent, {data: new ChemicalGroup(), maxHeight: '90vh'});
    ref.afterClosed().subscribe(
      res => {
        console.log(res);
        this.chemicals.push(res);
      }
    )
  }


  delete(){
    this.apiService.deleteProductGroup(this.productGroup.name).subscribe(
      res => {
        this.dialogRef.close();
      },
      err => {
        console.log(err);
        alert("Could not delete product group");
      }
    )
  }


  visible = true;
  fruitCtrl = new FormControl();
  @ViewChild('fruitInput') fruitInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;
  filteredChemicals: Observable<any[]>;


  add(event: MatChipInputEvent): void {
    // const input = event.input;
    // const value = event.value;

    // // Add our fruit
    // if ((value || '').trim()) {
    //   if(this.productGroup.technicalSet.findIndex((v) => v == value.trim()) <= -1){
    //     this.productGroup.technicalSet.push(value.trim());
    //   }
    // }

    // // Reset the input value
    // if (input) {
    //   input.value = '';
    // }

    this.fruitCtrl.setValue(null);
  }

  remove(fruit: string): void {
    const index = this.productGroup.technicalSet.indexOf(fruit);

    if (index >= 0) {
      this.productGroup.technicalSet.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    if(!this.productGroup.technicalSet){
      this.productGroup.technicalSet = [];
    }
    if(this.productGroup.technicalSet.findIndex((v) => v == event.option.viewValue.trim()) <= -1){
      console.log(event.option.value);
      if(event.option.value){
        this.productGroup.technicalSet.push(event.option.viewValue);
      }else {
        this.addChemicalGroup();
      }
    }
    this.fruitInput.nativeElement.value = '';
    this.fruitCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.chemicals.filter(fruit => fruit.name.toLowerCase().indexOf(filterValue) === 0);
  }
}
