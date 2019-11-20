import { ApiService } from './../../services/api/api.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Narration } from 'src/app/shared/models/narration.model';

@Component({
  selector: 'app-latest-videos',
  templateUrl: './latest-videos.component.html',
  styleUrls: ['./latest-videos.component.scss'],
})
export class LatestVideosComponent implements OnInit {
  narrations$: Observable<Narration[]>;

  constructor(
    private apiService: ApiService
  ) { }

  ngOnInit() {
    this.narrations$ = this.apiService.getLatestPublishedNarrations();
  }

}
