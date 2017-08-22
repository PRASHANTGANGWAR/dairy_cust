import { Component } from '@angular/core';

import { NavController, MenuController, AlertController, LoadingController } from 'ionic-angular';
import { LastDeliveryPage } from '../LastDelivery/lastDelivery';
import { PaymentHistoryPage } from '../payment-history/paymentHistory';
import { UserData } from '../../providers/user-data';

@Component({
  selector: 'urgent-collection',
  templateUrl: 'urgent.html'
})

export class UrgentPage {
  private loading :any;
  AppUsers: any=[];

  constructor(
    public userData: UserData,
    private navCtrl: NavController,
    public menu: MenuController,
    private _alert: AlertController,
    private _loading: LoadingController
    ) {
      this.menu.enable(true, 'loggedInMenu');
      this.UrgentCollections();
    }

  UrgentCollections() {
      this.showLoader();
      this.userData.urgentCollections().then(results=>{
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
    console.log(id);
    console.log(due);
    console.log(bill);
    console.log(deviceId);
    console.log(deviceId);
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
    // this.navCtrl.push(LastDeliveryPage, {customerid:id});
  }

  paynowBox(id: any,due: any,bill: any,deviceId: any) {
    console.log(id);
    console.log(due);
    console.log(bill);
    console.log(deviceId);
    let alert = this._alert.create({
      subTitle: "Enter amount to pay",
      inputs: [ 
        {
          type: 'number',
          name: 'Amount',
          placeholder: 'Amount',
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

  paymentHistory(id: any) {
    console.log(id);
    this.navCtrl.push(PaymentHistoryPage, {customerid:id});
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
