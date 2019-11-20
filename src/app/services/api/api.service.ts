import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Video } from 'src/app/shared/models/video.model';
import { environment } from 'src/environments/environment';
import { Narration } from 'src/app/shared/models/narration.model';
import { User } from 'src/app/shared/models/user.model';

@Injectable({
  providedIn: 'root'
})

export class ApiService {
  
  baseUri:string;
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private http: HttpClient) {
    this.baseUri = environment.apiBaseUrl;
  }

  // Create
  createEmployee(data): Observable<any> {
    let url = `${this.baseUri}/create`;
    return this.http.post(url, data)
      .pipe(
        catchError(this.errorMgmt)
      )
  }

  // Get all videos
  getVideos(): Observable<Video[]> {
    return this.http.get<Video[]>(`${this.baseUri}/videos`);
  }

  getLatestPublishedNarrations(): Observable<Narration[]> {
    return this.http.get<Narration[]>(`${this.baseUri}/published-narrations`);
  }

  // Get video
  getVideo(id: string): Observable<Video> {
    let url = `${this.baseUri}/videos/${id}`;
    return this.http.get<Video>(url, {headers: this.headers}).pipe(
      catchError(this.errorMgmt)
    )
  }

  getNarrationsForVideo(id: string): Observable<Narration[]> {
    let url = `${this.baseUri}/videos/${id}/narrations`;
    return this.http.get<Narration[]>(url, {headers: this.headers}).pipe(
      catchError(this.errorMgmt)
    )
  }

  getNarration(id: string): Observable<Narration> {
    let url = `${this.baseUri}/narrations/${id}`;
    return this.http.get<Narration>(url, {headers: this.headers}).pipe(
      catchError(this.errorMgmt)
    )
  }

  // Error handling 
  errorMgmt(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }

  login(user: User): Observable<{ token: string, auth: boolean }> {
    const url = `${this.baseUri}/login`;
    return this.http.post<any>(url, user, {headers: this.headers}).pipe(
      catchError(this.errorMgmt)
    );
  }

  getUserData(): Observable<User> {
    const url = `${this.baseUri}/user/me`;
    return this.http.get<User>(url, {headers: this.headers}).pipe(
      catchError(this.errorMgmt)
    );
  }

  findVideos(key: string): Observable<Video[]> {
    const params = new HttpParams()
      .set('key', key);

    const url = `${this.baseUri}/videos/find`;
    return this.http.get<Video[]>(url, { headers: this.headers, params }).pipe(
      catchError(this.errorMgmt)
    );
  }

  requestNarration(videoId: string): Observable<any> {
    const url = `${this.baseUri}/narrations-requests/${videoId}`;
    return this.http.get<any>(url, { headers: this.headers }).pipe(
      catchError(this.errorMgmt)
    );
  }

  public addVideo(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUri}/videos`, data);
  }

  public createVideoByYoutubeId(videoUrl: string, id: string): Observable<Video> {
    return this.http.post<Video>(`${this.baseUri}/videos/youtube`, { videoUrl, id});
  }

  public getPlayerId(videoUrl:string): string {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    const match = videoUrl.match(regExp)
    return (match&&match[7].length==11)? match[7] : '';
  }
}
