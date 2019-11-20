import { NavController, IonButton, MenuController } from '@ionic/angular';
import { Component, OnInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { MenuItem } from 'src/app/shared/models/menu-item.model';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  public mainMenuVisible: boolean = true;
  public subMenuVisible: boolean = false;
  public isAuthorized: boolean = false;
  private menuItems: MenuItem[] = [];
  private subMenuItems: MenuItem[] = [];
  @ViewChildren(IonButton, { read: ElementRef }) subMenuItemsReference: QueryList<ElementRef>

  constructor(
    private readonly navController: NavController,
    private readonly menuController: MenuController,
    private readonly authService: AuthenticationService,
    private readonly router: Router
    ) { }

  ngOnInit() {
  }

  public openMenu() {
    this.navController.navigateForward("menu");
  }
}
