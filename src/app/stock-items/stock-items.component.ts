import { Component, OnInit} from '@angular/core';
import { ApiService } from '../shared/api.service';
import { NavItem } from '../side-navigation-bar/side-navigation-bar.component';
import { Observable, from } from 'rxjs';
import { ProductGroup, Package, PackageRateItem, ProductGroupFields, StockItem} from '../Model/stock-item';
import {NgxImageCompressService} from 'ngx-image-compress';
import { Papa } from 'ngx-papaparse';
import { DatabaseService } from '../shared/database.service';
import { AppComponent } from '../app.component';


@Component({
  selector: 'app-stock-items',
  templateUrl: './stock-items.component.html',
  styleUrls: ['./stock-items.component.css']
})




export class StockItemsComponent implements OnInit {

  items : NavItem[]= [
    {title:"Products", icon:"list", link: 'product-list'},
    {title:"Expired Batches", icon:"list", link: 'expired-batches'},
    {title:"Tax Details", icon:"list", link: 'tax-details'}

  ];
  chemicalGroup: any = {};
  chemicalGroups$ : Observable<any>;
  tallyProducts : StockItem[];
  productGroups$ : Observable<any>;
  productImageUrl: any;
  productGroup: ProductGroup;
  company$: Observable<any>;
  category$: Observable<any>;
  databaseService: DatabaseService
  constructor(private apiService?: ApiService, 
    private imageCompress?: NgxImageCompressService, private papa?:Papa) {
      this.databaseService = AppComponent.databaseService;
  }

  async ngOnInit() {
    this.productGroup = new ProductGroup();
    this.getChemicalGroups();
    this.getTallyProducts();
    this.company$ = this.apiService.getFieldNames("COMPANY");
    this.category$ = this.apiService.getFieldNames("CATEGORY");
    this.databaseService.openDatabase().then(
      async (res) =>     {
        this.tallyProducts = await this.databaseService.getAllStockItemsForBilling();
      }

    )
    
  }

  getChemicalGroups(){
    this.chemicalGroups$ = this.apiService.getAllChemicalGroup();
  }

  getTallyProducts(){
    
  }

  deleteChemicalGroup(name: string){
    this.apiService.deleteChemcialGroup(name).subscribe(
      res =>{
        alert("deletion successful!");
      },
      err =>{
        console.log(err);
      }
    )
  }

  saveChemicalGroup(){
    this.apiService.saveChemicalGroup(this.chemicalGroup).subscribe(
      res =>{
        alert("Saved")
        this.chemicalGroup = {};
      },
      err => {
        console.log(err);
      }

    )
  }

   async onSelectFile() { // called each time file input changes
    
    await this.imageCompress.uploadFile().then(async ({image, orientation}) => {
    
   
      console.warn('Size in bytes was:', this.imageCompress.byteCount(image));
     
      this.productGroup.image = image;
      while(this.imageCompress.byteCount(this.productGroup.image) > 50000){
        await this.imageCompress.compressFile(this.productGroup.image, orientation, 50, 50).then(
          async result => {
            this.productGroup.image = result;
            console.warn('Size in bytes is now:', this.imageCompress.byteCount(result));
          }
        );
      }
       
      
      console.warn('Size in bytes is finally:', this.imageCompress.byteCount(this.productGroup.image));
      
      
    });
    
  
  }

  addChemicalGroup(event){
    var found: boolean = false;
    for (let c of this.productGroup.technicalSet){
      if(c == event.value){
        found = true;
      }
    }
    if (!found){
      this.productGroup.technicalSet.push(event.value)
    }
  }

  addPackaging(event, input){
    var found: boolean = false;
    for (let c of this.productGroup.packaging){
      if(c.key == input){
        found = true;
      }
    }
    if (!found){
      this.productGroup.packaging.push(new Package(input, event.value))
    }
  }

  saveProductGroup(){
    this.apiService.saveProductGroup(this.productGroup).subscribe(
      res => {
        alert("saved");
        this.productGroup = new ProductGroup();
      },
      err =>{
        console.log(err);
      }
    )
  }

  getProductGroups(){
    this.productGroups$ = this.apiService.getAllProductGroupId();
  }

  getProductGroup(id){
    this.apiService.getProductGroup(id).subscribe(
      res =>{
        this.productGroup = res;
      },
      err =>{
        console.log(err);
      }
    )
  }

  deleteProductGroup(str: string){
    this.apiService.deleteProductGroup(str).subscribe(
      res =>{
        alert(res);
        this.productGroup = new ProductGroup()
      },
      err =>{
        console.log(err);
      }
    )
  }

//_____________________________________________________________________________


  godowns: any[];
  priceLists:any[];
  pricemap: Map<String, String>= new Map()
  results: any[];
  fields: string[];

  

  getPriceData(){
    this.godowns = this.databaseService.getUser().godownList;
    this.priceLists = this.databaseService.getUser().salesVoucherSettings.priceLists
  }

