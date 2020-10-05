import { Component, OnInit, Inject } from '@angular/core';
import { ApiService } from '../../../services/API/api.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ChemicalGroup } from '../../../model/ChemicalGroup/chemical-group';

@Component({
  selector: 'app-chemical-group-entry',
  templateUrl: './chemical-group-entry.component.html',
  styleUrls: ['./chemical-group-entry.component.css']
})
export class ChemicalGroupEntryComponent implements OnInit {
  chemicals: any[] = [];

  constructor(public dialogRef?: MatDialogRef<ChemicalGroupEntryComponent>,@Inject(MAT_DIALOG_DATA) public chemicalGroup?: ChemicalGroup, private apiService?: ApiService) {
    if(!chemicalGroup){
      chemicalGroup = new ChemicalGroup();
    }
  }

  ngOnInit(): void {
    this.apiService.getAllChemicalGroup().subscribe(
      res => {
        this.chemicals = res;
        console.log(res)
      },
      err => console.log(err)
    )
  }

  save(){
    this.apiService.saveChemicalGroup(this.chemicalGroup).subscribe(
      res => {
        this.dialogRef.close(this.chemicalGroup);
      },
      err => {
        console.log(err)
        alert("Could not save the following chemical group.");
      }
    )
  }

  delete(){
      this.apiService.deleteChemcialGroup(this.chemicalGroup.name).subscribe(
        res => {
          this.dialogRef.close();
        },
        err => {
          console.log(err);
        }
      )


  }

}
