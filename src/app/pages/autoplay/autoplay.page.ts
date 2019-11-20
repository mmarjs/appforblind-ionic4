import { Scene } from './../../shared/models/scene.model';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChildren, ElementRef, QueryList } from '@angular/core';
import { Video } from 'src/app/shared/models/video.model';
import { ApiService } from 'src/app/services/api/api.service';
import { Narration } from 'src/app/shared/models/narration.model';
import * as moment from 'moment';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-autoplay',
  templateUrl: './autoplay.page.html',
  styleUrls: ['./autoplay.page.scss'],
})
export class AutoplayPage implements OnInit {
  public video: Video;
  public narrations: Narration[];
  public narration: Narration;
  public cardTitle: string;
  public cardDescription: string;
  public currentStep: number = 0;
  private player: any = null;
  private stopPlaybackAt: number;
  private watchCurrentTimeInterval: any;
  public steps: Array<any> = [{
    type: 'welcome'
  }];

  @ViewChildren('sceneTitle', { read: ElementRef }) sceneTitleLabel: QueryList<ElementRef>;

  constructor (
    private route: ActivatedRoute,
    private apiService: ApiService,
    private navController: NavController
    ) {}

  ngOnInit() {
    this.route.data.subscribe(data => {
     this.video = data.videoData.video;
     this.narration = data.narrationData;
     this.buildSteps();
   });
 }

  private buildSteps() {
    this.narration.scenes.forEach((scene: Scene) => {
      this.steps.push({
        type: 'sceneText',
        title: scene.name,
        description: scene.description
      })
      this.steps.push({
        type: 'sceneVideo',
        from: scene.from,
        to: scene.to
      })
    })
  }

  onPlayerStateChange(event) {
    if (event.data == window['YT'].PlayerState.PAUSED) {
      console.log(this.player.getCurrentTime());
    }
  }

  onPlayerReady(event) {
    event.target.playVideo();
  }

  public nextStep() {
    if (typeof this.steps[this.currentStep + 1] == 'undefined') {
      this.navController.navigateBack(['video', this.video._id]);
      return;
    }
    this.currentStep++;

    if (this.steps[this.currentStep].type == 'sceneText') {
      setTimeout(e => {
        this.sceneTitleLabel.toArray()[0].nativeElement.focus();
      }, 200);
    }

    if (this.steps[this.currentStep].type == 'sceneVideo') {
      setTimeout(() => {
        if (this.player !== null) {
          this.player.stopVideo();
          this.player.destroy();
          this.player = null;
        }
        this.player = new window['YT'].Player('video', {
          height: '445',
          width: '810',
          videoId: this.apiService.getPlayerId(this.narration.video.videoUrl),
          playerVars: {
            start: moment.duration(this.steps[this.currentStep].from).asSeconds()
          },
          events: {
            'onReady': this.onPlayerReady,
            'onStateChange': this.onPlayerStateChange
          }
        });
        this.stopPlaybackAt = moment.duration(this.steps[this.currentStep].to).asSeconds();
        this.watchCurrentTime();
      }, 100);
    }
  }

  private watchCurrentTime() {
    this.watchCurrentTimeInterval = setInterval(() => {
      if (typeof this.player.getCurrentTime == 'function') {
        const currentTime = this.player.getCurrentTime();
        if (currentTime >= this.stopPlaybackAt) {
          this.player.stopVideo();
          this.nextStep();
          clearInterval(this.watchCurrentTimeInterval);
        }
      }
    }, 500);
  }
}
