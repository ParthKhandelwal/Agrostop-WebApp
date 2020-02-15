import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatTableDataSource } from '@angular/material';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { ConfirmationBoxComponent } from '../../confirmation-box/confirmation-box.component';
import { CreateUserFormComponent } from '../../create-form/create-user-form/create-user-form.component';
import { User } from '../../Model/User';
import { ApiService } from '../../shared/api.service';


@Component({
  selector: 'app-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.css']
})
export class UserTableComponent implements OnInit {

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  @ViewChild(MatTable, {static: false}) table: MatTable<User>;
  dataSource: MatTableDataSource<User>;
  users: User[];


  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['name', 'username', 'role', 'update'];

constructor(private apiService: ApiService, private dialog?: MatDialog, private dialogConfig?: MatDialogConfig){

}

  ngOnInit() {
    this.apiService.getAllUsers().subscribe(
      res => {
        this.users = res;
        this.dataSource = new MatTableDataSource<User>(this.users);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.table.dataSource = this.dataSource;
        this.table.renderRows();
      },
      err => {
        alert("Could not get Users. Try again later");
      },
    );
  }

  ngAfterViewInit() {

  }

  renderRows(){
    this.dataSource = new MatTableDataSource<User>(this.users);
    this.table.renderRows();
  }

  applyFilter(filterValue: string) {
   this.dataSource.filter = filterValue.trim().toLowerCase();
 }




 updateUser(data){
   const dialogConfig = new MatDialogConfig();
   dialogConfig.autoFocus = true;
   dialogConfig.width = "50%";
   this.dialog.open(CreateUserFormComponent, {data, maxHeight: '90vh'});
 }

 deleteUser(data){
   const dialogRef = this.dialog.open(ConfirmationBoxComponent, {
      width: '350px',
      data: "Do you confirm the deletion of this User:" + data.name + " ?"
    });
dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.apiService.deleteUser(data).subscribe(
          res =>{
            alert("User deleted successfully");
          },
          err =>{
            console.log(err);
          }
        );
        // DO SOMETHING
      }
    });
  }


 createUser() {
   const dialogConfig = new MatDialogConfig();
   dialogConfig.autoFocus = true;
   dialogConfig.width = "50%";
   dialogConfig.height = "150%";
   this.dialog.open(CreateUserFormComponent, { maxHeight: '90vh'});

 }


}
