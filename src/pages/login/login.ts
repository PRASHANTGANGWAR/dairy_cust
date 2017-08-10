import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

import { NavController, AlertController, LoadingController } from 'ionic-angular';

import { UserData } from '../../providers/user-data';

import { UserOptions } from '../../interfaces/user-options';

import { TabsPage } from '../tabs-page/tabs-page';
import { MapPage } from '../map/map';
import { DBProvider } from '../../providers/DBProvider';

declare var window: any;

@Component({
  selector: 'page-user',
  templateUrl: 'login.html'
})
export class LoginPage {
  public flag : boolean = false;
  login: UserOptions = { username: '', password: '' };
  submitted = false;
  private loading :any;
  AppUsers: Array<Object>;

  constructor(
    private navCtrl: NavController, 
    public userData: UserData,
    private _loading: LoadingController,
    private _alert: AlertController,
    public db: DBProvider
    ) {
      let user = JSON.parse(window.localStorage.getItem('loginDetails'));
        if(user){
          this.navCtrl.setRoot(TabsPage);
        } 
    }

    ionViewDidLoad() {
    this.deleteAppUser();
  }

  ngOnInit() {
  }


  public deleteAppUser() {
    this.db.deleteAppUser()
      .then(data => {
        if (data.res.rowsAffected == 1) {
          console.log('AppUser Deleted.');
        }
        else {
          console.log('No AppUser Deleted.');
        }
      })
      .catch(ex => {
        console.log(ex);
      });
  }

  public insertAppUser(resultData: any) {
    this.db.insertAppUser(resultData)
      .then(data => {
      console.log(data);
        this.navCtrl.setRoot(TabsPage);
      })
      .catch(ex => {
        console.log(ex);
      });
      this.navCtrl.setRoot(TabsPage);
  }

  public getAllAppUsers() {
    this.db.getAppUsers()
      .then(data => {
        this.AppUsers = data;
      })
      .catch(ex => {
        console.log(ex);
      });
  }



  onLogin(form: NgForm) {
  console.log(form);
  //this.navCtrl.setRoot(TabsPage);
    this.submitted = true;
    if (form.valid) {
      this.showLoader();
      this.userData.login(this.login.username,this.login.password).then(results=>{
          console.log(results);
          let resultData : any ={};
           resultData = results;

          if(resultData.user && resultData.user.authentication_token){
            //this.navCtrl.setRoot(TabsPage);
            this.device_deliveries();
          } else{
            this.hideLoader();
            this.doAlert('Error',resultData.message);
          }
      });
    }
  }

   device_deliveries() {
      //this.showLoader();
      this.userData.device_deliverie().then(results=>{
        this.hideLoader();
          let resultData : any ={};
           resultData = results;
          if(resultData.deliveries && resultData.product_quantities){
            //this.navCtrl.setRoot(TabsPage);
            //this.doAlert('Success','Delivery details have been come !!');
            this.insertAppUser(resultData);
            
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
      buttons: ['Ok']
    });
    alert.present();
  }
}