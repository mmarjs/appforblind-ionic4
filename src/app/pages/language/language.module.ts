import { MenuComponentModule } from './../../components/menu/menu.module';
import { FooterComponent } from './../../components/footer/footer.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { LanguagePage } from './language.page';
import { TranslateModule } from '@ngx-translate/core';

const routes: Routes = [
  {
    path: '',
    component: LanguagePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    TranslateModule,
    MenuComponentModule
  ],
  declarations: [
    LanguagePage,
    FooterComponent
  ]
})
export class LanguagePageModule {}
