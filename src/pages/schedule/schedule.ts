import { Component } from '@angular/core';

import { AlertController, LoadingController } from 'ionic-angular';

import { UserData } from '../../providers/user-data';

@Component({
  selector: 'page-schedule',
  templateUrl: 'schedule.html'
})

export class SchedulePage {
  private loading :any;
  Deliveries: any=[];

  constructor(
    public userData: UserData,
    private _alert: AlertController,
    private _loading: LoadingController
    ) {
      this.delivered();
    }

  delivered() {
      this.showLoader();
      this.userData.deliveredItems().then(results=>{
        this.hideLoader();
          let resultData : any ={};
           resultData = results;
           if(resultData.deliveries){
              this.Deliveries = resultData.deliveries;            
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
