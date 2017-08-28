import { Component } from '@angular/core';

import { NavController, MenuController, AlertController, LoadingController } from 'ionic-angular';
import { PaymentHistoryPage } from '../payment-history/paymentHistory';
import { UserData } from '../../providers/user-data';

@Component({
  selector: 'box',
  templateUrl: 'box.html'
})

export class BoxPage {
  private loading :any;
  BoxResult: any=[];

  constructor(
    public userData: UserData,
    private navCtrl: NavController,
    public menu: MenuController,
    private _alert: AlertController,
    private _loading: LoadingController
    ) {
      this.menu.enable(true, 'loggedInMenu');
      this.boxCollections();
    }

  boxCollections() {
      this.showLoader();
      this.userData.boxCollections().then(results=>{
          let result : any ={};
          result = results;
          if(result.customer.length){
            this.BoxResult = result.customer;
            this.hideLoader();
          }else{

            this.hideLoader();
            this.MsgAlert('Status','No result found');
          }

          
      });
  }

  receive() {
    // this.navCtrl.push(LastDeliveryPage, {customerid:id});
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
    console.log(type);
    let alert = this._alert.create({
      subTitle: message,
      buttons: ['Ok'],
      cssClass: 'my-alert'
    });
    alert.present();
  }

}
