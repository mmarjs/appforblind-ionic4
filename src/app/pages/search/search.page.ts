import { Component, OnInit } from '@angular/core';
import { VideoSearchService } from 'src/app/services/video-search/video-search.service';
import { Video } from 'src/app/shared/models/video.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {
  public videos: Video[] = [];
  public searchStr: string;

  constructor(
    private readonly videoSearchService: VideoSearchService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.searchStr = params.search;
    });
    this.videoSearchService.videos.subscribe(videos => this.videos = videos);
  }
}
