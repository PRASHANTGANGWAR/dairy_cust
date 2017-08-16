import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { NgModule, ErrorHandler } from '@angular/core';

import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

import { InAppBrowser } from '@ionic-native/in-app-browser';
import { SplashScreen } from '@ionic-native/splash-screen';

import { IonicStorageModule } from '@ionic/storage';

import { ConferenceApp } from './app.component';

import { LoginPage } from '../pages/login/login';
import { SchedulePage } from '../pages/schedule/schedule';
import { SpeakerListPage } from '../pages/speaker-list/speaker-list';
import { TabsPage } from '../pages/tabs-page/tabs-page';

import { UserData } from '../providers/user-data';
import { SQLite } from '@ionic-native/sqlite';
import { DBProvider } from '../providers/DBProvider';

@NgModule({
  declarations: [
    ConferenceApp,
    LoginPage,
    SchedulePage,
    SpeakerListPage,
    TabsPage,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(ConferenceApp, {}, {
      links: [
        { component: TabsPage, name: 'TabsPage', segment: 'tabs-page' },
        { component: SchedulePage, name: 'Schedule', segment: 'schedule' },
        { component: SpeakerListPage, name: 'SpeakerList', segment: 'speakerList' },
        { component: LoginPage, name: 'LoginPage', segment: 'login' },
      ]
    }),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    ConferenceApp,
    LoginPage,
    SchedulePage,
    SpeakerListPage,
    TabsPage,
  ],
  providers: [
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    SQLite,
    DBProvider,
    UserData,
    InAppBrowser,
    SplashScreen
  ]
})
export class AppModule { }
