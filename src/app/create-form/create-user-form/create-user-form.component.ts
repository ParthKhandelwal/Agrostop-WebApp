import { Component, OnInit, Inject, Input } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { ApiService } from '../../shared/api.service';
import { MAT_DIALOG_DATA} from '@angular/material';
import { User } from '../../Model/user';


@Component({
  selector: 'app-create-user-form',
  templateUrl: './create-user-form.component.html',
  styleUrls: ['./create-user-form.component.css']
})
export class CreateUserFormComponent implements OnInit {
  hide = true;
  user: User = {
    name: "",
   password: "",
   lastLogin: null,
   emailId: "",
   contactNumber: "",
   _id: "",
   role: "",
   tallyUserName: "",
   posCashLedgerName: "",
   cashLedgerName: "",
   basicBasePartyName: "",
   placeOfSupply: "",
   voucherTypeName: "",
   godownName: "",
   salesVoucherHeader: "",
   salesVoucherFooter: "",
 };


  posCashLedgers: string[] = [];
  cashLedgers: string[]= [];
  basicBasePartyNames: string[]= [];
  placeOfSupplies: string[]= [];
  voucherTypeNames: string[] = [];
  godownNames: string[] = [];
url = '';
selectedFile = '';

  onFileChanged(event) {
     this.selectedFile = event.target.files[0]
     console.log(this.selectedFile);
   }

  constructor(private router? :Router, @Inject(ApiService) private apiService? : ApiService) { }

  ngOnInit() {
    this.apiService.getCashLedgers().subscribe(
      res =>{
        console.log(res);
        this.posCashLedgers = res.list;
        this.cashLedgers = res.list;
        this.basicBasePartyNames = res.list;
      },
      err =>{
        console.log(err);
      }
    );

    this.apiService.getVoucherTypeName().subscribe(
      res =>{
        this.voucherTypeNames = res.list;
      },
      err =>{
        console.log(err);
      }
    );

    this.apiService.getPlaceOfSupplies().subscribe(
      res =>{
        this.placeOfSupplies = res.list;

      },
      err =>{

        console.log(err);
      }
    );

    this.apiService.getGodownNames().subscribe(
      res =>{
        this.godownNames = res.list;

      },
      err =>{
        console.log(err);
      }
    );
  }

  submit(){
    this.apiService.saveUser(this.user).subscribe(
      res =>{
        console.log(res);
      },
      err =>{
        console.log(err);
      }
    )
  }

}
