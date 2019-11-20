import { ApiService } from 'src/app//services/api/api.service';
import { Component, OnInit, ViewChildren, ElementRef, QueryList, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Video } from 'src/app/shared/models/video.model';
import { Narration } from 'src/app/shared/models/narration.model';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-video',
  templateUrl: './video.page.html',
  styleUrls: ['./video.page.scss'],
})
export class VideoPage implements OnInit, AfterViewInit {
  public video: Video;
  public narrations: Narration[];
  public narration: Narration;
  public narrationAvailable: boolean = false;
  private player: any = null;
  public showPlayer: boolean = false;
  public showCharacters: boolean = false;
  public showLocations: boolean = false;
  public showScenes: boolean = false;
  public showVideo: boolean = false;
  public time: any;

  @ViewChildren('pageTitle', { read: ElementRef }) pageTitleLabel: QueryList<ElementRef>;
  @ViewChildren('characters', { read: ElementRef }) charactersLabel: QueryList<ElementRef>;
  @ViewChildren('locations', { read: ElementRef }) locationsLabel: QueryList<ElementRef>;
  @ViewChildren('scenes', { read: ElementRef }) scenesLabel: QueryList<ElementRef>;

  constructor (
    private route: ActivatedRoute,
    private apiService: ApiService,
    private navController: NavController
    ) {}

   onPlayerStateChange(event){
    if (event.data == window['YT'].PlayerState.PAUSED) {
      console.log(this.player.getCurrentTime());
    }
  }

   onPlayerReady(event) {
    console.log("READY", event);
  }

  ngOnInit() {
     this.route.data.subscribe(data => {
      this.video = data.videoData.video;
      this.narrations = data.videoData.narrations;

      if (this.narrations.length > 0) {
        const selectedNarration = this.narrations[0];
        this.apiService.getNarration(selectedNarration._id)
        .subscribe(narration => {
          this.narrationAvailable = true;
          this.narration = narration;
          return narration;
        })
      }
    });
  }

  ngAfterViewInit() {
    setTimeout(e => {
      this.pageTitleLabel.toArray()[0].nativeElement.focus();
    }, 200);
  }

  public startVideo() {
    this.showCharacters = false;
    this.showLocations = false;
    this.showScenes = false;
    this.showVideo = true;

    setTimeout(() => {
      this.player = new window['YT'].Player('video', {
        height: '445',
        width: '810',
        videoId: this.apiService.getPlayerId(this.narration.video.videoUrl),
        playerVars: {
          autoplay: 1
        },
        events: {
          'onReady': this.onPlayerReady,
          'onStateChange': this.onPlayerStateChange
        }
      });
    }, 100);

  }

  public startAutoplay() {
    this.navController.navigateForward(['autoplay', this.video._id, this.narration._id]);
  }

  public seeCharacters() {
    this.showCharacters = true;
    this.showLocations = false;
    this.showScenes = false;
    setTimeout(e => {
      this.charactersLabel.toArray()[0].nativeElement.focus();
    }, 200);
  }

  public seeLocations() {
    this.showCharacters = false;
    this.showLocations = true;
    this.showScenes = false;
    setTimeout(e => {
      this.locationsLabel.toArray()[0].nativeElement.focus();
    }, 200);
  }

  public seeScenes() {
    this.showCharacters = false;
    this.showLocations = false;
    this.showScenes = true;
    setTimeout(e => {
      this.scenesLabel.toArray()[0].nativeElement.focus();
    }, 200);
  }


}
