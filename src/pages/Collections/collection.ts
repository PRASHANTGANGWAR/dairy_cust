import { Component } from '@angular/core';

import { NavController, MenuController, AlertController, LoadingController } from 'ionic-angular';
import { LastDeliveryPage } from '../LastDelivery/lastDelivery';
import { PaymentHistoryPage } from '../payment-history/paymentHistory';
import { UrgentPage } from '../Urgent/urgent';
import { UserData } from '../../providers/user-data';
// const FilteredAppUsers: any=[];
@Component({
  selector: 'collection',
  templateUrl: 'collection.html'
})

export class CollectionPage {
  private loading :any;
  AppUsers: any=[];
  queryText = '';

  constructor(
    public userData: UserData,
    private navCtrl: NavController,
    public menu: MenuController,
    private _alert: AlertController,
    private _loading: LoadingController
    ) {
      this.menu.enable(true, 'loggedInMenu');
      this.collections();
    }

  collections() {
      this.showLoader();
      this.userData.collections().then(results=>{
          let result : any ={};
          result = results;
          if(result.customers.length && result.customers[0].device){
            this.AppUsers = result.customers[0].device;
            for(var i=0;i<this.AppUsers.length;i++){
              this.AppUsers[i].address1 = this.AppUsers[i].addresses[0];
            }
          }

          this.hideLoader();
      });
  }

  lastDelivery(id: any) {
    console.log(id);
    this.navCtrl.push(LastDeliveryPage, {customerid:id});
  }

  paynow(id: any,due: any,bill: any,deviceId: any,payment: any) {
    var min = due-100;
    var max = due+100;
   if(parseInt(payment.Amount) > min && parseInt(payment.Amount) < max){
       this.userData.paynow(id,due,bill,deviceId,payment.Amount).then(results=>{
          let result : any ={};
          result = results;
          if(result.message == "Payment Successfully Paid"){
            this.hideLoader();
            this.MsgAlert('Success',result.message);
          }else{
            this.hideLoader();
            this.MsgAlert('Error',result.message);
          }

          
      });
   }else{
     
     this.hideLoader();
     this.MsgAlert('Error',"Please enter amount between "+min+"and"+max+"!");
   }
    
    // this.navCtrl.push(LastDeliveryPage, {customerid:id});
  }

  paynowBox(id: any,due: any,bill: any,deviceId: any) {
    let alert = this._alert.create({
      title: "Enter Amount to pay",
      inputs: [ 
        {
          type: 'number',
          name: 'Amount',
          placeholder: 'Enter Amount',
          value: 'payment',
          id: 'abc'
        },
      ],
      buttons: [
      {
        text: 'Pay',
        handler: (Amount) => {
          this.showLoader();
          this.paynow(id,due,bill,deviceId,Amount);
        }
      }
      ],
      cssClass: 'custom-alert'
    });
    alert.present();
  }

  search(){
    this.AppUsers = [];
    this.userData.collections().then(results=>{
          let result : any ={};
          result = results;
          if(result.customers.length && result.customers[0].device){
            this.AppUsers = result.customers[0].device;
            for(var k=0;k<this.AppUsers.length;k++){
              this.AppUsers[k].address1 = this.AppUsers[k].addresses[0];
            }
            for(var i=0;i<this.AppUsers.length;i++){
          if(this.AppUsers[i] && this.AppUsers[i].name ){
              var name = this.AppUsers[i].name.toUpperCase();
              var address = this.AppUsers[i].address1.name.toUpperCase();
              var mobile = this.AppUsers[i].mobile;
              var city = this.AppUsers[i].address1.city_name.toUpperCase();
              var state = this.AppUsers[i].address1.state_name.toUpperCase();
              var area = this.AppUsers[i].address1.area_name.toUpperCase();
              var device = this.AppUsers[i].device_name.toUpperCase();
              if((name.indexOf(this.queryText.toUpperCase())>-1)|| (mobile.indexOf(this.queryText)>-1) || (address.indexOf(this.queryText.toUpperCase())>-1) || (city.indexOf(this.queryText.toUpperCase())>-1) || (area.indexOf(this.queryText.toUpperCase())>-1) || (state.indexOf(this.queryText.toUpperCase())>-1) || (device.indexOf(this.queryText.toUpperCase())>-1)){
         
              } else {
                this.AppUsers.splice(i,1);
                i--;
              }
            }            
          }
          }
      });
  }

  paymentHistory(id: any) {
    console.log(id);
    this.navCtrl.push(PaymentHistoryPage, {customerid:id});
  }

  urgent() {
    this.navCtrl.push(UrgentPage);
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
      buttons: ['Done','Cancel']
    });
    alert.present();
  }

  MsgAlert(type: string,message: string) {
    let alert = this._alert.create({
      title: type,
      subTitle: message,
      buttons: ['Ok']
    });
    alert.present();
  }

}
