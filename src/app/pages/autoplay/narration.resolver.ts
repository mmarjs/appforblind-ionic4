import { ApiService } from './../../services/api/api.service';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, EMPTY } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Narration } from 'src/app/shared/models/narration.model';

@Injectable({
  providedIn: 'root'
})
export class NarrationResolver implements Resolve<Observable<Narration>> {
  constructor(
    private router: Router,
    private apiService: ApiService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Narration> {
    const id = route.paramMap.get('narrationId');

    const videoData = this.apiService.getNarration(id)
      .pipe(catchError(err => {
        this.router.navigate(['/']);
        return EMPTY;
      }));
    return this.apiService.getNarration(id);
  }
}
