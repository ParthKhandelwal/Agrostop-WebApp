import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { Customer } from '../Model/customer';
import { ApiService } from '../shared/api.service';
import { CustomerTableComponent } from '../tables/customer-table/customer-table.component';
import { NavItem } from '../side-navigation-bar/side-navigation-bar.component';
import { Papa } from 'ngx-papaparse';
import { Address } from '../Model/address';


@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {
  items: NavItem[] = [
    {title: "Customers", link: 'customerListView', icon: 'list'},
    {title: "Addresses", link: 'addressListView', icon: 'list'}

  ]
  results: any[] = [];
  fields: any[] = [];
  customerResults: any[] = [];
  customerFields: any[] = [];

  constructor(private apiService?: ApiService, private papa?:Papa) {

  }

  ngOnInit() {

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
            var data = this.papa.parse(csv);
            this.fields = data.data[0];
            data.data.shift();
            this.results = data.data;
            console.log(this.fields);
            console.log(this.results);   
         }
         
      }
  }

  public upload(){
    for (let item of this.results){
      if(item[0] != null && item[0] != "" ){
        var address: Address = new Address();
      address._id = item[0];
      address.name = item[1];
      address.tehsilName = item[2];
      address.districtName = item[3];
      address.stateName = item[4];
      address.nearBranch = item[5];
      address.deliveryCharge = item[6];
      this.apiService.addAddress(address).subscribe(
        res => {
          item[item.length + 1] = true;
        },
        err => {
          item[item.length + 1] = false;
        }
      )
      }
      
    }
  }


  public customerChangeListener(files: FileList){
    console.log(files);
    if(files && files.length > 0) {
       let file : File = files.item(0); 
         let reader: FileReader = new FileReader();
         reader.readAsText(file);
         reader.onload = (e) => {
            let csv: string = reader.result as string;
            var data = this.papa.parse(csv);
            this.fields = data.data[0];
            data.data.shift();
            this.results = data.data;
            console.log(this.fields);
            console.log(this.results);   
         }
         
      }
  }


  uploadCustomer(){
    for (let item of this.customerResults){
      if(item[0] != null && item[0] != "" ){
        var address: Address = new Address();
      address._id = item[0];
      address.name = item[1];
      address.tehsilName = item[2];
      address.districtName = item[3];
      address.stateName = item[4];
      this.apiService.addAddress(address).subscribe(
        res => {
          item[item.length + 1] = true;
        },
        err => {
          item[item.length + 1] = false;
        }
      )
      }
      
    }
  }



}
