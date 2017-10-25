import { Component } from '@angular/core';
import { ViewController,NavController } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';

@Component({
  selector: 'page-splash',
  templateUrl: 'splash.html',
})
export class Splash {
 
  constructor(public viewCtrl: ViewController, public splashScreen: SplashScreen, public navCtrl : NavController) {
 
  }
 
  ionViewDidEnter() {
 
    this.splashScreen.hide();
 
    setTimeout(() => {
      this.viewCtrl.dismiss();
    }, 4000);
 
  }
 
}