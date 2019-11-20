import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TranslateModule } from '@ngx-translate/core';
import { SearchPage } from './search.page';
import { VideoSearchModule } from 'src/app/components/video-search/video-search.module';
import { MenuComponentModule } from 'src/app/components/menu/menu.module';

const routes: Routes = [
  {
    path: '',
    component: SearchPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    TranslateModule,
    VideoSearchModule,
    MenuComponentModule
  ],
  declarations: [SearchPage]
})
export class SearchPageModule {}
