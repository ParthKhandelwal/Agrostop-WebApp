import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { interval, Observable } from 'rxjs';
import { flatMap, map, shareReplay } from 'rxjs/operators';
import { AuthenticationService } from '../../../services/Authentication/authentication.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { InventoryInfoComponent } from '../../AgroEntryComponents/inventory-info/inventory-info.component';
import { TallyService } from '../../../services/Tally/tally.service';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { DayBookService } from '../../../services/DayBook/day-book.service';
import { DatabaseService } from '../../../services/Database/database.service';
import { Router } from '@angular/router';
import { AWSServiceService } from '../../../services/AWSService/awsservice.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationService } from '../../../services/Notification/notification.service';

@Component({
  selector: 'navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

    isOpen:boolean = false;

    routes: any[] = [
      {title: "Dashboard", icon: "dashboard", link: "/dashboard", roles: ["Admin", "Company User"]},
      {title: "Voucher", icon: "receipt_long", link: "/agro-voucher", roles: ["Admin", "Company User"]},
      {title: "Voucher Register", icon: "menu_book", link: "/daybook", roles: ["Admin", "Company User"]},
      {title: "Customer Profile", icon: "supervisor_account", link: "/customer", roles: ["Admin", "Company User"]},
      {title: "Address Profile", icon: "location_pin", link: "/address-summary", roles: ["Admin"]},
      {title: "Stock Report", icon: "inventory", link: "/stock-summary", roles: ["Admin", "Company User"]},
      {title: "Stock Transfer Summary", icon: "inventory", link: "/stock-transfer-summary", roles: ["Admin"]},

      {title: "Movement Analysis", icon: "all_inbox", link: "/movement-analysis", roles: ["Admin"]},
      {title: "Customer List", icon: "list", link: "/customer-profile", roles: ["Admin"]},
      {title: "Address List", icon: "list", link: "/address-profile", roles: ["Admin"]},
      {title: "Product Profile", icon: "spa", link: "/product-profile", roles: ["Admin"]},
      {title: "User Profile", icon: "supervised_user_circle", link: "/user-profile", roles: ["Admin"]},
      {title: "Crop Profile", icon: "category", link: "/crop-profile", roles: ["Admin"]},
      {title: "Settings", icon: "settings", link: "/settings", roles: ["Admin"]},
      {title: "Tally Console", icon: "admin_panel_settings", link: "/tally-console", roles: ["Admin"]},

    ]

  constructor(private breakpointObserver: BreakpointObserver,
     public auth?: AuthenticationService,
     private dialog?: MatDialog, public tallyService?: TallyService, private router?: Router,
     public daybookService?: DayBookService,  public databaseService?: DatabaseService,
      public notificationService?: NotificationService,
     public aws?: AWSServiceService) {
    }

    ngOnInit(){

    }

  toggle(){
    this.isOpen = !this.isOpen
  }
  public allowed(arr: string[]){
    return arr.findIndex((s) => s === this.auth.user.role) > -1
  }

  searchInventory(){
    const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = true;
      dialogConfig.width = "50%";
      this.dialog.open(InventoryInfoComponent, { maxHeight: '90vh'});
  }

  matchRoute(str){
    return this.router.url == str;
  }


}
