import { Component, ViewChild } from '@angular/core';

import { Events, LoadingController, ModalController, AlertController, MenuController, Nav, Platform } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
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
// import { Splash } from '../pages/splash/splash';
declare var window: any;
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

  private loading :any;
  // the root nav is a child of the root app component
  // @ViewChild(Nav) gets a reference to the app's root nav
  @ViewChild(Nav) nav: Nav;

  // List of pages that can be navigated to from the left menu
  // the left menu only works after login
  // the login page disables the left menu
 
  deliveryPages: PageInterface[] = [
    { title: 'Packets', name: 'TabsPage', component: TabsPage, icon: 'information-circle', panding: true },
    { title: 'Cancelled', name: 'TabsPage', component: SpeakerListPage, icon: 'md-close-circle', canceled: true },
    { title: 'Delivered', name: 'TabsPage', component: SchedulePage, icon: 'md-checkmark-circle', delivered: true },
    { title: 'Logout', name: 'TabsPage', component: TabsPage, icon: 'log-out', logsOut: true }
  ];

  cashboyPages: PageInterface[] = [
    { title: 'Packets', name: 'TabsPage', component: TabsPage, icon: 'information-circle', panding: true },
    { title: 'Cancelled', name: 'TabsPage', component: SpeakerListPage, icon: 'md-close-circle', canceled: true },
    { title: 'Delivered', name: 'TabsPage', component: SchedulePage, icon: 'md-checkmark-circle', delivered: true },
    { title: 'Collection', name: 'TabsPage', component: CollectionPage, icon: 'md-basket', lastDelivery1: true },
    { title: 'Urgent Collection', name: 'TabsPage', component: UrgentPage, icon: 'md-notifications', urgent: true },
    { title: 'Box', name: 'TabsPage', component: BoxPage, icon: 'md-archive', box: true },
    { title: 'Logout', name: 'TabsPage', component: TabsPage, icon: 'log-out', logsOut: true }
  ];
  
  rootPage: any;
  isCombinedApp: boolean = false;
  appType: string;
  hideLogout: boolean = false;
  userRole : any;

  constructor(
    // private navCtrl: NavController,
    private statusBar: StatusBar,
    private _loading: LoadingController,
    private _alert: AlertController,
    public events: Events,
    public userData: UserData,
    public menu: MenuController,
    public platform: Platform,
    public storage: Storage,
    public splashScreen: SplashScreen,
    public modalCtrl: ModalController
  ) {
    /*let splash = this.modalCtrl.create(Splash);
    splash.present();*/
    if(window.localStorage.getItem('App') == "CombinedApp"){
      this.isCombinedApp = true;
    }


    
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
    platform.ready().then(() => {
      platform.registerBackButtonAction(() => {
        if(this.nav.canGoBack()){
          this.nav.pop();
        }else{
          this.exitApp();
        }
      });
    });
    this.checkTime();
  }


  checkTime() {
      var updateTime = JSON.parse(window.localStorage.getItem('updateTime'));
    if(updateTime){
      var now = new Date();
      var predate = new Date(updateTime);
      if(now.valueOf() > predate.valueOf()){
        var diff = now.valueOf() - predate.valueOf()
        if(diff >= 1000*60*5){
          window.localStorage.removeItem('updateTime');
          this.hideLogout = false;
          console.log(diff);
        }
        else if(diff < 1000*60*5){
          this.hideLogout = true;
          var newdif = 1000*60*5 - diff;
          this.updateTimeout(newdif);
        }
      }
    }
  }

  updateTimeout(diff: any){
    let that = this;
    setTimeout(function () {
      window.localStorage.removeItem('updateTime');
        that.hideLogout = false;
    }, diff);
  }

  buttonDisable() {
    let that = this;
    setTimeout(function () {
      window.localStorage.removeItem('updateTime');
        that.hideLogout = false;
    }, 1000*60*15);
  }



  logout(){
      window.localStorage.removeItem('loginDetails');
      window.localStorage.removeItem('CashboyLogin');
      window.localStorage.removeItem('App');
      this.nav.setRoot(LoginPage);
      this.isCombinedApp = false;
  }

   logoutConfirm(){
  let alert = this._alert.create({
      subTitle: "Are you realy want to logout",
      buttons: [
      {
        text: 'No',
        role: 'cancel'
      },
      {
        text: 'Logout',
        handler: () => {
             this.logout();
        }
      }
      ],
      cssClass: 'logout'
    });
    alert.present();
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
      this.logoutConfirm();
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
      if(window.localStorage.getItem('App') == "CombinedApp"){
        this.isCombinedApp = true;
      }
      this.enableMenu(true);
      // this.isCashBoyApp = false;
      let user = JSON.parse(window.localStorage.getItem('loginDetails'));
      this.userRole = user.role;

    });

    this.events.subscribe('user:disable', () => {
      console.log("button is disabled");
      this.hideLogout = true;
      this.buttonDisable();
    });
    this.events.subscribe('user:enable', () => {
      console.log("button is enabled");
      this.hideLogout = false;
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
      // this.statusBar.overlaysWebView(true);
      this.statusBar.backgroundColorByHexString('#a0266b');
      this.splashScreen.hide();

    });


  }

  showLoader(){
    this.loading = this._loading.create({
      content: 'Please wait...',
    });
    this.loading.present();
  }

  hideLoader(){
    this.loading.dismiss();
  }

  doAlert(type: string,message: string) {
    console.log(type);
    let alert = this._alert.create({
      subTitle: message,
      buttons: ['Ok'],
     cssClass: 'my-alert'
    });
    alert.present();
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
    exitApp(){
      let alert = this._alert.create({
      subTitle: "Do you want to exit",
      buttons: [
      {
        text: 'No',
        role: 'cancel'
      },
      {
        text: 'Exit',
        handler: () => {
          this.platform.exitApp();
        }
      }
      ],
      cssClass: 'exit-app'
    });
    alert.present();
}
}
