import { Injectable } from '@angular/core';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import * as _ from 'lodash';
import { BehaviorSubject, from, Observable, of, throwError } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { FacebookUser } from 'src/app/shared/models/facebook-user.model';
import { GoogleUser } from 'src/app/shared/models/google-user.model';
import { SocialLoginType } from 'src/app/shared/models/social-login-type.enum';
import { User } from 'src/app/shared/models/user.model';
import { Storage } from '@ionic/storage';

import { ApiService } from '../api/api.service';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  public isAuthorized: BehaviorSubject<boolean>;

  private readonly tokenStorageKey = 'auth-token';

  private fb: Facebook;
  private googlePlus: GooglePlus;
  private userService: UserService;
  private storage: Storage;
  private apiService: ApiService;

  public init(apiService: ApiService,
              storage: Storage,
              fb: Facebook,
              googlePlus: GooglePlus,
              userService: UserService): Promise<any> {
    this.apiService = apiService;
    this.storage = storage;
    this.fb = fb;
    this.userService = userService;
    this.googlePlus = googlePlus;

    return this.fetchUserData()
      .pipe(
        tap((user: User) => {
          this.userService.init(user);
        })
      ).toPromise();
  }

  public socialLogin(type: SocialLoginType): Observable<boolean> {
    const loginObservable = type === SocialLoginType.GOOGLE ? this.gmailLogin() : this.fbLogin();

    return loginObservable
      .pipe(
        mergeMap((user: User) => {
          if (_.isNil(user)) {
            return of(false);
          }

          return this.apiService.login(user)
            .pipe(
              map((authToken) => {
                if (authToken.auth) {
                  this.isAuthorized.next(authToken.auth);
                  this.setToken(authToken.token);

                  this.userService.setUserData(user);
                }

                return authToken.auth;
              })
            );
        })
      );
  }

  public logOut(): void {
    this.isAuthorized.next(false);
    this.userService.setUserData(null);

    this.storage.remove(this.tokenStorageKey);
  }

  public getToken(): Observable<string> {
    return from(this.storage.get(this.tokenStorageKey));
  }

  private setToken(token: string): void {
    this.storage.set(this.tokenStorageKey, token);
  }

  private gmailLogin(): Observable<User> {
    return from(this.googlePlus.login({}))
      .pipe(
        map((user: GoogleUser) => {
          return User.mapFromGoogleModel(user);
        }),
        catchError((e: any) => {
          console.log(`login with gmail crashed: ${e}`);

          return of(null);
        })
      );
  }

  private fbLogin(): Observable<User> {
    return from(this.fb.login(['public_profile', 'email']))
      .pipe(
        mergeMap((res: FacebookLoginResponse) => {

          if (res.status === 'connected') {
            return this.getFBUserDetails();
          }

          return of(null);
        }),
        catchError((e: any) => {
          console.log(`login with facebook crashed: ${e}`);

          return of(null);
        })
      );
  }

  private getFBUserDetails(): Observable<User> {
    return from(this.fb.api(`me/?fields=id,first_name,last_name,email`, ['public_profile', 'email'])).pipe(
      map((user: FacebookUser) => {
        if (user) {
          const userModel = User.mapFromFacebookModel(user);

          return userModel;
        }

        return null;
      })
    );
  }

  private fetchUserData(): Observable<any> {
    return this.getToken()
      .pipe(
        mergeMap((token: string) => {
          const isExist = !_.isNil(token);
          this.isAuthorized = new BehaviorSubject(isExist);
          if (isExist) {
            return this.apiService.getUserData();
          } else {
            return of(null);
          }
        }),
        catchError(e => {
          this.isAuthorized = new BehaviorSubject(false);

          return of(null);
        })
      );
  }
}
