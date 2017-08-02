import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

import { NavController, AlertController, LoadingController } from 'ionic-angular';

import { UserData } from '../../providers/user-data';

import { UserOptions } from '../../interfaces/user-options';

import { TabsPage } from '../tabs-page/tabs-page';
import { MapPage } from '../map/map';


@Component({
  selector: 'page-user',
  templateUrl: 'login.html'
})
export class LoginPage {
  public flag : boolean = false;
  login: UserOptions = { username: '', password: '' };
  submitted = false;
  private loading :any;

  constructor(
    private navCtrl: NavController, 
    public userData: UserData,
    private _loading: LoadingController,
    private _alert: AlertController
    ) { }

  onLogin(form: NgForm) {
    this.submitted = true;
    debugger;
    if (form.valid) {
      this.showLoader();
      this.userData.login(this.login.username,this.login.password).then(results=>{
      debugger;
          console.log(results);
          let resultData : any ={};
           resultData = results;
          if(resultData.user.authentication_token){
            //this.navCtrl.setRoot(TabsPage);
            this.device_deliveries();
          } else{
            form.resetForm();
            this.doAlert('Error','Invalid username/password. Please try again.');
          }
      });
    }
  }

   device_deliveries() {
    debugger;
      //this.showLoader();
      this.userData.device_deliverie().then(results=>{
      debugger;
        this.hideLoader();
          let resultData : any ={};
           resultData = results;
          if(resultData.deliveries && resultData.product_quantities){
            //this.navCtrl.setRoot(TabsPage);
            //this.doAlert('Success','Delivery details have been come !!');
            this.navCtrl.setRoot(TabsPage);
          } else{
            this.doAlert('Error','Invalid username/password. Please try again.');
          }
      });
  }

  forgotPassword() {
    this.flag = true;
    this.navCtrl.push(MapPage);
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
    let alert = this._alert.create({
      title: type,
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }
}