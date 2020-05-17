import { Component } from '@angular/core';
import { DatabaseService } from './shared/database.service';
import { ApiService } from './shared/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  title = 'Agrostop-WebApp';
  proceed : boolean = false;

  public static databaseService: DatabaseService;
  constructor(public database? : DatabaseService){
    AppComponent.databaseService = database;
  }
}
