import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from '../../../services/API/api.service';

@Component({
  selector: 'ledger-movement-analysis',
  templateUrl: './ledger-movement-analysis.component.html',
  styleUrls: ['./ledger-movement-analysis.component.css']
})
export class LedgerMovementAnalysisComponent implements OnInit {

  fromDate: Date;
  toDate: Date;
  ledgerSummaryList: any[] = [];
  ledger: any;
  @Input("oneLedger") oneLedger: boolean;

  loading: boolean;

  constructor(private apiService?: ApiService) { }

  ngOnInit(): void {
    let current = new Date();
    if(current.getMonth() <=3 ){
      this.fromDate = new Date(current.getFullYear()-1,3,1);
    }else{
      this.fromDate = new Date(current.getFullYear(),3,1);
    }
    this.toDate = current;
  }

  public apply(value){
    this.loading = true;
    console.log(this.ledger);
    if(this.oneLedger){
      this.ledgerSummaryList = [];
    }
    this.apiService.getLedgerSummary(value, this.fromDate, this.toDate).subscribe(
      res => {
        res = res.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        this.ledgerSummaryList.push({item: value, data: res, fromDate: this.fromDate, toDate: this.toDate});
        this.loading = false;
      },
      err => {
        console.log(err);
        this.loading = false;
      }
    );
  }




}
