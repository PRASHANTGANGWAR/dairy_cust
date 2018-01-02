import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

import { MenuController, NavController, AlertController, LoadingController } from 'ionic-angular';

import { UserData } from '../../providers/user-data';
// import { CollectionPage } from '../Collections/collection';
import { UserOptions } from '../../interfaces/user-options';
import { Events } from 'ionic-angular';
import { TabsPage } from '../tabs-page/tabs-page';
import { CollectionPage } from '../Collections/collection';
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
  totalDeiliveryProducts: any;
  DeiliveredProducts: any;
  private loading :any;
  AppUsers: Array<Object>;

  constructor(
    private navCtrl: NavController, 
    public userData: UserData,
    private _loading: LoadingController,
    private _alert: AlertController,
    public events: Events,
    public db: DBProvider,
    public menu: MenuController
    ) {
      this.menu.enable(false, 'loggedInMenu');
      let user = JSON.parse(window.localStorage.getItem('loginDetails'));
        if(user){
             if(user.role == 3)
              this.navCtrl.setRoot(TabsPage);
            else
              this.navCtrl.setRoot(CollectionPage);
        } 
    }

    ionViewDidLoad() {
    // this.deleteAppUser();
  }

  ngOnInit() {
  }


  public deleteAppUser() {
    this.db.deleteAppUser()
      .then(data => {
        if (data.res.rowsAffected == 1) {
          console.log('Delivery Deleted.');
        }
        else {
          console.log('No Delivery Deleted.');
        }
      })
      .catch(ex => {
        console.log(ex);
      });
  }

  public insertAppUser(resultData: any) {
    this.db.insertAppUser(resultData);
    let user = JSON.parse(window.localStorage.getItem('loginDetails'));
      if(user.role == 3)
              this.navCtrl.setRoot(TabsPage);
            else
              this.navCtrl.setRoot(CollectionPage);
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
            var preUser = window.localStorage.getItem('userPhone');
            if(preUser != resultData.user.mobile){
              window.localStorage.removeItem('productQuantity');
              window.localStorage.removeItem('DeliveredPackets');
              window.localStorage.removeItem('deliveredOrder');
              this.db.deleteTable()
                .then(data => {
                 console.log(data);
                 window.localStorage.setItem('userPhone',resultData.user.mobile);
                  this.device_deliveries();
                })
              
            }else{
              this.device_deliveries();
            }
          } else{
            this.hideLoader();
            this.doAlert('Error','Invalid User Phone or Password');
          }
      });
    }
  }

   device_deliveries() {
      //this.showLoader();
      this.userData.device_deliverie().then(results=>{
        this.hideLoader();
          let resultData : any ={};
          // let result : any ={};
          let productQuantity: any ={};
          let newObj : any ={};
           resultData = results;
          if(resultData.deliveries){
            newObj.deliveries = [];
            for(var i=0;i<resultData.deliveries.length;i++){
                if(resultData.deliveries[i].delivery_status == "0"){
                    newObj.deliveries.push(resultData.deliveries[i]);
                }
            }
            // window.localStorage.setItem('DeiverdDeliveries',JSON.stringify(updatedDeliveries));
            if(resultData.product_quantities){
              productQuantity = resultData.product_quantities;
              window.localStorage.removeItem('productQuantity');
              window.localStorage.setItem('productQuantity',JSON.stringify(productQuantity));
              window.localStorage.setItem('pendingProductsQuantity',JSON.stringify(productQuantity));

            }
            this.insertAppUser(newObj);
            
          } else{
            let user = JSON.parse(window.localStorage.getItem('loginDetails'));
            if(user.role == 3)
              this.navCtrl.setRoot(TabsPage);
            else
              this.navCtrl.setRoot(CollectionPage);
            this.doAlert('Error','No pending deliveries');
          }
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
}