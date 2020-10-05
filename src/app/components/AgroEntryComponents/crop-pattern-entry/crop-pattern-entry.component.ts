import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CropPattern } from '../../../model/CropPattern/crop-pattern';
import { ApiService } from '../../../services/API/api.service';
import { AuthenticationService } from '../../../services/Authentication/authentication.service';
import { Crop, CropVariety } from '../../../model/Crop/crop';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-crop-pattern-entry',
  templateUrl: './crop-pattern-entry.component.html',
  styleUrls: ['./crop-pattern-entry.component.css']
})
export class CropPatternEntryComponent implements OnInit {
  crops: Crop[] = [];
  seasons: string[] = ["Rabi", "Kharif"];


  nameControl = new FormControl();
  cropFilteredOptions: Observable<Crop[]>;
  varControl = new FormControl();
  cropVarFilteredOptions: Observable<CropVariety[]>;

  constructor(public dialogRef?: MatDialogRef<CropPatternEntryComponent>,@Inject(MAT_DIALOG_DATA) public cropPattern?: CropPattern, private apiService?: ApiService, private auth?: AuthenticationService) {
    this.cropPattern.userId = auth.user.userName;
    this.cropPattern.dateEntered = new Date();
   }

  ngOnInit(): void {
    this.apiService.getAllCrops().subscribe(
      res=> {
        this.crops = res;
        this.cropFilteredOptions = this.nameControl.valueChanges.pipe(
          startWith(''),
          map(value => this.nameFilter(value))
        );
        this.cropVarFilteredOptions = this.varControl.valueChanges.pipe(
          startWith(''),
          map(value => this.varFilter(value))
        );
      }
    )
  }

  private nameFilter(value: string): Crop[] {
    const filterValue = value?value.toLowerCase(): "";
    return this.crops.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
  }

  private varFilter(value: string): CropVariety[] {
    const filterValue = value.toLowerCase();
    return this.cropVariety().filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
  }

  cropVariety(): CropVariety[]{
    if(this.cropPattern.cropName){
      return ;

    }else{
      return [];
    }

  }
  varieties: CropVariety[];
  nameSelected(){
    if(this.cropPattern.cropName){
      this.varieties = this.crops.filter((v) => v.name === this.cropPattern.cropName)[0].varieties;
      setTimeout(() => {
        document.getElementById("variety").focus();
      }, 300);
    }
  }

  cropVarietySelected(){
    setTimeout(() => {
      document.getElementById("land").focus();

    }, 300);

  }

  landEntered(){
    console.log("some");
    setTimeout(() => {
      document.getElementById("seasonField").focus();
    }, 300);
  }
  seasonSelected(){
    setTimeout(() => {
      document.getElementById("narration").focus();
    }, 300);
  }

  narrationEntered(){
    setTimeout(() => {
      document.getElementById("saveBtn").focus();
    }, 300);
  }

  save(){
    this.apiService.saveCropPattern(this.cropPattern).subscribe(
      res => {
        let customerId = this.cropPattern.customerId;
        this.nameControl.setValue('');
        this.cropPattern = new CropPattern();
        this.cropPattern.customerId = customerId;
        this.cropPattern.userId = this.auth.user.userName;
        this.cropPattern.dateEntered = new Date();
      }
    )
  }

  delete(){
    this.apiService.deleteCrop(this.cropPattern.id).subscribe(
      res => {
        this.dialogRef.close();
      }
    )
  }
}