  updatePrice(){
    
    this.apiService.getAllProductGroup().subscribe(
      (groups: ProductGroup[]) => {
        groups.forEach((group:ProductGroup) => {
          group.packaging.forEach((pack:Package) => {
            this.databaseService.getStockItem(pack.item).then((product) => {
              var stockItem: StockItem = Object.assign(new StockItem(), product);
              var list :PackageRateItem[] = []
              this.pricemap.forEach((pricelist: string, godown: string) => {
                var rate: number = stockItem.getRate(pricelist);
                list.push(new PackageRateItem(godown, rate, stockItem.getRateInclusiveOfTax(rate, "")));
              })
              this.apiService.updatePriceForProductGroup(pack.item, list).subscribe(
                res => console.log(res),
                err => console.log(err)
              );
              
            })
          });
          
          })
        })
  }
    

  

 


  getRate(priceList: string, stockItem:any): number{
    if (stockItem["FULLPRICELIST.LIST"]){
      if (stockItem["FULLPRICELIST.LIST"] instanceof Array){
        for (let item of  stockItem["FULLPRICELIST.LIST"]){
          if (item && item.PRICELEVEL && item["PRICELEVELLIST.LIST"] && item["PRICELEVELLIST.LIST"].RATE && item.PRICELEVEL.content == priceList){
            return this.getNumbers(item["PRICELEVELLIST.LIST"].RATE.content)
          }
        }
      } else {
        if (stockItem["FULLPRICELIST.LIST"].PRICELEVEL && stockItem["FULLPRICELIST.LIST"]["PRICELEVELLIST.LIST"].RATE && stockItem["FULLPRICELIST.LIST"].PRICELEVEL.content == priceList){
          return this.getNumbers(stockItem["FULLPRICELIST.LIST"]["PRICELEVELLIST.LIST"].RATE.content)
        }
      }
    }
    
    return 0;
  }

  getAmount(priceList: string, stockItem:any): number{
    const rate = this.getRate(priceList, stockItem);
    var amount: number = rate*1;
    if(!stockItem["GSTDETAILS.LIST"]){
      return 0;
    }
    if(!stockItem["GSTDETAILS.LIST"]["STATEWISEDETAILS.LIST"]){
      return 0;
    }
    
    if(!stockItem["GSTDETAILS.LIST"]["STATEWISEDETAILS.LIST"]["RATEDETAILS.LIST"]){
      return 0;
    }
    if(stockItem["GSTDETAILS.LIST"]["STATEWISEDETAILS.LIST"]["RATEDETAILS.LIST"] instanceof Array){
      for(let item of stockItem["GSTDETAILS.LIST"]["STATEWISEDETAILS.LIST"]["RATEDETAILS.LIST"]){
        if((item["GSTRATEDUTYHEAD"] && item.GSTRATE) 
        && (item["GSTRATEDUTYHEAD"].content == "Central Tax" 
        || item["GSTRATEDUTYHEAD"].content == "State Tax")){
          amount = amount + Math.round(rate*item.GSTRATE.content*100)/10000 
        }
      }
      console.log(amount);
      return Math.floor(amount*100)/100;
    } else {
      return 0;
    }
    
    return 0;
  }

  getNumbers(temp: string): number{
    var returnNumber;
    returnNumber = temp.replace(/\//g, "");
    returnNumber = returnNumber.replace(/[^\d.-]/g, "");
    return returnNumber;
  }

  public changeListener(files: FileList){
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
         }
         
      }
  }

  async uploadCsvFile(){
    console.log(this.results);
    for (let item of this.results){
      if(item[0] != null && item[0] != "" ){
      this.productGroup.name = item[0];
      this.productGroup.companyName = item[1];
      this.productGroup.description = item[2];
      this.productGroup.priorityLevel = item[3];
      this.saveProductGroup();
      }
      
    }
  }

  groupField: ProductGroupFields = new ProductGroupFields();
  saveGroupField(){
    if (this.groupField.id && this.groupField.fieldType && this.groupField.image){
      this.apiService.saveField(this.groupField).subscribe(
        res => {
          alert("Saved Succesfully");
          this.groupField = new ProductGroupFields();
        },
        err => {
          alert("Could not save at this time please try again later.")
          console.log(err);
        }
      );

    }
    
  }

  async selectGroupFieldImage(){

    await this.imageCompress.uploadFile().then(async ({image, orientation}) => {
    
   
      console.warn('Size in bytes was:', this.imageCompress.byteCount(image));
     
      this.groupField.image = image;
      while(this.imageCompress.byteCount(this.groupField.image) > 50000){
        await this.imageCompress.compressFile(this.groupField.image, orientation, 50, 50).then(
          async result => {
            this.groupField.image = result;
            console.warn('Size in bytes is now:', this.imageCompress.byteCount(result));
          }
        );
      }
      console.warn('Size in bytes is finally:', this.imageCompress.byteCount(this.groupField.image));
    });
    

  }



}

