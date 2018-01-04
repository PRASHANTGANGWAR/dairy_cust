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
          let res : any ={};
          let result : any ={};
          res = results;
          if(res.status && res.status == 200){
            result = JSON.parse(res._body);
            if(result.customers && result.customers.length && result.customers[0].device){
              this.AppUsers = result.customers[0].device;
              for(var i=0;i<this.AppUsers.length;i++){
                this.AppUsers[i].address1 = this.AppUsers[i].addresses[0];
              }
            }else{
              this.MsgAlert('Error','No data for this user');
            }
          }else{
             this.MsgAlert('Error','Please try again');
          }
          

          this.hideLoader();
      });
  }

  lastDelivery(id: any) {
    console.log(id);
    this.navCtrl.push(LastDeliveryPage, {customerid:id});
  }

  paynow(id: any,due: any,bill: any,deviceId: any,payment: any) {
       this.showLoader();
       this.userData.paynow(id,due,bill,deviceId,payment.Amount).then(results=>{
          let result : any ={};
          result = results;
          if(result.message && result.message == "Payment Successfully Paid"){
            for(var i=0;i<this.AppUsers.length;i++){
                if(this.AppUsers[i].id == id){
                    this.AppUsers.splice(i,1);
                }
            }
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
        handler: (payment) => {
          
          var min = 100 * Math.floor( due/ 100);
          var max = 100 * Math.ceil( due/ 100);
          if(min != 0){
            if(parseInt(payment.Amount) == min || parseInt(payment.Amount) == max){
               this.confirmPayment(id,due,bill,deviceId,payment);
           }else{
             this.MsgAlert('Error',"Please enter amount "+min+" or "+max+" !");
           }
          }else{
            if(parseInt(payment.Amount) == max){
               this.confirmPayment(id,due,bill,deviceId,payment);
           }else{
             this.MsgAlert('Error',"Please enter amount "+max+" !");
           }
          }
         
          
        }
      }
      ],
      cssClass: 'custom-alert'
    });
    alert.present();
  }

  confirmPayment(id: any,due: any,bill: any,deviceId: any,payment: any){
  let alert = this._alert.create({
      title: "Do you want to pay for delivery?",
      buttons: [
      {
        text: 'Confirm',
        handler: () => {
             this.paynow(id,due,bill,deviceId,payment);
        }
      }
      ],
      cssClass: 'confirm-action-payment'
    });
    alert.present();
}

  search(){
    this.AppUsers = [];
    this.userData.collections().then(results=>{
          let res : any ={};
          let result : any ={};
          res = results;
          if(res.status && res.status == 200){
            result = JSON.parse(res._body);
          }
          if(result.customers && result.customers.length && result.customers[0].device){
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
    console.log(type);
    let alert = this._alert.create({
      subTitle: message,
      buttons: ['Ok'],
      cssClass: 'my-alert'
    });
    alert.present();
  }

}
