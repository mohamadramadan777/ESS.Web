import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log("hello interceptor!!")
    //const token = this.authService.getToken();
    if (true) {
      console.log('Interceptor called:', request.url);
      //console.log('Interceptor called:', token);
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer $SKJHFQZKQSN Fksqcn/SDJFQKJN`
        }
      });
    }
    return next.handle(request);
  }
}
