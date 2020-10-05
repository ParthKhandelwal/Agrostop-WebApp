import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { ApiService } from '../../../services/API/api.service';
import {Crop, CropVariety} from '../../../model/Crop/crop'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';

@Component({
  selector: 'app-crop-entry',
  templateUrl: './crop-entry.component.html',
  styleUrls: ['./crop-entry.component.css']
})
export class CropEntryComponent implements OnInit {
  displayedColumns: string[] = ['name', 'narration', 'action'];
  cropVariety: CropVariety = new CropVariety();
  @ViewChild("table") table: MatTable<CropVariety>;

  constructor(public dialogRef?: MatDialogRef<CropEntryComponent>,@Inject(MAT_DIALOG_DATA) public crop?: Crop, private apiService?: ApiService) {

   }

  ngOnInit(): void {

  }

  save(){
    this.apiService.saveCrop(this.crop).subscribe(
      res => {
        this.dialogRef.close();
      }
    )
  }

  deleteVariety(i){
    this.crop.varieties.splice(i,1);
    this.table.renderRows();
  }

  nameEntered(){
    if(this.crop.name){
      document.getElementById("varName").focus();
    }
  }

  addVariety(){
    this.crop.varieties.push(this.cropVariety);
    this.table.renderRows();
    this.cropVariety = new CropVariety();
    setTimeout(() => {
      document.getElementById("varName").focus();
    }, 300);
  }

  delete(){
    this.apiService.deleteCrop(this.crop.id).subscribe(
      res => {
        this.dialogRef.close();
      }
    )
  }

}
