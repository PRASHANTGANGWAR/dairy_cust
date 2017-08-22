import { Component, ViewChild } from '@angular/core';

import { Events, MenuController, Nav, Platform } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';
import { LoginPage } from '../pages/login/login';
import { TabsPage } from '../pages/tabs-page/tabs-page';
// import { LastDeliveryPage } from '../pages/LastDelivery/lastDelivery';
import { CollectionPage } from '../pages/Collections/collection';
import { UrgentPage } from '../pages/Urgent/urgent';
import { SchedulePage } from '../pages/schedule/schedule';
import { SpeakerListPage } from '../pages/speaker-list/speaker-list';
import { BoxPage } from '../pages/Box/box';
import { UserData } from '../providers/user-data';

export interface PageInterface {
  title: string;
  name: string;
  component: any;
  icon: string;
  logsOut?: boolean;
  index?: number;
  tabName?: string;
  tabComponent?: any;
  delivered?: boolean;
  canceled?: boolean; 
  panding?: boolean; 
  collection?: boolean;
  lastDelivery?: boolean;
  lastDelivery1?: boolean;
  urgent?: boolean;
  box?: boolean;


}

@Component({
  templateUrl: 'app.template.html'
})
export class ConferenceApp {
  // the root nav is a child of the root app component
  // @ViewChild(Nav) gets a reference to the app's root nav
  @ViewChild(Nav) nav: Nav;

  // List of pages that can be navigated to from the left menu
  // the left menu only works after login
  // the login page disables the left menu

  loggedInPages: PageInterface[] = [
    { title: 'Packets', name: 'TabsPage', component: TabsPage, icon: 'information-circle', panding: true },
    { title: 'Canceled', name: 'TabsPage', component: SpeakerListPage, icon: 'md-close-circle', canceled: true },
    { title: 'Delivered', name: 'TabsPage', component: SchedulePage, icon: 'md-checkmark-circle', delivered: true },
    // { title: 'LastDelivery', name: 'TabsPage', component: LastDeliveryPage, icon: 'md-checkmark-circle', lastDelivery: true },
    { title: 'Collection', name: 'TabsPage', component: CollectionPage, icon: 'md-keypad', lastDelivery1: true },
    { title: 'Urgent Collection', name: 'TabsPage', component: UrgentPage, icon: 'md-notifications', urgent: true },
    { title: 'Box', name: 'TabsPage', component: BoxPage, icon: 'md-archive', box: true },
    { title: 'Logout', name: 'TabsPage', component: TabsPage, icon: 'log-out', logsOut: true }
  ];
  loggedOutPages: PageInterface[] = [
  ];
  rootPage: any;

  constructor(
    public events: Events,
    public userData: UserData,
    public menu: MenuController,
    public platform: Platform,
    public storage: Storage,
    public splashScreen: SplashScreen
  ) {

    // Check if the user has already seen the tutorial
    this.storage.get('hasSeenTutorial')
      .then((hasSeenTutorial) => {
        if (hasSeenTutorial) {
          this.rootPage = LoginPage;
        } else {
          this.rootPage = LoginPage;
        }
        this.platformReady()
      });

    // load the conference data

    // decide which menu items should be hidden by current login status stored in local storage
    this.userData.hasLoggedIn().then((hasLoggedIn) => {
      this.enableMenu(hasLoggedIn === true);
    });
    this.enableMenu(true);

    this.listenToLoginEvents();
  }

  openPage(page: PageInterface) {
    let params = {};

    // the nav component was found using @ViewChild(Nav)
    // setRoot on the nav to remove previous pages and only have this page
    // we wouldn't want the back button to show in this scenario
    if (page.index) {
      params = { tabIndex: page.index };
    }

    // If we are already on tabs just change the selected tab
    // don't setRoot again, this maintains the history stack of the
    // tabs even if changing them from the menu
    if (this.nav.getActiveChildNavs().length && page.index != undefined) {
      this.nav.getActiveChildNavs()[0].select(page.index);
    // Set the root of the nav with params if it's a tab index
  } else {
      this.nav.setRoot(page.name, params).catch((err: any) => {
        console.log(`Didn't set nav root: ${err}`);
      });
    }

    if (page.logsOut === true) {
      // Give the menu time to close before changing to logged out
      window.localStorage.removeItem('loginDetails');
      this.nav.setRoot(LoginPage);

    }
    if (page.panding === true) {
      this.nav.setRoot(TabsPage);
    }
    if (page.canceled === true) {
      this.nav.setRoot(SpeakerListPage);
    }
    if (page.delivered === true) {
      this.nav.setRoot(SchedulePage);
    }
   /* if (page.lastDelivery === true) {
      this.nav.setRoot(LastDeliveryPage);
    }*/
    if (page.lastDelivery1 === true) {
      this.nav.setRoot(CollectionPage);
    }
    if (page.urgent === true) {
      this.nav.setRoot(UrgentPage);
    }
    if (page.box === true) {
      this.nav.setRoot(BoxPage);
    }
  }

  

  listenToLoginEvents() {
    this.events.subscribe('user:login', () => {
      this.enableMenu(true);
    });

    this.events.subscribe('user:logout', () => {
      this.enableMenu(false);
    });
  }

  enableMenu(loggedIn: boolean) {
    this.menu.enable(loggedIn, 'loggedInMenu');
    this.menu.enable(!loggedIn, 'loggedOutMenu');
  }

  platformReady() {
    // Call any initial plugins when ready
    this.platform.ready().then(() => {
      this.splashScreen.hide();
    });
  }

  isActive(page: PageInterface) {
    let childNav = this.nav.getActiveChildNavs()[0];

    // Tabs are a special case because they have their own navigation
    if (childNav) {
      if (childNav.getSelected() && childNav.getSelected().root === page.tabComponent) {
        return 'primary';
      }
      return;
    }

    if (this.nav.getActive() && this.nav.getActive().name === page.name) {
      return 'primary';
    }
    return;
  }
}
