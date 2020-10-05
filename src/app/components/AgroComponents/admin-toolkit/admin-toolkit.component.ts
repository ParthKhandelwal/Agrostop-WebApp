import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SyncService } from '../../../services/Sync/sync.service';
import { AuthenticationService } from '../../../services/Authentication/authentication.service';

@Component({
  selector: 'app-admin-toolkit',
  templateUrl: './admin-toolkit.component.html',
  styleUrls: ['./admin-toolkit.component.css']
})
export class AdminToolkitComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<AdminToolkitComponent>,     public router?: Router,
    public syncService?: SyncService, public auth?: AuthenticationService
    ) {

    }
  ngOnInit(): void {
    this.syncService.saveVoucherTypes;
  }

  onNoClick(): void {
  }

  navigateTo(str){
    this.router.navigateByUrl('/' +str)
    this.dialogRef.close();

  }
}
