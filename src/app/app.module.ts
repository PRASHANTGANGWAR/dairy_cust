import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

import { InAppBrowser } from '@ionic-native/in-app-browser';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { IonicStorageModule } from '@ionic/storage';

import { ConferenceApp } from './app.component';
import { LastDeliveryPage } from '../pages/LastDelivery/lastDelivery';
import { CollectionPage } from '../pages/Collections/collection';
import { PaymentHistoryPage } from '../pages/payment-history/paymentHistory';
import { LoginPage } from '../pages/login/login';
import { BoxPage } from '../pages/Box/box';
import { UrgentPage } from '../pages/Urgent/urgent';
import { ModalPage } from '../pages/modal/modal';
import { SchedulePage } from '../pages/schedule/schedule';
import { SpeakerListPage } from '../pages/speaker-list/speaker-list';
import { TabsPage } from '../pages/tabs-page/tabs-page';
import { UserData } from '../providers/user-data';
import { SQLite } from '@ionic-native/sqlite';
import { DBProvider } from '../providers/DBProvider';

@NgModule({
  declarations: [
    ConferenceApp,
    LastDeliveryPage,
    CollectionPage,
    PaymentHistoryPage,
    ModalPage,
    LoginPage,
    BoxPage,
    StatusBar,
    UrgentPage,
    SchedulePage,
    SpeakerListPage,
    TabsPage,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(ConferenceApp, { pageTransition: 'md-transition'}, {
      links: [
        { component: TabsPage, name: 'TabsPage', segment: 'tabs-page' },
        { component: SchedulePage, name: 'Schedule', segment: 'schedule' },
        { component: SpeakerListPage, name: 'SpeakerList', segment: 'speakerList' },
        { component: LastDeliveryPage, name: 'LastDeliveryPage', segment: 'LastDeliveryPage' },
        { component: CollectionPage, name: 'LastDeliveryPage1', segment: 'LastDeliveryPage1' },
        { component: PaymentHistoryPage, name: 'PaymentHistoryPage', segment: 'PaymentHistoryPage' },
        { component: UrgentPage, name: 'UrgentPage', segment: 'UrgentPage' },
        { component: BoxPage, name: 'BoxPage', segment: 'BoxPage' },
        { component: LoginPage, name: 'LoginPage', segment: 'login' },
      ]
    }),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    ConferenceApp,
    LoginPage,
    BoxPage,
    LastDeliveryPage,
    CollectionPage,
    UrgentPage,
    PaymentHistoryPage,
    SchedulePage,
    SpeakerListPage,
    TabsPage,
    ModalPage
  ],
  providers: [
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    SQLite,
    DBProvider,
    UserData,
    StatusBar,
    InAppBrowser,
    SplashScreen
  ]
})
export class AppModule { }
