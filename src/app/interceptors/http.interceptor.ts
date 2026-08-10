import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { Observable } from "rxjs";
import { finalize, tap } from "rxjs/operators";

@Injectable()
export class HttpAppInterceptor implements HttpInterceptor {

  constructor() { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = "123"
    const newRequest = request.clone({
      headers: request.headers.set("Authorization", "Bearer " + token)
    });
    return next.handle(newRequest).pipe(
      tap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse && event.status === 200) {
          // this.auth.isLoading.next(false);
        }
      }, (err: any) => {
        // this.auth.isLoading.next(false);
        if (err.status == "401") {
          // this.auth.loggedoutSuccessfully();
        } else if (err.status == "409") {
          // this.notify.showModal(ErrorComponent,{error:err.message,statusText:err.statusText,message:err.error.message});  
        } else {
          // this.notify.showModal(ErrorComponent,{error:err.message,statusText:err.statusText})   
        }
      })
    );

  }
}
