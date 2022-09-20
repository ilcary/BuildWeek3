import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserAuthService } from './user-auth.service';

@Injectable()
export class NavigationInterceptor implements HttpInterceptor {

  constructor(private auth:UserAuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let token = this.auth.getAccessToken() // controllare se la gestione del token è corretta anche se non è loggato l'utente
    if(token){
      let newRequest = request.clone({
        headers: request.headers.append('Authorization', 'Bearer ' + token)
      })
      return next.handle(newRequest)
    }
    return next.handle(request);
  }
}
