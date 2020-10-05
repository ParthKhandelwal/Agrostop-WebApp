import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, interval } from 'rxjs';
import { DatePipe } from '@angular/common';


@Injectable({
  providedIn: 'root'
})
export class TallyService {

  public connectedToClient = new BehaviorSubject<boolean>(false);
  constructor(private httpClient: HttpClient, private datePipe?: DatePipe ) {
    this.getStatus().subscribe(res =>  {
      this.connectedToClient.next(true);
    },err => {
      this.connectedToClient.next(false);
    })
    this.readConfig();
  }


  public BASE_URL = "http://localhost:8080/";
  stockItems$ = new BehaviorSubject([]);


  getStatus(): Observable<any>{
    return this.httpClient.get<any>(this.BASE_URL + 'status');
  }

  updateStockItem(object: any): Observable<any>{
    return this.httpClient.post<any>(this.BASE_URL + 'updateStockItem', object);
  }

  public updatingStockItems: boolean;
  updateAllStockItems(){
    this.updatingStockItems = true;
     this.httpClient.get<any>(this.BASE_URL + 'forceStockItem').subscribe(
       res => {
        this.updatingStockItems = false;
       },
       err => {
        this.updatingStockItems = false;
       }
     );

  }

  public getItems(str: string): Observable<any[]>{
    return this.httpClient.get<any[]>(this.BASE_URL + "getItems?item="+str);
  }

  public update(str, type): Observable<any>{
    return this.httpClient.post<any>(this.BASE_URL + 'update?type='+type, str);

  }

  public backupVouchers(from:Date, to:Date){
    return this.httpClient.get<any[]>(this.BASE_URL+"backUpVoucher?fromDate="
    +this.datePipe.transform(from, "yyyyMMdd")+"&toDate="+this.datePipe.transform(to, "yyyyMMdd"));

  }


  java_jdk:string;
  war_file:string;

  saveConfig(){
    var object: any = {
      java_jdk: this.java_jdk,
      war_file: this.war_file
    }
    localStorage.setItem("config", JSON.stringify(object));
  }

  readConfig(){
    try {
      var ObjectStr: string = localStorage.getItem("config");
      var Object: any = JSON.parse(ObjectStr);
      this.java_jdk = Object.java_jdk;
      this.war_file = Object.war_file;
    } catch (error) {

    }
  }

  initiateTallyClient(){
  //   this.electron.childProcess.exec("cd "+this.java_jdk, function(err, stdout, stderr) {
  //     if (err) {
  //       alert(err);
  //     }
  //   });
  //   this.electron.childProcess.exec("java -jar "+ this.war_file, function(err, stdout, stderr) {
  //     if (err) {
  //         alert(err);
  //     }
  //     this.getStatus().subscribe(
  //       res => {
  //         this.connectedToClient.next(true);
  //       },
  //       err => {
  //         this.connectedToClient.next(false);
  //       }
  //     )
  // });
  }
}
