import { Location } from '@angular/common';
import { IonButton, NavController } from '@ionic/angular';
import { Component, OnInit, ViewChildren, QueryList, ElementRef, ContentChildren, ViewChild, AfterContentInit, ContentChild, AfterViewInit } from '@angular/core';
import { MenuItem } from 'src/app/shared/models/menu-item.model';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {
  public mainMenuVisible: boolean = true;
  public subMenuVisible: boolean = false;
  public menuItems: MenuItem[] = [];
  public subMenuItems: MenuItem[] = [];

  @ViewChildren('mainButton', { read: ElementRef }) mainButtons: QueryList<ElementRef>;

  constructor(
    private navController: NavController,
    private location: Location
    ) { }

    
  ngOnInit() {
    this.menuItems = [
      <MenuItem>{
        title: 'MENU.main',
        routerLink: '/welcome'
      },
      <MenuItem>{
        title: 'MENU.language',
        routerLink: '/language'
      },
      <MenuItem>{
        title: 'MENU.about',
        routerLink: '/about'
      },
        /*
        children: [
          <MenuItem>{
            title: 'MENU.search_video_by_url',
            routerLink: '/video-by-url'
          },
          <MenuItem>{
            title: 'MENU.search_video_by_title',
            routerLink: '/video-by-title'
          },
          <MenuItem>{
            title: 'MENU.see_latest_videos',
            routerLink: '/latest-videos'
          },
        ]
        */
      <MenuItem>{
        title: 'MENU.login',
        routerLink: '/login'
      },
      <MenuItem>{
        title: 'MENU.get_help',
        routerLink: '/help'
      }
    ]

    this.menuItems = this.menuItems.map(item => Object.assign(new MenuItem(), item));

  }

  public openSubMenu(items: MenuItem[]): void {
    this.subMenuItems = items;
    this.hideMainMenu();
    this.showSubMenu();
  }

  public closeSubMenu(): void {
    this.showMainMenu();
    this.hideSubMenu();
  }

  private showMainMenu(): void {
    this.mainMenuVisible = true;
  }

  private hideMainMenu(): void {
    this.mainMenuVisible = false;
  }

  private showSubMenu(): void {
    this.subMenuVisible = true;
  }

  private hideSubMenu(): void {
    this.subMenuVisible = false;
  }

  private visitPage(item: MenuItem): void {
    this.navController.navigateForward(item.routerLink);
  }

  public activateItem(item: MenuItem): void {
    item.hasChildren() ? this.openSubMenu(item.children) : this.visitPage(item);
  }

  public activateSubItem(item: MenuItem): void {
    this.visitPage(item);
  }

  public closeMenu() {
    this.location.back();
  }

}
