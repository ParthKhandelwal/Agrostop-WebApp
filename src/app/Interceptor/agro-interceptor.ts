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
import { Observable } from 'rxjs';

@Injectable()
export class AgroInterceptor implements HttpInterceptor {
  constructor(private cookie: CookieService) { }
  //function which will be called for all http calls
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    //how to update the request Parameters

  //    const updatedRequest = request.clone({
  //    headers: request.headers.set("Authorization", "Bearer " + this.cookie.get('token'))
  //  });
  if (sessionStorage.getItem('username') && sessionStorage.getItem('token')) {
     request = request.clone({
       setHeaders: {
         Authorization: sessionStorage.getItem('token')
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
          }
        }
      )
    );
  }
}
