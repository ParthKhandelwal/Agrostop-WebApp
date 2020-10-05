import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './components/login/login.component';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {MatButtonModule} from '@angular/material/button';
import { DayBookComponent } from './components/day-book/day-book.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatMenuModule} from '@angular/material/menu';
import {MatStepperModule} from '@angular/material/stepper';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatTabsModule} from '@angular/material/tabs';
import {MatCardModule} from '@angular/material/card';
import { AutoCompleteComponent } from './components/AgroComponents/auto-complete/auto-complete.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatDialogModule} from '@angular/material/dialog';
import { ReactiveFormsModule} from '@angular/forms';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import {MatExpansionModule} from '@angular/material/expansion';
import { InvoicePrintViewComponent } from './components/invoice-print-view/invoice-print-view.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

import {MatPaginatorModule} from '@angular/material/paginator';

import { CommonModule, DatePipe } from '@angular/common';
import { NgxIndexedDBModule, DBConfig } from 'ngx-indexed-db';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatSortModule} from '@angular/material/sort';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {MatTableModule} from '@angular/material/table';
import { CustomerSummaryComponent } from './components/customer-summary/customer-summary.component';
import { TallyConsoleComponent } from './components/tally-console/tally-console.component';
import { VoucherTableComponent } from './components/AgroComponents/voucher-table/voucher-table.component';
import { VoucherSummaryComponent } from './components/AgroComponents/voucher-summary/voucher-summary.component';
import { CustomerEntryComponent } from './components/AgroEntryComponents/customer-entry-components/customer-entry.component';
import { VoucherStatsComponent } from './components/AgroComponents/voucher-stats/voucher-stats.component';
import { InventoryBreakdownComponent } from './components/AgroComponents/inventory-breakdown/inventory-breakdown.component';
import { AddressSummaryComponent } from './components/address-summary/address-summary.component';
import { InventoryDetailComponent } from './components/inventory-detail/inventory-detail.component';
import { StockTransferTableComponent } from './components/AgroComponents/stock-transfer-table/stock-transfer-table.component';
import { CustomerTableComponent } from './components/AgroComponents/customer-table/customer-table.component';
import { VoucherFilterComponent } from './components/AgroComponents/voucher-filter/voucher-filter.component';



import {MatChipsModule} from '@angular/material/chips';

import {MatSidenavModule} from '@angular/material/sidenav';
import { InventoryInfoComponent } from './components/AgroEntryComponents/inventory-info/inventory-info.component';
import { AdminToolkitComponent } from './components/AgroComponents/admin-toolkit/admin-toolkit.component';
import { ProductProfileComponent } from './components/product-profile/product-profile.component';
import { ChemicalGroupEntryComponent } from './components/AgroEntryComponents/chemical-group-entry/chemical-group-entry.component';
import { ProductGroupTableComponent } from './components/AgroComponents/product-group-table/product-group-table.component';
import { ProductGroupEntryComponentsComponent } from './components/AgroEntryComponents/product-group-entry-components/product-group-entry-components.component';
import { ProductProfileTableComponent } from './components/AgroComponents/product-profile-table/product-profile-table.component';
import { ProductProfileEntryComponentComponent } from './components/AgroEntryComponents/product-profile-entry-component/product-profile-entry-component.component';
import { UserTableComponent } from './components/AgroComponents/user-table/user-table.component';
import { ChemicalGroupTableComponent } from './components/AgroComponents/chemical-group-table/chemical-group-table.component';
import { UserEntryComponentComponent } from './components/AgroEntryComponents/user-entry-component/user-entry-component.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { SettingsComponent } from './components/settings/settings.component';
import { PrintConfigurationEntryComponent } from './components/AgroEntryComponents/print-configuration-entry/print-configuration-entry.component';
import { PrintConfigurationTableComponent } from './components/AgroComponents/print-configuration-table/print-configuration-table.component';
import { StockSummaryComponent } from './components/stock-summary/stock-summary.component';
import { BatchTableComponent } from './components/AgroComponents/batch-table/batch-table.component';
import { ParticularTableComponent } from './components/Voucher/particular-table/particular-table.component';
import { InventoryTableComponent } from './components/Voucher/inventory-table/inventory-table.component';
import { BankAllocationComponent } from './components/Voucher/bank-allocation/bank-allocation.component';
import { BillAllocationComponent } from './components/Voucher/bill-allocation/bill-allocation.component';

