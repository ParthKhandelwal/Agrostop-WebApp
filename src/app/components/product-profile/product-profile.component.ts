import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/API/api.service';
import { ProductProfile } from '../../model/ProductProfile/product-profile';
import { ProductGroup } from '../../model/StockItem/stock-item';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-product-profile',
  templateUrl: './product-profile.component.html',
  styleUrls: ['./product-profile.component.css']
})
export class ProductProfileComponent implements OnInit {

  productGroups:any[] =[];
  productProfile: ProductProfile;
  productGroup: ProductGroup;



  constructor(private apiService?: ApiService, private dialog?: MatDialog) { }

  ngOnInit(): void {

  }


}
