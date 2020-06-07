  import { Injectable } from "@angular/core";
import { tap } from "rxjs/operators";
import { CookieService } from 'ngx-cookie-service';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from "@angular/common/http";
import { Observable, throwError } from 'rxjs';
import { AuthenticationService } from '../shared/authentication.service';

@Injectable()
export class AgroInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthenticationService) { }
  //function which will be called for all http calls
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    //how to update the request Parameters

  //    const updatedRequest = request.clone({
  //    headers: request.headers.set("Authorization", "Bearer " + this.cookie.get('token'))
    //  });
    var user = JSON.parse(sessionStorage.getItem('currentUser'));
    if (user && user.token) {
     request = request.clone({
       setHeaders: {
         Authorization: 'Bearer ' + user.token 
       }
     })
   }
    //logging the updated Parameters to browser's console
    console.log("Before making api call : ", request);
    return next.handle(request).pipe(
      tap(
        event => {
          
          if (event instanceof HttpResponse) {
            console.log("api call success :", event);
            
          }
        },
        error => {
          if (event instanceof HttpResponse) {
            console.log("api call error :", event);
            if (error.status == 401 || error.status == 403) {
              // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
              this.authenticationService.logOut();
              location.reload(true);
            }
            
          }
          const err = error.error.message || error.statusText;
          return throwError(err);
        }
      )
    );
  }
}
