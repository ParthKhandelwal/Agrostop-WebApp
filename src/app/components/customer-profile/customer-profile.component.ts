import { Component, OnInit, ViewChild } from '@angular/core';
import { Customer } from '../../model/Customer/customer';
import { ApiService } from '../../services/API/api.service';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { CustomerTableComponent } from '../AgroComponents/customer-table/customer-table.component';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-customer-profile',
  templateUrl: './customer-profile.component.html',
  styleUrls: ['./customer-profile.component.css']
})
export class CustomerProfileComponent implements OnInit {
  customers: Customer[]= [];
  loading:boolean
  campaignCustomers: Customer[] = [];

  @ViewChild("customerTable") customerTable: CustomerTableComponent;
  @ViewChild("campaignTable") campaignTable: CustomerTableComponent;
  constructor(private apiService?: ApiService, private db?: NgxIndexedDBService) { }

  async ngOnInit(): Promise<void> {
    this.loading = true;
    this.customers = await this.db.getAll("customers");
    this.loading = false;
    setTimeout(() => {
      this.customerTable.setCustomers(this.customers);
    }, 300);

    this.apiService.getAllCampaigns().subscribe(
      res => {
        this.campaigns = res;
        this.filteredOptions = this.campaignControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filter(value))
        );
      },
      err => {
        console.log(err);
        alert("Could not get campaigns");
      }
    )
  }


  public changeListener(files: FileList){
    console.log(files);
    if(files && files.length > 0) {
       let file : File = files.item(0); 
         console.log(file.name);
         console.log(file.size);
         console.log(file.type);
         let reader: FileReader = new FileReader();
         reader.readAsText(file);
         reader.onload = (e) => {
            let csv: string = reader.result as string;
            console.log(csv);
         }
      }
  }

  addCustomersToCampaign(customers){
    this.campaignCustomers = this.campaignCustomers.concat(customers);
    this.campaignTable.setCustomers(this.campaignCustomers);
  }



  campaignControl = new FormControl();
  campaigns: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<string[]>;




  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.campaigns.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }

  submit(){
    this.loading = true;
    this.apiService.addCampaignItems(
      this.campaignControl.value, 
      this.campaignCustomers.map(res =>res.customerId)
      ).subscribe(
        res => {
          this.loading = false;
        },
        err =>{
          this.loading = false;
        }
      );
  }
}
