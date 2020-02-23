import { Injectable } from '@angular/core';
import { Customer } from '../Model/customer';
import { Address } from '../Model/address';
import { VOUCHER } from '../Model/voucher';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../Model/user';
import { CookieService } from 'ngx-cookie-service';
import { StockItem, PriceListItem, UpdateStockItemData } from '../Model/stock-item';
import { TallyVoucher } from '../Model/tally-voucher';
import { UserLogin, Response } from '../login-form/login-form.component';
import { TaxDetails } from '../Model/tax-details';



@Injectable({
  providedIn: 'root'
})
export class ApiService {
  getLedger(ledgerEntry: string): Observable<any> {
    return this.httpClient.get<any>(this.BASE_URL + 'ledger/?id=' + ledgerEntry);
    }

  public WEB_SOCKET_URL = "https://agrostop-web-server.herokuapp.com"
  private BASE_URL = "https://agrostop-web-server.herokuapp.com/api/";

  //private BASE_URL = "http://localhost:8081/api/";
  //public WEB_SOCKET_URL = "http://localhost:8081";
  public TALLY_HELPER_URL = "http://localhost:8082";

  constructor(private httpClient: HttpClient, private cookie?: CookieService) {
  }

  authenticate(user: UserLogin) {
    return this.httpClient.post<any>(this.WEB_SOCKET_URL +'/authenticate', user);
  }

  getCustomers(): Observable<Customer[]> {
    return this.httpClient.get<Customer[]>(this.BASE_URL + 'customers/getAll');

  }

  getCustomer(id: string): Observable<Customer> {
    return this.httpClient.get<Customer>(this.BASE_URL + 'customer/?id=' + id);
  }

  getStockItem(id: string, godown: string): Observable<any> {
    return this.httpClient.get<any>(this.BASE_URL + 'stockItem/?id=' + id + "&godownName=" + godown);
  }

  addCustomer(customer: Customer): Observable<any> {
    return this.httpClient.post<any>(this.BASE_URL + 'customer/create', customer);
  }

  deleteCustomer(customer: Customer): Observable<any> {
    return this.httpClient.delete(this.BASE_URL + 'customer/delete/' + customer.customerId);
  }

  getCurrentUser(): Observable<any> {
    return this.httpClient.get<User>(this.BASE_URL + 'user/currentUser');
  }

  getVouchers(toDate: Date, fromDate: Date): Observable<VOUCHER[]> {
    return this.httpClient.get<VOUCHER[]>(this.BASE_URL + 'vouchers?fromDate=' + fromDate + '&toDate=' + toDate);
  }
  getAllVouchers(): Observable<any> {
    return this.httpClient.get<VOUCHER[]>(this.BASE_URL + 'vouchers/getAll');
  }

  getAllStockItems(): Observable<any> {
    return this.httpClient.get<StockItem[]>(this.BASE_URL + 'stockItem/getAll');
  }

  getAllStockItemsForBilling(godownName: string): Observable<any> {
    return this.httpClient.get<StockItem[]>(this.BASE_URL + 'stockItem/getStockItemListForBilling?godownName=' + godownName);
  }

  getNearExpiryBatches(daysRemaining: Number): Observable<any> {
    return this.httpClient.get(this.BASE_URL + 'stockItem/nearExpiryBatches?daysRemaining=' + daysRemaining);
  }

  getCustomerHistory(id: string): Observable<any> {
    return this.httpClient.get(this.BASE_URL + 'customer/getCustomerHistory?id='+ id);
  }

  saveTallyVoucher(tallyVoucher: VOUCHER): Observable<any> {
    return this.httpClient.post(this.BASE_URL + 'voucher/saveVoucher', tallyVoucher)
  }

  getCashLedgers(): Observable<any> {
    return this.httpClient.get(this.BASE_URL + 'ledger/getCashLedgerNames');
  }

  getSalesVoucherTypeName(): Observable<any> {
    return this.httpClient.get(this.BASE_URL + "voucherType/getNamesByParent?voucherType=Sales");
  }

  getPlaceOfSupplies(): Observable<any> {
    return this.httpClient.get(this.BASE_URL + 'user/placeOfSupplies');
  }
  getGodownNames(): Observable<any> {
    return this.httpClient.get(this.BASE_URL + 'godown/getNames');
  }

  getPriceList(item: string): Observable<any> {
    return this.httpClient.get(this.BASE_URL + 'stockItem/getPriceList?itemName='+item);
  }

  savePriceList(item: string, priceList: UpdateStockItemData): Observable<any> {
    return this.httpClient.post(this.BASE_URL + 'stockItem/savePriceList?itemName=' + item
      , JSON.parse(JSON.stringify(priceList)));
  }

  saveUser(user: User): Observable<any> {
    return this.httpClient.post(this.BASE_URL + 'user/create', JSON.parse(JSON.stringify(user)));
  }

  updateUser(user: User): Observable<any> {
    return this.httpClient.post(this.BASE_URL + 'user/update', JSON.parse(JSON.stringify(user)));
  }

  getUser(userName: string): Observable<any> {
    return this.httpClient.get(this.BASE_URL + 'user/' + userName);
  }

  getPOSUser(): Observable<any> {
    return this.httpClient.get(this.BASE_URL + 'user/POSUser');
  }

  getAllAddresses(): Observable<any> {
    return this.httpClient.get(this.BASE_URL + 'address/getAddressesWithDetail')
  }


  getAddresses(): Observable<any> {
    return this.httpClient.get(this.BASE_URL + 'address/getAddresses')
  }

  addAddress(address: Address): Observable<any> {
    return this.httpClient.post(this.BASE_URL + 'address/create', address);
  }

  saveStockItem(item : any): Observable<any>{
    return this.httpClient.post(this.BASE_URL + 'stockitem/save', item);
  }

  getSalesLedger(): Observable<any>{
    return this.httpClient.get(this.BASE_URL + 'stockitem/salesLedgers');
  }

  getUserDetails(): Observable<any>{
    return this.httpClient.get(this.BASE_URL + 'user/userDetails');
  }

  addTaxDetail(taxDetail: TaxDetails): Observable<any>{
    return this.httpClient.post(this.BASE_URL + 'taxDetails/create', taxDetail);
  }
  getTaxDetails(): Observable<any>{
    return this.httpClient.get(this.BASE_URL + 'taxDetails/getAll');
  }

  getBatch(id: string): Observable<any> {
    return this.httpClient.get(this.BASE_URL + 'batch/get?batchId=' + id);
  }

  getTaxDetail(id: string): Observable<any> {
    return this.httpClient.get(this.BASE_URL + 'taxDetails?id=' + id);
  }

  deleteTaxDetails(data: TaxDetails): Observable<any>{
    return this.httpClient.delete(this.BASE_URL + 'taxDetails/delete?id=' + data.hsnCode);
  }

  getAllUsers(): Observable<any>{
    return this.httpClient.get(this.BASE_URL + 'user/getAll');
  }
  deleteUser(user: User): Observable<any> {
    return this.httpClient.delete(this.BASE_URL + 'user/delete/' + user.userName);
  }


  getAddress(id: string): Observable<any> {
    return this.httpClient.get(this.BASE_URL + 'address?id=' + id);
  }

  validUserId(id: string): Observable<any> {
    return this.httpClient.post(this.BASE_URL + 'user/validUsername', id);
  }

  getLedgerByGroup(id: string): Observable<any> {
    return this.httpClient.get(this.BASE_URL + 'ledger/byGroup?id='+id);
  }

}
