import { Component } from '@angular/core';

import { AlertController, LoadingController } from 'ionic-angular';

import { UserData } from '../../providers/user-data';

@Component({
  selector: 'page-speaker-list',
  templateUrl: 'speaker-list.html'
})
export class SpeakerListPage {
  private loading :any;
  Deliveries: any=[];

  constructor(
    public userData: UserData,
    private _alert: AlertController,
    private _loading: LoadingController
    ) {
      this.canceled();
    }

  canceled() {
      this.showLoader();
      this.userData.canceledItems().then(results=>{
        this.hideLoader();
          let result : any ={};
          result = results;
          if(result.deliveries.length){
            for(var i=0;i<result.deliveries.length;i++){
              if(result.deliveries[i].delivery_status == 2){
                this.Deliveries = result.deliveries[i].deliveries;
              }
            }           
          } else{
            this.doAlert('Error','Please try again');
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
    let alert = this._alert.create({
      title: type,
      subTitle: message,
      buttons: ['Done','Cancel']
    });
    alert.present();
  }

}
