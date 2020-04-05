import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {DashboardComponent} from './dashboard/dashboard.component'
import {LoginFormComponent} from './login-form/login-form.component'
import {NotFoundComponent} from './not-found/not-found.component';
import { NavigationBarComponent } from './navigation-bar/navigation-bar.component';
import { CustomersComponent } from './customers/customers.component';
import { OrdersComponent } from './orders/orders.component';
import { ComplaintsComponent } from './complaints/complaints.component';
import { UsersComponent } from './users/users.component';
import { CreateCustomerFormComponent } from './create-form/create-customer-form/create-customer-form.component';
import { CreateComplaintFormComponent } from './create-form/create-complaint-form/create-complaint-form.component';
import { CreateOrderFormComponent } from './create-form/create-order-form/create-order-form.component';
import { CreateUserFormComponent } from './create-form/create-user-form/create-user-form.component';
import { AgroInterceptor } from './Interceptor/agro-interceptor';
import { ApiService } from './shared/api.service';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { CustomerTableComponent } from './tables/customer-table/customer-table.component';
import { MatFormFieldModule, MatInputModule } from '@angular/material';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatDialogModule, MatDialogConfig,MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatSidenavModule} from '@angular/material/sidenav';
import { CustomerViewComponent } from './view/customer-view/customer-view.component';
import { ConfirmationBoxComponent } from './confirmation-box/confirmation-box.component';
import { VoucherTableComponent } from './tables/voucher-table/voucher-table.component';
import { SalesComponent } from './sales/sales.component';
import { CreateVoucherComponent } from './create-form/create-voucher/create-voucher.component';
import { OrderTableComponent } from './tables/order-table/order-table.component';
import { StockItemTableComponent } from './tables/stock-item-table/stock-item-table.component';
import { StockItemsComponent } from './stock-items/stock-items.component';
import { VoucherViewComponent } from './view/voucher-view/voucher-view.component';
import { ComplaintViewComponent } from './view/complaint-view/complaint-view.component';
import { StockItemViewComponent } from './view/stock-item-view/stock-item-view.component';
import { OrderViewComponent } from './view/order-view/order-view.component';
import { BatchTableComponent } from './tables/batch-table/batch-table.component';
import { ExpiredProductsComponent } from './Products/expired-products/expired-products.component';
import {MatSelectModule} from '@angular/material/select';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material';
import {MatCardModule} from '@angular/material/card';
import {MatListModule} from '@angular/material/list';
import {MatToolbarModule} from '@angular/material/toolbar';
import { CustomerListViewComponent } from './CustomerPackage/customer-list-view/customer-list-view.component';
import { AddressListViewComponent } from './CustomerPackage/address-list-view/address-list-view.component';
import { AddressTableComponent } from './tables/address-table/address-table.component';
import { CreateAddressFormComponent } from './create-form/create-address-form/create-address-form.component';
import { DayBookComponent } from './AccountingPackage/day-book/day-book.component';
import { CreateStockItemFormComponent } from './create-form/create-stock-item-form/create-stock-item-form.component';
import { CashTenderedComponent } from './VoucherPackage/cash-tendered/cash-tendered.component';
import { InvoicePrintViewComponent } from './PrintPackage/invoice-print-view/invoice-print-view.component';
import { StorageServiceModule } from 'ngx-webstorage-service';
import { AgroStorageService } from './shared/agro-storage.service';
import { SideNavigationBarComponent } from './side-navigation-bar/side-navigation-bar.component';
import { ProductListViewComponent } from './Products/product-list-view/product-list-view.component';
import { TaxDetailsTableComponent } from './tables/tax-details-table/tax-details-table.component';
import { CreateTaxDetailsFormComponent } from './create-form/create-tax-details-form/create-tax-details-form.component';
import { UserTableComponent } from './tables/user-table/user-table.component';
import { DatePipe } from '@angular/common';
import { PaymentOptionComponent } from './VoucherPackage/payment-option/payment-option.component';
import { CustomerSelectionComponent } from './VoucherPackage/customer-selection/customer-selection.component';
import { InventorySelectionComponent } from './VoucherPackage/inventory-selection/inventory-selection.component';
import { VoucherWizardComponent } from './VoucherPackage/voucher-wizard/voucher-wizard.component';
import { VoucherSettingComponent } from './VoucherPackage/voucher-setting/voucher-setting.component';
import {MatProgressBarModule} from '@angular/material/progress-bar';

import { ChartsModule } from 'ng2-charts';
import {NgxPrintModule} from 'ngx-print';
import { StockCheckComponent } from './Products/stock-check/stock-check.component';
import { PaymentVoucherWizardComponent } from './VoucherPackage/payment-voucher-wizard/payment-voucher-wizard.component';
import { ReceiptVoucherWizardComponent } from './VoucherPackage/receipt-voucher-wizard/receipt-voucher-wizard.component';
import { CashBookComponent } from './AccountingPackage/cash-book/cash-book.component';
import { QRCodeModule } from 'angularx-qrcode';
import { NgxBarcodeModule } from 'ngx-barcode';


@NgModule({
  declarations: [
    AppComponent,
    LoginFormComponent,
    DashboardComponent,
    NotFoundComponent,
    NavigationBarComponent,
    CustomersComponent,
    OrdersComponent,
    ComplaintsComponent,
    UsersComponent,
    CreateCustomerFormComponent,
    CreateComplaintFormComponent,
    CreateOrderFormComponent,
    CreateUserFormComponent,
    CustomerTableComponent,
    CustomerViewComponent,
    ConfirmationBoxComponent,
    VoucherTableComponent,
    SalesComponent,
    CreateVoucherComponent,
    OrderTableComponent,
    StockItemTableComponent,
    StockItemsComponent,
    VoucherViewComponent,
    ComplaintViewComponent,
    StockItemViewComponent,
    OrderViewComponent,
    BatchTableComponent,
    ExpiredProductsComponent,
    
    CustomerListViewComponent,
    AddressListViewComponent,
    AddressTableComponent,
    CreateAddressFormComponent,
    DayBookComponent,
    CreateStockItemFormComponent,
    CashTenderedComponent,
    InvoicePrintViewComponent,
    SideNavigationBarComponent,
    ProductListViewComponent,
    TaxDetailsTableComponent,
    CreateTaxDetailsFormComponent,
    UserTableComponent,
    PaymentOptionComponent,
    CustomerSelectionComponent,
    InventorySelectionComponent,
    VoucherWizardComponent,
    VoucherSettingComponent,
    StockCheckComponent,
    PaymentVoucherWizardComponent,
    ReceiptVoucherWizardComponent,
    CashBookComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSidenavModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardModule,
    MatListModule,
    MatToolbarModule,
    StorageServiceModule,
    ChartsModule,
    MatProgressBarModule,
    NgxPrintModule,
    QRCodeModule,
    NgxBarcodeModule

  ],
  providers: [CookieService, ApiService, DatePipe, MatDialog, AgroStorageService, MatDialogConfig, {
      provide: HTTP_INTERCEPTORS,
      useClass: AgroInterceptor,
    multi: true
  } 
    ],
  bootstrap: [AppComponent],
  entryComponents: [CreateCustomerFormComponent, CreateTaxDetailsFormComponent, InvoicePrintViewComponent, CashTenderedComponent, CreateStockItemFormComponent, CustomerTableComponent, ConfirmationBoxComponent, CreateAddressFormComponent,
    PaymentOptionComponent, CustomerViewComponent]
})
export class AppModule { }
