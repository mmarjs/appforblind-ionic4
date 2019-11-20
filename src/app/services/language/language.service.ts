import { Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
 
const LNG_KEY = 'SELECTED_LANGUAGE';
 
@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  selected = '';
 
  constructor(private translate: TranslateService, private storage: Storage, private plt: Platform) { }
 
  setInitialAppLanguage() {
    let language = this.translate.getBrowserLang();
    this.translate.setDefaultLang(language);
 
    this.storage.get(LNG_KEY).then(val => {
      if (val) {
        this.setLanguage(val);
        this.selected = val;
      }
    });
  }

  currentLanguage() {
    return this.selected;
  }
 
  getLanguages() {
    return [
      { name: 'English', key: 'en' },
      { name: 'Magyar', key: 'hu' },
      { name: 'Română', key: 'ro' },
    ];
  }
 
  setLanguage(lng) {
    this.translate.use(lng);
    this.selected = lng;
    this.storage.set(LNG_KEY, lng);
  }
}