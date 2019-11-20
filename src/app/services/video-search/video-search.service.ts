import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { BehaviorSubject } from 'rxjs';
import { Video } from 'src/app/shared/models/video.model';
import { AlertController, NavController } from '@ionic/angular';
import { NarrationRequestService } from '../narration-request/narration-request.service';
import { NavigationExtras } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class VideoSearchService {
  public videos: BehaviorSubject<Video[]> = new BehaviorSubject<Video[]>([]);

  constructor(
    private readonly translateService: TranslateService,
    private readonly apiService: ApiService,
    private readonly alertController: AlertController,
    private readonly narrationRequestService: NarrationRequestService,
    private readonly navController: NavController) { }

  public search(searchStr: string): void {
    this.apiService.findVideos(searchStr).subscribe((videos) => {
      this.videos.next(videos);
      if (videos && videos.length === 0) {
        if (this.isURL(searchStr) && this.getYoutubeId(searchStr)) {
          this.createRequestPopup(searchStr);
        } else {
          this.notFoundAlert(searchStr);
        }
      } else {
        const navigationExtras: NavigationExtras = {
          queryParams: {
            search: searchStr,
          }
        };
        this.navController.navigateForward(['search'], navigationExtras);
      }
    });
  }

  private async createRequestPopup(url: string) {
    const [notFoundText, requestText, cancelText, createText] = await Promise.all([
      this.translateService.get('SEARCH.not_found').toPromise(),
      this.translateService.get('SEARCH.request').toPromise(),
      this.translateService.get('SEARCH.cancel').toPromise(),
      this.translateService.get('SEARCH.create').toPromise()
    ]);
    const alert = await this.alertController.create({
      header: notFoundText,
      message: requestText,
      buttons: [
        {
          text: cancelText
        },
        {
          text: createText,
          handler: () => {
            const id = this.getYoutubeId(url);
            this.narrationRequestService.narrationRequest(url, id);
          }
        },
      ]
    });


    await alert.present();
  }



  private async notFoundAlert(title: string) {
    const [notFoundText, viodeNotFound] = await Promise.all([
      this.translateService.get('SEARCH.not_found').toPromise(),
      this.translateService.get('SEARCH.video_not_found').toPromise(),
    ]);
    const alert = await this.alertController.create({
      header: notFoundText,
      message: viodeNotFound,
      buttons: ['OK']
    });

    await alert.present();
  }

  public getYoutubeId(url: string): string {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    const match = url.match(regExp)
    return (match && match[7].length === 11) ? match[7] : null;
  }

  private isURL(str): boolean {
    const pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator

    return pattern.test(str);
  }
}
