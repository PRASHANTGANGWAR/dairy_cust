import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

import { InAppBrowser } from '@ionic-native/in-app-browser';
import { SplashScreen } from '@ionic-native/splash-screen';

import { IonicStorageModule } from '@ionic/storage';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicPageModule } from 'ionic-angular';
import { ConferenceApp } from './app.component';
import { LastDeliveryPage } from '../pages/LastDelivery/lastDelivery';
import { CollectionPage } from '../pages/Collections/collection';
import { PaymentHistoryPage } from '../pages/payment-history/paymentHistory';
import { LoginPage } from '../pages/login/login';
import { BoxPage } from '../pages/Box/box';
import { UrgentPage } from '../pages/Urgent/urgent';
import { SnoozedPage } from '../pages/snoozed/snoozed';
import { PendingsnoozedPage } from '../pages/pendingsnoozed/pendingsnoozed';
import { ModalPage } from '../pages/modal/modal';
import { SchedulePage } from '../pages/schedule/schedule';
import { SpeakerListPage } from '../pages/speaker-list/speaker-list';
import { TabsPage } from '../pages/tabs-page/tabs-page';
import { Splash } from '../pages/splash/splash';
import { UserData } from '../providers/user-data';
import { SQLite } from '@ionic-native/sqlite';
import { DBProvider } from '../providers/DBProvider';
import { EditQuantityModal } from '../pages/edit-quantity-modal/edit-quantity';
 import { ReturnQuantityPage } from '../pages/return-quantity/return-quantity';
  import { PreviousDeliveryPage } from '../pages/previous-delivery/previous-delivery';

 


@NgModule({
  declarations: [
    ConferenceApp,
    LastDeliveryPage,
    CollectionPage,
    PaymentHistoryPage,
    ModalPage,
    LoginPage,
    BoxPage,
    UrgentPage,
    SchedulePage,
    SpeakerListPage,
    TabsPage,
    Splash,
    SnoozedPage,
    PendingsnoozedPage,
    EditQuantityModal,
    ReturnQuantityPage,
    PreviousDeliveryPage
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
        { component: CollectionPage, name: 'Collections', segment: 'Collections' },
        { component: PaymentHistoryPage, name: 'PaymentHistoryPage', segment: 'PaymentHistoryPage' },
        { component: UrgentPage, name: 'UrgentPage', segment: 'UrgentPage' },
        { component: SnoozedPage, name: 'SnoozedPage', segment: 'SnoozedPage' },
        { component: PendingsnoozedPage, name: 'PendingsnoozedPage', segment: 'PendingsnoozedPage' },
        { component: BoxPage, name: 'BoxPage', segment: 'BoxPage' },
        { component: LoginPage, name: 'LoginPage', segment: 'login' },
      ]
    }),
    IonicPageModule.forChild(PreviousDeliveryPage),
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
    ModalPage,
    Splash,
    SnoozedPage,
    PendingsnoozedPage,
    EditQuantityModal,
    ReturnQuantityPage
  ],
  providers: [
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    SQLite,
    DBProvider,
    UserData,
    InAppBrowser,
    StatusBar,
    SplashScreen
  ]
})
export class AppModule { }
