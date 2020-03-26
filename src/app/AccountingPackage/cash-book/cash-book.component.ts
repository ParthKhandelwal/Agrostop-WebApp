import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/shared/api.service';
import { Observable } from 'rxjs';
import { AuthenticationService } from 'src/app/shared/authentication.service';
import { FormControl } from '@angular/forms';
import { User } from 'src/app/Model/user';

@Component({
  selector: 'app-cash-book',
  templateUrl: './cash-book.component.html',
  styleUrls: ['./cash-book.component.css']
})
export class CashBookComponent implements OnInit {
  cashBookStats$: Observable<any[]>;
  fromDate = new FormControl();
  toDate = new FormControl();
  user : User;
  constructor(private apiService?: ApiService, private auth?: AuthenticationService) { }

  ngOnInit() {
    this.auth.currentUser.subscribe(
      (res : User) => {
        this.user = res;
        this.toDate.setValue(new Date())
        this.fromDate.setValue(new Date())
        this.getSummary();
      }
    );
  }

  getSummary(){
    this.cashBookStats$ = this.apiService.getCashBook(this.user.userName, this.fromDate.value, this.toDate.value)
  }

}
