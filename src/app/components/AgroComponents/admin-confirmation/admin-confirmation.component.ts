import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserLogin } from 'src/app/model/User/user';
import { ApiService } from 'src/app/services/API/api.service';

@Component({
  selector: 'app-admin-confirmation',
  templateUrl: './admin-confirmation.component.html',
  styleUrls: ['./admin-confirmation.component.scss']
})
export class AdminConfirmationComponent implements OnInit {

  user: UserLogin = {
    username: '',
    password: ''
  };
  sub: Subscription

  constructor(public dialogRef: MatDialogRef<AdminConfirmationComponent>,@Inject(MAT_DIALOG_DATA) public data?: any, private apiService?: ApiService) { }

  ngOnInit(): void {
  }

  authenticate(){
    if(this.user.username && this.user.password){
      this.sub =  this.apiService.authenticate(this.user)
      .pipe(map(user => {
        return user.user.role =="Admin";
      })).subscribe(
        res => {
          this.dialogRef.close(res);
        }
      );
    }
  }

  ngOnDestroy(){
    if(this.sub){
      this.sub.unsubscribe();
    }
  }
}
