import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { map } from 'rxjs/operators';
import { TallyService } from '../../services/Tally/tally.service';

@Component({
  selector: 'app-tally-console',
  templateUrl: './tally-console.component.html',
  styleUrls: ['./tally-console.component.css']
})
export class TallyConsoleComponent implements OnInit {

  java_jdk:string;
  war_file:string;
  client_url:string = "http://localhost:8080/"


  constructor( public tallyService?: TallyService) { }

  ngOnInit(): void {
    this.readConfig();
  }


  saveConfig(){
    var object: any = {
      java_jdk: this.java_jdk,
      war_file: this.war_file
    }
    //this.electron.fs.writeFileSync("config.json", JSON.stringify(object), "UTF-8");
  }

  readConfig(){
    try {
      //var ObjectStr: string = this.electron.fs.readFileSync("voucherNumber.json").toString("UTF-8");
      //var Object: any = JSON.parse(ObjectStr);
      //this.java_jdk = Object.java_jdk;
      //this.war_file = Object.war_file;
    } catch (error) {

    }
  }

  initiateTallyClient(){
  //   this.electron.childProcess.exec("cd "+this.java_jdk, function(err, stdout, stderr) {
  //     if (err) {
  //       alert(err);
  //     }
  //     console.log(stdout)
  // });
  //   this.electron.childProcess.exec("java -jar "+ this.war_file, function(err, stdout, stderr) {
  //     if (err) {
  //         alert(err);
  //     }
  //     console.log(stdout)
  // });
  }

  fetchItems(str){
    this.tallyService.getItems(str).subscribe(
      res => {
        this.tallyService.connectedToClient.next(true);
        res = res.map((r) => {
          return {name: r, select: false, type: str}
        })
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      err => {
        this.tallyService.connectedToClient.next(false);
      }
    )
  }

  displayedColumns: string[] = ['sno', 'name', 'select'];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<any>;

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  selectAll(val){
    this.dataSource.data = this.dataSource.data.map((r) => {
      r.select = val;
      return r;
    })
    this.table.renderRows();
  }

  update(){
    this.dataSource.data
    .filter((r) => r.select)
    .forEach((r) => {
      this.tallyService.update(r.name, r.type).subscribe(
        res => {
          r.classname = "success"
        },
        err => {
          r.classname = "failure"
        }
      )
    })
  }
  backing: boolean = false;
  from: Date = new Date();
  to: Date = new Date();

  backUp(){
    this.backing = true
    this.tallyService.backupVouchers(this.from, this.to).subscribe(
      res => {
        this.backing = false;
        this.tallyService.connectedToClient.next(true);
      },
      err => {
        this.backing = false;
        this.tallyService.connectedToClient.next(false);
        alert("Backup Failed");
      }
    )
  }

}
