import { ApiService } from './../../services/api/api.service';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, EMPTY, forkJoin } from 'rxjs';
import { catchError, map, concatAll } from 'rxjs/operators';
import { Video } from 'src/app/shared/models/video.model';
import { Narration } from 'src/app/shared/models/narration.model';

@Injectable({
  providedIn: 'root'
})
export class VideoResolver implements Resolve<Observable<Video>> {
  constructor(
    private router: Router,
    private apiService: ApiService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const id = route.paramMap.get('videoId');

    const videoData = this.apiService.getVideo(id)
      .pipe(catchError(err => {
        this.router.navigate(['/']);
        return EMPTY;
      }));
    const narrationData = this.apiService.getNarrationsForVideo(id);

    return forkJoin([videoData, narrationData]).pipe(map(result => {
      return {
        video: result[0],
        narrations: result[1]
      }
    }));
  }
}
