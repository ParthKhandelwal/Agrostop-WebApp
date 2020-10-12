import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DatePipe } from '@angular/common';
import { User, UserLogin } from "../../model/User/user";
import { StockItem, ProductGroupFields, StockCheck, StockCheckItem, UpdateStockItemData, PackageRateItem } from "../../model/StockItem/stock-item";
import { INVENTORYENTRIESIN_LIST, VOUCHER } from "../../model/Voucher/voucher";
import { Customer } from "../../model/Customer/customer";
import { Order } from "../../model/Order/order";
import { ProductProfile } from "../../model/ProductProfile/product-profile";
import { Address } from "../../model/Address/address";
import { Crop } from '../../model/Crop/crop';
import { CropPattern } from '../../model/CropPattern/crop-pattern';
import { Notification } from '../../model/Notification/notification';
import { VoucherTypeConfig, Coupon } from "../../model/VoucherType/voucher-type-config";







@Injectable({
  providedIn: 'root'
})
export class ApiService {
  getProductBatch(product: string): Observable<any[]> {
    return this.httpClient.get<any[]>(this.BASE_URL + 'batch/?id=' + product);
  }

  getAllBatches():Observable<any[]>{
    return this.httpClient.get<any[]>(this.BASE_URL + 'batch/getAllBatches');
  }
  getLedger(ledgerEntry: string): Observable<any> {
    return this.httpClient.get<any>(this.BASE_URL + 'ledger/?id=' + encodeURIComponent(ledgerEntry));
    }



  getVoucherNumber(name:string): Observable<any>{
    return this.httpClient.get<any>(this.BASE_URL + 'counters/getNext?voucherType='+name);
  }

  saveCounter(counter: any): Observable<any>{
    return this.httpClient.post(this.BASE_URL+"counters/save", counter);
  }

  //private BASE_URL = "https://agrostopserver-env.eba-vei6xp54.ap-south-1.elasticbeanstalk.com/api/";
  //public WEB_SOCKET_URL = "https://agrostopserver-env.eba-vei6xp54.ap-south-1.elasticbeanstalk.com";

  //private BASE_URL = "http://localhost:5000/api/";
  //public WEB_SOCKET_URL = "http://localhost:5000";
  //public TALLY_HELPER_URL = "http://localhost:8082";


  private BASE_URL = "https://agrostop-web-server.herokuapp.com/api/";
  public WEB_SOCKET_URL = "https://agrostop-web-server.herokuapp.com";



  user: User;
  constructor(private httpClient: HttpClient, private datePipe?: DatePipe) {
  }

  getField(type: String): Observable<any>{
    return this.httpClient.get<any>(this.BASE_URL + 'groupField/getField?type='+type);
  }

  getFieldNames(type: String): Observable<any>{
    return this.httpClient.get<any[]>(this.BASE_URL + 'groupField/getNames?type='+type);
  }


  saveField(type: ProductGroupFields): Observable<any>{
    return this.httpClient.post(this.BASE_URL + 'groupField/save', type);
  }

  authenticate(user: UserLogin) {
    return this.httpClient.post<any>(this.WEB_SOCKET_URL +'/authenticate', user);
  }

  getCustomers(): Observable<any[]> {
    return this.httpClient.get<any[]>(this.BASE_URL + 'customers/getAll');

  }

  getCustomer(id: string): Observable<Customer> {
    return this.httpClient.get<Customer>(this.BASE_URL + 'customer/?id=' + id);
  }

  getCashBook(userName: string, fromDate: Date, toDate: Date): Observable<any[]> {
    return this.httpClient.get<any[]>(this.BASE_URL + 'report/getCashBook?userName='+userName +
    "&fromDate=" + this.datePipe.transform(fromDate, "yyyyMMdd") + '&toDate=' + this.datePipe.transform(toDate, "yyyyMMdd"));
  }



  getSevenDaySummary(): Observable<any>{
    return this.httpClient.get<any>(this.BASE_URL + 'report/sevenDaySalesReport');
  }

  getStockItem(id: string): Observable<any> {
    return this.httpClient.get<any>(this.BASE_URL + 'stockItem/?id=' + encodeURIComponent(id));
  }

  saveStockCheck(check: StockCheck): Observable<any>{
    return this.httpClient.post<any>(this.BASE_URL + 'stockItem/stock-check/save', check);

  }

