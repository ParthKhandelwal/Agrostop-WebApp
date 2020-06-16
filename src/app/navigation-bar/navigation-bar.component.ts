import { Component, OnInit, Inject } from '@angular/core';
import {User} from '../Model/user';

import { Router } from '@angular/router';
import { AuthenticationService } from '../shared/authentication.service';
import { PosService } from '../shared/pos.service';
import { DatabaseService } from '../shared/database.service';
import { AppComponent } from '../app.component';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { ProductStatComponent } from '../Products/product-stat/product-stat.component';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.css']
})
export class NavigationBarComponent implements OnInit {
  url: string;

  currentUser: User;
  numberOfStockItems: number;
  numberOfLedgers: number;
  numberOfBatches: number;
  numberOfVoucherTypes: number;
  numberOfCustomers: number;
  numberOfAddresses: number;
  numberOfPrintCOnf: number;
  numberOfVouchers: number;
  databaseService: DatabaseService;
  

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private posService: PosService,
    private dialog?: MatDialog
    
  ) {
    this.authenticationService.currentUser.subscribe(x => {
      this.currentUser = x
      if(!(x && x.name)){
        authenticationService.logOut();
      }
    });
    this.databaseService = AppComponent.databaseService;
  }

  ngOnInit() {
    
  }

  updateDatabaseStats(){
    this.databaseService.db.count("Addresses").then(
      res => this.numberOfAddresses = res
    );
    this.databaseService.db.count("customers").then(
      res => this.numberOfCustomers = res
    );
    this.databaseService.db.count("Ledgers").then(
      res => this.numberOfLedgers = res
    );
    this.databaseService.db.count("items").then(
      res => this.numberOfStockItems = res
    );
    this.databaseService.db.count("Voucher Types").then(
      res => this.numberOfVoucherTypes = res
    );
    this.databaseService.db.count('Batches').then(
      res => this.numberOfBatches = res
    );
    this.databaseService.db.count('PrintConfiguration').then(
      res => this.numberOfPrintCOnf = res
    );
    this.databaseService.db.count('cacheVoucher').then(
      res => this.numberOfVouchers = res
    );

    

  }


  deleteDatabase(){
    this.databaseService.clearDatabse();
  }

   isAdmin() {
    return this.currentUser && this.currentUser.role === "Admin";
  }

   isCompanyUser() {
    return this.currentUser && this.currentUser.role === "Company User";
  }

  logout() {
    this.authenticationService.logOut();
    this.router.navigate(['/login']);
  }


  itemDetails(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = "50%";
    const dialogRef = this.dialog.open(ProductStatComponent, {maxHeight: '90vh'});
  }

}
