import { Video } from 'src/app/shared/models/video.model';
import { ApiService } from './../../services/api/api.service';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, EMPTY } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class VideoOnlyResolver implements Resolve<Observable<Video>> {
  constructor(
    private router: Router,
    private apiService: ApiService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Video> {
    const id = route.paramMap.get('videoId');

    return this.apiService.getVideo(id)
      .pipe(catchError(err => {
        this.router.navigate(['/']);
        return EMPTY;
      }));
  }
}
