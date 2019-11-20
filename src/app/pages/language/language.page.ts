import { Component, OnInit } from '@angular/core';
import { LanguageService } from 'src/app/services/language/language.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-language',
  templateUrl: './language.page.html',
  styleUrls: ['./language.page.scss'],
})
export class LanguagePage implements OnInit {
  selectedLanguage: string;
  languages = [];

  constructor(
    private languageService: LanguageService,
    private navController: NavController
    ) { }

  ngOnInit() {
    this.languages = this.languageService.getLanguages();
    this.selectedLanguage = this.languageService.currentLanguage();
  }

  public setLanguage(lng: string) {
    this.languageService.setLanguage(lng);
    this.navController.navigateBack("/welcome");
  }

}