  getTallyData(guid: string): Observable<any>{
    return   this.httpClient.get<any>(this.BASE_URL + 'tallyBuffer/getRequest?guid='+guid);
  }

  createRequestForStockItems():Observable<any>{
    return   this.httpClient.get<any>(this.BASE_URL + 'stockItem/createRequest');
  }


getStockItemFullObject(res: string):Observable<any>{

  return this.httpClient.get<any>(this.BASE_URL + 'stockItem/getAllStockItems?requestId='+res);
}

getStockItemGroupsByName(): Observable<any[]>{
  return this.httpClient.get<any>(this.BASE_URL + "stockGroup/getNames");
}

  saveStockCheckItem(id: string,item : StockCheckItem) : Observable<any>{
    return this.httpClient.post<any>(this.BASE_URL + 'stockItem/stock-check/saveItem?id=' + id, item);

  }

  deleteStockCheck(id: string): Observable<any>{
    return this.httpClient.delete<any>(this.BASE_URL + 'stockItem/stock-check/delete?id=' + id);
  }

 getStockCheck(userName: string): Observable<any[]>{
  return this.httpClient.get<any[]>(this.BASE_URL + 'stockItem/stock-check/get?userName=' + userName);
  }

  getStockCheckById(id: string): Observable<any>{
    return this.httpClient.get<any>(this.BASE_URL + 'stockItem/stock-check/getById?id=' + id);
    }

  getStockSummary( fromDate: Date, toDate: Date): Observable<any[]>{
    return this.httpClient.get<any[]>(this.BASE_URL + 'report/getStockSummary?'+
    "fromDate=" + this.datePipe.transform(fromDate, "yyyyMMdd") + '&toDate=' + this.datePipe.transform(toDate, "yyyyMMdd"));

  }

  updateCustomer(customer: Customer): Observable<any>{
    return this.httpClient.post<any>(this.BASE_URL + 'customer/update', customer);
  }

  addCustomer(customer: Customer): Observable<any> {
    return this.httpClient.post<any>(this.BASE_URL + 'customer/create', customer);
  }

  deleteCustomer(customer: string): Observable<any> {
    return this.httpClient.delete(this.BASE_URL + 'customer/delete/?id=' + customer);
  }


  getOrderDetails(id: string): Observable<any>{
    return this.httpClient.get<any>(this.BASE_URL+ "order/getOrderDetails?orderId="+id);
  }

  getOrder(id: string): Observable<Order>{
    return this.httpClient.get<any>(this.BASE_URL+ "order/?id="+id);

  }

  saveOrder(order: Order): Observable<any>{
    return this.httpClient.post<any>(this.BASE_URL + 'order/save', order);
  }

  getAllOrders(): Observable<Order[]>{
    return this.httpClient.get<Order[]>(this.BASE_URL + 'order/getAll');
  }



  getCustomerOrders(customerId: string): Observable<Order[]>{
    return this.httpClient.get<Order[]>(this.BASE_URL + 'order/getCustomerOrders?customerId=' + customerId);
  }

  completeOrder(orderId: string, voucher:VOUCHER): Observable<any>{
    return this.httpClient.post<any>(this.BASE_URL + 'order/completeOrder?orderId='+ orderId, voucher);
  }

  deleteOrder(id: string): Observable<any>{
    return this.httpClient.delete<any>(this.BASE_URL + 'order/delete?orderId='+ id);
  }

  getCurrentUser(): Observable<any> {
    return this.httpClient.get<User>(this.BASE_URL + 'user/currentUser');
  }

  getVoucher(id: string): Observable<any>{
     return this.httpClient.get<any>(this.BASE_URL + 'voucher?id=' + id);

  }

  getTallyFullVoucher(masterId: string): Observable<any>{
    return this.httpClient.get<any>(this.BASE_URL + 'voucher/getVoucher?masterId=' + masterId);

  }

  getVouchers(fromDate: Date, toDate: Date): Observable<any[]> {
    return this.httpClient.get<any[]>(this.BASE_URL + 'vouchers?fromDate=' + this.datePipe.transform(fromDate, "yyyyMMdd") + '&toDate=' + this.datePipe.transform(toDate, "yyyyMMdd"));
  }
  getAllVouchers(): Observable<any> {
    return this.httpClient.get<VOUCHER[]>(this.BASE_URL + 'vouchers/getAll');
  }

  getAllStockItems(): Observable<any> {
    return this.httpClient.get<StockItem[]>(this.BASE_URL + 'stockItem/getAll');
  }

