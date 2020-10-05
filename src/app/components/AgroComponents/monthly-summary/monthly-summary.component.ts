import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label, Color, BaseChartDirective } from 'ng2-charts';
import * as _ from "lodash";
import { DatePipe } from '@angular/common';
import { ApiService } from '../../../services/API/api.service';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { VoucherSummaryComponent } from '../voucher-summary/voucher-summary.component';
import { VOUCHER } from '../../../model/Voucher/voucher';


@Component({
  selector: 'app-monthly-summary',
  templateUrl: './monthly-summary.component.html',
  styleUrls: ['./monthly-summary.component.css']
})
export class MonthlySummaryComponent implements OnInit {
  @Input("type") type: String
  @Input("data") itemSummaryList: any[];
  indata: any[] = [];
  displayedColumns: string[] = ['month', 'inward', 'outward'];
  monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
  ];

  constructor(private datePipe?: DatePipe, private apiService?: ApiService, private dialog?: MatDialog) { }

  ngOnInit(): void {
    this.filterTypes = this.getFilterTypes();
    this.applyFilter("", "")
  }

  totalInward(){
    let total = 0;
    this.indata.forEach((v) => {
      total += v.inward;
    })
    return total;
  }

  totalOutward(){
    let total = 0;
    this.indata.forEach((v) => {
      total += v.outward;
    })
    return total;
  }


  rowClick(value){
    switch (value.category) {
      case "Month":
        this.setData(this.groupByDate(value.value));
        break;
      case "Date":
        this.setData(this.groupByVoucherNumber(value.value));
        break;
      case "Voucher Number":
        if(value && value.value && value.value[0]&& value.value[0].id){
          this.showVoucher(value.value[0].id);
        }else{
          alert("The current voucher cannot be processed. Please try again.")
        }
        break;
      default:
        this.setData(this.groupByMonths(this.itemSummaryList));
        break;
    }
  }

  showVoucher(id){
    this.apiService.getVoucher(id).subscribe(
      res => {
        const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = true;
      this.dialog.open(VoucherSummaryComponent, {data: Object.assign(new VOUCHER(),res), maxHeight: '90vh'});
      }
    )
  }

  getAmount(element: any){
    switch (this.type) {
      case "ledger":
        return +element.amount;
      case "product":
        return +element.qty;

      default:
        break;
    }
  }

  groupByDate(res: any[]){
    return _(res)
                                .groupBy(x => this.datePipe.transform(new Date(x.date), "MMM dd, yyyy"))
                                .map((value, key) => {
                                  let outward  = 0;
                                  let inward = 0;
                                  value.forEach(element => {
                                    if(element.isdeemedpositive == "Yes"){
                                      inward += this.getAmount(element) || 0
                                    }else{
                                      outward += this.getAmount(element) || 0;
                                    }
                                  });
                                  return  {type: key, value: value, inward: inward, outward: outward, category: "Date"}
                                })
                                .value();
  }

  groupByVoucherNumber(res: any[]){
    return _(res)
                                .groupBy(x => x.vouchernumber)
                                .map((value, key) => {
                                  let outward  = 0;
                                  let inward = 0;
                                  value.forEach(element => {
                                    if(element.isdeemedpositive == "Yes"){
                                      inward += this.getAmount(element) || 0;
                                    }else{
                                      outward += this.getAmount(element) || 0;
                                    }
                                  });
                                  return  {type: key, value: value, inward: inward, outward: outward, category: "Voucher Number"}
                                })
                                .value();
  }

  groupByMonths(res: any[]): any[]{
    return _(res)
                                .groupBy(x => new Date(x.date).getMonth())
                                .map((value, key) => {
                                  let outward  = 0;
                                  let inward = 0;
                                  value.forEach(element => {
                                    if(element.isdeemedpositive == "Yes"){
                                      inward += this.getAmount(element) || 0;
                                    }else{
                                      outward += this.getAmount(element) || 0;
                                    }
                                  });
                                  return  {type: this.monthNames[key], value: value, inward: inward, outward: outward, category: "Month"}
                                })
                                .value();
  }


  setData(data){
    this.indata = data;
    this.setChart();
  }





  //Chart Data

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

  @ViewChild("chart") chart: BaseChartDirective;


  setChart(){
    this.barChartLabels = this.indata.map((v) => v.type);
    this.barChartData = [
    {
      data: this.indata.map((v) => v.inward),
      label: "Inward"
    },
    {
      data: this.indata.map((v) => v.outward),
      label: "Outward"
    },
  ];
    //this.chart.chart.update();
    console.log(this.barChartData);
  }

  filterTypes: string[];
  getFilterTypes(): string[]{
    switch (this.type) {
      case "ledger":
        return ["Voucher Type"]
      case "product":
        return ["Voucher Type", "Godown", "ledger"]


      default:
        break;
    }
  }

  //Filter Data

  filterValues: string[] = [];

  getFilterValues(value){
    switch (value) {
      case "Voucher Type":
        this.filterValues = [...new Set(this.itemSummaryList.map((v) => v.vouchertypename))]
        break;
      case "Godown":
        this.filterValues = [...new Set(this.itemSummaryList.map((v) => v.godown))]
        break;

      case "Ledger":
        this.filterValues = [...new Set(this.itemSummaryList.map((v) => v.ledger))]
        break;

      default:
        break;
    }
  }

  applyFilter(value, category){
    switch (category) {
      case "Voucher Type":
        this.setData(  this.groupByMonths(this.itemSummaryList.filter((v) => v.vouchertypename === value)));
        break;
      case "Godown":
        this.setData(this.groupByMonths(this.itemSummaryList.filter((v) => v.godown === value)));
        break;

      case "Ledger":
        this.setData(this.groupByMonths(this.itemSummaryList.filter((v) => v.ledger === value)));
        break;
      default:
        this.setData(this.groupByMonths(this.itemSummaryList));
        break;
    }
  }


}
