import { NavController } from '@ionic/angular';
import { Component, OnInit, ViewChildren, ElementRef, QueryList } from '@angular/core';
import { UserService } from 'src/app/services/user/user.service';
import { User } from 'src/app/shared/models/user.model';
import * as _ from 'lodash';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit {
  public userName = '';
  @ViewChildren('welcomeText', { read: ElementRef }) welcomeText: QueryList<ElementRef>;

  constructor(
    private readonly userService: UserService
  ) { }

  ngOnInit() {
    this.userService.user.subscribe((user: User) => {
      this.userName = !_.isNil(user) ? `${user.firstName} ${user.lastName}` : '';
    });
  }

  ngAfterViewInit() {
    setTimeout(e => {
      this.welcomeText.toArray()[0].nativeElement.focus();
    }, 200);
  }

}
