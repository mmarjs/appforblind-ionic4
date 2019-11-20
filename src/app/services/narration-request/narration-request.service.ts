import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { AuthenticationService } from '../authentication/authentication.service';
import { filter, flatMap, delay } from 'rxjs/operators';
import { AlertController, NavController } from '@ionic/angular';
import { Subscription, Observable, of } from 'rxjs';
import { Video } from 'src/app/shared/models/video.model';

import * as _ from 'lodash';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class NarrationRequestService {
  private requestSub: Subscription;

  constructor(
    private readonly apiService: ApiService,
    private readonly authService: AuthenticationService,
    private readonly alertController: AlertController,
    private readonly navController: NavController,
    private readonly translateService: TranslateService) { }

  public async narrationRequest(videoUrl: string, id: string) {
    this.requestSub = this.authService.isAuthorized
      .pipe(
        filter(isAuthorized => isAuthorized),
        delay(200),
        flatMap(() => {
          return this.createRequest(videoUrl, id);
        })
      )
      .subscribe((data) => {
        const success = !_.isNil(data);
        this.resultAlert(success);
      });

    if (this.authService.isAuthorized.value === false) {
      this.askLoginPopup();
    }
  }

  private createRequest(videoUrl: string, id: string): Observable<any> {
    return this.apiService.createVideoByYoutubeId(videoUrl, id)
      .pipe(
        flatMap((video: Video) => {
          if (video) {
            return this.apiService.requestNarration(video._id);
          }

          return of(null);
        })
      );
  }

  private async askLoginPopup() {
    const [loginText, loginForRequestText, cancelText] = await Promise.all([
      this.translateService.get('LOGIN.title').toPromise(),
      this.translateService.get('SEARCH.login_for_request').toPromise(),
      this.translateService.get('SEARCH.cancel').toPromise(),
    ]);
    const alert = await this.alertController.create({
      header: loginText,
      message: loginForRequestText,
      buttons: [
        {
          text: cancelText,
          handler: () => {
            this.requestSub.unsubscribe();
          }
        },
        {
          text: loginText,
          handler: () => {
            this.navController.navigateForward('login');
          }
        },
      ]
    });

    await alert.present();
  }

  private async resultAlert(success: boolean) {
    const text = await this.translateService.get(success ? 'SEARCH.request_created' : 'SEARCH.video_not_found').toPromise();
    const alert = await this.alertController.create({
      message: text,
      buttons: ['OK']
    });

    await alert.present();
  }
}
