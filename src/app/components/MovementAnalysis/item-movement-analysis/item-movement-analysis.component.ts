import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../../services/API/api.service';
import * as _ from "lodash";
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MatTableDataSource } from '@angular/material/table';
import { MonthlySummaryComponent } from '../../AgroComponents/monthly-summary/monthly-summary.component';
import { Observable, Subscription } from 'rxjs';
import { FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { AutoCompleteComponent } from '../../AgroComponents/auto-complete/auto-complete.component';

@Component({
  selector: 'item-movement-analysis',
  templateUrl: './item-movement-analysis.component.html',
  styleUrls: ['./item-movement-analysis.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ItemMovementAnalysisComponent implements OnInit {
  fromDate: Date = new Date();
  toDate: Date = new Date();
  itemSummaryList: any[] = [];
  @Input("type") type: string;
  @ViewChild("productAutoComp") productAutoComp: AutoCompleteComponent;
  control = new FormControl();
  options: string[];
  filteredOptions: Observable<string[]>;

  subscription: Subscription
  summarySub: Subscription
  name: string;
  loading:boolean = false;

  constructor(private apiService?: ApiService) { }

  ngOnInit(): void {
    switch (this.type) {
      case "productGroup":
        this.subscription = this.apiService.getAllProductGroupId().subscribe(
          res => {
            this.options = res.map((r) => r.name);
            this.filteredOptions = this.control.valueChanges.pipe(
              startWith(''),
              map(value => this._filter(value))
            );
          }
        )
        break;
      case "chemicalGroup":
        this.subscription = this.apiService.getAllChemicalGroup().subscribe(
          res => {
            this.options = res.map((c) => c.name);
            this.filteredOptions = this.control.valueChanges.pipe(
              startWith(''),
              map(value => this._filter(value))
            );
          }
        )
        break;

      default:
        break;
    }
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }

  public apply(){
      this.loading = true;
      switch (this.type) {
        case "productGroup":
          this.subscription = this.apiService.getProductGroupSummary(this.control.value, this.fromDate, this.toDate).subscribe(
            resList => {
              this.itemSummaryList = [];
              resList.forEach((res) => {
                this.handleSummaries(res);
              })
              this.loading = false

            },
            err=>{
              console.log(err);
              this.loading = false;
            }
          )
          break;
        case "chemicalGroup":
          this.subscription = this.apiService.getChemicalGroupSummary(this.control.value, this.fromDate, this.toDate).subscribe(
            resList => {
              this.itemSummaryList = [];
              resList.forEach((res) => {
                this.handleSummaries(res);
              })
              this.loading = false;
            },
            err => {
              console.log(err);
              this.loading = false;
            }
          )
          break;

        case "product":
          this.summarySub =  this.apiService.getItemSummary(this.productAutoComp.productControl.value.NAME, this.fromDate, this.toDate).subscribe(
            res => {
              this.handleSummaries(res);
              this.loading = false;
            },
            err => {
              this.loading = false;
            }
          );
          break;
        default:
          break;
      }




  }

  handleSummaries(res: any[]){
    if(res && res.length >0 ){
      res = res.map((v) => {
        v.ledger = v.ledgers.filter((l) => l.isdeemedpositive == "Yes")[0].ledgername;
        return v;
      }).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime())

      this.itemSummaryList.push({item: res[0].item, data: res, fromDate: this.fromDate, toDate: this.toDate});

    }

  }





  ngOnDestroy(){
    if(this.summarySub){
      this.summarySub.unsubscribe();
    }
    if(this.subscription){
      this.subscription.unsubscribe();
    }
  }


}
