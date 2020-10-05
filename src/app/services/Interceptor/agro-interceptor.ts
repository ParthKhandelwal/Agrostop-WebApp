  import { Injectable } from "@angular/core";
import { tap, catchError } from "rxjs/operators";
import { AuthenticationService } from "../Authentication/authentication.service";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from "@angular/common/http";
import { Observable, throwError } from 'rxjs';
import { Router } from "@angular/router";

@Injectable()
export class AgroInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthenticationService, private router?:Router ) { }

  //function which will be called for all http calls
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    //how to update the request Parameters

  //    const updatedRequest = request.clone({
  //    headers: request.headers.set("Authorization", "Bearer " + this.cookie.get('token'))
    //  });

    if (this.authenticationService.token) {
     request = request.clone({
       setHeaders: {
         Authorization: 'Bearer ' + this.authenticationService.token,
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
      ),


      catchError((error: HttpErrorResponse) => {

        let errorMessage = '';

        if (error.error instanceof ErrorEvent) {

          // client-side error

          errorMessage = `Error: ${error.error.message}`;

        } else {

          // server-side error
          console.log(error)
          switch (error.status) {
            case 0:
              break;
            case 401:
              alert("You have been logged out");
              this.router.navigateByUrl("/login")
              break;
            case 900:
              alert(`Error Code: ${error.status}\nMessage: ${error.error}`);
              break;
            default:
              errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
              window.alert(errorMessage);
              break;
          }


        }


        return throwError(errorMessage);

      })
    );
  }
}
