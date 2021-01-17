import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';

import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DayBookComponent } from './components/day-book/day-book.component';
import { CustomerSummaryComponent } from './components/customer-summary/customer-summary.component';
import { AddressSummaryComponent } from './components/address-summary/address-summary.component';
import { ProductProfileComponent } from './components/product-profile/product-profile.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { SettingsComponent } from './components/settings/settings.component';
import { StockSummaryComponent } from './components/stock-summary/stock-summary.component';
import { AgroVoucherWizardComponent } from './components/Voucher/agro-voucher-wizard/agro-voucher-wizard.component';
import { CustomerTableComponent } from './components/AgroComponents/customer-table/customer-table.component';
import { CustomerProfileComponent } from './components/customer-profile/customer-profile.component';
import { StockCheckPrintViewComponent } from './components/PrintComponents/stock-check-print-view/stock-check-print-view.component';
import { AddressProfileComponent } from './components/address-profile/address-profile.component';
import { CropProfileComponent } from './components/crop-profile/crop-profile.component';
import { MovementAnalysisComponent } from './components/MovementAnalysis/movement-analysis/movement-analysis.component';
import { HomeComponent } from './components/AgroComponents/home/home.component';
import { TallyConsoleComponent } from './components/tally-console/tally-console.component';
import { StockTransferComparisonComponent } from './components/stock-transfer-comparison/stock-transfer-comparison.component';


const routes: Routes = [

  {
    path: '',
    component: LoginComponent
  },
  {
    path: 'dashboard',
    component: HomeComponent
  },



  {
    path: 'daybook',
    component: DayBookComponent
  },
  {
    path: 'customer',
    component: CustomerSummaryComponent
  },
  {
    path: 'address-summary',
    component: AddressSummaryComponent
  },

  {
    path: 'product-profile',
    component: ProductProfileComponent
  },
  {
    path: 'user-profile',
    component: UserProfileComponent
  },
  {
    path: 'settings',
    component: SettingsComponent
  },
  {
    path: 'stock-summary',
    component: StockSummaryComponent,
  },
  {
    path: 'agro-voucher',
    component: AgroVoucherWizardComponent,
  },
  {
    path: 'stock-transfer-summary',
    component: StockTransferComparisonComponent,
  },
  {
    path: 'customer-profile',
    component: CustomerProfileComponent,
  },
  {
    path: 'stock-print',
    component: StockCheckPrintViewComponent,
  },
  {
    path: 'address-profile',
    component: AddressProfileComponent,
  },
  {
    path: 'crop-profile',
    component: CropProfileComponent,
  },
  {
    path: 'movement-analysis',
    component: MovementAnalysisComponent,
  },
  {
    path: 'tally-console',
    component: TallyConsoleComponent,
  },
  {
    path: '**',
    component: PageNotFoundComponent
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
