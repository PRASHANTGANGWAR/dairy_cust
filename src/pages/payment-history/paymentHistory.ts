import { Component } from '@angular/core';

import { NavParams, AlertController, LoadingController } from 'ionic-angular';

import { UserData } from '../../providers/user-data';

@Component({
  selector: 'payment-history',
  templateUrl: 'paymentHistory.html'
})

export class PaymentHistoryPage {
  private loading :any;
  Payments: any=[];
  Customer: any={};
  id: number;

  constructor(
    private navParams: NavParams,
    public userData: UserData,
    private _alert: AlertController,
    private _loading: LoadingController
    ) {
        this.id = this.navParams.get('customerid');
        this.delivered();
      // this.delivered();
    }

  delivered() {
      this.showLoader();
      console.log(this.id);
      this.userData.lastPayments(this.id).then(results=>{
        this.hideLoader();
           let result : any ={};
          result = results;
          if(result.customer){
            this.Customer = result.customer;
            this.Payments = result.customer.payment_history;
            if(result.customer.payment_history.length==0){
              this.doAlert('Status','No payment history');
            }
          }else{
            this.doAlert('Status','Please try again');
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
      buttons: ['ok'],
      cssClass: 'my-alert'
    });
    alert.present();
  }

}
