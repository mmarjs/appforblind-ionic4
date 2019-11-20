import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { NavController } from '@ionic/angular';
import { ApiService } from 'src/app//services/api/api.service';
import { Narration } from './../../shared/models/narration.model';

@Component({
  selector: 'app-latest-videos',
  templateUrl: './latest-videos.page.html',
  styleUrls: ['./latest-videos.page.scss'],
})
export class LatestVideosPage implements OnInit {
  public narrations$: Observable<Narration[]>;

  constructor(
    private navController: NavController,
    private apiService: ApiService
  ) { }

  ngOnInit() {
    this.getVideos();
  }

  public getVideos(): void  {
    this.narrations$ = this.apiService.getLatestPublishedNarrations();
  }

  public goToVideo(id: string): void {
    this.navController.navigateForward(['video', id]);
  }

}
