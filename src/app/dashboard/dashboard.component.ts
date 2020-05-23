import { Component, OnInit } from '@angular/core';
import { VOUCHER } from '../Model/voucher';
import { ApiService } from '../shared/api.service';
import { Customer } from '../Model/customer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  voucher: VOUCHER
  increasePercent: number;
  updateTime: Date;

  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true
  };
 
  public barChartLegend = true;
 

  public salesSummary$: Observable<any>;
  
  public chartType: string = 'line';

  public chartDatasets: Array<any> = [
    { data: [], label: 'This Year' },
    { data: [], label: 'Previous Year' }
  ];

  public chartLabels: Array<any> = [];





  constructor(private apiService?: ApiService) { }

  ngOnInit() {
    
    // this.salesSummary$ = this.apiService.getSevenDaySummary();
    // this.salesSummary$.subscribe(
    //   res => {
    //     console.log(res);
    //     this.chartDatasets[0].data = res.THISYEAR.map((d) => d.CREDITAMOUNT * (1))
    //     this.chartDatasets[0].label = "This Year"
    //     this.chartDatasets[1].data = res.PREVYEAR.map((d) => d.CREDITAMOUNT * (1))
    //     this.chartDatasets[1].label = "Previous Year"
    //     this.chartLabels = res.THISYEAR.map((d) => d.REFDAY)
    //     if (this.chartDatasets[0].data[6] == 0){
    //       this.increasePercent = 0;
          
    //     }else {
    //       this.increasePercent = Math.round((this.chartDatasets[0].data[7] - this.chartDatasets[0].data[6])*100 / this.chartDatasets[0].data[6])
    //     }
    //     this.updateTime = new Date()
    //     console.log(this.chartDatasets)
    //   }
    // );
    
    
    
  }

}
