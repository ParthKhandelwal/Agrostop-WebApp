import { Component, OnInit, Input } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label, Color } from 'ng2-charts';
import { VOUCHER } from '../../../model/Voucher/voucher';

@Component({
  selector: 'voucher-stats',
  templateUrl: './voucher-stats.component.html',
  styleUrls: ['./voucher-stats.component.css']
})
export class VoucherStatsComponent implements OnInit {

  @Input("vouchers") vouchers: VOUCHER[];

  barChartOptions: ChartOptions = {
    responsive: true,
  };
  barChartLabels: Label[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartPlugins = [];
  barChartColors: Color[] = [
    {
      borderColor: 'black',
      backgroundColor: 'rgb(197,234,0)',
    },
  ];



  barChartData: ChartDataSets[] = [
    { data: [0,0,0,0,0,0,0,0,0,0,0,0], label: 'This Year' }
  ];


  totalSale:number = 0;
  saleThisYear: number = 0;
  totalMonthlySale: number = 0;
  totalWeeklySale: number = 0;

  constructor() { }

  ngOnInit(): void {
  }

  calculateStats(vouchers: VOUCHER[]){
    this.vouchers = vouchers;
    this.totalSale = 0;
    this.saleThisYear = 0;
    this.totalMonthlySale = 0;
    this.totalWeeklySale = 0;
    let today:Date = new Date();
    let start: Date;
    this.barChartData = [
      { data: [0,0,0,0,0,0,0,0,0,0,0,0], label: 'This Year' }
    ];
    if(today.getMonth() < 3){
      start = new Date("1-APR-"+(today.getFullYear()-1));
      console.log(start);
    }else {
      start = new Date("1-APR-"+today.getFullYear());
    }
    for(let voucher of this.vouchers){
      let voucherTotal: number = this.getVoucherTotal(voucher.LEDGERENTRIES_LIST);
      this.totalSale = this.totalSale + voucherTotal;
      let voucherDate: Date = new Date(voucher.DATE);
      if(voucherDate >= start){
        this.saleThisYear = this.saleThisYear + voucherTotal;
        this.barChartData[0].data[voucherDate.getMonth()] = (+this.barChartData[0].data[voucherDate.getMonth()]) + voucherTotal; 
      }
      if(today.getTime() - voucherDate.getTime() <= (7*24*60*60*1000)){
        this.totalWeeklySale = this.totalWeeklySale + voucherTotal;
      }
      if(today.getTime() - new Date(voucher.DATE).getTime() <= (30*24*60*60*1000)){
        this.totalMonthlySale = this.totalMonthlySale + voucherTotal;
      }
      
    }
    console.log(this.barChartData);
  }

  getVoucherTotal(list){
    var total: number = 0;
      for (let item of list){
        total = total + (item.POSPAYMENTTYPE && item.AMOUNT ? (item.AMOUNT) : 0);
      }
      return total*(-1);
  }


}