  getAllStockItemsForBilling(): Observable<any> {
    return this.httpClient.get<StockItem[]>(this.BASE_URL + 'stockItem/getStockItemListForBilling?godownName=');
  }

  getNearExpiryBatches(daysRemaining: Number): Observable<any> {
    return this.httpClient.get(this.BASE_URL + 'stockItem/nearExpiryBatches?daysRemaining=' + daysRemaining);
  }

  getCustomerHistory(id: string): Observable<any> {
    return this.httpClient.get(this.BASE_URL + 'customer/getCustomerHistory?id='+ id);
  }

  getCustomerOrder(id: string): Observable<VOUCHER[]> {
    return this.httpClient.get<VOUCHER[]>(this.BASE_URL + 'customer/getCustomerOrder?id=' + id);
  }

  saveTallyVoucher(tallyVoucher: VOUCHER): Observable<any> {
    return this.httpClient.post(this.BASE_URL + 'voucher/saveVoucher', tallyVoucher)
  }

  getCashLedgers(): Observable<any> {
    return this.httpClient.get(this.BASE_URL + 'ledger/getCashLedgerNames');
  }

  getLedgerFullObject(id: String): Observable<any>{
    return this.httpClient.get(this.BASE_URL + 'ledger/getLedgerFullObject?parent='+ id);
  }

  getSalesVoucherTypeName(): Observable<any> {
    return this.httpClient.get(this.BASE_URL + "voucherType/getNamesByParent?voucherType=Sales");
  }

  getVoucherTypeNames(str: string): Observable<any[]>{
    return this.httpClient.get<any[]>(this.BASE_URL + "voucherType/getNamesByParent?voucherType=" + str);
  }

  getVoucherType(id: string): Observable<any>{
    return this.httpClient.get(this.BASE_URL + "voucherType/?id=" + encodeURIComponent(id));
  }

  getPlaceOfSupplies(): Observable<any> {
    return this.httpClient.get(this.BASE_URL + 'user/placeOfSupplies');
  }
  getGodownNames(): Observable<any> {
    return this.httpClient.get(this.BASE_URL + 'godown/getNames');
  }

