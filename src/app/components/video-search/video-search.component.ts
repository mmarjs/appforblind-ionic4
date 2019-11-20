import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VideoSearchService } from 'src/app/services/video-search/video-search.service';
import { Video } from 'src/app/shared/models/video.model';

@Component({
  selector: 'app-video-search',
  templateUrl: './video-search.component.html',
  styleUrls: ['./video-search.component.scss'],
})
export class VideoSearchComponent implements OnInit {
  public searchForm: FormGroup;
  public videos: Video[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private videoSearchService: VideoSearchService
    ) {
    this.searchForm = this.formBuilder.group({
      title: ['', Validators.required]
    });
  }

  search() {
    const searchStr = this.searchForm.get('title').value;

    this.videoSearchService.search(searchStr);
    this.searchForm.get('title').setValue('');
  }


  ngOnInit() {}
}