import { AgroVoucherWizardComponent } from './components/Voucher/agro-voucher-wizard/agro-voucher-wizard.component';
import { VoucherSettingsComponent } from './components/Voucher/voucher-settings/voucher-settings.component';
import { CollectionComponent } from './components/Voucher/collection/collection.component';
import { StockCheckComponent } from './components/stock-check/stock-check.component';
import { CustomerProfileComponent } from './components/customer-profile/customer-profile.component';
import { StockCheckPrintViewComponent } from './components/PrintComponents/stock-check-print-view/stock-check-print-view.component';
import { MatTableExporterModule } from 'mat-table-exporter';
import { AddressProfileComponent } from './components/address-profile/address-profile.component';
import { CropEntryComponent } from './components/AgroEntryComponents/crop-entry/crop-entry.component';
import { CropPatternEntryComponent } from './components/AgroEntryComponents/crop-pattern-entry/crop-pattern-entry.component';
import { CropProfileComponent } from './components/crop-profile/crop-profile.component';
import { CropProfileTableComponent } from './components/AgroComponents/crop-profile-table/crop-profile-table.component';
import { ItemMovementAnalysisComponent } from './components/MovementAnalysis/item-movement-analysis/item-movement-analysis.component';
import { MovementAnalysisComponent } from './components/MovementAnalysis/movement-analysis/movement-analysis.component';
import { MonthlySummaryComponent } from './components/AgroComponents/monthly-summary/monthly-summary.component';
import { LedgerMovementAnalysisComponent } from './components/MovementAnalysis/ledger-movement-analysis/ledger-movement-analysis.component';
import { BatchAllocationComponent } from './components/Voucher/batch-allocation/batch-allocation.component';
import { AccountingAllocationComponent } from './components/Voucher/accounting-allocation/accounting-allocation.component';
import { VoucherDetailComponent } from './components/Voucher/voucher-detail/voucher-detail.component';
import { BatchTransferComponent } from './components/AgroComponents/batch-transfer/batch-transfer.component';
import { HomeComponent } from './components/AgroComponents/home/home.component';
import { LayoutModule } from '@angular/cdk/layout';
import { NavigationComponent } from './components/AgroComponents/navigation/navigation.component';
import { RouterModule } from '@angular/router';
import {MatRadioModule} from '@angular/material/radio';
import { NotificationComponent } from './components/AgroComponents/notification/notification.component';
import { CropPatternSummaryComponent } from './components/AgroComponents/crop-pattern-summary/crop-pattern-summary.component';
import { CouponEntryComponent } from './components/Voucher/coupon-entry/coupon-entry.component';
import { ConnectComponent } from './components/connect/connect.component';
import { ApiService } from './services/API/api.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AgroInterceptor } from './services/Interceptor/agro-interceptor';
import { ChartsModule } from 'ng2-charts';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatBadgeModule} from '@angular/material/badge';
import {NgxPrintModule} from 'ngx-print';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';


