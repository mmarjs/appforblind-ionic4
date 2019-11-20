import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { WelcomePage } from './welcome.page';
import { TranslateModule } from '@ngx-translate/core';
import { LatestVideosModule } from 'src/app/components/latest-videos/latest-videos.module';
import { VideoSearchModule } from 'src/app/components/video-search/video-search.module';
import { MenuComponentModule } from 'src/app/components/menu/menu.module';

const routes: Routes = [
  {
    path: '',
    component: WelcomePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    TranslateModule,
    LatestVideosModule,
    VideoSearchModule,
    MenuComponentModule
  ],
  declarations: [
    WelcomePage
  ]
})
export class WelcomePageModule {}