  getPriceList(): Observable<any> {
    return this.httpClient.get<any>(this.BASE_URL + 'user/priceLevels');
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

  saveChemicalGroup(item: any): Observable<any>{
    return this.httpClient.post(this.BASE_URL + 'chemicalGroup/save', item);
  }

  getAllChemicalGroup(): Observable<any>{
    return this.httpClient.get(this.BASE_URL + 'chemicalGroup/getAll');
  }

  deleteChemcialGroup(name: String): Observable<any>{
    return this.httpClient.delete(this.BASE_URL + 'chemicalGroup/delete?id='+ name)
  }


  saveProductGroup(item: any): Observable<any>{
    return this.httpClient.post(this.BASE_URL + 'productGroup/save', item);
  }

  getAllProductGroupId(): Observable<any>{
    return this.httpClient.get(this.BASE_URL + 'productGroup/getAllId');
  }

  getAllProductGroup(): Observable<any>{
    return this.httpClient.get(this.BASE_URL + 'productGroup/getAll');
  }

  getProductGroup(id: string): Observable<any>{
    return this.httpClient.get(this.BASE_URL + 'productGroup/get?id='+id);
  }

  deleteProductGroup(name: String): Observable<any>{
    return this.httpClient.delete(this.BASE_URL + 'productGroup/delete?id'+ name);
  }


  updatePriceForProductGroup(productId: string, list: PackageRateItem[]): Observable<any>{
    return this.httpClient.post(this.BASE_URL+'productGroup/updatePrice?productId='+productId, list);
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



  getBatch(id: string): Observable<any> {
    return this.httpClient.get(this.BASE_URL + 'batch/get?batchId=' + id);
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



  //FORCE SYNC IMPLEMENTATION

  getForcedStockItem(type: string): Observable<any[]>{
    return this.httpClient.get<any[]>(this.BASE_URL + 'forceRequest?type='+type);

  }

  getCachePage(page: number, type:string): Observable<any>{
    return this.httpClient.get<any[]>(this.BASE_URL + 'tallyBuffer/getCacheId?type='+type+"&pageNumber="+page);

  }

  getCustomerVoucher(id: string){
    return this.httpClient.get<any[]>(this.BASE_URL + 'vouchers/getCustomerVoucher?id='+id);
  }

  getAddressVoucher(id: string){
    return this.httpClient.get<any[]>(this.BASE_URL + 'customers/getByAddress?id='+id);
  }


  saveInventroyInForVerification(voucher: VOUCHER){
    return this.httpClient.post(this.BASE_URL+'stockTransfer/addInventoryIn', voucher);
  }

  saveInventoryIn(inventoryIn: INVENTORYENTRIESIN_LIST): Observable<any>{
    return this.httpClient.post<any>(this.BASE_URL + 'stockTransfer/save', inventoryIn)
  }

  verifyInventoryIN(remoteId: string,invetoryId: string){
    return this.httpClient.get<any[]>(this.BASE_URL + 'stockTransfer/verify?remoteId='+remoteId+"&inventoryId="+invetoryId);
  }

  rejectInventoryIN(invetoryId: string){
    return this.httpClient.get<any>(this.BASE_URL + 'stockTransfer/reject?inventoryId='+invetoryId);
  }

  deleteInventoryIN(invetoryId: string){
    return this.httpClient.delete<any>(this.BASE_URL + 'stockTransfer/delete?inventoryId='+invetoryId);
  }

  getStockTransfers(){
    return this.httpClient.get<any[]>(this.BASE_URL + 'stockTransfer/getTransfers');
  }

  getAllLedgers(){
    return this.httpClient.get<any[]>(this.BASE_URL + 'ledger/getAll');
  }

  getAllVoucherTypes(){
    return this.httpClient.get<any[]>(this.BASE_URL + 'voucherType/getAll');
  }

  getUpdates(type: string): Observable<any[]>{
    var url = "";

    switch (type){
      case "items":
          url = this.BASE_URL + 'stockItem/getUpdates';
          break;
      case "customers":
          url = this.BASE_URL + 'customers/getUpdates';;
          break;
      case "ledgers":
          url = this.BASE_URL + 'ledger/getUpdates';
          break;
      case "vouchertypes":
          url = this.BASE_URL + 'voucherType/getUpdates';

    }
    return this.httpClient.get<any[]>(url);
  }


  //PRODUCT PROFILE

  saveProductProfile(productProfile: ProductProfile){
    return this.httpClient.post(this.BASE_URL+'productProfile/save', productProfile);
  }

  getProductProfile(id: string): Observable<any>{
    return this.httpClient.get(this.BASE_URL+'productProfile/get?id='+id);
  }

  getAllProductProfile(): Observable<any[]>{
    return this.httpClient.get<any[]>(this.BASE_URL + 'productProfile/getAll');
  }



  getPrintConfiguration(id: string):Observable<any>{
    return this.httpClient.get<any>(this.BASE_URL + "printConfiguration?id=" + id);
  }

  getAllVocuherTypeConfig():Observable<any[]>{
    return this.httpClient.get<any>(this.BASE_URL + "voucherTypeConfig/getAll");
  }



  savePrintConfiguration(conf: any):Observable<any>{
    return this.httpClient.post(this.BASE_URL + "printConfiguration/save", conf);
  }

  deleteVoucherTypeConfig(id: string){
    return this.httpClient.delete<any>(this.BASE_URL + 'voucherTypeConfig/delete?id=' + id);

  }

  getMaterialVoucher(str: string){
    return this.httpClient.get<any>(this.BASE_URL + "voucher/getMaterialVoucher?id=" + str);

  }

  getLoyaltyPoints(id: String): Observable<any>{
    return this.httpClient.get<any>(this.BASE_URL + "customer/getLoyaltyPoints?customerId=" + id);

  }

  getAddressSummary(pageNumber: number, pageSize: number ): Observable<any[]>{
    return this.httpClient.get<any>(this.BASE_URL + "address/address-summary?pageSize="+pageSize+"&pageNumber="+pageNumber);
  }

  saveCrop(crop: Crop): Observable<any>{
    return this.httpClient.post(this.BASE_URL+"crops/save", crop);
  }

  deleteCrop(id: string): Observable<any>{
    return this.httpClient.delete(this.BASE_URL+"crops/delete?id="+ id);
  }
  getCrop(id: string): Observable<any>{
    return this.httpClient.get<any>(this.BASE_URL+"crops/get?id="+ id);
  }

  getAllCrops(): Observable<any[]>{
    return this.httpClient.get<any[]>(this.BASE_URL+"crops/getAll");
  }

  saveCropPattern(cropPattern: CropPattern): Observable<any>{
    return this.httpClient.post(this.BASE_URL+"cropPattern/save", cropPattern);
  }

  deleteCropPattern(id: string): Observable<any>{
    return this.httpClient.delete(this.BASE_URL+"cropPattern/delete?id="+ id);
  }
  getCropPattern(id: string): Observable<any>{
    return this.httpClient.get<any>(this.BASE_URL+"cropPattern/get?id="+ id);
  }

  getAllCropPatterns(): Observable<any[]>{
    return this.httpClient.get<any[]>(this.BASE_URL+"cropPattern/getAll");
  }

  getCropPatternsByCustomer(id: string): Observable<any[]>{
    return this.httpClient.get<any[]>(this.BASE_URL+"cropPattern/getCustomerPattern?id="+id);

  }

  getItemSummary(item: string, fromDate: Date, toDate: Date): Observable<any[]>{
    this.datePipe.transform
    return this.httpClient.get<any[]>(this.BASE_URL+ "stockItem/summary?item="+item+"&fromDate="
    +this.datePipe.transform(fromDate, "yyyyMMdd")+"&toDate="+this.datePipe.transform(toDate, "yyyyMMdd"))
  }

  getLedgerSummary(ledger: string, fromDate: Date, toDate: Date): Observable<any[]>{
    return this.httpClient.get<any[]>(this.BASE_URL+ "ledger/summary?ledger="+ledger+"&fromDate="
    +this.datePipe.transform(fromDate, "yyyyMMdd")+"&toDate="+this.datePipe.transform(toDate, "yyyyMMdd"))
  }

  getProductGroupSummary(group: string, fromDate: Date, toDate: Date){
    return this.httpClient.get<any[]>(this.BASE_URL+"productProfile/summary?group="+group+"&fromDate="
    +this.datePipe.transform(fromDate, "yyyyMMdd")+"&toDate="+this.datePipe.transform(toDate, "yyyyMMdd"));

  }

  getChemicalGroupSummary(group: string, fromDate: Date, toDate: Date){
    return this.httpClient.post<any[]>(this.BASE_URL+"chemicalGroup/summary?fromDate="
    +this.datePipe.transform(fromDate, "yyyyMMdd")+"&toDate="+this.datePipe.transform(toDate, "yyyyMMdd"), group);

  }

  refactorChemicalGroup(){
    return this.httpClient.get<any[]>(this.BASE_URL+"chemicalGroup/refactor");
  }

  getBatchVoucher(product: string, batch: string): Observable<any[]>{
    return this.httpClient.post<any[]>(this.BASE_URL+"vouchers/getBatchVoucher", {"product": product, "batch": batch});
  }

  updateBatchVoucher(item: any){
    return this.httpClient.post(this.BASE_URL+"vouchers/updateBatch", item);
  }

  getCloudVouchers(): Observable<VOUCHER[]>{
    return this.httpClient.get<VOUCHER[]>(this.BASE_URL+"vouchers/getOfflineVouchers");
  }

  getCropPatterns(cropName: string): Observable<any[]>{
    return this.httpClient.get<any[]>(this.BASE_URL + "cropPattern/cropPattern?cropName=" + cropName);
  }

  addNotification(notification: Notification){
    return this.httpClient.post(this.BASE_URL+"notification/addNotification", notification)
  }

  addCoupon(voucherType: string,coupon: Coupon ){
    return this.httpClient.post(this.BASE_URL+"voucherTypeConfig/addCoupon", coupon)
  }

  saveVoucherTypeConfig(voucherTypeConfig: VoucherTypeConfig){
    return this.httpClient.post(this.BASE_URL+"voucherTypeConfig/save", voucherTypeConfig)
  }

  getCustomerCoupon(id: string){
    return this.httpClient.get<any[]>(this.BASE_URL + "customer/getCoupons?id=" + id);
  }

  redeemCoupon(id: string){
    return this.httpClient.get<any[]>(this.BASE_URL + "customer/redeemCoupon?id=" + id);
  }

  getAWSCred(){
    return this.httpClient.get<any>(this.BASE_URL+ "user/awsCred");
  }

  deleteVoucher(id: string): Observable<any>{
    return this.httpClient.delete(this.BASE_URL+"voucher/delete?id="+id);
  }

  resetVoucher(id: string){
    return this.httpClient.get<any>(this.BASE_URL+ "stockTransfer/resetVoucher?id="+id);
  }
}