const dbConfig: DBConfig  = {
  name: 'Agrostop',
  version: 1,
  objectStoresMeta: [{
    store: 'Voucher Types',
    storeConfig: { keyPath: 'NAME', autoIncrement: false },
    storeSchema: [
    ]
  },
  {
    store: 'cacheVoucher',
    storeConfig: { keyPath: '_REMOTEID', autoIncrement: false },
    storeSchema: [
    ]
  },
  {
    store: 'items',
    storeConfig: { keyPath: 'NAME', autoIncrement: false },
    storeSchema: [
    ]
  },
  {
    store: 'customers',
    storeConfig: { keyPath: 'id', autoIncrement: false },
    storeSchema: [
    ]
  },
  {
    store: 'Ledgers',
    storeConfig: { keyPath: 'NAME', autoIncrement: false },
    storeSchema: [
    ]
  },
  {
    store: 'Addresses',
    storeConfig: { keyPath: '_id', autoIncrement: false },
    storeSchema: [
    ]
  },
  {
    store: 'Batches',
    storeConfig: { keyPath: 'BATCHID', autoIncrement: false },
    storeSchema: [
      { name: 'productId', keypath: 'productId', options: { unique: false } },
    ]
  },
  {
    store: 'cacheCustomers',
    storeConfig: { keyPath: 'id', autoIncrement: false },
    storeSchema: [
    ]
  },
  {
    store: 'PrintConfiguration',
    storeConfig: { keyPath: 'voucherType', autoIncrement: false },
    storeSchema: [
    ]
  }

]
};


@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    LoginComponent,
    DayBookComponent,
    DashboardComponent,
    AutoCompleteComponent,
    InvoicePrintViewComponent,
    NavigationComponent,
    CustomerSummaryComponent, TallyConsoleComponent, VoucherTableComponent, VoucherSummaryComponent, CustomerEntryComponent, VoucherStatsComponent, InventoryBreakdownComponent, AddressSummaryComponent, InventoryDetailComponent, StockTransferTableComponent, CustomerTableComponent, VoucherFilterComponent, InventoryInfoComponent, AdminToolkitComponent, ProductProfileComponent, ChemicalGroupEntryComponent, ProductGroupTableComponent, ProductGroupEntryComponentsComponent, ProductProfileTableComponent, ProductProfileEntryComponentComponent, UserTableComponent, ChemicalGroupTableComponent, UserEntryComponentComponent, UserProfileComponent, SettingsComponent, PrintConfigurationEntryComponent, PrintConfigurationTableComponent, StockSummaryComponent, BatchTableComponent, ParticularTableComponent, InventoryTableComponent, BankAllocationComponent, BillAllocationComponent,AgroVoucherWizardComponent, VoucherSettingsComponent, CollectionComponent, StockCheckComponent, CustomerProfileComponent, StockCheckPrintViewComponent, AddressProfileComponent, CropEntryComponent, CropPatternEntryComponent, CropProfileComponent, CropProfileTableComponent, ItemMovementAnalysisComponent, MovementAnalysisComponent, MonthlySummaryComponent, LedgerMovementAnalysisComponent, BatchAllocationComponent, AccountingAllocationComponent, VoucherDetailComponent, BatchTransferComponent, HomeComponent, NotificationComponent, CropPatternSummaryComponent, CouponEntryComponent, ConnectComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    NgxPrintModule,
    BrowserAnimationsModule,
    MatTableExporterModule,
    MatGridListModule,
    MatBadgeModule,
    MatInputModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    MatRadioModule,
    MatToolbarModule,
    MatTooltipModule,
    MatMenuModule,
    MatStepperModule,
    MatTabsModule,
    MatSnackBarModule,
    MatCardModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatExpansionModule,
    MatSlideToggleModule,
    MatTableModule,
    MatBottomSheetModule,
    MatSortModule,
    MatProgressBarModule,
    MatSidenavModule,
    MatPaginatorModule,
    MatChipsModule,
    LayoutModule,
    ChartsModule,
    RouterModule,
    CommonModule,
    NgxIndexedDBModule.forRoot(dbConfig),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production, registrationStrategy: 'registerImmediately' })
  ],
  providers: [ApiService, DatePipe,{
    provide: HTTP_INTERCEPTORS,
    useClass: AgroInterceptor,
  multi: true
}, { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
  entryComponents: [InvoicePrintViewComponent, VoucherSummaryComponent, CustomerEntryComponent, VoucherFilterComponent],

  bootstrap: [AppComponent]
})
export class AppModule { }
