import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../authentication/authentication.service';
import { mergeMap } from 'rxjs/operators';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  public constructor(
    private readonly authService: AuthenticationService
  ) { }

  public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.authService.isAuthorized.value) {
      return this.authService.getToken()
        .pipe(
          mergeMap((token: string) => {
            const headers: { [name: string]: string | string[]; } = {
              'x-access-token': token
            };

            const cloneReq = request.clone({
              setHeaders: headers
            });

            return next.handle(cloneReq);

          })
        );
    } else {
      return next.handle(request);
    }
  }
}
