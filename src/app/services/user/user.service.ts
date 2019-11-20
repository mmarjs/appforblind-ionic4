import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from 'src/app/shared/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public user: BehaviorSubject<User>;

  constructor() {  }

  public init(userData: User): void {
    this.user = new BehaviorSubject(userData);
  }

  public setUserData(userData: User): void {
    this.user.next(userData);
  }
}
