import { VideoResolver } from './pages/video/video.resolver';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AnonymousGuard } from './services/anonymous-guard/anonymous.guard';
import { VideoOnlyResolver } from './pages/autoplay/video-only.resolver';
import { NarrationResolver } from './pages/autoplay/narration.resolver';

const routes: Routes = [
  { path: '', redirectTo: '/welcome', pathMatch: 'full' },
  { path: 'welcome', loadChildren: './pages/welcome/welcome.module#WelcomePageModule' },
  { path: 'language', loadChildren: './pages/language/language.module#LanguagePageModule' },
  { path: 'latest-videos', loadChildren: './pages/latest-videos/latest-videos.module#LatestVideosPageModule' },
  {
    path: 'login',
    loadChildren: './pages/login/login.module#LoginPageModule',
    canActivate: [AnonymousGuard]
  },
  { path: 'help', loadChildren: './pages/help/help.module#HelpPageModule' },
  { path: 'about', loadChildren: './pages/about/about.module#AboutPageModule' },
  { path: 'menu', loadChildren: './pages/menu/menu.module#MenuPageModule' },
  {
    path: 'video/:videoId',
    loadChildren: './pages/video/video.module#VideoPageModule',
    resolve: {
      videoData: VideoResolver
    }
  },
  { path: 'menu', loadChildren: './pages/menu/menu.module#MenuPageModule' },
  { path: 'search', loadChildren: './pages/search/search.module#SearchPageModule' },
  { 
    path: 'autoplay/:videoId/:narrationId', 
    loadChildren: './pages/autoplay/autoplay.module#AutoplayPageModule',
    resolve: {
      videoData: VideoOnlyResolver,
      narrationData: NarrationResolver
    }
 }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
